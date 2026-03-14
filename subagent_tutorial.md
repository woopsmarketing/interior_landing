# Sub-Agent Team 설계 튜토리얼
> 이 프로젝트(AI 인테리어 랜딩페이지)를 기준으로 설계된 **대형 개발팀 모델**
> "혼자 Claude Code를 쓰지만, 실제론 팀 전체가 움직이는 것처럼"

---

## 0. 개념 — 왜 서브에이전트 팀인가?

```
You (PM/CTO 역할)
    ↓ 자연어 지시
Orchestrator (총괄 — 전처리 + 분배 + 취합)
    │
    ├─ 내부 전처리: 요청 크기 판단 (TASK / FEATURE / PROJECT)
    │   ├─ 🟢 TASK    → 5요소 정제 → 바로 에이전트 호출
    │   ├─ 🟡 FEATURE → 인라인 명세 → 에이전트 호출
    │   └─ 🔵 PROJECT → mini-PRD 파일 생성 → prd-analyzer → 설계 → 구현
    │
    └─ 하위 에이전트 분배
        ┌───────┬───────┬───────┬───────┐
        설계팀  구현팀  QA팀  배포팀  ...
```

**핵심 원칙 3가지:**
1. **단일 책임**: 에이전트 하나 = 역할 하나 = 산출물 하나
2. **호출 시점 고정**: 언제 부르는지 명확해야 안 겹친다
3. **입출력 계약**: 무엇을 받아서 무엇을 내놓는지 명시

---

## 1. 전체 팀 구조도

```
┌─────────────────────────────────────────────────────────────┐
│                       ORCHESTRATOR                          │
│  내부 전처리: TASK/FEATURE/PROJECT 판단 + 필요시 PRD 생성     │
│  분배: 적합한 에이전트 순차/병렬 호출 + 결과 취합 + 보고       │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌──────────┬────────┼────────┬──────────┐
        ▼          ▼        ▼        ▼          ▼
     [기획팀]    [개발팀]  [품질팀]  [배포팀]   [보안팀]
    PRODUCT &   IMPLEMEN-  QUALITY  DELIVERY   SECURITY
    ARCHITECTURE  TATION      │        │
        │          │          ▼        ▼
        ▼          ▼       [디버그]  [성능팀]
     [테스트]              DEBUG   PERFORMANCE
      TEST
```

---

## 2. 팀별 서브에이전트 목록

### 🟦 PRODUCT & ARCHITECTURE — 기획·설계팀

---

#### `prd-analyzer`
| 항목 | 내용 |
|------|------|
| **역할** | PRD 문서를 읽고 구현 가능한 태스크로 분해 |
| **산출물** | `claudedocs/task-breakdown.md` |
| **호출 시점** | PROJECT 규모 작업 시작 전 1회 (Orchestrator가 PRD 생성 후) |
| **입력** | PRD 파일 경로 |
| **출력** | 섹션별 태스크 리스트, 우선순위, 의존성 맵 |
| **도구** | Read, Grep, Write |

```yaml
name: prd-analyzer
description: PRD를 읽고 구현 태스크를 분해합니다. "PRD 분석해줘", "태스크 뽑아줘" 요청에 사용.
tools: [Read, Grep, Write]
prompt: |
  PRD 문서를 읽고 다음을 수행:
  1. 섹션별 구현 항목 추출
  2. 기술 의존성 분석 (A 구현 후 B 가능 등)
  3. 예상 복잡도 점수 (1-5)
  4. claudedocs/task-breakdown.md 에 저장
```

---

#### `architect`
| 항목 | 내용 |
|------|------|
| **역할** | 기술 스택 결정 및 디렉토리 구조 설계 |
| **산출물** | `claudedocs/architecture.md` |
| **호출 시점** | 프로젝트 초기 1회 / 대형 리팩토링 전 |
| **입력** | 프로젝트 요구사항, 기술 제약 |
| **출력** | 폴더 구조, 컴포넌트 경계, 데이터 흐름도 |
| **도구** | Read, Glob, Write, WebSearch |

---

#### `api-designer`
| 항목 | 내용 |
|------|------|
| **역할** | API 엔드포인트 명세 설계 |
| **산출물** | `claudedocs/api-spec.md` |
| **호출 시점** | 백엔드 구현 시작 전 |
| **입력** | 폼 데이터 구조, 외부 API 문서 |
| **출력** | 엔드포인트 목록, 요청/응답 스키마, 에러 코드 |
| **도구** | Read, Write, WebFetch |

