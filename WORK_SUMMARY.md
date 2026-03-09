# AI 인테리어 견적 비교 랜딩페이지 — 구현 작업 정리

- **작업 일자**: 2026-03-09
- **기반 문서**: `interior_landingpage_prd.md` (v1.0)
- **기술 스택**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + motion + lucide-react

---

## 구현 개요

PRD 기반 10개 섹션 + 4단계 멀티스텝 폼 랜딩페이지를 **Scout → Build → QA** 3단계 파이프라인으로 구현했습니다.
7개 서브에이전트가 역할을 분담하여 병렬/순차 실행하였습니다.

---

## 3단계 파이프라인

### Stage 0: 프로젝트 부트스트랩 (Claude 직접)

```bash
npx create-next-app@latest app --typescript --tailwind --app --src-dir
npm install motion lucide-react
mkdir -p claudedocs/monet-refs
mkdir -p src/components/sections
mkdir -p src/components/form/steps
```

- Next.js 16 App Router + TypeScript + Tailwind CSS 프로젝트 초기화
- 디렉토리 구조 설계 및 생성

---

### Stage 1: Scout — 재료 수집 (병렬 실행)

#### `prd-copy-extractor` 에이전트

**역할**: PRD 전체를 읽고 모든 섹션의 카피를 추출하여 구조화

**작업 내용**:
- `interior_landingpage_prd.md` 전체 분석
- 11개 섹션(Header, Hero, Problem, CoreValue, HowItWorks, WhoFor, Outcomes, Trust, FAQ, FinalCTA, Form) 카피 추출
- 필수 고지 문구 3종(AI 이미지, 비교/견적, 선택 고지) 포함

**출력물**: `claudedocs/copy-sheet.md`

---

#### `monet-component-scout` 에이전트

**역할**: Monet MCP를 통해 각 섹션에 적합한 UI 컴포넌트를 검색하고 레퍼런스 저장

**작업 내용**:
- `mcp__monet-mcp__search_components` 툴로 4개 섹션 검색
- `mcp__monet-mcp__get_component_code` 툴로 실제 컴포넌트 코드 추출
- 각 컴포넌트에 PRD 한국어 콘텐츠 적용 가이드 작성

| 섹션 | 선택된 컴포넌트 | 특징 |
|------|--------------|------|
| Hero | `landingfolio-hero-5` | 두 컬럼, dual CTA 구조 |
| FAQ | `trackit-so-faq-7` | AnimatePresence 아코디언 |
| How It Works | `patenty-ai-how-it-works-3` | STEP 번호 + 아이콘 그리드 |
| Problem Cards | `features-x` | 4-card 그리드 (2×2) |

**출력물**: `claudedocs/monet-refs/hero.md`, `faq.md`, `how-it-works.md`, `problem-cards.md`

---

### Stage 2: Build — 섹션 구현 (병렬 실행)

#### `landing-section-builder` 에이전트 (그룹 1)

**담당 섹션**: Header, Hero

**작업 내용**:
- **Header**: sticky top-0, 로고 + 신뢰 문구 + CTA, 모바일 반응형
- **Hero**: 두 컬럼 레이아웃, 공감 헤드라인, 2개 CTA, 예시 카드, motion 애니메이션
- `page.tsx` 초기 조립

**출력물**: `src/components/sections/Header.tsx`, `Hero.tsx`

---

#### `form-builder` 에이전트

**담당**: 멀티스텝 폼 전체

**작업 내용**:
- **MultiStepForm**: 진행률 표시(1/4~4/4) + 프로그레스 바 + 단계 전환 애니메이션 + 유효성 검사
- **Step1**: 이름, 연락처, 지역(8개), 공간 유형(radio 토글)
- **Step2**: 예산, 시공 범위/스타일/중요 요소(pill 체크박스), 상세 요청사항
- **Step3**: 공간 사진 + 참고 이미지 선택 업로드, AI 면책 고지
- **Step4**: 개인정보 동의, 상담 동의, "꼭 계약하지 않아도 됩니다" 안심 문구
- 완료 화면: "요청이 접수되었습니다"

**출력물**: `src/components/form/MultiStepForm.tsx`, `steps/Step1~4.tsx`

---

#### `landing-section-builder` 에이전트 (그룹 2)

**담당 섹션**: Problem, CoreValue, HowItWorks

**작업 내용**:
- **Problem**: 2×2 카드 그리드, lucide-react 아이콘, 공감 본문
- **CoreValue**: 좌우 2단, 100+ 숫자 강조 카드, 핵심 포인트 3개 뱃지
- **HowItWorks**: 4단계 플로우(데스크톱 가로/모바일 세로), 단계 연결선, AI 면책 문구

**출력물**: `src/components/sections/Problem.tsx`, `CoreValue.tsx`, `HowItWorks.tsx`

---

#### `landing-section-builder` 에이전트 (그룹 3)

**담당 섹션**: WhoFor, Outcomes, Trust, FAQ, FinalCTA

