# Build Report

생성일: 2026-03-25

## 요약

| 검증 | 결과 | 상세 |
|------|------|------|
| TypeScript | PASS | 오류 0개 |
| Next.js Build | PASS | 경고 0개, 29페이지 정적 생성 완료 |
| ESLint | WARN | 모듈 경로 오류 1개 (빌드 차단 없음) |

## 최종 판정: 배포 가능

빌드 자체는 성공적으로 완료되었습니다. ESLint 설정 파일에 경로 오류가 있어 WARN 수준의 이슈가 존재하나, Next.js 빌드(컴파일+페이지 생성)는 정상 완료되었습니다.

---

## 발견된 이슈

| 파일 | 라인 | 오류 | 심각도 |
|------|------|------|--------|
| eslint.config.mjs | 2 | `eslint-config-next/core-web-vitals` 모듈 경로 오류 — `.js` 확장자 누락 | WARN |
| eslint.config.mjs | 3 | `eslint-config-next/typescript` 모듈 경로도 동일 패턴 — `.js` 확장자 누락 가능성 있음 | WARN |

### 오류 상세

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  '/mnt/d/Documents/landing_interior/node_modules/eslint-config-next/core-web-vitals'
  imported from /mnt/d/Documents/landing_interior/eslint.config.mjs
Did you mean to import "eslint-config-next/core-web-vitals.js"?
```

패키지 내부 실제 파일명:
- `core-web-vitals.js` (존재)
- `typescript.js` (존재)

현재 `eslint.config.mjs`의 import 경로:
- `eslint-config-next/core-web-vitals` → 확장자 없음 (ESM 환경에서 오류)
- `eslint-config-next/typescript` → 확장자 없음 (동일 문제)

---

## 빌드 상세

- Next.js 15.5.12
- 컴파일 시간: 37.9초
- 정적 페이지: 29개 생성 완료
- 동적 라우트(ƒ): 18개
- 정적 라우트(○): 11개

---

## 수정 권장 사항

### ESLint 설정 수정 (WARN — 배포 영향 없음, 개선 권장)

`eslint.config.mjs` 2~3번 줄의 import 경로에 `.js` 확장자를 추가합니다.

수정 전:
```js
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
```

수정 후:
```js
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";
```

ESM(`.mjs`) 환경에서는 확장자 명시가 필수입니다. 이 수정으로 `npx eslint src/` 직접 실행도 정상 동작합니다.
