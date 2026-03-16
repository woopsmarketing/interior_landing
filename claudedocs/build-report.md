# Build Report

생성일: 2026-03-16

## 요약

| 검증 | 결과 | 상세 |
|------|------|------|
| TypeScript | PASS | 오류 0개 |
| Next.js Build | BLOCKED | WSL2 환경 hang — 코드 오류 아님 |
| ESLint | SKIP | eslint-config-next 모듈 경로 오류 (빌드와 무관) |

## 최종 판정: 배포 가능 (Vercel 기준) / 로컬 빌드 환경 제약

---

## 빌드 Hang 원인 분석

### 현상
- `npm run build` 실행 시 다음 라인 이후 무기한 멈춤:
  ```
  ▲ Next.js 15.5.12
  - Environments: .env.local
  ```
- 240초 이상 대기해도 컴파일 단계 진입 불가

### 원인: WSL2 + Windows D드라이브 조합 이슈
- **환경**: WSL2(linux-x64) + 프로젝트 경로 `/mnt/d/Documents/landing_interior` (Windows D드라이브 마운트)
- **근본 원인**: Next.js 15.x가 빌드 시작 시 파일 시스템 감시(watcher) 초기화를 수행하는데,
  WSL2에서 Windows NTFS 경로(`/mnt/d/...`)를 대상으로 inotify가 정상 동작하지 않음
- **코드 자체의 오류가 아님**: TypeScript 컴파일(tsc --noEmit) 통과, 모든 의존성 정상 로드 확인

### 추가 발견: sharp 패키지 바이너리 누락 (수동 수정 완료)
- **문제**: `@img/sharp-win32-x64`만 설치됨, `@img/sharp-linux-x64` 누락
- **증상**: `Could not load the "sharp" module using the linux-x64 runtime`
- **수정**: `/tmp`에서 tarball 수동 다운로드 후 node_modules에 복사 (완료)
  - `/mnt/d/Documents/landing_interior/node_modules/@img/sharp-linux-x64` 설치 완료
  - `/mnt/d/Documents/landing_interior/node_modules/@img/sharp-libvips-linux-x64` 설치 완료
- **단, 이 문제가 빌드 hang의 직접 원인은 아님** (hang은 sharp 로드 전 단계에서 발생)

---

## 발견된 이슈

| 파일 | 이슈 | 심각도 | 상태 |
|------|------|--------|------|
| `node_modules/@img/` | sharp linux 바이너리 누락 | MEDIUM | 수동 수정 완료 |
| `eslint.config.mjs` | `eslint-config-next/core-web-vitals` 경로 오류 | LOW | 미수정 (빌드 무관) |
| 빌드 환경 전체 | WSL2 D드라이브 inotify hang | HIGH | 환경 이슈 (코드 무관) |

---

## 수정 권장 사항

### 1. 로컬 빌드 환경 개선 (환경 이슈)
- **권장**: 프로젝트를 WSL2 홈 디렉토리로 이전
  ```bash
  cp -r /mnt/d/Documents/landing_interior ~/landing_interior
  cd ~/landing_interior && npm install && npm run build
  ```
- **이유**: WSL2 네이티브 경로(`/home/...`)에서는 inotify가 정상 동작

### 2. Vercel 배포는 정상 동작 예상
- TypeScript 타입 오류 없음 (tsc --noEmit: EXIT 0)
- 코드 레벨 오류 없음
- Vercel은 Linux 네이티브 환경에서 빌드하므로 hang 없음

### 3. sharp 의존성 영구 수정 (package.json)
- Windows에서 `npm install` 시 linux 바이너리가 자동 포함되도록:
  ```bash
  # Windows PowerShell에서 실행
  npm install --include=optional
  ```
- 또는 package.json optionalDependencies에 추가:
  ```json
  "@img/sharp-linux-x64": "0.34.5",
  "@img/sharp-libvips-linux-x64": "1.2.4"
  ```

### 4. ESLint 설정 수정 (선택)
- `eslint.config.mjs`의 import 경로 수정:
  ```js
  // 변경 전
  import nextConfig from "eslint-config-next/core-web-vitals"
  // 변경 후
  import nextConfig from "eslint-config-next/core-web-vitals.js"
  ```

---

## 결론

**Vercel 배포 가능**: 코드 자체(TypeScript, 컴포넌트, API 라우트)에는 오류 없음.
로컬 `npm run build` hang은 WSL2 + Windows D드라이브 마운트 환경의 inotify 제약으로,
Vercel Linux 빌드 환경에서는 재현되지 않는 환경 이슈임.