**작업 내용**:
- **WhoFor**: CheckCircle2 체크리스트, stagger 애니메이션
- **Outcomes**: 4개 아이콘 카드, 색상별 차별화
- **Trust**: 7개 안심 배지(rounded-full, flex-wrap), #FFF9F5 배경
- **FAQ**: AnimatePresence 아코디언, ChevronDown 회전 아이콘
- **FinalCTA**: orange 그라디언트 배경, 감정형 클로징 카피

**출력물**: `WhoFor.tsx`, `Outcomes.tsx`, `Trust.tsx`, `FAQ.tsx`, `FinalCTA.tsx`

---

### Stage 3: QA — 검수 (병렬 실행)

#### `ux-copy-reviewer` 에이전트

**역할**: PRD 톤앤매너 원칙 기준 카피 검수

**발견 이슈**:
| 파일 | 문제 | 처리 |
|------|------|------|
| FAQ.tsx | "더 정확한 예시 이미지" — AI 품질 암시 | ✅ "더 구체적인"으로 수정 |
| HowItWorks.tsx | Step 2에서 AI 이미지가 앞에 부각 | ⚠️ 경미, 유지 |
| FinalCTA.tsx | 보조 문구 가독성 낮음 | ⚠️ 경미, 유지 |

**출력물**: `claudedocs/qa-report.md` (섹션 1)

---

#### `mobile-layout-checker` 에이전트

**역할**: Tailwind 클래스 기반 모바일 우선 설계 검수

**발견 이슈**:
| 파일 | 문제 | 처리 |
|------|------|------|
| CoreValue.tsx | `text-6xl` 기본 — 모바일 과도하게 큼 | ✅ `text-4xl sm:text-5xl`로 수정 |
| CoreValue.tsx | CTA `w-full` 누락 | ✅ `w-full sm:w-auto` 추가 |
| MultiStepForm.tsx | `duration-250` 유효하지 않은 클래스 | ✅ `duration-200`으로 수정 |

**출력물**: `claudedocs/qa-report.md` (섹션 2 추가)

---

#### `user-exit-analyzer` 에이전트

**역할**: 사용자 이탈 위험 포인트 분석 + 전환 개선 제안

**핵심 발견**:
1. 폼이 페이지 최하단 → CTA 클릭 후 긴 스크롤 필요
2. WhoFor 섹션에 CTA 완전 부재 (공감 극대화 구간에서 전환 공백)
3. Hero dual CTA가 동일 동작 → 결정 피로 가능성

**적용된 개선**:
- ✅ 폼 위치를 Hero 바로 아래로 이동
- ✅ WhoFor 하단에 CTA 버튼 추가

**A/B 테스트 제안 Top 3**:
1. Step 1 연락처를 마지막 수집으로 변경 (기대 효과: 이탈 10–20% 감소)
2. WhoFor CTA 유무 비교
3. Hero Primary CTA 1개 + 탐색 링크로 분리

**출력물**: `claudedocs/qa-report.md` (섹션 3 추가)

---

## 최종 파일 구조

```
D:/Documents/landing_interior/
├── interior_landingpage_prd.md     ← 기획 PRD
├── WORK_SUMMARY.md                 ← 본 문서
├── .gitignore
├── claudedocs/
│   ├── copy-sheet.md               ← 전체 섹션 카피
│   ├── qa-report.md                ← QA 3종 통합 리포트
│   └── monet-refs/
│       ├── hero.md
│       ├── faq.md
│       ├── how-it-works.md
│       └── problem-cards.md
├── .claude/agents/                 ← 7개 서브에이전트 정의
│   ├── prd-copy-extractor.md
│   ├── monet-component-scout.md
│   ├── landing-section-builder.md
│   ├── form-builder.md
│   ├── ux-copy-reviewer.md
│   ├── mobile-layout-checker.md
│   └── user-exit-analyzer.md
└── app/                            ← Next.js 앱
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.*
    └── src/
        ├── app/
        │   └── page.tsx            ← 섹션 조립
        └── components/
            ├── sections/
            │   ├── Header.tsx
            │   ├── Hero.tsx
            │   ├── Problem.tsx
            │   ├── CoreValue.tsx
            │   ├── HowItWorks.tsx
            │   ├── WhoFor.tsx
            │   ├── Outcomes.tsx
            │   ├── Trust.tsx
            │   ├── FAQ.tsx
            │   └── FinalCTA.tsx
            └── form/
                ├── MultiStepForm.tsx
                └── steps/
                    ├── Step1.tsx
                    ├── Step2.tsx
                    ├── Step3.tsx
                    └── Step4.tsx
```

---

## 실행 방법

```bash
cd app
npm install
npm run dev    # 개발 서버 (http://localhost:3000)
npm run build  # 프로덕션 빌드
```

---

## 빌드 결과

```
✓ Compiled successfully
✓ Generating static pages (4/4)
Route (app)
├ ○ /
└ ○ /_not-found
○ (Static) prerendered as static content
```

TypeScript 오류 없음, SSG(정적 생성) 성공.
