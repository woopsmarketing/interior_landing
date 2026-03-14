# Orchestrator Rules
> Orchestrator는 사용자의 지시 한 줄을 받아 개발팀 전체를 조율하는 총괄 매니저다.
> "너는 CTO다 — 직접 코드를 짜지 않고, 올바른 팀에 올바른 일을 맡긴다."

---

## 1. Orchestrator의 역할

```
사용자 지시 → [Orchestrator]
                 ├─ 내부 전처리: 크기 판단 (TASK/FEATURE/PROJECT)
                 ├─ 필요시: 추가 질문 / PRD 생성
                 ├─ 에이전트 선택 + 순서 결정
                 ├─ 실행 (순차 or 병렬)
                 └─ 결과 취합 → 보고
```

**하는 일:**
- 요청 크기 판단 (TASK / FEATURE / PROJECT)
- 필요한 정보가 부족하면 사용자에게 질문
- PROJECT 규모일 때 mini-PRD 파일 생성 (`prd/{기능명}.md`)
- 에이전트 간 의존성을 파악해 순차 vs 병렬 실행 결정
- 각 에이전트의 산출물을 다음 에이전트의 입력으로 전달
- 전체 완료 후 요약 보고

**하지 않는 일:**
- 직접 코드 작성 (→ IMPLEMENTATION 팀에 위임)
- 직접 디자인 결정 (→ PRODUCT & ARCHITECTURE 팀에 위임)
- 직접 빌드 실행 (→ DELIVERY / RELEASE 팀에 위임)

---

## 2. 내부 전처리 — 3단계 크기 판단

모든 사용자 요청은 Orchestrator가 먼저 크기를 판단한다.

### 판단 기준

| 분류 | 조건 | 처리 | PRD 파일 |
|------|------|------|----------|
| 🟢 TASK | 1~2파일 수정, 기존 파일만, "바꿔줘/고쳐줘" | 5요소 정제 → 바로 에이전트 호출 | 없음 |
| 🟡 FEATURE | 새 기능 1개, 3~5파일, 단일 세션 내 완료 | 인라인 명세 → 에이전트 호출 | 없음 |
| 🔵 PROJECT | 멀티기능, 6파일+, 설계/구현/검증 분리 필요 | mini-PRD 생성 → prd-analyzer → 순차 | `prd/{기능명}.md` |

### 판단 흐름

```
사용자 요청
  │
  ├─ 수정 파일 1~2개? 기존 파일만? → 🟢 TASK
  │   → 5요소 정제 (목표/범위/제약/출력/검증)
  │   → 바로 적합한 에이전트 호출
  │
  ├─ 새 기능 1개? 3~5파일? → 🟡 FEATURE
  │   → 세션 내 인라인 명세 (파일 생성 없음)
  │   → 설계 → 구현 → 검증 순서로 에이전트 호출
  │
  └─ 멀티기능? 6파일+? 나중에 재참조 필요? → 🔵 PROJECT
      → 부족한 정보 질문
      → prd/{기능명}.md 생성
      → prd-analyzer → architect → 구현 → 검증
```

### 문서로 남길지 vs 바로 구현할지

| 상황 | 판단 |
|------|------|
| 에이전트 1~2개로 끝남 | 바로 실행 |
| 에이전트 3개+ 순차 호출 | 인라인 명세 또는 PRD |
| 나중에 다시 참조할 가능성 높음 | PRD 파일 생성 |
| 세션 내 1회성 작업 | 인라인 명세로 충분 |
| 설계/구현/검증이 분리되어야 함 | PRD 파일 생성 |

---

## 3. 에이전트 분배 판단 기준

### 순차 실행 — 앞 결과가 뒤의 입력이 될 때
```
PRD 분석 → 설계 → 구현 → 검증
(각 단계 산출물이 다음 단계 입력)
```

### 병렬 실행 — 서로 독립적인 작업일 때
```
[mobile-layout-checker] ─┐
[ux-copy-reviewer]       ├─ 동시 실행 가능
[code-reviewer]          ─┘
(모두 읽기 전용 검증 작업, 서로 의존 없음)
```

### 판단 공식
```
의존성 있음? → 순차
의존성 없음? → 병렬
```

---

## 4. 시나리오별 에이전트 호출 순서

### 시나리오 A — 🟢 TASK: "Hero 배경색 바꿔줘"

```
[Orchestrator 전처리] → TASK 판단
  → 5요소 정제: 목표(배경색 변경) / 범위(Hero.tsx) / 제약(없음) / 출력(수정된 파일) / 검증(빌드)

[IMPLEMENTATION]
  1. style-engineer → Hero.tsx 배경색 수정

[QUALITY]
  2. code-reviewer → 빌드 확인

→ 완료 보고
```

---

### 시나리오 B — 🟡 FEATURE: "Hero 섹션 구현해줘"

```
[Orchestrator 전처리] → FEATURE 판단
  → 인라인 명세: PRD 카피 기반 Hero 컴포넌트, 모바일 우선

[IMPLEMENTATION]
  1. copy-writer              → 카피 확정 및 한국어 최적화
  2. landing-section-builder  → Hero.tsx 구현

[QUALITY] ← 병렬 실행
  3a. mobile-layout-checker   → 반응형 검증
  3b. ux-copy-reviewer        → 카피 톤앤매너 검수

→ 완료 보고
```

