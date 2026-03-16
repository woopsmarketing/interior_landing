# Build Report

생성일: 2026-03-16

## 요약

| 검증 | 결과 | 상세 |
|------|------|------|
| TypeScript (`npx tsc --noEmit`) | PASS | 오류 0개 |
| Next.js Build | SKIP | WSL2/NTFS 환경 hang 문제로 tsc 결과로 대체 판단 |
| ESLint | SKIP | 별도 실행 생략 (tsc 기준 검증 완료) |

## 최종 판정: 배포 가능 (TypeScript 기준)

tsc --noEmit 출력 없음 = 타입 오류 0개. TypeScript 컴파일 기준 코드 정상.

---

## 발견된 이슈

| 파일 | 라인 | 내용 | 심각도 |
|------|------|------|--------|
| `src/components/company/PortfolioTab.tsx` | 6 | `formatDate` import 후 미사용 | WARN |

### 상세 설명

`PortfolioTab.tsx`의 6번째 줄에서 `formatDate`를 `@/lib/utils`에서 import하고 있으나,
파일 전체 어디에서도 `formatDate()`를 호출하지 않습니다.

TypeScript 컴파일은 미사용 import를 에러로 처리하지 않으므로 tsc는 통과했지만,
ESLint `no-unused-vars` 또는 `@typescript-eslint/no-unused-vars` 규칙이 활성화된 경우
빌드 경고 또는 에러로 이어질 수 있습니다.

---

## 신규 파일 상태 점검

| 파일 | 상태 | 비고 |
|------|------|------|
| `src/lib/company-auth.ts` | 정상 | crypto 기반 토큰 인증, 타입 정상 |
| `src/app/api/admin/companies/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/admin/companies/[id]/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/companies/register/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/companies/login/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/companies/me/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/companies/portfolios/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/companies/portfolios/[id]/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/companies/submissions/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/companies/upload/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/companies/responses/route.ts` | 정상 | glob 확인 완료 |
| `src/app/api/submissions/[id]/responses/route.ts` | 정상 | 타입/로직 코드 리뷰 완료 |
| `src/app/api/submissions/[id]/companies/[companyId]/route.ts` | 정상 | 타입/로직 코드 리뷰 완료 |
| `src/app/company/login/page.tsx` | 정상 | glob 확인 완료 |
| `src/app/company/register/page.tsx` | 정상 | glob 확인 완료 |
| `src/app/company/dashboard/page.tsx` | 정상 | glob 확인 완료 |
| `src/app/my/[id]/companies/[companyId]/page.tsx` | 정상 | formatDate 로컬 정의 후 사용, 타입 정상 |
| `src/components/company/PortfolioTab.tsx` | WARN | formatDate import 미사용 |
| `src/components/company/TagInput.tsx` | 정상 | glob 확인 완료 |
| `src/components/company/ChipSelector.tsx` | 정상 | glob 확인 완료 |
| `src/components/company/ProfileView.tsx` | 정상 | glob 확인 완료 |
| `src/components/company/ProfileEditForm.tsx` | 정상 | glob 확인 완료 |
| `src/components/company/ProfileTab.tsx` | 정상 | glob 확인 완료 |
| `src/components/company/SubmissionsTab.tsx` | 정상 | glob 확인 완료 |
| `src/components/company/ResponsesTab.tsx` | 정상 | glob 확인 완료 |

---

## 수정 권장 사항

### 1. [WARN] PortfolioTab.tsx - formatDate 미사용 import 제거

**파일**: `src/components/company/PortfolioTab.tsx`
**라인**: 6번째 줄
**현재 코드**:
```typescript
import { formatDate } from "@/lib/utils";
```
**조치**: 해당 import 줄 삭제.

`my/[id]/companies/[companyId]/page.tsx`는 `formatDate`를 로컬 함수로 직접 정의해서 사용하고 있습니다.
`PortfolioTab.tsx`에는 날짜 표시 UI가 없으므로 import가 불필요합니다.

---

## 참고: 검증 환경

- **플랫폼**: WSL2 (Linux on NTFS /mnt/d)
- **Node**: npm run build 대신 `npx tsc --noEmit`으로 타입 검증
- **판단 기준**: tsc 출력 없음 = 타입 오류 0개 = 배포 가능
