# 프로젝트: AI 인테리어 견적 비교 랜딩페이지

## 프로젝트 개요
- **목적**: 인테리어 견적 비교 서비스 광고 유입용 랜딩페이지 (전환 검증)
- **PRD**: `interior_landingpage_prd.md` (v1.0)
- **배포**: Vercel — Root Directory `./` (git 루트)
- **Git Remote**: `landing` → `https://github.com/woopsmarketing/interior_landing.git`

## 기술 스택
- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Animation**: motion/react (`"use client"` 필수)
- **Icons**: lucide-react
- **AI**: OpenAI API (`openai` 패키지 설치됨)
- **패키지 매니저**: npm

## 환경 변수
```
OPENAI_API_KEY=.env.local에 저장됨 (git에 올라가지 않음)
```

## 프로젝트 구조
```
src/
├── app/
│   ├── page.tsx          — 랜딩 메인 (섹션 조립)
│   ├── form/page.tsx     — 폼 단독 페이지
│   └── api/              — API 라우트 (아직 없음, 생성 예정)
├── components/
│   ├── sections/         — 랜딩 섹션 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── QuickBenefits.tsx
│   │   ├── BeforeAfter.tsx
│   │   ├── Problem.tsx
│   │   ├── CoreValue.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── SocialProof.tsx
│   │   ├── WhoFor.tsx
│   │   ├── Outcomes.tsx
│   │   ├── Trust.tsx
│   │   ├── FAQ.tsx
│   │   └── FinalCTA.tsx
│   └── form/
│       ├── MultiStepForm.tsx   — 폼 컨트롤러 (상태 관리)
│       └── steps/
│           ├── Step1.tsx       — 공간 기본 정보
│           ├── Step2.tsx       — 공사 희망 정보
│           ├── Step3.tsx       — 취향 및 우선순위
│           ├── Step4.tsx       — 이미지 업로드 + 요청사항
│           └── Step5.tsx       — 개인정보 및 동의 (최종 제출)
```

## 폼 데이터 구조 (FormData 인터페이스)
```typescript
// Step 1 — 공간 기본 정보
spaceType, region, area, areaUnknown, currentCondition, buildingAge

// Step 2 — 공사 희망 정보
constructionScope, desiredTiming, budget, constructionPurpose,
scheduleFlexibility, occupancyDuringWork

// Step 3 — 취향 및 우선순위
priorities[], preferredStyles[], preferredAtmosphere, currentProblems[]

// Step 4 — 이미지 및 요청사항
spacePhoto: File | null        // 현재 공간 사진 (선택)
referenceImage: File | null    // 원하는 감성 참고 이미지 (선택)
additionalRequest: string      // 추가 요청사항 (선택)

// Step 5 — 개인정보 및 동의
name, phone, email, contactMethod[], availableTime[],
agreePrivacy, agreeConsult, agreeMarketing
```

## 현재 폼 제출 흐름
```
Step 5 제출 → handleSubmit() → isLoading(2초) → isSubmitted = true
→ 완료화면: /after.jpg (하드코딩된 샘플 이미지) 표시
```

---

## 다음 구현 목표: AI 인테리어 이미지 생성

### 원하는 결과
**폼 제출 후 실제 AI가 생성한 인테리어 완성 이미지를 결과 화면에 출력**

사용자가 입력한 데이터를 조합해서:
- 공간 정보 + 취향/스타일 + 예산 등 폼 데이터
- 현재 공간 사진 (업로드 시)
- 원하는 감성 참고 이미지 (업로드 시)

→ 위 데이터를 기반으로 완성된 인테리어 이미지를 AI가 생성해서 출력

### 선택한 기술
- **모델**: `gpt-image-1` (OpenAI 최신 이미지 생성 모델, DALL-E 3보다 우수)
- **API**: OpenAI Responses API (`image_generation` tool 사용)
- **특징**: 이미지 입력 + 텍스트 동시 처리, 단일 API 호출로 분석+생성 가능

### 구현할 파이프라인
```
[Step 5 제출]
     ↓
[Next.js API Route: /api/generate-interior]
     ↓
1. 폼 데이터 → 한국어 정보를 영어 프롬프트로 변환
2. spacePhoto (있으면) → base64 인코딩
3. referenceImage (있으면) → base64 인코딩
     ↓
[gpt-image-1 Responses API 호출]
- input: 텍스트(프롬프트) + 이미지들(있는 것만)
- tools: [{ type: "image_generation" }]
- 이미지 입력 분석 + 인테리어 이미지 생성 한 번에 처리
     ↓
4. 생성된 이미지 base64 반환
     ↓
[완료 화면에 AI 생성 이미지 표시]
```

### 입력 케이스별 처리
```
spacePhoto O + referenceImage O → 공간 구조 + 감성 스타일 모두 반영 (최고 품질)
spacePhoto O + referenceImage X → 공간 구조 + 폼 스타일 데이터 반영
spacePhoto X + referenceImage O → 감성 이미지 스타일 + 폼 데이터 반영
spacePhoto X + referenceImage X → 폼 텍스트 데이터만으로 이미지 생성
```

### 생성할 파일
1. `src/app/api/generate-interior/route.ts` — API 라우트
2. `MultiStepForm.tsx` 수정 — 제출 시 API 호출, 결과 이미지 상태 관리
3. 완료 화면 수정 — `/after.jpg` 하드코딩 제거, AI 생성 이미지로 교체

