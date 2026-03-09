# 작업 이력 (Changelog)

> AI 인테리어 견적 비교 랜딩페이지 — 전체 작업 기록
> 프로젝트: `landing_interior` / 저장소: https://github.com/woopsmarketing/interior_landing

---

## 현재 상태 요약

- **프레임워크**: Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **빌드 상태**: ✅ SSG 빌드 성공 (`npm run build`)
- **라우트**: `/` (메인 랜딩), `/form` (멀티스텝 견적 폼)
- **섹션 수**: 14개 (Header 포함)
- **폼 단계**: 4단계

---

## 작업 단계별 기록

---

### 1단계 — 초기 구현 (commit: `700d8f9`)

**PRD 기반 전체 랜딩페이지 초기 구현**

#### 생성된 섹션 컴포넌트
| 파일 | 역할 |
|------|------|
| `Header.tsx` | sticky 헤더, 로고, CTA 버튼 |
| `Hero.tsx` | 헤드라인, 서브카피, CTA 2개, 신뢰 배지, 공감 포인트 |
| `Problem.tsx` | 4개 문제 카드 (2×2 그리드) |
| `CoreValue.tsx` | 핵심 가치 + 100+ 업체 수 강조 |
| `HowItWorks.tsx` | 4단계 프로세스 플로우 |
| `SocialProof.tsx` | 통계 배너 + 후기 캐러셀 |
| `WhoFor.tsx` | 대상 고객 체크리스트 5개 |
| `Outcomes.tsx` | 기대 효과 4개 카드 |
| `Trust.tsx` | 신뢰/안심 포인트 (무료 상담, 계약 강요 없음 등) |
| `FAQ.tsx` | 아코디언 FAQ 8개 항목 |
| `FinalCTA.tsx` | 감성 마무리 + CTA 버튼 |

#### 생성된 폼 컴포넌트
| 파일 | 역할 |
|------|------|
| `MultiStepForm.tsx` | 4단계 폼 컨테이너, 진행 표시기 |
| `Step1.tsx` | 이름 / 전화번호 / 지역 / 공간 유형 |
| `Step2.tsx` | 예산 / 시공 범위 / 스타일 / 우선순위 / 상세 내용 |
| `Step3.tsx` | 사진 업로드 (선택) + AI 면책 문구 |
| `Step4.tsx` | 개인정보 동의 + 최종 제출 |

#### 기술 결정
- `motion/react` 애니메이션 적용 컴포넌트에 `"use client"` 필수
- 색상 테마: `orange-500` 계열 accent, 배경 `#FFF9F5` (크림 오렌지)
- 폼은 `/form` 라우트로 분리 (랜딩과 독립)

---

### 2단계 — UX 개선 1차 (commit: `3161516` 일부)

**히어로 헤드라인 단축 + 캐러셀 업그레이드 + CTA 다양화**

#### Hero.tsx
- h1 카피 단축: 긴 한 줄 → 2줄로 압축
  - 변경 전: `🏠 인테리어를 바꾸고 싶은 마음은 분명한데, 어디서부터 시작해야 할지 막막하셨나요?`
  - 변경 후: `🏠 막막한 인테리어, / 이제 쉽고 확실하게 시작하세요`
- `max-w-2xl` 적용으로 헤드라인 임팩트 강화
- 서브카피 단일 `<p>` → 두 개 `<p>` 태그 분리 + `mt-3` 간격

#### SocialProof.tsx
- 무한루프 자동 슬라이드 (3.5초 간격)
- `currentIndex % TESTIMONIALS.length` 방식으로 무한 순환
- 좌우 화살표 버튼 (`ChevronLeft`, `ChevronRight`) 추가
- 사용자 조작 시 타이머 리셋 (`resetTimer()`)
- dot indicator는 `displayIndex`로 현재 위치 표시

#### CTA 버튼 문구 섹션별 다양화
| 섹션 | 변경 후 문구 |
|------|-------------|
| Hero | 무료 견적 요청하기 |
| CoreValue | 미리 인테리어 결과물 확인하기 |
| WhoFor | 무료 견적 요청하기 |
| Trust | 최저가 견적 요청받기 |
| FAQ | 무료 견적 요청하기 |
| FinalCTA | 최저가 견적 요청받기 |

---

### 3단계 — 신규 섹션 추가 (commit: `3161516` 일부)

#### BeforeAfter.tsx (신규)
- 마우스/터치 드래그로 인테리어 전후 이미지 비교
- `position` state (0~100%)로 divider 위치 제어
- `useLayoutEffect`로 컨테이너 width 측정 (After 이미지 클리핑 정확도)
- 현재: 회색/오렌지 플레이스홀더 배경
- **이미지 교체**: `public/before.jpg`, `public/after.jpg` 파일 추가 시 자동 적용
- 크기: `h-[480px] sm:h-[680px]`, 폭: `max-w-7xl`