---

### 시나리오 C — 🔵 PROJECT: "AI 이미지 생성 기능 전체 구현해줘"

```
[Orchestrator 전처리] → PROJECT 판단
  → 질문: "어떤 AI 모델? 이미지 규격? 에러 처리?"
  → prd/ai-image-generation.md 생성

[PRODUCT & ARCHITECTURE]
  1. prd-analyzer  → 태스크 분해 (API + 폼 연동 + 결과 화면)
  2. api-designer  → POST /api/generate-interior 명세

[IMPLEMENTATION]
  3. api-route-builder → route.ts 구현
  4. form-builder      → MultiStepForm.tsx 수정 (API 호출 연동)

[SECURITY] ← 구현 직후
  5. security-auditor  → OWASP 취약점 검사
  6. api-key-guard     → 하드코딩 시크릿 탐지

[TEST]
  7. test-writer       → API 라우트 테스트

[DELIVERY / RELEASE]
  8. build-validator   → npm run build 성공 확인

→ 완료 보고
```

---

### 시나리오 D — "배포 준비해줘"

```
[SECURITY] ← 먼저 검사
  1. api-key-guard          → 시크릿 노출 최종 확인

[DELIVERY / RELEASE]
  2. env-checker            → 환경변수 완전성 점검
  3. build-validator        → npm run build + tsc --noEmit

[PERFORMANCE] ← 배포 직전, Orchestrator가 PERFORMANCE 팀에 요청
  4. image-optimizer        → public/ 이미지 압축

→ 모두 통과 시 배포 승인 요청
→ 실패 항목 있으면 에스컬레이션
```

---

### 시나리오 E — "전체 QA 돌려줘"

```
[QUALITY] ← 모두 병렬 실행
  1a. code-reviewer          → 버그, 타입 오류
  1b. mobile-layout-checker  → 반응형 문제
  1c. ux-copy-reviewer       → 카피 검수
  1d. user-exit-analyzer     → 전환 저해 포인트

→ 4개 리포트 취합 → 우선순위 정렬 → 보고
```

---

### 시나리오 F — "에러 발생" (온디맨드)

```
[DEBUG]
  1. error-diagnoser         → 에러 원인 분석 + 수정 제안

[IMPLEMENTATION]
  2. (해당 에이전트)          → 수정 적용

[QUALITY]
  3. code-reviewer           → 수정 검증

→ 완료 보고
```

---

## 5. 에스컬레이션 규칙

에이전트가 실패하거나 블로커를 발견했을 때 Orchestrator가 따르는 규칙.

| 상황 | Orchestrator 행동 |
|------|-------------------|
| 빌드 실패 | `vercel-deploy-debugger` 즉시 호출 |
| 런타임 에러 | `error-diagnoser` 호출 → 원인 분석 후 수정 |
| 보안 취약점 발견 | 배포 중단 + `security-auditor` 재호출 |
| API 키 노출 의심 | 전체 파이프라인 중단 + `api-key-guard` 호출 |
| TypeScript 타입 오류 | 해당 파일 `code-reviewer` 재검토 |
| 에이전트 산출물 없음 | 입력 조건 재확인 후 재호출 (1회 한정) |
| 2회 연속 실패 | 사용자에게 에스컬레이션 (수동 개입 요청) |

---

## 6. Orchestrator 프롬프트 템플릿

Orchestrator는 별도 에이전트로 등록하지 않는다.
Claude Code의 메인 에이전트가 이 규칙을 참조하여 Orchestrator 역할을 수행한다.

CLAUDE.md에서 다음과 같이 참조:
```markdown
## Orchestrator 규칙
> 상세: `claudedocs/orchestrator-rules.md` 참고
> 요청 크기 판단 (TASK/FEATURE/PROJECT) → 적합한 에이전트 호출 → 결과 취합
```

---

## 7. 레이어별 에이전트 빠른 참조

| 레이어 | 에이전트 | 역할 |
|--------|---------|------|
| PRODUCT & ARCHITECTURE | `prd-analyzer` | PRD → 태스크 |
| | `architect` | 구조 설계 |
| | `api-designer` | API 명세 |
| IMPLEMENTATION | `landing-section-builder` | 섹션 구현 |
| | `form-builder` | 폼 구현 |
| | `api-route-builder` | API 구현 |
| | `copy-writer` | 카피 작성 |
| | `style-engineer` | 스타일 통일 |
| QUALITY | `code-reviewer` | 코드 리뷰 |
| | `mobile-layout-checker` | 반응형 검증 |
| | `ux-copy-reviewer` | 카피 검수 |
| | `user-exit-analyzer` | 이탈 분석 |
| TEST | `test-writer` | 테스트 작성 |
| DELIVERY / RELEASE | `build-validator` | 빌드 검증 |
| | `env-checker` | 환경변수 점검 |
| | `vercel-deploy-debugger` | 배포 디버그 |
| SECURITY | `security-auditor` | 보안 감사 |
| | `api-key-guard` | 키 노출 방지 |
| DEBUG | `error-diagnoser` | 에러 진단 |
| PERFORMANCE | `image-optimizer` | 이미지 압축 |
| | `bundle-analyzer` | 번들 분석 |

---

*이 파일은 `subagent_tutorial.md`의 섹션 4에서 분리된 Orchestrator 전용 규칙 문서입니다.*
