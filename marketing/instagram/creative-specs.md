# 인스타그램 광고 소재 규격 + 제작 가이드

> AI 인테리어 견적 비교 서비스 — 크리에이티브 제작 매뉴얼

---

## 이미지 소재 규격

| 포맷 | 비율 | 크기 (px) | 용도 | 파일 형식 |
|------|------|-----------|------|-----------|
| 피드 이미지 | 1:1 | 1080 x 1080 | 피드 광고 | PNG / JPG |
| 스토리/릴스 | 9:16 | 1080 x 1920 | 스토리, 릴스 광고 | PNG / JPG |
| 캐러셀 | 1:1 | 1080 x 1080 | 다중 이미지 슬라이드 | PNG / JPG |
| 피드 세로형 | 4:5 | 1080 x 1350 | 피드 (세로 확장) | PNG / JPG |

### 파일 요구사항

- **최대 파일 크기**: 30MB (이미지), 4GB (영상)
- **권장 해상도**: 최소 1080px 너비
- **텍스트 비율**: 이미지 내 텍스트 20% 이하 (Meta 광고 정책)
- **영상 길이**: 릴스 15-30초, 스토리 15초

---

## 디자인 시스템

### 색상 팔레트

| 용도 | 색상 | HEX | 사용처 |
|------|------|-----|--------|
| 포인트 | 오렌지 | #F97316 | CTA 버튼, 강조 텍스트, 아이콘 |
| 포인트 (진한) | 다크 오렌지 | #EA580C | 호버, 그라데이션 끝 |
| 배경 | 화이트 | #FFFFFF | 메인 배경 |
| 배경 (따뜻한) | 크림 | #FFF9F5 | 카드 배경, 섹션 구분 |
| 텍스트 (메인) | 다크 그레이 | #1F2937 | 제목, 본문 |
| 텍스트 (보조) | 미디엄 그레이 | #6B7280 | 설명, 부제목 |
| 강조 배경 | 라이트 오렌지 | #FFF7ED | 배지, 태그 배경 |

### 폰트 가이드

| 용도 | 권장 폰트 | 스타일 |
|------|-----------|--------|
| 제목 | Pretendard Bold / Noto Sans KR Bold | 24-36pt, 굵게 |
| 본문 | Pretendard Regular / Noto Sans KR Regular | 16-20pt |
| CTA | Pretendard SemiBold | 18-24pt, 굵게 |
| 숫자 강조 | Pretendard ExtraBold | 40-60pt |

> Canva에서는 **Noto Sans KR**을 기본 한글 폰트로 사용한다. Pretendard는 별도 업로드 필요.

---

## 컨셉 1: Before/After 비교

### AI 이미지 생성 프롬프트 (ChatGPT / DALL-E)

**Before 이미지:**
```
A realistic photo of a dated, worn-out Korean apartment living room.
Old wallpaper, scratched wooden floor, outdated fluorescent lighting,
cluttered space, small window with thin curtains.
Wide-angle interior photography, natural daylight, slightly dim atmosphere.
Photorealistic, candid real estate listing style.
```

**After 이미지:**
```
A stunning modern Korean apartment living room after renovation.
Clean white walls, warm wood herringbone flooring, recessed LED lighting,
minimalist furniture, large window with sheer linen curtains.
Scandinavian-modern style, warm neutral tones with orange accent cushions.
Wide-angle interior photography, bright natural light.
Photorealistic, architectural digest quality, 4K detail.
```

### Canva 제작 단계

