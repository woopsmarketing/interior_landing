# 바이브코딩 실전 가이드
> "잘 쓰는 사람"은 AI를 팀원처럼 다룬다 — 심부름꾼이 아니라.

---

## 1. 핵심 마인드셋

**나쁜 요청:** "앱 만들어줘"
**좋은 요청:** 목표 + 범위 + 제약 + 파일 위치 + 출력 형식

Claude Code는 컨텍스트가 많을수록 결과가 좋아진다.
모호함 = 할루시네이션의 씨앗이다.

**PRD를 직접 안 써도 된다** — Orchestrator가 큰 요청(PROJECT)을 감지하면 mini-PRD를 자동 생성한다. 너는 자연어로 요청만 하면 된다.

---

## 2. 프롬프트 5요소 공식

모든 작업 요청은 이 5가지를 포함해야 한다:

```
[목표]     무엇을 달성하려는가
[범위]     어디까지 건드려도 되는가 (파일/폴더 명시)
[제약]     하면 안 되는 것 (기존 로직 유지, 특정 패키지 금지 등)
[출력]     어떤 형태로 나와야 하는가 (파일 생성 / 수정 / 리포트)
[검증]     완료 조건은 무엇인가 (빌드 성공 / 특정 동작 확인 등)
```

### 적용 예시

**나쁜 요청:**
```
Hero 섹션 만들어줘
```

**좋은 요청:**
```
[목표] PRD 2장 Hero 섹션을 컴포넌트로 구현
[범위] src/components/sections/Hero.tsx 파일만 생성 (기존 파일 수정 금지)
[제약] motion/react 사용 필수, framer-motion 사용 금지 / "use client" 선언 필수
[출력] Hero.tsx 완성 파일 — 모바일 우선, orange-500 테마
[검증] npm run build 통과 + 모바일 375px에서 CTA 버튼 1개 이상 노출
```

> **참고**: 5요소를 완벽하게 채우지 않아도 된다. Orchestrator가 부족한 부분은 자동으로 추론하거나 질문한다.
> 중요한 건 "최대한 구체적으로" 쓰려는 습관이다.

---

## 3. 에이전트팀 실제 사용법

### 너는 이것만 하면 된다

| 너의 역할 | 에이전트팀이 하는 것 |
|-----------|---------------------|
| 자연어로 요청 전달 | Orchestrator가 크기 판단 + 에이전트 분배 |
| 부족한 정보 질문에 답변 | 자동으로 다음 단계 진행 |
| 결과 확인 후 피드백 | Orchestrator가 수정 에이전트 재호출 |

### 요청 크기별 흐름 — 3가지 경로

#### 🟢 TASK — 작은 요청 (1~2파일 수정)

```
너: "Hero 배경색 #FFF5EB로 바꿔줘"
  ↓
[Orchestrator] → TASK 판단
  → 5요소 정제: 목표(배경색 변경) / 범위(Hero.tsx) / 검증(빌드)
  → style-engineer 호출 → 수정 완료
  ↓
✅ 끝
```

이런 요청들이 TASK:
- "Hero 배경색 바꿔줘"
- "FAQ 아코디언 기본 열림으로 고쳐줘"
- "버튼 텍스트 '무료 견적 받기'로 수정해줘"

---

#### 🟡 FEATURE — 중간 요청 (새 기능 1개, 3~5파일)

```
너: "FAQ 섹션 새로 만들어줘"
  ↓
[Orchestrator] → FEATURE 판단
  → 인라인 명세 (세션 내, 파일 생성 없음)
  → copy-writer → 카피 확정
  → landing-section-builder → FAQ.tsx 구현
  → mobile-layout-checker + ux-copy-reviewer (병렬)
  ↓
✅ 끝
```

이런 요청들이 FEATURE:
- "FAQ 섹션 만들어줘"
- "로그인 페이지 추가해줘"
- "결과 페이지 디자인 수정해줘"

---

#### 🔵 PROJECT — 큰 요청 (멀티기능, 6파일+)

```
너: "AI 이미지 생성 API 추가해줘. 폼 제출하면 인테리어 완성 이미지 보여주는 기능"
  ↓
[Orchestrator] → PROJECT 판단
  → 질문: "어떤 AI 모델? 이미지 규격? 에러 처리 방식?"
  ↓
너: "gpt-image-1, 1024x1024, 실패 시 기본 이미지 표시"
  ↓
[Orchestrator] → prd/ai-image-generation.md 생성 (mini-PRD)
  → prd-analyzer → 태스크 분해
  → api-designer → API 명세
  → api-route-builder → route.ts 구현
  → form-builder → MultiStepForm.tsx 수정
  → security-auditor → 보안 검증
  → test-writer → API 테스트
  → build-validator → 빌드 확인
  ↓
✅ 완료 보고
```