```markdown
# 이 프로젝트 기준 산출물 예시

## POST /api/generate-interior
Request:
  - spaceType: string
  - region: string
  - budget: string
  - preferredStyles: string[]
  - spacePhoto?: base64
  - referenceImage?: base64

Response:
  - imageData: base64 (png)
  - generationId: string

Error:
  - 400: 필수 필드 누락
  - 429: OpenAI rate limit
  - 500: 생성 실패
```

---

### 🟩 IMPLEMENTATION — 개발팀

---

#### `landing-section-builder`
| 항목 | 내용 |
|------|------|
| **역할** | 랜딩페이지 섹션 컴포넌트 구현 |
| **산출물** | `src/components/sections/*.tsx` |
| **호출 시점** | 섹션 구현 요청 시마다 |
| **입력** | PRD 카피, Monet 레퍼런스 코드 |
| **출력** | 완성된 섹션 컴포넌트 파일 |
| **도구** | Read, Write, Edit, Glob, Grep |

---

#### `form-builder`
| 항목 | 내용 |
|------|------|
| **역할** | 멀티스텝 폼 구현 |
| **산출물** | `src/components/form/**/*.tsx` |
| **호출 시점** | 폼 관련 구현/수정 시 |
| **입력** | FormData 인터페이스, Step 요구사항 |
| **출력** | MultiStepForm + Step1~N 컴포넌트 |
| **도구** | Read, Write, Edit, Glob |

---

#### `api-route-builder`
| 항목 | 내용 |
|------|------|
| **역할** | Next.js API 라우트 구현 |
| **산출물** | `src/app/api/**/*.ts` |
| **호출 시점** | API 구현 요청 시 |
| **입력** | api-spec.md, 외부 SDK 문서 |
| **출력** | 완성된 API route.ts 파일 |
| **도구** | Read, Write, Edit, Bash |

> **이 프로젝트 핵심**: `/api/generate-interior/route.ts` — gpt-image-1 호출 로직

---

#### `copy-writer`
| 항목 | 내용 |
|------|------|
| **역할** | 한국어 UX 카피 작성 및 수정 |
| **산출물** | `claudedocs/copy-sheet.md` |
| **호출 시점** | 컴포넌트 구현 전 카피 확정 시 |
| **입력** | PRD 톤앤매너, 섹션 목적 |
| **출력** | 헤드라인, 서브카피, 버튼 텍스트 |
| **도구** | Read, Write |

---

#### `style-engineer`
| 항목 | 내용 |
|------|------|
| **역할** | Tailwind 스타일 일관성 적용 |
| **산출물** | 스타일 수정된 컴포넌트 파일들 |
| **호출 시점** | 디자인 리뷰 후 / 스타일 불일치 발견 시 |
| **입력** | 디자인 토큰 (색상, 폰트, 간격) |
| **출력** | 일관된 Tailwind 클래스 적용 |
| **도구** | Read, Edit, Grep, Glob |

---

### 🟨 QUALITY — 품질팀

---

#### `code-reviewer`
| 항목 | 내용 |
|------|------|
| **역할** | 구현된 코드 리뷰 및 개선 제안 |
| **산출물** | `claudedocs/code-review.md` |
| **호출 시점** | 구현 완료 후 PR 전 |
| **입력** | 변경된 파일 목록 |
| **출력** | 버그 위험, 타입 오류, 리팩토링 포인트 |
| **도구** | Read, Grep, Glob, mcp__ide__getDiagnostics |

---

#### `mobile-layout-checker`
| 항목 | 내용 |
|------|------|
| **역할** | 모바일 반응형 설계 검증 |
| **산출물** | `claudedocs/mobile-review.md` |
| **호출 시점** | 컴포넌트 구현 완료 후 |
| **입력** | 구현된 컴포넌트 파일 |
| **출력** | breakpoint 문제, CTA 가시성, 터치 타겟 체크 |
| **도구** | Read, Grep, Glob |

---

#### `ux-copy-reviewer`
| 항목 | 내용 |
|------|------|
| **역할** | 카피가 PRD 톤앤매너에 맞는지 검수 |
| **산출물** | 인라인 수정 제안 |
| **호출 시점** | 카피 작성 완료 후 / 컴포넌트 구현 후 |
| **입력** | 컴포넌트 파일, PRD 원칙 |
| **출력** | 부적절한 표현, 대체 문구 제안 |
| **도구** | Read, Grep |

