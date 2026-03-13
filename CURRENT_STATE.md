# CURRENT STATE
> 마지막 업데이트: 2026-03-13

## 최근 완료 작업

| 커밋 | 내용 |
|------|------|
| `ee7a51b` | Vercel 빌드 에러 해결 — OpenAI 클라이언트 lazy 초기화 |
| `6160de2` | SocialProof 섹션 강화 — 완료건수 카드 + 리뷰 20개 추가 |
| `d8a0232` | Step5 이메일 필수화 + 모두동의 + UX 카피 개선 |
| `e7eb6e5` | AI 인테리어 이미지 생성 API 구현 + 폼 연동 (`/api/generate-interior`) |
| `7a7a4c3` | Hero 서브카피 강조 + 1분 인테리어 미리보기 보조 링크 추가 |

## 미커밋 변경사항 (commit 필요)

### 수정된 파일
- `src/app/layout.tsx` — TrackingScripts 컴포넌트 추가
- `src/app/page.tsx` — 섹션 구조 업데이트
- `src/components/form/MultiStepForm.tsx` — 전환 추적 이벤트 연동
- `.gitignore` — 업데이트

### 신규 파일 (untracked)
- `src/components/tracking/TrackingScripts.tsx` — GA4 + Meta Pixel + 네이버 전환 스크립트
- `src/lib/tracking.ts` — 전환 추적 유틸리티 (trackFormStart, trackStepComplete, trackFormSubmit, trackAIImageGenerated, captureUtmParams)
- `src/app/about/page.tsx` — About 페이지
- `public/home1_subinterior.png`, `home2_subinterior.png`, `office1_subinterior.png` — 섹션용 이미지
- `marketing/` — 마케팅 실행 가이드 (네이버/인스타/트래킹/UTM)
- `claudedocs/marketing-strategy.md`, `claudedocs/naver-sublinks.md`

## 현재 앱 상태

| 항목 | 상태 |
|------|------|
| 로컬 빌드 | ✅ `npm run build` 성공 |
| Vercel 배포 | ✅ 배포됨 (마지막 push 기준) |
| AI 이미지 생성 | ✅ `/api/generate-interior` 구현 완료 |
| 전환 추적 코드 | ⚠️ 코드는 완성, **Vercel 환경변수 미설정** |
| 광고 집행 | ⏳ 아직 시작 전 |

### 전환 추적 — 미설정 환경변수 (Vercel Dashboard에 추가 필요)
```
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_NAVER_CONVERSION_ID=XXXXXXXXXX
```

## 현재 작업 브랜치
```
main (origin/main 대비 30 commits ahead — push 필요)
```

## 배포 정보
- **Git Remote**: `landing` → `https://github.com/woopsmarketing/interior_landing.git`
- **Vercel Root Directory**: `./`
- **Framework**: Next.js (App Router) + TypeScript + Tailwind CSS
