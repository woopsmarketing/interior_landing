# QA Report — AI 인테리어 견적 비교 랜딩페이지(수정)

## 2. 모바일 레이아웃 검수 (mobile-layout-checker)

검수 일시: 2026-03-09
검수 대상: `src/components/sections/` (10개), `src/components/form/` (1개), `src/components/form/steps/` (4개) — 총 15개 TSX 파일

---

### 통과

아래 항목들은 모바일 우선 원칙을 올바르게 준수하고 있습니다.

- **Header.tsx** — sticky 헤더 `z-50`, 낮은 높이로 콘텐츠 침범 최소화. 패딩 `px-5 sm:px-8 lg:px-12` 순서 정상.
- **Hero.tsx** — h1 기본 `text-3xl → sm:text-4xl → lg:text-[2.6rem]` 순서 준수. 그리드 `grid-cols-1 → lg:grid-cols-2` 모바일 단일 컬럼. CTA 버튼 `w-full sm:w-auto` 패턴 정상. 패딩 `px-5` 기본 적용.
- **Problem.tsx** — 그리드 `grid-cols-1 → sm:grid-cols-2` 정상. 헤딩 `text-2xl sm:text-3xl lg:text-4xl` 준수. 섹션 패딩 `px-5 py-20` 적절.
- **HowItWorks.tsx** — 그리드 `grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-4` 순서 정상. 헤딩 `text-2xl sm:text-3xl lg:text-4xl` 준수.
- **WhoFor.tsx** — `flex flex-col gap-4` 단일 열. 패딩 `px-5` 기본. 헤딩 `text-2xl sm:text-3xl lg:text-4xl` 정상.
- **Outcomes.tsx** — 그리드 `grid-cols-1 → sm:grid-cols-2` 정상. 헤딩 스케일 정상.
- **Trust.tsx** — `flex flex-wrap justify-center gap-3` 배지 자동 줄 바꿈. 헤딩 순서 정상.
- **FAQ.tsx** — `flex flex-col gap-3` 단일 열. 아코디언 버튼 `w-full`. 헤딩 `text-2xl sm:text-3xl lg:text-4xl` 준수.
- **FinalCTA.tsx** — CTA 버튼 `w-full sm:w-auto`, `flex-col sm:flex-row` 모바일 수직 스택. 헤딩 `text-2xl sm:text-3xl lg:text-4xl` 준수.
- **Step1.tsx** — 모든 input/select `w-full`, `py-3`(약 48px 터치 영역) 확보. 공간 유형 그리드 `grid-cols-2 sm:grid-cols-3` 적절.
- **Step2.tsx** — select·textarea 모두 `w-full`, `py-3`. 체크박스 그룹 `flex flex-wrap gap-2` 줄 바꿈 처리 정상.
- **Step3.tsx** — 파일 업로드 영역 전체 너비, `py-7` 충분한 터치 영역.
- **Step4.tsx** — 체크박스 레이블 `px-4 py-4` 충분한 터치 영역.

---

### 수정 필요

| 파일 | Tailwind 클래스 | 문제 | 수정 방법 |
|------|----------------|------|-----------|
| `CoreValue.tsx` | `text-6xl sm:text-7xl` (L82) | 기본 클래스 `text-6xl`(60px)이 모바일에서 과도하게 큼 — 검수 기준 4번(text-5xl 이상 기본 금지) 위반 | `text-4xl sm:text-5xl lg:text-6xl`로 단계 축소 |
| `CoreValue.tsx` | `text-4xl sm:text-5xl` (L83, `+` 기호) | 위 문제와 연동, `+` 기호도 `text-4xl` 기본으로 큰 편 | `text-2xl sm:text-3xl lg:text-4xl`로 수정 |
| `MultiStepForm.tsx` | `w-full max-w-lg mx-auto` (L139, L177) | 폼 컨테이너 자체에 수평 패딩 없음 — 부모 섹션 패딩에만 의존하여 좌우 여백이 0이 될 수 있음 | 컨테이너에 `px-4 sm:px-0` 추가 또는 부모 섹션에서 패딩 보장 명시 |
| `MultiStepForm.tsx` | `duration-250` (L238) | Tailwind 기본 스케일에 없는 유효하지 않은 클래스 — 애니메이션이 적용되지 않을 수 있음 | `duration-[250ms]` 또는 `duration-300`으로 교체 |
| `CoreValue.tsx` | CTA 버튼 (L64–69) | `rounded-full bg-orange-500 px-7 py-3.5` — 모바일에서 `w-full` 없이 콘텐츠 너비만큼만 차지함. 검수 기준 3번(CTA 모바일 전체 너비) 위반 | `w-full sm:w-auto` 추가, 또는 `flex flex-col sm:flex-row` 래퍼 내에 배치 |