---

#### `user-exit-analyzer`
| 항목 | 내용 |
|------|------|
| **역할** | 사용자 이탈 포인트 탐지 |
| **산출물** | `claudedocs/ux-analysis.md` |
| **호출 시점** | 랜딩페이지 전체 구현 완료 후 |
| **입력** | 전체 섹션 컴포넌트 |
| **출력** | 이탈 위험 섹션, 전환 개선 제안, A/B 아이디어 |
| **도구** | Read, Grep, Glob |

---

### 🟫 TEST — 테스트팀

---

#### `test-writer`
| 항목 | 내용 |
|------|------|
| **역할** | 구현된 기능에 대한 테스트 코드 작성 |
| **산출물** | `__tests__/**/*.test.ts(x)` |
| **호출 시점** | 기능 구현 완료 후 / 리팩토링 전 안전망 확보 시 |
| **입력** | 테스트 대상 파일, 기대 동작 명세 |
| **출력** | Jest/Playwright 테스트 파일 |
| **도구** | Read, Write, Bash, Glob |

기본: unit/integration 테스트 우선
필요 시: Playwright E2E 확장

---

### 🟥 DELIVERY / RELEASE — 배포팀

---

#### `vercel-deploy-debugger`
| 항목 | 내용 |
|------|------|
| **역할** | Vercel 배포 오류 진단 및 수정 |
| **산출물** | 수정된 설정 파일 |
| **호출 시점** | 배포 실패 시 |
| **입력** | 빌드 로그, next.config.ts, package.json |
| **출력** | 오류 원인 분석, 수정 코드 |
| **도구** | Read, Write, Edit, Grep, Glob, Bash |

---

#### `build-validator`
| 항목 | 내용 |
|------|------|
| **역할** | 배포 전 빌드 성공 여부 검증 |
| **산출물** | `claudedocs/build-report.md` |
| **호출 시점** | 배포 직전 |
| **입력** | 프로젝트 루트 |
| **출력** | 빌드 성공/실패, TypeScript 오류, ESLint 경고 |
| **도구** | Bash, Read, Glob |
-프로젝트 환경에 맞게 조정

```bash
# 이 에이전트가 실행하는 커맨드
npm run build 2>&1
npx tsc --noEmit 2>&1
npx eslint src/ 2>&1
```

---

#### `env-checker`
| 항목 | 내용 |
|------|------|
| **역할** | 환경변수 설정 완전성 검사 |
| **산출물** | `claudedocs/env-checklist.md` |
| **호출 시점** | 배포 직전 / 신규 API 연동 후 |
| **입력** | .env.local, next.config.ts, API 라우트 파일 |
| **출력** | 누락된 환경변수, Vercel 설정 필요 항목 |
| **도구** | Read, Grep, Glob |

---

### 🟪 SECURITY — 보안팀

---

#### `security-auditor`
| 항목 | 내용 |
|------|------|
| **역할** | OWASP Top 10 기준 보안 취약점 검사 |
| **산출물** | `claudedocs/security-report.md` |
| **호출 시점** | API 라우트 구현 완료 후 |
| **입력** | API 라우트 파일들 |
| **출력** | XSS, 인젝션, 노출된 시크릿, rate limit 미적용 등 |
| **도구** | Read, Grep, Glob |

---

#### `api-key-guard`
| 항목 | 내용 |
|------|------|
| **역할** | API 키 / 시크릿 노출 방지 |
| **산출물** | 경고 리포트 |
| **호출 시점** | 커밋 전 / API 라우트 수정 시 |
| **입력** | 전체 소스 파일 |
| **출력** | 하드코딩된 키, .gitignore 누락 항목 |
| **도구** | Grep, Glob, Read |

---

### 🔴 DEBUG — 디버그팀

---

#### `error-diagnoser`
| 항목 | 내용 |
|------|------|
| **역할** | 런타임/빌드 에러 원인 분석 및 수정 제안 |
| **산출물** | 수정된 파일 또는 `claudedocs/debug-report.md` |
| **호출 시점** | 에러 발생 시 온디맨드 |
| **입력** | 에러 메시지, 스택 트레이스, 관련 파일 |
| **출력** | 근본 원인 분석, 수정 코드, 재발 방지 제안 |
| **도구** | Read, Edit, Grep, Glob, Bash |

