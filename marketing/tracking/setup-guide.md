# 전환추적 설치 가이드

이 문서는 GA4, Meta Pixel, 네이버 전환 태그를 랜딩페이지에 설치하는 절차를 안내합니다.

---

## 목차

1. [GA4 설정](#1-ga4-설정)
2. [Meta Pixel 설정](#2-meta-pixel-설정)
3. [네이버 전환 태그 설정](#3-네이버-전환-태그-설정)
4. [이벤트 스키마](#4-이벤트-스키마)
5. [디버깅 체크리스트](#5-디버깅-체크리스트)

---

## 1. GA4 설정

### 1-1. 속성 생성

1. [analytics.google.com](https://analytics.google.com) 접속
2. 관리(톱니바퀴) → **속성 만들기** 클릭
3. 속성 이름: `인테리어 견적 비교 랜딩페이지`
4. 시간대: `대한민국`, 통화: `KRW` 선택
5. 비즈니스 정보 입력 후 **만들기** 클릭

### 1-2. 데이터 스트림 생성

1. 속성 → 데이터 스트림 → **웹** 선택
2. 웹사이트 URL: 배포된 Vercel 도메인 입력
3. 스트림 이름: `랜딩페이지 웹`
4. **스트림 만들기** 클릭

### 1-3. 측정 ID 복사 및 환경 변수 설정

1. 생성된 스트림에서 **측정 ID** 복사 (형식: `G-XXXXXXXXXX`)
2. 프로젝트 루트의 `.env.local` 파일에 추가:

```env
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

3. Vercel 대시보드 → Settings → Environment Variables에도 동일하게 추가
4. 재배포 실행

### 1-4. 이벤트 확인

1. GA4 → **실시간** 리포트 열기
2. 랜딩페이지에 직접 접속하여 폼 진행
3. 아래 이벤트가 실시간에 표시되는지 확인:
   - `form_start` — 폼 컴포넌트 마운트 시
   - `form_step_complete` — 각 스텝 완료 시
   - `form_submit` — 최종 제출 시
   - `ai_image_generated` — AI 이미지 생성 성공 시

> GA4 실시간 데이터는 반영에 최대 30초 소요될 수 있습니다.

---

## 2. Meta Pixel 설정

### 2-1. 픽셀 생성

1. [business.facebook.com](https://business.facebook.com) 접속
2. **이벤트 관리자** → **데이터 소스 연결** 클릭
3. **웹** 선택 → 픽셀 이름: `인테리어 랜딩` 입력
4. **픽셀만** 선택 (수동 설치)
5. **계속** 클릭하여 픽셀 생성 완료

### 2-2. 픽셀 ID 환경 변수 설정

1. 이벤트 관리자에서 **픽셀 ID** 복사 (숫자 문자열)
2. `.env.local`에 추가:

```env
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXX
```

3. Vercel 환경 변수에도 동일하게 추가 후 재배포

### 2-3. 동작 확인

1. Chrome 웹 스토어에서 **Meta Pixel Helper** 확장 프로그램 설치
2. 랜딩페이지 접속 → Pixel Helper 아이콘 클릭
3. 아래 이벤트가 감지되는지 확인:
   - `PageView` — 페이지 로드 시 자동 발생
   - `InitiateCheckout` — 폼 진입 시
   - `Lead` — 폼 최종 제출 시
   - `ViewContent` — AI 이미지 생성 완료 시

### 2-4. 전환 API (선택사항)

서버 사이드 전환 추적이 필요한 경우:
1. 이벤트 관리자 → **설정** → **전환 API** 활성화
2. 액세스 토큰 생성 → 환경 변수에 추가
3. API Route에서 서버 이벤트 전송 구현

> iOS 14.5 이후 브라우저 픽셀만으로는 추적이 불완전할 수 있습니다. 전환 API 병행을 권장합니다.

---

## 3. 네이버 전환 태그 설정

### 3-1. 전환추적 스크립트 발급

1. [searchad.naver.com](https://searchad.naver.com) 접속 및 로그인
2. **도구** → **전환추적 관리** 메뉴 진입
3. **전환추적 스크립트** 발급 클릭
4. 사이트 URL: 배포된 Vercel 도메인 입력
5. 스크립트 발급 완료

### 3-2. 사이트 ID 환경 변수 설정

1. 발급된 스크립트에서 **사이트 ID** 복사 (형식: `s_XXXXXXXXXXXXXXXX`)
2. `.env.local`에 추가:

```env
NEXT_PUBLIC_NAVER_CONVERSION_ID=s_XXXXXXXXXXXXXXXX
```

3. Vercel 환경 변수에도 동일하게 추가 후 재배포

### 3-3. 전환 유형 설정

- **전환유형 코드**: `1` (신청완료)
- **전환가치**: `0` (금액 없음, 리드 수집 목적)
- 폼 제출 완료 시점에 전환 스크립트 호출:

```
cnv(전환유형, 전환가치) → cnv(1, 0)
```

### 3-4. 동작 확인

1. searchad.naver.com → 도구 → 전환추적 관리
2. **스크립트 설치 확인** 클릭
3. 사이트 URL 입력 후 정상 설치 여부 확인
4. 실제 폼 제출 후 전환 데이터가 집계되는지 확인 (최대 24시간 소요)

---

## 4. 이벤트 스키마

모든 전환 이벤트의 채널별 매핑:

| 이벤트 | GA4 | Meta Pixel | 네이버 | 발생 시점 |
|--------|-----|------------|--------|----------|
| 폼 진입 | `form_start` | `InitiateCheckout` | - | 폼 컴포넌트 마운트 |
| 스텝 완료 | `form_step_complete` | `CustomEvent` | - | 다음 버튼 클릭 |
| 최종 제출 | `form_submit` | `Lead` | `cnv(1, 0)` | 제출 버튼 클릭 |
| AI 이미지 생성 | `ai_image_generated` | `ViewContent` | - | 이미지 생성 성공 |

### GA4 이벤트 파라미터

```javascript
// form_start
gtag('event', 'form_start', {
  event_category: 'form',
  event_label: 'multi_step_form'
});

// form_step_complete
gtag('event', 'form_step_complete', {
  event_category: 'form',
  step_number: 1,           // 1~5
  step_name: 'space_info'   // space_info, construction, style, upload, personal
});

// form_submit
gtag('event', 'form_submit', {
  event_category: 'form',
  event_label: 'complete',
  has_space_photo: true,     // boolean
  has_reference_image: false // boolean
});

// ai_image_generated
gtag('event', 'ai_image_generated', {
  event_category: 'ai',
  generation_time_ms: 18500, // 생성 소요 시간
  has_input_images: true     // 입력 이미지 유무
});
```

### Meta Pixel 이벤트 코드

```javascript
// 폼 진입
fbq('track', 'InitiateCheckout');

// 스텝 완료
fbq('trackCustom', 'FormStepComplete', { step: 1 });

// 최종 제출
fbq('track', 'Lead');

// AI 이미지 생성
fbq('track', 'ViewContent', { content_name: 'ai_interior_image' });
```

---

## 5. 디버깅 체크리스트

설치 완료 후 아래 항목을 하나씩 확인합니다.

### 환경 변수

- [ ] `.env.local`에 `NEXT_PUBLIC_GA4_ID` 값이 올바르게 입력되어 있는가
- [ ] `.env.local`에 `NEXT_PUBLIC_META_PIXEL_ID` 값이 올바르게 입력되어 있는가
- [ ] `.env.local`에 `NEXT_PUBLIC_NAVER_CONVERSION_ID` 값이 올바르게 입력되어 있는가
- [ ] Vercel 환경 변수에도 동일한 값이 설정되어 있는가
- [ ] 환경 변수 변경 후 재배포를 했는가

### GA4

- [ ] GA4 실시간 리포트에서 `page_view` 이벤트가 보이는가
- [ ] 폼 진입 시 `form_start` 이벤트가 발생하는가
- [ ] 각 스텝 완료 시 `form_step_complete` 이벤트가 올바른 `step_number`와 함께 발생하는가
- [ ] 폼 제출 시 `form_submit` 이벤트가 발생하는가
- [ ] AI 이미지 생성 완료 시 `ai_image_generated` 이벤트가 발생하는가
- [ ] 브라우저 콘솔에 GA4 관련 오류가 없는가

### Meta Pixel

- [ ] Meta Pixel Helper에서 픽셀 ID가 올바르게 표시되는가
- [ ] `PageView` 이벤트가 페이지 로드 시 자동 발생하는가
- [ ] `InitiateCheckout` 이벤트가 폼 진입 시 발생하는가
- [ ] `Lead` 이벤트가 폼 제출 시 발생하는가
- [ ] `ViewContent` 이벤트가 AI 이미지 생성 시 발생하는가
- [ ] 이벤트 관리자 → 테스트 이벤트에서 이벤트가 수신되는가

### 네이버

- [ ] searchad.naver.com에서 스크립트 설치 확인이 정상인가
- [ ] 폼 제출 시 `cnv(1, 0)` 호출이 실행되는가
- [ ] 전환추적 관리에서 전환 데이터가 집계되는가 (최대 24시간 후 확인)

### 공통

- [ ] 모바일 기기에서도 이벤트가 정상 발생하는가
- [ ] 광고 차단기(AdBlock) 활성화 시 핵심 기능에 영향이 없는가
- [ ] UTM 파라미터가 GA4에 정상적으로 수집되는가 (`utm-templates.md` 참고)