---

### 종합 평가

**전체 15개 파일 중 3개 파일에서 5건의 수정 필요 항목 발견.**

**잘 된 점**:
- 모든 섹션에서 `px-5` 이상 기본 패딩 적용 — 모바일 가독성 확보 (검수 기준 6번 통과).
- 그리드 레이아웃 전체가 `grid-cols-1`에서 시작 (검수 기준 5번 통과).
- Hero, FinalCTA CTA 버튼이 `w-full sm:w-auto` 패턴 정상 적용 (검수 기준 3번 부분 통과).
- 폼 입력 필드 전체 `w-full`, `py-3` 이상으로 터치 영역 기준 충족 (검수 기준 8번 통과).
- 헤딩 타이포그래피 `text-2xl → sm:text-3xl → lg:text-4xl` 일관 적용 (검수 기준 4번 대부분 통과).
- fixed/sticky 요소는 Header 하나뿐이며 높이 낮아 콘텐츠 침범 최소화 (검수 기준 7번 통과).
- breakpoint 순서 (`sm:` → `md:` → `lg:`) 모든 파일에서 역순 없음 (검수 기준 2번 통과).

**수정이 필요한 점**:
1. `CoreValue.tsx` — 숫자 강조 `text-6xl` 기본 클래스: 모바일에서 60px 크기로 렌더링되어 화면을 과도하게 점유 **(기준 4번 위반, 즉각 수정 권장)**.
2. `CoreValue.tsx` — CTA 버튼에 `w-full` 미적용: 모바일에서 버튼이 콘텐츠 너비로만 표시됨 **(기준 3번 위반)**.
3. `MultiStepForm.tsx` — 폼 컨테이너 수평 패딩 부재: 좁은 화면에서 카드 가장자리가 화면에 붙을 수 있음.
4. `MultiStepForm.tsx` — `duration-250` 유효하지 않은 Tailwind 클래스.

**우선 수정 권장 순위**: CoreValue CTA `w-full` 추가 > CoreValue 숫자 `text-6xl` 축소 > MultiStepForm 패딩 보강 > `duration-250` 클래스 교체.

---

## 3. 사용자 이탈 분석 (user-exit-analyzer)

분석 일시: 2026-03-09
분석 대상: `src/components/sections/` (10개), `src/components/form/MultiStepForm.tsx`, `src/components/form/steps/` (4개), `src/app/page.tsx`
분석 기준: PRD v1.0 전환 원칙 (공감→문제→가치→행동 흐름, 모바일 우선, 무압박 설계)

---

### 이탈 위험 포인트

