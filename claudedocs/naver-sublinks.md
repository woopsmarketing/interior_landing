# 네이버 파워광고 서브링크 설정

## 도메인
`https://xn--l89a58x2iifyc.kr`

---

## 추천 서브링크 4개 (노출 우선순위 순)

| 순서 | 링크이름 | 연결 URL |
|------|----------|----------|
| 1 | 무료견적신청 | https://xn--l89a58x2iifyc.kr/#apply |
| 2 | 이용후기보기 | https://xn--l89a58x2iifyc.kr/#review |
| 3 | 이용방법 | https://xn--l89a58x2iifyc.kr/#how |
| 4 | 자주묻는질문 | https://xn--l89a58x2iifyc.kr/#faq |

> 네이버 파워광고 서브링크는 최대 4개까지 노출됨

---

## 전체 섹션 앵커 목록

| id | URL | 섹션 설명 |
|----|-----|----------|
| `#hero` | …/#hero | 히어로 (메인 헤드라인 + CTA) |
| `#benefits` | …/#benefits | 빠른 혜택 요약 |
| `#before-after` | …/#before-after | 인테리어 전후 비교 |
| `#problem` | …/#problem | 공감/문제 제기 |
| `#service` | …/#service | 핵심 가치 · 차별점 |
| `#compare` | …/#compare | 경쟁사 비교 테이블 |
| `#how` | …/#how | 이용 방법 4단계 |
| `#review` | …/#review | 이용 후기 · 소셜프루프 |
| `#who` | …/#who | 이런 분께 추천 |
| `#outcome` | …/#outcome | 기대 효과 |
| `#trust` | …/#trust | 안심 · 신뢰 포인트 |
| `#faq` | …/#faq | 자주 묻는 질문 |
| `#apply` | …/#apply | 최종 CTA · 견적 신청 |

---

## 코드 변경 사항
- 파일: `src/app/page.tsx`
- 각 섹션 컴포넌트를 `<div id="...">` 로 래핑하여 앵커 지원