### API 호출 코드 패턴
```typescript
// OpenAI Responses API with gpt-image-1
const response = await client.responses.create({
  model: "gpt-image-1",
  input: [{
    role: "user",
    content: [
      { type: "input_text", text: "상세 영어 프롬프트" },
      // 이미지는 있을 때만 추가
      ...(spacePhotoBase64 ? [{ type: "input_image", image_url: `data:image/jpeg;base64,${spacePhotoBase64}` }] : []),
      ...(refImageBase64 ? [{ type: "input_image", image_url: `data:image/jpeg;base64,${refImageBase64}` }] : []),
    ]
  }],
  tools: [{ type: "image_generation" }],
})

// 결과 추출
const imageData = response.output
  .filter(o => o.type === "image_generation_call")
  .map(o => o.result)[0]
// imageData = base64 string → <img src={`data:image/png;base64,${imageData}`} />
```

### 이미지 생성 프롬프트 품질 핵심 요소
```
- 공간감: "spacious Xsqm living room"
- 조명: "warm natural light through windows"
- 재질: 폼에서 선택한 스타일에 맞는 재질/색상
- 스타일: preferredStyles + preferredAtmosphere 반영
- 구도: "wide-angle interior photography"
- 품질: "photorealistic, architectural digest style"
```

### 로딩 처리
- 이미지 생성 소요 시간: 15~30초
- 현재 로딩 UI 이미 구현됨 (`isLoading` 상태)
- 로딩 메시지: "완성된 인테리어 미리보기를 생성 중입니다..."

### AI 면책 문구 (현재 구현됨, 유지)
```
"해당 이미지는 AI가 만든 이미지이므로 실제 결과물과 다를 수 있습니다."
```

---

## 디자인 원칙
- 색상 테마: `orange-500` accent, 배경 `#FFF9F5` (크림 오렌지)
- 한국어 카피 전용
- AI 과장 표현 없음, 사진 선택사항 강조
- `motion/react` 사용 컴포넌트는 반드시 `"use client"` 선언

## 주의사항
- `next.config.ts`에 `turbopack.root: path.resolve(__dirname)` 설정 (D:\Documents\package-lock.json 충돌 방지)
- `motion/react` import (framer-motion X)
- Vercel Root Directory = `./`

---

## Orchestrator 규칙 (모든 요청에 적용)

> 상세 시나리오: `claudedocs/orchestrator-rules.md` 참고

**나는 이 프로젝트의 CTO/Orchestrator다.** 사용자의 모든 요청을 받으면 아래 프로세스를 먼저 실행한다.

### Step 0: 크기 판단 (매 요청마다)

| 분류 | 조건 | 처리 |
|------|------|------|
| 🟢 TASK | 1~2파일 수정, "바꿔줘/고쳐줘" | 5요소 정제(목표/범위/제약/출력/검증) → 바로 적합한 에이전트 호출 |
| 🟡 FEATURE | 새 기능 1개, 3~5파일 | 인라인 명세 → 설계 → 구현 → 검증 에이전트 순차 호출 |
| 🔵 PROJECT | 멀티기능, 6파일+, 설계/구현/검증 분리 필요 | `prd/{기능명}.md` 생성 → prd-analyzer → architect → 구현 → 검증 |

### Step 1: 에이전트 분배

- **순차 실행**: 앞 결과가 뒤의 입력이 될 때 (설계 → 구현 → 검증)
- **병렬 실행**: 서로 독립적인 작업 (code-reviewer + mobile-layout-checker + ux-copy-reviewer)

### Step 2: 에이전트 팀 맵

| 레이어 | 에이전트 | 호출 시점 |
|--------|---------|----------|
| **기획팀** | `prd-analyzer`, `architect`, `api-designer` | PROJECT 시작 전 |
| **개발팀** | `landing-section-builder`, `form-builder`, `api-route-builder`, `copy-writer`, `style-engineer` | 구현 시 |
| **품질팀** | `code-reviewer`, `mobile-layout-checker`, `ux-copy-reviewer`, `user-exit-analyzer` | 구현 완료 후 |
| **테스트팀** | `test-writer` | 기능 구현 완료 후 |
| **배포팀** | `build-validator`, `env-checker`, `vercel-deploy-debugger` | 배포 직전 / 실패 시 |
| **보안팀** | `security-auditor`, `api-key-guard` | API 구현 후 / 커밋 전 |
| **디버그팀** | `error-diagnoser` | 에러 발생 시 |
| **성능팀** | `image-optimizer`, `bundle-analyzer` | 성능 최적화 / 배포 전 |

### Step 3: 에스컬레이션

| 상황 | 행동 |
|------|------|
| 빌드 실패 | `vercel-deploy-debugger` 즉시 호출 |
| 보안 취약점 | 배포 중단 + `security-auditor` 재호출 |
| API 키 노출 | 전체 중단 + `api-key-guard` 호출 |
| 2회 연속 실패 | 사용자에게 에스컬레이션 |

### Orchestrator 행동 원칙
- **직접 코드를 짜지 않는다** — 적합한 에이전트에 위임한다
- **병렬 가능한 작업은 반드시 병렬로** 실행한다
- **결과를 취합하여 요약 보고**한다
- 정보가 부족하면 먼저 사용자에게 질문한다
- **구현 완료 후 반드시 `build-validator` 에이전트로 빌드 검증** → 성공 확인 후 완료 보고 (TASK/FEATURE/PROJECT 무관 필수)