1. **새 디자인** → 1080 x 1080px (피드) 또는 1080 x 1920px (스토리)
2. **배경**: 화이트 (#FFFFFF)
3. **이미지 배치**:
   - 피드 (1:1): 좌우 분할, Before 왼쪽 / After 오른쪽
   - 스토리 (9:16): 상하 분할, Before 위 / After 아래
4. **구분선**: 가운데 세로선 또는 화살표 아이콘
5. **텍스트 오버레이**:
   - Before 쪽: `BEFORE` 라벨 (회색, 작게)
   - After 쪽: `AFTER` 라벨 (오렌지, 작게)
   - 하단: `견적 비교 한 번이면 이렇게` (Noto Sans KR Bold, 24pt, 다크 그레이)
   - 하단 CTA: `무료 견적 비교 →` (오렌지 배경 박스, 흰 텍스트)
6. **내보내기**: PNG, 1080px

### 스토리 버전 추가 요소

- 상단에 `swipe` 화살표 또는 링크 스티커 영역 확보
- 하단 1/4에 CTA 텍스트 배치
- Before/After 라벨에 애니메이션 효과 (Canva Pro)

---

## 컨셉 2: 고민 공감형

### AI 이미지 생성 프롬프트

```
A frustrated Korean person in their 30s sitting at a desk,
looking at multiple papers and a laptop screen showing different
interior design quotes and estimates. Overwhelmed expression,
messy desk with renovation brochures scattered around.
Warm indoor lighting, realistic lifestyle photography.
Korean apartment background, photorealistic.
```

### Canva 제작 단계

1. **새 디자인** → 1080 x 1080px
2. **배경**: 크림 (#FFF9F5) 단색 또는 AI 생성 이미지
3. **텍스트 카드 스타일** (이미지 없이 텍스트만으로도 가능):
   - 상단: `인테리어 업체 고르다가 지친 사람` (Noto Sans KR Bold, 28pt)
   - 이모지: `🙋‍♀️` (텍스트 옆)
   - 중단 (고민 리스트):
     ```
     ❌ 업체마다 전화해야 하고
     ❌ 비교할 수가 없고
     ❌ 바가지가 불안하고
     ```
     (Noto Sans KR Regular, 18pt, 미디엄 그레이)
   - 하단: `한 번에 비교하세요` (오렌지, Bold, 24pt)
   - CTA: `1분 무료 신청 →` (오렌지 배경 라운드 박스)
4. **디자인 포인트**: 체크리스트/X마크로 고민을 시각화
5. **내보내기**: PNG, 1080px

---

## 컨셉 3: 숫자 임팩트

### AI 이미지 생성 프롬프트

```
A clean, modern infographic-style background with subtle
interior design elements. Light cream background with faint
blueprint or floor plan lines. Minimalist, professional,
suitable for text overlay. No text in image.
Photorealistic style, soft focus interior in background.
```

### Canva 제작 단계

1. **새 디자인** → 1080 x 1080px
2. **배경**: 화이트 or 크림, 우측 하단에 인테리어 이미지 (반투명 30%)
3. **메인 숫자 배치**:
   - 중앙 대형: `100건+` (Noto Sans KR ExtraBold, 60pt, 오렌지)
   - 서브: `견적 데이터 기반` (Regular, 20pt, 다크 그레이)
4. **3열 수치 카드** (하단):
   ```
   평균 절감    비교 업체    소요 시간
   187만원      3-5곳       1분
   ```
   - 숫자: Bold 36pt, 오렌지
   - 라벨: Regular 14pt, 그레이
5. **하단 CTA**: `바가지 안 쓰는 인테리어의 시작` + 화살표
6. **내보내기**: PNG, 1080px

---

## 컨셉 4: AI 미리보기 강조

### AI 이미지 생성 프롬프트

**핸드폰 화면 속 이미지 (Before → AI 결과):**
```
A smartphone screen mockup showing a split view:
left side shows a plain empty Korean apartment room (before),
right side shows the same room beautifully renovated with
modern Scandinavian interior design (AI-generated result).
The phone is held by a hand against a clean white background.
Photorealistic, product photography style.
```

**AI 생성 인테리어 결과 이미지:**
```
A beautiful modern Korean apartment interior, AI-generated style.
Open plan living room with warm wood flooring, white walls,
designer pendant lights, comfortable sofa in neutral tones,
orange accent pillows and decor. Large windows with city view.
Photorealistic, interior design magazine quality, bright and airy.
```

### Canva 제작 단계

1. **새 디자인** → 1080 x 1080px (피드) 또는 1080 x 1920px (스토리)
2. **레이아웃 옵션 A (모바일 목업)**:
   - 핸드폰 목업 프레임 (Canva 요소에서 검색)
   - 화면 안에 AI 생성 인테리어 이미지 삽입
   - 상단: `AI가 미리 보여주는 우리 집` (Bold, 28pt)
   - 하단: `사진 한 장이면 끝` (Regular, 18pt)
3. **레이아웃 옵션 B (3단 흐름)**:
   ```
   [현재 사진] → [AI 처리 중] → [완성 이미지]
    📷 촬영      🤖 AI 분석     ✨ 결과
   ```
   - 3개 이미지를 화살표로 연결
   - 각 단계 아래에 한 줄 설명
4. **CTA**: `무료 AI 미리보기 체험 →` (오렌지 버튼)
5. **내보내기**: PNG, 1080px

---

## 컨셉 5: 후기 / 사회적 증거

### AI 이미지 생성 프롬프트

```
A warm, inviting Korean apartment interior that looks recently
renovated. Happy atmosphere, morning sunlight streaming through
windows. Modern minimalist style with natural wood and white tones.
A small orange accent plant pot on the shelf.
Lifestyle interior photography, editorial quality.
```

### Canva 제작 단계

1. **새 디자인** → 1080 x 1080px
2. **레이아웃: 후기 카드 디자인**
   - 배경: 따뜻한 인테리어 이미지 (투명도 20-30%)
   - 중앙 화이트 카드 (라운드 모서리, 그림자)
   - 카드 내용:
     ```
     ⭐⭐⭐⭐⭐

     "견적 비교 안 했으면
      200만원 더 쓸 뻔했어요"

     — 김OO, 30대, 아파트 32평
     ```
   - 텍스트: 메인 후기 (Bold, 22pt), 이름 (Regular, 14pt, 그레이)
3. **캐러셀 버전** (슬라이드 3-5장):
   - 슬라이드 1: 서비스 소개 카드
   - 슬라이드 2-4: 각각 다른 후기
   - 슬라이드 5: CTA 카드 (`지금 무료 신청하기`)
4. **하단 CTA**: `나도 견적 비교하기 →`
5. **내보내기**: PNG, 1080px

---

## 릴스 15초 영상 제작법

### 사전 준비

- AI 이미지 4-5장 생성 (아래 프롬프트 사용)
- CapCut 설치 (무료, PC 또는 모바일)

### AI 이미지 생성 프롬프트 (릴스용 시퀀스)

**프레임 1 (현재 공간):**
```
A plain, outdated Korean apartment living room.
Old wallpaper, basic fluorescent light, worn floor.
Wide-angle, realistic photo, slightly dim.
```

**프레임 2 (스타일 선택):**
```
A clean UI mockup showing interior style selection cards:
Modern, Scandinavian, Natural, Classic options displayed
on a white background with orange accent highlights.
Flat design, app interface style.
```

**프레임 3 (AI 처리):**
```
Abstract visualization of AI processing interior design.
Glowing wireframe overlay on an apartment room,
digital transformation effect, blue and orange light trails.
Futuristic but warm, tech meets home design.
```

**프레임 4 (완성 결과):**
```
A stunning renovated Korean apartment living room.
Modern Scandinavian design, warm wood flooring, white walls,
designer furniture, orange accent decor, bright natural light.
Architectural digest quality, photorealistic, aspirational.
```

**프레임 5 (CTA):**
```
Clean white background with centered text area.
Subtle interior design elements in corners (plant, lamp).
Space for Korean text overlay. Minimalist, premium feel.
Warm cream tones, orange accent border at bottom.
```

### CapCut 편집 단계

1. **새 프로젝트** → 비율: 9:16 (1080 x 1920)
2. **이미지 임포트**: 위 5장 순서대로 추가
3. **각 이미지 길이**: 3초씩 (총 15초)
4. **텍스트 오버레이** (각 프레임):

| 프레임 | 텍스트 | 폰트/크기 |
|--------|--------|-----------|
| 1 | `우리 집, 이대로 괜찮을까?` | Bold, 28pt, 화이트 (그림자) |
| 2 | `원하는 스타일만 고르면` | Bold, 28pt, 다크 그레이 |
| 3 | `AI가 완성 이미지를 만들어요` | Bold, 28pt, 화이트 (그림자) |
| 4 | `이렇게 바뀔 수 있어요 ✨` | Bold, 32pt, 화이트 (그림자) |
| 5 | `무료 견적 비교 → 프로필 링크` | Bold, 28pt, 오렌지 |

5. **전환 효과**: 프레임 사이에 페이드(Fade) 또는 슬라이드(Slide) 적용 (0.5초)
6. **BGM**: CapCut 내장 음악 라이브러리 → `Inspiring` 또는 `Lifestyle` 카테고리에서 선택 (저작권 프리)
7. **볼륨**: BGM 70-80% (텍스트 가독성 우선)
8. **내보내기**: 1080 x 1920, 30fps, H.264

### 릴스 변형: Before/After 버전

| 프레임 | 시간 | 내용 |
|--------|------|------|
| 1 | 0-4초 | Before 이미지 + `이 방이...` 텍스트 |
| 2 | 4-5초 | 전환 효과 (빠른 줌) |
| 3 | 5-11초 | After 이미지 + `이렇게 바뀝니다` 텍스트 |
| 4 | 11-15초 | CTA 카드 + `무료 견적 비교` |

---

## 소재 최종 체크리스트

### Meta 광고 정책 준수

- [ ] 이미지 내 텍스트 20% 이하 ([Meta 텍스트 오버레이 도구](https://www.facebook.com/ads/tools/text_overlay)로 확인)
- [ ] 과장/허위 광고 표현 없음 ("무조건", "100% 보장" 등 금지)
- [ ] Before/After 이미지가 비현실적이지 않음
- [ ] 개인정보 관련 표현 없음 ("당신의 나이가..." 등 금지)
- [ ] 저작권 문제 없는 이미지/음악 사용

### 디자인 품질

- [ ] 밝고 선명한 이미지 (어둡거나 흐릿하지 않음)
- [ ] CTA 버튼/텍스트 명확히 보임
- [ ] 모바일에서 읽을 수 있는 폰트 크기 (최소 16pt)
- [ ] 브랜드 색상(오렌지 #F97316) 일관 적용
- [ ] 여백 충분 (답답하지 않은 레이아웃)

### 포맷별 확인

- [ ] 피드용 1:1 (1080 x 1080) 버전 제작
- [ ] 스토리용 9:16 (1080 x 1920) 버전 제작
- [ ] 릴스용 9:16 영상 (15초) 제작
- [ ] 캐러셀 3-5장 세트 제작 (해당 컨셉만)

### 텍스트/카피

- [ ] 맞춤법 검수 완료
- [ ] CTA 문구 포함
- [ ] 해시태그 15-20개 준비
- [ ] 캡션 첫 줄에 핵심 메시지 배치

### 최종 내보내기

- [ ] 이미지: PNG, 1080px 이상
- [ ] 영상: MP4, 1080 x 1920, 30fps
- [ ] 파일명 규칙: `컨셉번호_포맷_날짜.확장자` (예: `c1_feed_20260313.png`)
