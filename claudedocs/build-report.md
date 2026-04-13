# Build Report

생성일: 2026-04-12

## 요약

| 검증 | 결과 | 상세 |
|------|------|------|
| TypeScript | PASS | 오류 0개 |
| Next.js Build | WARN | 컴파일 성공, ESLint 경고 1개 |
| ESLint | WARN | import 경로 문제 1건 (빌드 차단 없음) |

## 최종 판정: 배포 가능 (단, ESLint 경고 수정 권장)

빌드 컴파일은 정상 완료되었으며 30개 페이지 정적/동적 생성 성공.
ESLint 경고는 빌드를 차단하지 않으나, CI/CD 설정에 따라 배포 실패 원인이 될 수 있음.

---

## 발견된 이슈

| 파일 | 오류 메시지 | 심각도 |
|------|------------|--------|
| `eslint.config.mjs` | `Cannot find module 'eslint-config-next/core-web-vitals'` — `.js` 확장자 없는 import | WARN |
| `eslint.config.mjs` | `Cannot find module 'eslint-config-next/typescript'` — `.js` 확장자 없는 import | WARN |

**원인**: `node_modules/eslint-config-next/` 내에는 `core-web-vitals.js`, `typescript.js` 파일로 존재하나,
`eslint.config.mjs`에서 확장자 없이 `core-web-vitals`, `typescript`로 import하여 모듈 해석 실패.
ESM(`.mjs`) 환경에서는 확장자 명시가 필요.

---

## 빌드 결과 상세

| 항목 | 내용 |
|------|------|
| Next.js 버전 | 15.5.12 |
| 컴파일 시간 | 29.5초 |
| 생성 페이지 수 | 30개 |
| 정적(Static) 페이지 | /, /about, /admin, /company, /company/dashboard 등 |
| 동적(Dynamic) 페이지 | /api/* 라우트 전체, /my/[id] 등 |
| 최대 번들 크기 | / (메인) 164 kB First Load JS |

---

## 수정 권장 사항

### ESLint import 경로 수정 (eslint.config.mjs)

**현재 (오류 발생)**
```js
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

**수정 후 (권장)**
```js
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";
```

**이유**: ESM 환경(`.mjs` 파일)에서는 Node.js가 확장자 없는 상대 경로를 자동으로 해석하지 않음.
`eslint-config-next` 패키지 내 실제 파일명이 `.js` 확장자를 포함하므로 명시적으로 기재해야 함.

**우선순위**: P1 — Vercel 배포 시 ESLint 오류로 빌드 실패할 가능성 있음. 수정 권장.
