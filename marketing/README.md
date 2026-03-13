# AI 인테리어 견적 비교 — 마케팅 실행 가이드

## 랜딩페이지 URL

> **배포 후 여기에 입력**: `https://your-domain.vercel.app`

---

## 폴더 구조

```
marketing/
├── README.md                  ← 현재 파일 (총괄 가이드)
└── tracking/
    ├── setup-guide.md         ← GA4 / Meta Pixel / 네이버 전환추적 설치
    └── utm-templates.md       ← 채널별 UTM 파라미터 템플릿
```

---

## 전체 타임라인 (Day 1~14)

| 기간 | 작업 | 상세 내용 |
|------|------|----------|
| **Day 1-2** | 광고 계정 개설 + 전환추적 설치 | GA4 속성 생성, Meta Pixel 설치, 네이버 전환 태그 삽입. 상세 절차는 `tracking/setup-guide.md` 참고 |
| **Day 3-5** | 크리에이티브 소재 제작 | AI 이미지 생성(gpt-image-1) → Canva 텍스트 오버레이 → 채널별 규격 내보내기 |
| **Day 6-7** | 네이버 검색광고 집행 시작 | 키워드 세팅, 입찰가 조정, 확장소재 등록 |
| **Day 8-10** | 인스타그램 광고 집행 시작 | 피드 + 릴스 소재 세팅, 타겟 오디언스 구성 |
| **Day 11-14** | 유튜브 광고 + 성과 모니터링 + 최적화 | 범퍼/인스트림 소재 업로드, 전 채널 성과 분석 및 예산 재배분 |

---

## 채널별 우선순위

| 순위 | 채널 | 이유 | 핵심 지표 |
|------|------|------|----------|
| 1 | **네이버 검색광고** | 전환율이 가장 높음 — 이미 검색 의도가 있는 사용자 유입 | CPC, 전환율, CPA |
| 2 | **인스타그램 광고** | 높은 도달률 — 비주얼 중심 인테리어 콘텐츠에 적합 | CPM, 클릭률, 도달 수 |
| 3 | **유튜브 광고** | 인지도 확보 — 브랜드 노출과 리타게팅 모수 확보 | 조회수, 조회 완료율, CPV |

---

## 예산 배분 (총 100만원 기준)

| 채널 | 비중 | 금액 | 비고 |
|------|------|------|------|
| 네이버 검색 | 50% | 500,000원 | 전환 중심, 핵심 키워드 집중 |
| 인스타그램 | 30% | 300,000원 | 피드 70% + 릴스 30% 배분 권장 |
| 유튜브 | 20% | 200,000원 | 범퍼 60% + 인스트림 40% 배분 권장 |

> 집행 2주 후 채널별 CPA(전환당 비용) 비교 → 효율 높은 채널에 예산 재배분

---

## AI 크리에이티브 제작 워크플로우

```
1. 프롬프트 작성
   └─ 인테리어 스타일, 공간 유형, 분위기 키워드 정리

2. AI 이미지 생성
   └─ ChatGPT (gpt-image-1) 또는 API로 이미지 생성
   └─ 3~5개 시안 중 최적 선택

3. Canva 텍스트 오버레이
   └─ 생성된 이미지를 Canva에 업로드
   └─ 광고 카피, CTA 버튼, 로고 배치
   └─ 채널별 규격에 맞게 리사이즈

4. 내보내기 및 등록
   └─ 네이버: 1200x628px (검색광고 확장소재)
   └─ 인스타그램 피드: 1080x1080px (정사각형)
   └─ 인스타그램 릴스: 1080x1920px (세로)
   └─ 유튜브 범퍼: 1920x1080px (가로)
```

### 프롬프트 예시 (gpt-image-1)

```
A photorealistic wide-angle interior photo of a modern Korean apartment
living room, 30 square meters, warm natural light through large windows,
minimalist Scandinavian style with wood accents, soft beige and white
color palette, cozy atmosphere, architectural digest quality photography
```

---

## AI 도구 추천

| 용도 | 도구 | 비용 | 난이도 |
|------|------|------|--------|
| 이미지 생성 | ChatGPT (DALL-E 3) | $20/월 (Plus) | 쉬움 |
| 이미지 생성 (API) | OpenAI gpt-image-1 | 종량제 | 중간 |
| 텍스트 오버레이 | Canva 무료 | 무료 | 매우 쉬움 |
| 영상 편집 | CapCut | 무료 | 쉬움 |
| 영상 편집 대안 | Canva Video | 무료~$13/월 | 매우 쉬움 |
| AI 영상 생성 | Runway ML | $12/월 | 중간 |
| 배경 제거 | remove.bg | 무료 | 매우 쉬움 |

### 도구별 활용 시나리오

- **ChatGPT (DALL-E 3)**: 광고 소재용 인테리어 이미지 빠르게 생성. Plus 구독만으로 충분.
- **gpt-image-1 API**: 랜딩페이지 내 실시간 AI 이미지 생성에 사용 (이미 구현됨).
- **Canva**: 생성된 이미지 위에 광고 카피, CTA, 로고 등 텍스트 요소 배치. 템플릿 활용 가능.
- **CapCut / Canva Video**: 인스타그램 릴스, 유튜브 범퍼 영상 제작. 이미지 슬라이드쇼 + 텍스트 애니메이션.
- **Runway ML**: Before/After 변환 영상 등 고급 AI 영상 콘텐츠 제작.
- **remove.bg**: 제품/공간 이미지에서 배경 제거 후 새 배경 합성.

---

## 다음 단계

1. `tracking/setup-guide.md`를 따라 전환추적 설치
2. `tracking/utm-templates.md`에서 채널별 UTM 복사하여 광고 URL 세팅
3. Day 1-2 일정에 맞춰 광고 계정 개설 시작