| 섹션 | 위험도 | 이탈 원인 | 개선 제안 |
|------|--------|-----------|-----------|
| Hero | 중 | CTA 버튼 2개("무료로 내 조건 전달하기", "나에게 맞는 업체 알아보기")가 동일한 동작(폼 스크롤)을 수행함. 선택지가 2개면 "지금 해야 하나?" 결정 유예로 이어질 수 있음 | Secondary CTA를 폼 스크롤이 아닌 `#how-it-works` 앵커로 연결해 탐색 경로를 분리 |
| Hero | 낮-중 | 우측 예시 카드가 실제 사용자 케이스인지 서비스 출력물인지 맥락 설명 없음. "요청 예시" 라벨이 소형 캡션 크기(text-xs)여서 카드의 가치 전달이 약함 | 예시 카드 상단 라벨을 더 크고 명확한 안내 문구로 교체("이런 내용을 남기면 됩니다") |
| Problem | 낮 | 4개 카드 후 전환 유도가 전혀 없어 스크롤 모멘텀이 끊기면 이탈 가능 | 섹션 하단에 브리지 문구 1줄 추가("이 문제들, 혼자 해결하지 않아도 됩니다") |
| CoreValue | 낮 | "100+" 숫자 강조 카드에 근거(기준, 기간 등)가 없어 신뢰성 의문 가능 | "파트너 등록 기준" 또는 "견적 참여 가능 업체 수" 같은 맥락 문구 보강 |
| HowItWorks | 중 | Step 2 설명("요청 내용을 더 이해하기 쉽게 정리합니다")에서 누가 정리하는지(서비스 시스템? AI?) 불명확하여 AI에 대한 불신 또는 기대 오차 발생 가능. 면책 문구가 섹션 최하단에만 존재 | Step 2 description에 "서비스가 자동으로 정리" 또는 "AI 보조 정리" 주체 명시. 면책 문구를 Step 2 note 근처로 이동 |
| HowItWorks | 낮 | 4단계 읽고 "해볼 만하다"는 감정이 생기는 순간 행동 유도 수단 없음 | 스텝 그리드 하단에 소형 CTA 또는 "지금 시작하기 →" 텍스트 링크 추가 |
| WhoFor | 높 | 5개 공감 항목을 읽으며 자기 인식이 최고조에 달하는 구간임에도 CTA가 전혀 없음. 페이지 전체 전환 흐름에서 가장 큰 공백 | 체크리스트 하단 마무리 문구 직후에 CTA 버튼 배치(우선순위 1위) |
| Outcomes | 낮-중 | Problem 카드와 동일한 컴포넌트 구조(2×2 카드 그리드). 페이지 중간 "이미 본 것 같은" 피로감 유발 가능. CTA 없음 | 카드 배경·레이아웃을 Problem과 시각적으로 차별화. 섹션 하단 CTA 추가 |
| Trust | 중 | 7개 배지가 flex-wrap으로 나열되어 모바일에서 줄 바꿈 순서가 불규칙. "상담 신청 무료", "꼭 계약하지 않아도 됨" 같은 핵심 배지가 눈에 안 띌 수 있음. CTA 없음 | 핵심 배지 2개를 상단 고정 또는 시각 강조. 섹션 하단에 CTA 연결 |
| FAQ | 낮-중 | 6개 FAQ 중 3개가 AI 이미지 관련으로 편중. 실제 사용자 주요 의문(업체 선정 기준, 견적 전달 방식, 결과 확인 방법)에 대한 항목 부족. CTA 없음 | "업체는 어떻게 선정되나요?", "견적은 어떻게 받나요?" 운영 FAQ 1–2개 추가. 섹션 하단 CTA 배치 |
| FinalCTA | 중 | CTA 버튼 2개("무료로 견적 요청 시작하기", "내 조건 먼저 전달하기")가 다시 동일 동작. Hero와 동일한 이중 CTA 문제 반복 | Primary 버튼 1개로 단일화. Secondary 제거 또는 차별화된 역할 부여 |
| FinalCTA | 낮 | 오렌지 그라디언트 배경 위 신뢰 배지(white/100 텍스트)의 가독성 저하 | 신뢰 배지에 반투명 흰색 pill 배경 처리 |
| Form (전체 구조) | 높 | 폼이 `page.tsx` 최하단에 독립 배치. CTA 클릭 시 smooth scroll로 이동하는데 모바일 기준 스크롤 거리가 매우 길어 중간 이탈 위험이 높음 | 폼을 FinalCTA 직후로 이동하거나 CTA 클릭 시 인라인 펼침(아코디언) 방식 검토 |
| Form Step 1 | 높 | 첫 필드가 이름(실명) + 연락처(전화번호). 개인정보가 가장 먼저 요구되어 심리적 진입 장벽이 최고조인 구간에서 개인 정보 노출 요구. PRD의 "진입 장벽 최소화" 원칙과 불일치 | Step 1 순서 변경: 지역 → 공간 유형 → (Step 2) 예산/스타일 → 마지막에 이름/연락처. 인테리어 정보 먼저 수집 후 연락처 요청 |
| Form Step 2 | 중 | 단일 스텝에 인풋 그룹 5개(예산 select + 시공범위 + 스타일 + 우선순위 + 상세 textarea). 전체 선택 항목 수 20개 이상. 인지 부하가 폼 전체에서 가장 높은 구간 | textarea placeholder를 구체적 예시로 보강. 또는 Step 2를 두 스텝으로 분리 |
| Form Step 3 | 낮 | "선택사항" 표기는 있으나 "건너뛰기" 명시 버튼이 없어 업로드 의무로 오인 가능 | "사진 없이 계속하기" 텍스트 링크를 "다음" 버튼 하단에 추가 |
| Form Step 4 | 낮 | 개인정보 수집·이용 동의 체크박스에 약관 전문 링크 없음 | 약관 전문 "자세히 보기" 링크 또는 인라인 펼침 토글 추가 |
| 완료 화면 | 중 | 제출 후 완료 화면이 "요청이 접수되었습니다" + 설명 1–2줄로 짧고, 이후 단계(연락 시점, 프로세스) 안내 없음. 기대 불안 미해소 | "보통 X영업일 이내 연락드립니다" 등 후속 안내 추가 |