#### QuickBenefits.tsx (신규)
- Hero 바로 아래 핵심 혜택 4개 바 (빠른 스캔용)
- "2~3일 내 견적 답변 / 100% 무료 서비스 / 100개 이상 업체 비교 / 계약 강요 없음"
- `grid grid-cols-2 sm:grid-cols-4` 레이아웃

#### ComparisonTable.tsx (신규)
- "직접 알아볼 때 vs 인테리어비교 이용 시" 6행 비교표
- 데스크톱: 3열 테이블, 모바일: 행별 카드 스택
- 직접 열: ❌ 회색, 서비스 열: ✅ 오렌지 강조

---

### 4단계 — UX 개선 2차 (가독성)

#### 텍스트 크기 개선
- `Problem.tsx` 카드 설명: `text-sm` → `text-base`
- `Outcomes.tsx` 카드 설명: `text-sm` → `text-base`
- `HowItWorks.tsx` 스텝 설명: `text-sm` → `text-base`, `mb-2` → `mb-3`
- `SocialProof.tsx` 후기 본문: `text-sm` → `text-[15px]`

#### FAQ.tsx
- 기본 5개 노출 + "나머지 질문 더 보기 (3개) ↓" 버튼으로 나머지 접기
- `showAll` state 토글 방식

#### Header.tsx
- 로고 포인트 컬러: `인테리어<span className="text-orange-500">비교</span>`

#### FinalCTA.tsx
- 본문 텍스트 대비 강화: `text-orange-100` → `text-white/90`

---

### 5단계 — 한국 감성 UX 추가

#### Hero.tsx — 배경 + 스타일 태그
- 따뜻한 블러 서클 3개 (오렌지/앰버) → 인테리어 감성 배경 연출
- `public/hero-bg.jpg` 파일 추가 시 10% 투명도 배경 이미지로 자동 적용
- primary CTA에 `shadow-lg shadow-orange-200` 추가
- **인테리어 스타일 태그 선택 UI** 추가:
  - 모던 미니멀 / 내추럴 우드 / 북유럽 스칸디나비안 / 클래식 고급 / 빈티지 레트로 / 화이트 & 그레이
  - 클릭 선택 시 해당 스타일로 폼 시작 유도 문구 표시

#### FinalCTA.tsx — 카카오 채널 버튼
- 카카오 노란색 (`#FEE500`) 보조 CTA 버튼 추가
- **URL 교체 필요**: `FinalCTA.tsx` 내 `href="#kakao-channel"` → 실제 카카오 채널 URL
- "영업일 기준 2~3일 이내 담당자가 직접 연락드립니다" 응답 보장 문구 추가

---

## 최종 섹션 순서 (page.tsx)

```
Header
Hero
QuickBenefits    ← 신규
BeforeAfter      ← 신규
Problem
CoreValue
ComparisonTable  ← 신규
HowItWorks
SocialProof
WhoFor
Outcomes
Trust
FAQ
FinalCTA
```

---

## 이미지 교체 가이드

| 위치 | 파일 경로 | 설명 |
|------|----------|------|
| Hero 배경 | `app/public/hero-bg.jpg` | 인테리어 공간 사진 (권장: 1920×1080 이상) |
| Before 이미지 | `app/public/before.jpg` | 시공 전 공간 사진 |
| After 이미지 | `app/public/after.jpg` | 시공 후 공간 사진 |

---

## 미완료 / 향후 작업 예정

| 항목 | 우선순위 | 설명 |
|------|---------|------|
| 실제 이미지 교체 | 높음 | hero-bg, before, after 사진 추가 |
| 카카오 채널 URL | 높음 | FinalCTA.tsx href 교체 |
| 평수별 견적 가이드 | 중간 | 20/30/40평 예상 비용 범위 배너 |
| 네이버 블로그 후기 링크 | 중간 | Trust 섹션에 외부 후기 링크 추가 |
| 공사 일정 타임라인 | 낮음 | 철거→공사→마감 예상 기간 시각화 |
| 폼 지역 자동완성 | 낮음 | 시/군/구 드롭다운 UX |
| 상단 이벤트 배너 | 낮음 | 시즈널 긴급성 배너 |

---

## 로컬 개발 환경 세팅

```bash
git clone https://github.com/woopsmarketing/interior_landing.git
cd interior_landing/app
npm install
npm run dev       # http://localhost:3000
npm run build     # 프로덕션 빌드 검증
```

---

## 기술 스택

| 항목 | 버전/내용 |
|------|---------|
| Next.js | 16.1.6 (App Router) |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| motion/react | framer-motion 계열 |
| lucide-react | 아이콘 |
| 배포 방식 | SSG (Static Site Generation) |