---

### 🟧 PERFORMANCE — 성능팀

---

#### `image-optimizer`
| 항목 | 내용 |
|------|------|
| **역할** | 이미지 파일 압축 최적화 |
| **산출물** | 압축된 WebP/JPEG 파일 |
| **호출 시점** | 이미지 추가 시 / 배포 직전 |
| **입력** | public/ 폴더 이미지 파일들 |
| **출력** | 최적화된 이미지 (용량 50%+ 절감) |
| **도구** | Bash (sharp CLI) |

---

#### `bundle-analyzer`
| 항목 | 내용 |
|------|------|
| **역할** | Next.js 번들 크기 분석 |
| **산출물** | `claudedocs/bundle-report.md` |
| **호출 시점** | 의존성 추가 후 / 성능 저하 감지 시 |
| **입력** | package.json, next.config.ts |
| **출력** | 무거운 패키지, 코드스플리팅 기회, lazy loading 제안 |
| **도구** | Bash, Read, Glob |

---

## 3. 호출 시점 매트릭스

```
단계                  호출 에이전트
──────────────────────────────────────────────────────
[0] 모든 요청 시      Orchestrator 내부 전처리 (TASK/FEATURE/PROJECT 판단)
[1] 프로젝트 시작     prd-analyzer (PROJECT일 때만) → architect → api-designer
[2] 개발 착수 전      copy-writer (카피 확정)
[3] 섹션 구현 중      landing-section-builder (반복 호출)
[4] 폼 구현 중        form-builder
[5] API 구현 중       api-route-builder → security-auditor
[6] 구현 완료 후      code-reviewer → mobile-layout-checker → ux-copy-reviewer (병렬 가능)
[7] 테스트 작성       test-writer (기능 구현 완료 후)
[8] 전체 완성 후      user-exit-analyzer → bundle-analyzer
[9] 배포 직전         env-checker → build-validator
[10] 성능 최적화      image-optimizer → bundle-analyzer
[11] 배포 실패 시     vercel-deploy-debugger (온디맨드)
[12] 에러 발생 시     error-diagnoser → api-key-guard (온디맨드)
```

---

## 4. Orchestrator 패턴 — 너는 CTO다

> 상세 규칙: [`claudedocs/orchestrator-rules.md`](./claudedocs/orchestrator-rules.md) 참고

Orchestrator는 사용자의 지시를 받아 내부에서 크기를 판단하고, 적합한 에이전트들을 순서대로 (또는 병렬로) 호출하고 결과를 취합해 보고한다.

### Orchestrator 내부 전처리 — 3단계 분류

| 분류 | 조건 | 처리 | PRD 파일 |
|------|------|------|----------|
| 🟢 TASK | 1~2파일 수정, "바꿔줘/고쳐줘/수정해줘" | 5요소 정제 → 바로 에이전트 호출 | 없음 |
| 🟡 FEATURE | 새 기능 1개, 3~5파일, 설계 분리 불필요 | 인라인 명세 → 에이전트 호출 | 없음 |
| 🔵 PROJECT | 멀티기능, 6파일+, 설계/구현/검증 분리 필요 | mini-PRD 생성 → prd-analyzer → 순차 실행 | `prd/{기능명}.md` |

**PROJECT에서만 PRD 파일을 생성하는 이유:**
- 세션 내 컨텍스트로 충분한 작업에 파일을 만들면 문서만 쌓인다
- PRD 파일은 "나중에 재참조가 필요한 경우"에만 가치가 있다
- 에이전트 3개 이상 순차 호출이 필요할 때 → PRD로 명세 고정

---

## 5. 이 프로젝트에 적용한 에이전트 맵

