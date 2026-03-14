# UTM 파라미터 템플릿

광고 채널별 UTM 파라미터 표준 템플릿입니다. 모든 광고 URL에 일관된 UTM을 적용하여 GA4에서 채널별 성과를 정확히 추적합니다.

---

## 목차

1. [UTM 파라미터 설명](#1-utm-파라미터-설명)
2. [채널별 UTM 템플릿](#2-채널별-utm-템플릿)
3. [네이밍 컨벤션 규칙](#3-네이밍-컨벤션-규칙)
4. [GA4에서 UTM 데이터 확인](#4-ga4에서-utm-데이터-확인)
5. [실제 사용 예시](#5-실제-사용-예시)

---

## 1. UTM 파라미터 설명

| 파라미터 | 필수 여부 | 설명 | 예시 |
|----------|----------|------|------|
| `utm_source` | 필수 | 트래픽 유입 출처 (어디서 왔는가) | `naver`, `instagram`, `youtube` |
| `utm_medium` | 필수 | 마케팅 매체 유형 (어떤 방식으로 왔는가) | `cpc`, `paid_social`, `paid_video` |
| `utm_campaign` | 필수 | 캠페인 이름 (어떤 캠페인인가) | `interior_quote_mar2026` |
| `utm_term` | 선택 | 검색 키워드 (검색광고 전용) | `인테리어견적`, `인테리어비교` |
| `utm_content` | 선택 | 소재 구분 (A/B 테스트 등) | `benefit_card_a`, `reels_before_after` |

---

## 2. 채널별 UTM 템플릿

### 전체 템플릿 테이블

| 채널 | utm_source | utm_medium | utm_campaign | utm_term | utm_content |
|------|-----------|------------|-------------|----------|-------------|
| 네이버 검색 | `naver` | `cpc` | `{캠페인명}` | `{키워드}` | `{소재명}` |
| 인스타그램 피드 | `instagram` | `paid_social` | `{캠페인명}` | - | `{소재명}` |
| 인스타그램 릴스 | `instagram` | `paid_social` | `{캠페인명}` | - | `reels_{소재명}` |
| 유튜브 범퍼 | `youtube` | `paid_video` | `{캠페인명}` | - | `bumper_{소재명}` |
| 유튜브 인스트림 | `youtube` | `paid_video` | `{캠페인명}` | - | `instream_{소재명}` |

### 복사용 전체 URL 템플릿

**네이버 검색광고**

```
https://your-domain.vercel.app/?utm_source=naver&utm_medium=cpc&utm_campaign={캠페인명}&utm_term={키워드}&utm_content={소재명}
```

**인스타그램 피드 광고**

```
https://your-domain.vercel.app/?utm_source=instagram&utm_medium=paid_social&utm_campaign={캠페인명}&utm_content={소재명}
```

**인스타그램 릴스 광고**

```
https://your-domain.vercel.app/?utm_source=instagram&utm_medium=paid_social&utm_campaign={캠페인명}&utm_content=reels_{소재명}
```

**유튜브 범퍼 광고**

```
https://your-domain.vercel.app/?utm_source=youtube&utm_medium=paid_video&utm_campaign={캠페인명}&utm_content=bumper_{소재명}
```

**유튜브 인스트림 광고**

```
https://your-domain.vercel.app/?utm_source=youtube&utm_medium=paid_video&utm_campaign={캠페인명}&utm_content=instream_{소재명}
```

---

## 3. 네이밍 컨벤션 규칙

UTM 값의 일관성을 유지하기 위한 규칙입니다.

### 기본 규칙

| 규칙 | 설명 | 올바른 예 | 잘못된 예 |
|------|------|----------|----------|
| 소문자만 사용 | 대문자 사용 금지 (GA4는 대소문자 구분) | `naver` | `Naver`, `NAVER` |
| 공백 대신 언더스코어 | 띄어쓰기 대신 `_` 사용 | `paid_social` | `paid social`, `paid-social` |
| 한글 사용 금지 | 영문으로만 작성 | `interior_quote` | `인테리어_견적` |
| 날짜 포맷 | `MMYYYY` 또는 `YYYYMM` 사용 | `mar2026`, `202603` | `3월`, `26년3월` |

### 캠페인명 네이밍 패턴

```
{서비스}_{목적}_{시기}
```

예시:
- `interior_quote_mar2026` — 인테리어 견적, 2026년 3월
- `interior_launch_q1_2026` — 인테리어 론칭, 2026년 1분기
- `interior_retarget_apr2026` — 리타게팅, 2026년 4월

### 소재명 네이밍 패턴

```
{소재유형}_{소재특징}_{버전}
```

예시:
- `benefit_card_a` — 혜택 강조 카드형 소재 A버전
- `before_after_v1` — Before/After 비교 소재 v1
- `reels_transform_b` — 릴스용 변환 영상 B버전
- `bumper_quick_v2` — 범퍼용 빠른 견적 소재 v2

### 키워드 네이밍 (네이버 검색광고 전용)

```
{키워드를 영문으로 변환 또는 로마자 표기}
```

예시:
- `interior_gyeonjeok` — 인테리어 견적
- `interior_bigyo` — 인테리어 비교
- `apartment_remodel` — 아파트 리모델링
- `interior_cost` — 인테리어 비용

> 네이버 검색광고 시스템에서 자동 UTM 삽입 기능을 지원하는 경우, `{keyword}` 매크로를 활용할 수 있습니다.

---

## 4. GA4에서 UTM 데이터 확인

### 실시간 확인

1. GA4 → **실시간** 리포트
2. UTM이 포함된 URL로 랜딩페이지 접속
3. 트래픽 소스 카드에서 `소스/매체` 확인
   - 예: `naver / cpc`, `instagram / paid_social`

### 획득 리포트 확인

1. GA4 → **보고서** → **획득** → **트래픽 획득**
2. 기본 채널 그룹 또는 세션 소스/매체로 분류
3. 확인 가능한 항목:
   - **소스**: `utm_source` 값
   - **매체**: `utm_medium` 값
   - **캠페인**: `utm_campaign` 값
   - **세션 수동 검색어**: `utm_term` 값
   - **세션 수동 광고 콘텐츠**: `utm_content` 값

### 탐색 분석 활용

1. GA4 → **탐색** → **자유 형식** 만들기
2. 행: `세션 캠페인`, `세션 소스/매체`
3. 값: `세션 수`, `전환`, `전환율`
4. 필터: 원하는 캠페인명으로 필터링
5. 채널별, 캠페인별, 소재별 전환 성과 비교 가능

---

## 5. 실제 사용 예시

아래는 2026년 3월 캠페인을 가정한 실제 URL 예시입니다.

### 네이버 검색광고 — "인테리어 견적" 키워드

```
https://your-domain.vercel.app/?utm_source=naver&utm_medium=cpc&utm_campaign=interior_quote_mar2026&utm_term=interior_gyeonjeok&utm_content=benefit_card_a
```

### 인스타그램 피드 — Before/After 소재

```
https://your-domain.vercel.app/?utm_source=instagram&utm_medium=paid_social&utm_campaign=interior_quote_mar2026&utm_content=before_after_v1
```

### 인스타그램 릴스 — 변환 영상 소재

```
https://your-domain.vercel.app/?utm_source=instagram&utm_medium=paid_social&utm_campaign=interior_quote_mar2026&utm_content=reels_transform_a
```

### 유튜브 범퍼 — 빠른 견적 소재

```
https://your-domain.vercel.app/?utm_source=youtube&utm_medium=paid_video&utm_campaign=interior_quote_mar2026&utm_content=bumper_quick_v1
```

### 유튜브 인스트림 — 서비스 소개 영상

```
https://your-domain.vercel.app/?utm_source=youtube&utm_medium=paid_video&utm_campaign=interior_quote_mar2026&utm_content=instream_intro_v1
```

> 배포 완료 후 `your-domain.vercel.app` 부분을 실제 도메인으로 교체하세요.