---

### CTA 효과성 분석

**CTA 배치 현황**

| 섹션 | CTA 유무 | 내용 |
|------|----------|------|
| Header | 있음 | 무료로 견적 요청하기 (버튼 1개) |
| Hero | 있음 | Primary + Secondary — 동일 동작 (버튼 2개) |
| Problem | 없음 | — |
| CoreValue | 있음 | 무료로 내 조건 전달하기 (버튼 1개) |
| HowItWorks | 없음 | — |
| WhoFor | 없음 | 공감 최고조 구간, 가장 치명적 공백 |
| Outcomes | 없음 | — |
| Trust | 없음 | — |
| FAQ | 없음 | — |
| FinalCTA | 있음 | Primary + Secondary — 동일 동작 (버튼 2개) |

**핵심 문제**
1. 전체 10개 섹션 중 CTA 있는 섹션 4개뿐. Problem~FAQ 6개 섹션 중 CoreValue 1곳에만 CTA 존재.
2. Hero와 FinalCTA 두 곳에서 Primary/Secondary가 동일 동작 수행. 이중 선택지가 결정 지연 효과를 만들 수 있음.
3. WhoFor(공감 완성), Trust(신뢰 해소), FAQ(의심 해소) 직후 행동 유도 공백 — 전환 흐름에서 가장 큰 손실 구간.

**권장 CTA 추가 우선순위**
1. WhoFor 하단 (공감 완성 직후 — 최우선)
2. Trust 하단 (신뢰 해소 직후)
3. FAQ 하단 (마지막 의심 해소 직후)
4. HowItWorks 하단 (프로세스 이해 완료 직후)

---

### 폼 진입 장벽

**구조적 문제**
- 폼이 `page.tsx` 최하단 독립 요소. 모든 CTA가 `scrollIntoView({ behavior: "smooth" })`로 폼 도달. 페이지 상단에서 클릭 시 모바일 스크롤 거리가 10개 섹션 전체에 해당하며 중간 이탈 가능성이 높음.

**Step별 장벽 분석**

| Step | 장벽 수준 | 주요 원인 |
|------|-----------|-----------|
| Step 1 | 높음 | 첫 필드가 실명 + 전화번호. 개인정보 선요구 구조가 PRD 진입 최소화 원칙과 불일치 |
| Step 2 | 중간 | 인풋 그룹 5개, 선택 항목 20개 이상. 전체 폼에서 인지 부하 최고 구간. textarea 빈 칸 공포 |
| Step 3 | 낮음 | 선택사항 표기 양호하나 명시적 스킵 버튼 없음 |
| Step 4 | 낮음 | 필수 동의 2개로 간결. 약관 전문 링크 부재가 유일한 리스크 |
| 완료 화면 | 중간 | 후속 프로세스 안내 없어 기대 불안 미해소 |

---

### A/B 테스트 아이디어 (Top 3)