이런 요청들이 PROJECT:
- "AI 이미지 생성 기능 전체 구현해줘"
- "반려동물 쇼핑몰 랜딩 만들어줘"
- "결제 시스템 연동해줘"

---

### 핵심: 너는 "무엇을 원하는가"만 말하면 된다

- 작은 수정 → 바로 실행
- 중간 기능 → 세션 내 명세로 진행
- 큰 프로젝트 → Orchestrator가 부족한 정보 질문 → mini-PRD 자동 생성 → 전체 파이프라인 가동

**"어떻게 구현할지"는 에이전트팀이 결정한다.**

---

## 4. PRD가 자동 생성되는 과정 (PROJECT 경로만)

PRD는 "기획 문서"가 아니라 "에이전트 실행 명세서"다.
**PROJECT 규모일 때만** Orchestrator가 자동 생성한다.

### Orchestrator가 생성하는 mini-PRD 구조

```markdown
# [기능명] mini-PRD

## 개요
- 목적: (1~2문장)
- 대상 사용자: (누가 쓰는가)

## 핵심 요구사항
1. (필수 기능 — 구체적으로)

## 기술 제약
- 프레임워크: (자동 감지)
- 금지 사항: (있으면)

## 섹션/화면 구성
- (각 섹션 목적 + 핵심 카피)

## UI/UX 방향
- 레이아웃 / 톤앤매너 / 모바일

## 완료 조건
- [ ] (체크리스트)
```

### 좋은 PRD vs 나쁜 PRD

| 항목 | 나쁜 PRD | 좋은 PRD |
|------|----------|----------|
| 카피 | "임팩트 있는 헤드라인" | "전국 100개 업체 견적을 한 번에 비교" |
| 레이아웃 | "깔끔하게" | "카드 3개, 2xl:3col, md:2col, sm:1col" |
| 제약 | "보기 좋게" | "orange-500 accent, motion fade-in 0.3s" |
| 완료 조건 | 없음 | "빌드 성공 + CTA 클릭 시 폼으로 스크롤" |

---

## 5. 에이전트 직접 호출 시 입력 명시 규칙

에이전트를 직접 부를 때는 반드시 **입력 파일 경로**를 명시한다:

```
// 나쁜 호출
"모바일 반응형 확인해줘"

// 좋은 호출
"mobile-layout-checker: src/components/sections/Hero.tsx 파일을
 모바일 375px 기준으로 반응형 검증해줘.
 결과는 claudedocs/mobile-review.md에 저장."
```

---

## 6. 실전 예시 — "AI 이미지 생성 API 추가"

이 프로젝트의 실제 작업을 5요소 공식으로 분해한 전체 흐름이다.

### Step 1: 설계 요청 (PRODUCT & ARCHITECTURE)

```
[목표] POST /api/generate-interior 엔드포인트 API 명세 작성
[범위] claudedocs/api-spec.md 파일 생성만 (코드 구현 금지)
[제약]
  - OpenAI gpt-image-1 모델 사용 (DALL-E 3 아님)
  - Responses API 사용 (image_generation tool)
  - 이미지 입력 케이스 4가지 모두 명세 (사진 유/무 × 참고이미지 유/무)
[출력] claudedocs/api-spec.md — 요청/응답 스키마, 에러 코드, 입력 케이스별 처리
[검증] 4가지 입력 케이스가 모두 명세에 포함되어 있을 것
```

### Step 2: 구현 요청 (IMPLEMENTATION)

```
[목표] claudedocs/api-spec.md 명세대로 API 라우트 구현
[범위] src/app/api/generate-interior/route.ts 파일 생성
[제약]
  - openai 패키지 사용 (이미 설치됨)
  - OPENAI_API_KEY는 process.env에서 읽을 것 (하드코딩 금지)
  - Next.js App Router API 라우트 형식
  - 파일은 base64로 인코딩해서 전달
[출력] 완성된 route.ts — 4가지 입력 케이스 분기 포함
[검증] npx tsc --noEmit 타입 오류 없음
```

### Step 3: 보안 검증 요청 (SECURITY) — 구현 직후 반드시