```
interior-landing/
│
├── [ORCHESTRATOR] 총괄 (전처리 + 분배)
│   └── 내부: TASK/FEATURE/PROJECT 판단 → 필요시 PRD 생성
│
├── [PRODUCT & ARCHITECTURE] 기획팀
│   ├── prd-analyzer         → PRD → 태스크 분해
│   ├── architect            → src/ 구조 설계
│   └── api-designer         → /api/generate-interior 명세
│
├── [IMPLEMENTATION] 개발팀
│   ├── landing-section-builder  → 14개 섹션 컴포넌트
│   ├── form-builder             → Step1~5 + MultiStepForm
│   ├── api-route-builder        → gpt-image-1 연동 API
│   ├── copy-writer              → 한국어 카피 시트
│   └── style-engineer           → orange-500 테마 일관성
│
├── [QUALITY] 품질팀
│   ├── code-reviewer            → TypeScript 타입 오류, 버그
│   ├── mobile-layout-checker    → 모바일 반응형
│   ├── ux-copy-reviewer         → PRD 톤앤매너 검수
│   └── user-exit-analyzer       → 전환 저해 포인트
│
├── [TEST] 테스트팀
│   └── test-writer              → Jest/Playwright 테스트
│
├── [DELIVERY / RELEASE] 배포팀
│   ├── build-validator          → npm run build 검증
│   ├── env-checker              → OPENAI_API_KEY 등 점검
│   └── vercel-deploy-debugger   → 배포 실패 진단
│
├── [SECURITY] 보안팀
│   ├── security-auditor         → API 라우트 OWASP 검사
│   └── api-key-guard            → 하드코딩 시크릿 탐지
│
├── [DEBUG] 디버그팀
│   └── error-diagnoser          → 런타임/빌드 에러 진단
│
└── [PERFORMANCE] 성능팀
    ├── image-optimizer          → 이미지 압축
    └── bundle-analyzer          → 번들 분석
```

---

## 6. 새 에이전트 추가 시 체크리스트

새 프로젝트에 에이전트를 추가할 때 이 4가지를 먼저 정의해야 겹침 없이 설계된다:

```markdown
## [에이전트 이름]

### 1. 역할 (1문장)
이 에이전트는 [무엇을] 한다.

### 2. 산출물
- 파일: [경로/파일명]
- 형식: [md / tsx / json / 수정된 파일]

### 3. 호출 시점
- [ ] 작업 시작 전 (1회성)
- [ ] 구현 중 반복 호출 가능
- [ ] 에러 발생 시 온디맨드
- [ ] 배포 직전 체크포인트

### 4. 입출력 계약
- 입력: [무엇을 받는가]
- 출력: [무엇을 내놓는가]
```

---

## 7. Claude Code에서 실제 등록 방법

`.claude/agents/` 폴더에 마크다운 파일로 저장:

```
~/.claude/agents/
├── prd-analyzer.md
├── architect.md
├── landing-section-builder.md
├── form-builder.md
├── api-route-builder.md
├── mobile-layout-checker.md
├── build-validator.md
├── vercel-deploy-debugger.md
├── security-auditor.md
├── test-writer.md
└── error-diagnoser.md
```

각 파일 형식:

```markdown
---
name: build-validator
description: |
  배포 전 빌드 성공 여부를 검증합니다.
  "빌드 확인해줘", "배포 전 체크", "build 오류 확인" 요청에 사용.
tools:
  - Bash
  - Read
  - Glob
---

당신은 Next.js 프로젝트의 빌드 검증 전문가입니다.

다음을 순서대로 실행하세요:
1. `npm run build` 실행 후 오류 수집
2. `npx tsc --noEmit` 실행 후 타입 오류 수집
3. ESLint 경고 수집
4. claudedocs/build-report.md에 결과 저장

실패 항목은 원인과 수정 방향을 함께 제시하세요.
```

> **참고**: Orchestrator는 별도 에이전트 파일로 등록하지 않는다.
> Claude Code의 plan 모드 + 메인 에이전트가 Orchestrator 역할을 수행한다.
> `claudedocs/orchestrator-rules.md`의 규칙을 CLAUDE.md에서 참조하면 된다.

---

## 8. 확장 — 더 큰 팀을 만들려면

현재 팀(18명)에서 다음 역할을 추가하면 엔터프라이즈급이 된다:

| 추가 에이전트 | 용도 |
|---------------|------|
| `db-schema-designer` | DB 테이블 설계 (Supabase/Prisma) |
| `i18n-manager` | 다국어 처리 (한/영/일) |
| `analytics-integrator` | GA4/Mixpanel 이벤트 설계 |
| `a11y-auditor` | 웹 접근성 (WCAG 2.1) 검사 |
| `seo-optimizer` | 메타태그, OG, sitemap 최적화 |
| `changelog-writer` | 배포 노트 자동 생성 |

---

*이 문서는 `D:/Documents/landing_interior` 프로젝트를 기준으로 작성되었으나,*
*어떤 Next.js 랜딩페이지 프로젝트에도 동일하게 적용 가능하다.*
