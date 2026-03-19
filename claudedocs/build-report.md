# Build Report
생성일: 2026-03-19

## 요약
| 검증 | 결과 | 상세 |
|------|------|------|
| TypeScript | PASS | 오류 0개 |
| Next.js Build | PASS (WARN) | 빌드 성공, ESLint 경고 1개 |
| ESLint | WARN | 모듈 경로 경고 1개 (빌드 차단 없음) |

## 최종 판정: 배포 가능

빌드는 정상 완료되었습니다. ESLint 경고가 존재하지만 빌드를 차단하지 않으며, 배포에 영향을 주지 않습니다.

---

## 발견된 이슈

| 파일 | 항목 | 내용 | 심각도 |
|------|------|------|--------|
| `eslint.config.mjs` | line 2 | `eslint-config-next/core-web-vitals` → 확장자 없는 import, 실제 파일명은 `core-web-vitals.js` | WARN |

### 오류 메시지 원문
```
ESLint: Cannot find module '/mnt/d/Documents/landing_interior/node_modules/eslint-config-next/core-web-vitals'
imported from /mnt/d/Documents/landing_interior/eslint.config.mjs
Did you mean to import "eslint-config-next/core-web-vitals.js"?
```

### 원인 분석
- `eslint.config.mjs`의 2번째 줄에서 `eslint-config-next/core-web-vitals`를 import하고 있음
- 실제 `node_modules/eslint-config-next/` 디렉토리에는 `core-web-vitals.js` (확장자 포함)로 파일이 존재
- ESM(`.mjs`) 환경에서는 확장자를 포함한 명시적 경로가 필요
- 동일 이유로 3번째 줄 `eslint-config-next/typescript`도 잠재적 동일 문제 (`typescript.js`로 존재)

---

## 빌드 결과 상세

### 컴파일
- 컴파일 성공: 9.3s
- TypeScript 타입 오류: 0건
- 정적 페이지 생성: 26/26 완료

### 라우트 현황 (32개)
| 구분 | 수량 |
|------|------|
| Static (○) | 10개 |
| Dynamic/Server (ƒ) | 22개 |

### 주요 페이지 번들 크기
| 페이지 | 크기 | First Load JS |
|--------|------|---------------|
| `/` (메인 랜딩) | 58.1 kB | 164 kB |
| `/company/dashboard` | 9.08 kB | 120 kB |
| `/form` | 13 kB | 124 kB |
| `/my/[id]/companies/[companyId]` | 8.85 kB | 120 kB |

---

## 수정 권장 사항

### 1. ESLint 모듈 경로 수정 (권장, 낮은 우선순위)
`/mnt/d/Documents/landing_interior/eslint.config.mjs`의 import 경로에 `.js` 확장자를 추가합니다.

```js
// 현재 (문제)
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// 수정 후
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";
```

- 영향: ESLint 경고 제거, 린트 정확도 향상
- 위험도: 낮음 (빌드/배포에는 영향 없음)

---

## 집중 확인 파일 검증 결과

| 파일 | TypeScript | 빌드 포함 | 상태 |
|------|-----------|----------|------|
| `src/lib/types.ts` | PASS | 정상 참조 | OK |
| `src/components/company/SubmissionsTab.tsx` | PASS | 번들 포함 | OK |
| `src/components/company/PortfolioTab.tsx` | PASS | 번들 포함 | OK |
| `src/app/company/portfolio/[id]/page.tsx` | PASS | `/company/portfolio/[id]` 동적 라우트 생성 | OK |
| `src/app/api/companies/portfolios/[id]/route.ts` | PASS | `/api/companies/portfolios/[id]` 동적 라우트 생성 | OK |
| `src/app/api/companies/submissions/route.ts` | PASS | `/api/companies/submissions` 라우트 생성 | OK |
| `next.config.ts` | PASS | 빌드 설정 정상 적용 | OK |