```
[목표] 방금 생성된 API 라우트의 보안 취약점 검사
[범위] src/app/api/generate-interior/route.ts 파일만
[제약] 읽기 전용 (파일 수정 금지, 리포트만 작성)
[출력] claudedocs/security-report.md — OWASP Top 10 기준, 발견 항목 + 심각도
[검증] API 키 하드코딩 여부 반드시 포함
```

### Step 4: 폼 연결 요청 (IMPLEMENTATION)

```
[목표] Step5 제출 시 /api/generate-interior 호출 후 결과 이미지 표시
[범위] src/components/form/MultiStepForm.tsx 수정
[제약]
  - 기존 isLoading, isSubmitted 상태 로직 유지
  - /after.jpg 하드코딩 제거
  - 로딩 중 메시지: "완성된 인테리어 미리보기를 생성 중입니다..."
  - AI 면책 문구 유지
[출력] 수정된 MultiStepForm.tsx — generatedImage state 추가
[검증] 빌드 성공 + isSubmitted 시 AI 이미지 또는 에러 메시지 표시
```

### Step 5: 배포 체크 (DELIVERY / RELEASE) — 병렬 실행 가능

```
[목표] 배포 전 최종 검증 3종
[범위] 프로젝트 전체
[제약] 읽기 + 빌드 실행만 (코드 수정 금지)
[출력] 각각 claudedocs/에 저장
  - env-checker → env-checklist.md
  - build-validator → build-report.md
[검증] 3개 모두 PASS 상태일 것
```

---

## 7. 반복 가능한 요청 템플릿

복사해서 바로 쓸 수 있는 템플릿들:

### 새 섹션 구현 템플릿

```
[목표] PRD [X]장 [섹션명] 섹션을 컴포넌트로 구현
[범위] src/components/sections/[ComponentName].tsx 파일 생성
[제약]
  - motion/react 사용 ("use client" 필수)
  - framer-motion 사용 금지
  - 색상: orange-500 accent, 배경 #FFF9F5
  - 한국어 카피는 PRD 원문 그대로 사용
  - 이미지 사용 시 next/image 컴포넌트
[출력] 완성된 [ComponentName].tsx
[검증] npm run build 통과
```

### 버그 수정 템플릿

```
[목표] [증상] 버그 수정
[범위] [파일 경로] 파일만 수정
[증상] [어떤 상황에서 어떻게 깨지는가]
[제약] 다른 컴포넌트 로직 변경 금지
[출력] 수정된 파일 (변경점 요약 포함)
[검증] [재현 방법] 으로 확인 시 정상 동작
```

### 코드 리뷰 요청 템플릿

```
[목표] [파일명] 코드 리뷰
[범위] [파일 경로] 파일만
[제약] 읽기 전용 (수정 금지, 의견만)
[출력] claudedocs/code-review-[날짜].md
  - 버그 위험 (있으면)
  - 타입 오류 (있으면)
  - 리팩토링 제안 (선택)
[검증] 심각도 HIGH 항목이 없을 것
```

---

## 8. 흔한 실수와 대처법

| 실수 | 증상 | 대처 |
|------|------|------|
| 너무 큰 요청 | AI가 중간에 멈추거나 반쪽만 구현 | 작업을 3개 이하 파일 단위로 쪼개기 |
| 제약 미명시 | 기존 파일 덮어쓰기, 금지 패키지 사용 | 항상 [제약] 항목에 금지 목록 포함 |
| 검증 기준 없음 | "완료" 기준이 불분명해 반복 수정 | [검증] 항목을 체크리스트로 작성 |
| 설계 없이 구현 | 타입 충돌, 명세 불일치 | 반드시 설계 → 구현 순서 지키기 |
| 에이전트 연속 대화 | 이전 컨텍스트 오염 | 새 작업은 새 대화창에서 시작 |

---

## 9. 이 프로젝트 전용 빠른 참조

```
다음 구현: gpt-image-1 API 연동
  → api-designer (명세) → api-route-builder (구현) → security-auditor (검증)

배포 체크:
  → api-key-guard → env-checker → build-validator → (통과 시) 배포

전체 QA:
  → code-reviewer + mobile-layout-checker + ux-copy-reviewer (병렬) → user-exit-analyzer

에러 대응:
  → error-diagnoser → (해당 에이전트) 수정 → code-reviewer 재검증
```

---

*이 가이드는 `subagent_tutorial.md` + `orchestrator-rules.md`의 실전 적용 매뉴얼이다.*
*새 프로젝트에도 [목표/범위/제약/출력/검증] 5요소 공식은 동일하게 적용된다.*
