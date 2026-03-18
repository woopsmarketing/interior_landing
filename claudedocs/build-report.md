# Build Report

> 생성일: 2026-03-17
> 검증 환경: WSL2 (Linux) + Next.js 15.5.12 + TypeScript

---

## 요약

| 검증 | 결과 | 상세 |
|------|------|------|
| TypeScript | FAIL | 오류 5개 |
| Next.js Build | FAIL | `.next/trace` 파일 잠금 (환경 문제) |
| ESLint | FAIL | `eslint-config-next` 모듈 경로 오류 |

## 최종 판정: 배포 불가

---

## 발견된 이슈

### 이슈 1 — TypeScript 타입 오류 (FAIL, 심각도: HIGH)

`AdminSubmission` 인터페이스에 `status` 필드가 정의되어 있지 않으나,
`admin/page.tsx`와 `SubmissionDetail.tsx` 두 파일에서 `status` 프로퍼티를 참조하고 있음.

| 파일 | 라인 | 오류 | 심각도 |
|------|------|------|--------|
| `src/app/admin/page.tsx` | 270 | `Property 'status' does not exist on type 'AdminSubmission'` | HIGH |
| `src/app/admin/page.tsx` | 271 | `Property 'status' does not exist on type 'AdminSubmission'` | HIGH |
| `src/app/admin/page.tsx` | 274 | `Property 'status' does not exist on type 'AdminSubmission'` (×2) | HIGH |
| `src/components/admin/SubmissionDetail.tsx` | 34 | `Property 'status' does not exist on type 'AdminSubmission'` | HIGH |

**원인 분석**

- `src/lib/types.ts` 의 `AdminSubmission` 인터페이스(88~119행)에 `status` 필드가 없음
- `AdminCompany` 인터페이스(122~130행)에는 `status: string`이 정의되어 있음
- `status` 필드가 나중에 DB 스키마에 추가되었으나 타입 정의에 반영되지 않은 것으로 추정

### 이슈 2 — `.next/trace` 파일 잠금 (FAIL, 심각도: HIGH)

WSL2 환경에서 `.next/trace` 파일이 Windows 프로세스에 의해 잠겨 있어
Next.js 빌드가 해당 파일을 열 수 없어 `ENOENT` 오류로 즉시 중단됨.

```
uncaughtException [Error: ENOENT: no such file or directory, open '.../.next/trace']
```

**원인**: Windows 측 `node.exe` 또는 Next.js dev server가 `trace` 파일을 점유 중.

### 이슈 3 — ESLint 설정 모듈 경로 오류 (FAIL, 심각도: MEDIUM)

```
Cannot find module 'eslint-config-next/core-web-vitals'
Did you mean 'eslint-config-next/core-web-vitals.js'?
```

`eslint.config.mjs`에서 ESM import 경로에 `.js` 확장자 누락.

---

## 수정 권장 사항

### 1. [필수 - P0] TypeScript 타입 오류 수정

`src/lib/types.ts`의 `AdminSubmission` 인터페이스에 `status` 필드를 추가:

```typescript
export interface AdminSubmission {
  // ... 기존 필드들
  hasGeneratedImage: boolean;
  status?: string;  // "received" | "matching" | "quoted" 등
}
```

또는 status 값을 구체적인 유니언 타입으로 정의:

```typescript
status?: "received" | "matching" | "quoted";
```

수정 대상 파일: `src/lib/types.ts` (119행 `hasGeneratedImage: boolean;` 다음 줄)

### 2. [필수 - P0] `.next/trace` 파일 잠금 해제

Windows 환경에서 다음 중 하나를 실행:

- **방법 A**: Windows 작업 관리자 → `node.exe` 프로세스 전체 종료 후 빌드 재실행
- **방법 B**: Windows PowerShell에서 `Stop-Process -Name node -Force` 실행
- **방법 C**: PC 재시작 후 빌드 재실행

이후 WSL2에서 `.next` 폴더 수동 삭제 후 `npm run build` 재실행:
```bash
rm -rf .next && npm run build
```

### 3. [권장 - P1] ESLint 설정 경로 수정

`eslint.config.mjs` 에서 import 경로에 `.js` 확장자 추가:

```js
// 수정 전
import config from "eslint-config-next/core-web-vitals"
// 수정 후
import config from "eslint-config-next/core-web-vitals.js"
```

---

## 조치 순서

1. `src/lib/types.ts` → `AdminSubmission`에 `status` 필드 추가 (타입 오류 5건 해소)
2. Windows에서 node 프로세스 종료 후 `.next` 폴더 삭제
3. `npm run build` 재실행으로 빌드 성공 여부 확인
4. 필요 시 `eslint.config.mjs` 경로 수정