1. **Step 1 필드 순서 역전 (연락처 마지막 수집)**
   - A안 (현재): 이름 → 연락처 → 지역 → 공간 유형
   - B안: 지역 → 공간 유형 → (이후 스텝에서) 이름/연락처
   - 측정 지표: Step 1 완료율, 전체 폼 제출율
   - 가설: 개인정보를 나중에 수집하면 초기 이탈률 감소, 전체 완료율 개선
   - 기대 효과: 진입 단계 이탈 10–20% 개선 가능성. 인테리어·부동산 플랫폼에서 반복 검증된 패턴

2. **WhoFor 섹션 하단 CTA 추가 유무**
   - A안 (현재): WhoFor 섹션 CTA 없음
   - B안: WhoFor 체크리스트 하단에 "무료로 시작하기" 버튼 추가
   - 측정 지표: WhoFor 구간 클릭률(히트맵), 폼 도달율 변화
   - 가설: 공감 극대화 직후 CTA 노출 시 추가 스크롤 없이 전환 유도 가능
   - 기대 효과: 중간 구간 폼 도달율 상승. B안이 유효하면 Trust/FAQ 하단에도 순차 적용

3. **Hero Primary CTA 단일화 (2개 → 1개 + 탐색 경로 분리)**
   - A안 (현재): Primary + Secondary 동일 동작 버튼 2개
   - B안: Primary 1개("무료로 내 조건 전달하기") + Secondary를 "#how-it-works" 앵커 텍스트 링크("먼저 살펴보기")로 교체
   - 측정 지표: Hero CTA 클릭률, Primary/Secondary 클릭 비율, 폼 도달율
   - 가설: 선택지 단일화로 결정 피로 제거 → Primary 클릭 증가. 아직 확신이 없는 사용자는 탐색 경로로 유도하여 이탈 방어

---

### 종합 전환율 평가

**전환 흐름 일관성: 7 / 10**

| 흐름 단계 | 구현 상태 | 평가 |
|-----------|-----------|------|
| 공감 (Hero) | 헤드라인 + 서브카피 + 공감 포인트 3개 | 양호. PRD 원칙 충실 |
| 문제 제시 (Problem) | 4개 문제 카드 + 공감 헤드라인 | 양호. 섹션 후 CTA 없음 |
| 가치 제안 (CoreValue) | 차별화 3포인트 + 100+ 강조 + CTA | 양호 |
| 프로세스 (HowItWorks) | 4단계 명확, AI 면책 있음 | 양호. CTA 없음 |
| 대상 확인 (WhoFor) | 5개 공감 항목 명확 | 양호. CTA 공백이 가장 심각 |
| 기대 결과 (Outcomes) | 4개 카드, 구성 적절 | 양호. 시각 차별화 필요, CTA 없음 |
| 신뢰/안심 (Trust) | 7개 배지, 마무리 문구 | 양호. 핵심 배지 강조 부족, CTA 없음 |
| 의심 해소 (FAQ) | 6개 항목 중 3개 AI 편중 | 보통. 운영 FAQ 추가 필요 |
| 최종 행동 유도 (FinalCTA) | 감성 카피 적절, CTA 이중화 | 보통 |
| 폼 진입 장벽 | Step 1 연락처 선요구 | 개선 필요 |
| 완료 경험 | 후속 안내 없음 | 개선 필요 |

**즉시 개선 우선순위**
1. Step 1 필드 순서 변경 (연락처/이름을 마지막으로) — 전환율에 직접 영향
2. WhoFor 하단 CTA 추가 — 공감 구간 이탈 방어
3. Trust 하단 CTA 추가 — 신뢰 해소 후 전환 유도
4. FinalCTA 버튼 단일화 — 결정 피로 제거
5. 완료 화면 후속 안내 추가 — 경험 품질 개선

**유지할 강점**
- Hero 헤드라인과 서브카피: PRD 공감 원칙에 정확히 부합하며 변경 불필요
- "사진 없이도 요청 가능" 메시지: Hero, HowItWorks, Trust, FinalCTA, Step 3에 일관 반복. 이탈 방어 효과적
- 전반적 톤(친근하고 부담 없는 어조): 타겟 사용자의 막막함/불안 감정에 적절히 대응
- Step 4 "꼭 계약하지 않아도 됩니다" 강조 박스: 마지막 진입 장벽 해소에 기여
