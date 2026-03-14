# AI 이미지 생성 프롬프트 템플릿

> AI 인테리어 견적 비교 랜딩페이지 광고용 이미지 생성 프롬프트 5종

---

## 컨셉 1: Before/After 분할 이미지

### 기본 프롬프트 (거실)

```
Create a split-screen interior design comparison image. Left side: an old, worn-out Korean apartment living room with outdated wallpaper, old flooring, and cluttered furniture. Right side: the same room beautifully renovated in modern minimalist Korean style with warm wood tones, clean white walls, and stylish furniture. A diagonal dividing line separates the two halves. Photorealistic, wide-angle, natural lighting. 1080x1080 square format.
```

### 공간 변형

| 변형 | 프롬프트 수정 부분 |
|------|-------------------|
| 주방 | `Korean apartment living room` → `Korean apartment kitchen with old cabinets, stained countertops, and outdated appliances` / After: `sleek modern kitchen with white quartz countertops, handleless cabinets, and integrated appliances` |
| 침실 | `Korean apartment living room` → `Korean apartment bedroom with old wallpaper, worn mattress on the floor, and dim lighting` / After: `serene modern bedroom with platform bed, soft neutral bedding, and ambient lighting` |
| 원룸 | `Korean apartment living room` → `small Korean studio apartment (원룸) with cramped layout, old fixtures, and poor storage` / After: `efficiently designed modern studio with built-in storage, loft bed, and open layout` |

### 스타일 변형

| 스타일 | After 부분 수정 |
|--------|----------------|
| 모던 | `modern minimalist Korean style with warm wood tones, clean white walls, and stylish furniture` |
| 북유럽 | `Scandinavian-inspired style with light oak floors, white and pale blue palette, cozy textiles, and minimalist furniture` |
| 내추럴 | `natural organic style with raw wood elements, indoor plants, linen textures, earthy tones, and rattan accents` |
| 클래식 | `modern classic Korean style with elegant molding, herringbone flooring, marble accents, and refined furniture` |

---

## 컨셉 2: 공감형 (고민하는 사람)

### 기본 프롬프트 (커플)

```
A young Korean couple in their 30s sitting on the floor of an empty apartment, looking at renovation quotes on their phones with worried expressions. Stacks of interior design catalogs around them. Soft natural light from window. Warm, empathetic mood. Photorealistic. 1080x1080.
```

### 변형

| 변형 | 프롬프트 |
|------|---------|
| 여성 1인 | `A young Korean woman in her late 20s sitting alone at a small desk in an unrenovated apartment, comparing multiple renovation quotes printed on paper. She looks overwhelmed and uncertain. Soft warm lighting. Empathetic, relatable mood. Photorealistic. 1080x1080.` |
| 남성 1인 | `A young Korean man in his 30s standing in an empty apartment holding his phone, looking at the bare walls and old flooring with a thoughtful, slightly stressed expression. Moving boxes in the background. Natural window light. Photorealistic. 1080x1080.` |
| 신혼부부 | `A newly married Korean couple in their early 30s walking through an empty apartment for the first time. They look excited but overwhelmed, pointing at different areas that need renovation. Bright natural light. Hopeful yet uncertain mood. Photorealistic. 1080x1080.` |

---

## 컨셉 3: 숫자 임팩트 (100+ 강조)

### 기본 프롬프트

```
A clean, modern infographic-style interior design image. Beautiful renovated Korean apartment living room in the background (slightly blurred). In the foreground, a minimalist white card or screen showing '100+' in large orange typography. Clean, professional, magazine-style layout. 1080x1080.
```

> **주의**: AI 이미지 생성 모델은 텍스트/숫자 렌더링 품질이 낮습니다. 숫자와 텍스트는 Canva에서 별도로 오버레이하는 것을 권장합니다.

### 권장 워크플로우

1. 아래 프롬프트로 배경 이미지만 생성:
```
A beautiful renovated Korean apartment living room with modern minimalist design. Warm wood tones, clean white walls, stylish furniture. Slightly blurred, soft focus. Bright natural lighting. Professional interior photography style. 1080x1080.
```
2. Canva에서 열기
3. 반투명 오렌지 또는 화이트 카드 오버레이 추가
4. "100+" 텍스트를 프리텐다드 Bold로 직접 입력
5. 서브텍스트: "검증된 인테리어 업체" 추가

---

## 컨셉 4: 후기/사회적 증거

### 기본 프롬프트 (가족)

```
A happy Korean family (parents and young child) standing in their beautifully renovated modern apartment. They are smiling and gesturing at their new living space with pride. Clean, bright interior with warm wood and white tones. Natural lighting. Warm, authentic mood. 1080x1080.
```

### 변형

| 변형 | 프롬프트 |
|------|---------|
| 젊은 커플 | `A happy young Korean couple in their 30s sitting on a new sofa in their beautifully renovated apartment. They are smiling and looking satisfied with the renovation result. Modern, clean interior with warm tones. Natural light from large windows. Authentic, warm mood. 1080x1080.` |
| 1인 가구 | `A confident young Korean woman standing in her newly renovated modern studio apartment, smiling with arms crossed. Clean white walls, warm wood accents, clever storage solutions. She looks proud and satisfied. Bright, uplifting mood. Photorealistic. 1080x1080.` |
| 리뷰 카드 스타일 | `A beautifully renovated Korean apartment interior as background (living room with warm wood and white tones). A floating translucent white card in the center with subtle shadow. Clean, editorial style. Space for text overlay. 1080x1080.` |

---

## 컨셉 5: AI 미리보기 (스마트폰 목업)

### 기본 프롬프트

```
A person's hand holding a modern smartphone showing an AI-generated beautiful interior design on the screen. The phone displays a stunning renovated Korean apartment living room. The real background behind the phone shows an old, unrenovated room. Contrast between the AI preview on screen and the current state. Photorealistic, shallow depth of field. 1080x1080.
```

### 변형

| 변형 | 프롬프트 |
|------|---------|
| 태블릿 버전 | `Hands holding a modern tablet displaying an AI-generated interior design preview. The tablet screen shows a beautifully renovated Korean living room. The actual room behind the tablet is old and unrenovated. Strong visual contrast. Top-down angle. Photorealistic. 1080x1080.` |
| 노트북 버전 | `A laptop screen on a desk showing an AI interior design preview of a beautiful Korean apartment. Next to the laptop, actual old apartment photos are scattered. The screen glows with the vibrant renovated design. Clean desk setup. Photorealistic. 1080x1080.` |
| 앱 화면 강조 | `Close-up of a smartphone screen showing a modern interior design app interface. The screen displays a before/after comparison of a Korean apartment renovation. Clean UI with orange accent colors. Blurred background of an empty apartment. Photorealistic. 1080x1080.` |

---

## 프롬프트 사용법

### 이미지 생성 방법

1. **ChatGPT Plus** (가장 쉬움): 프롬프트를 그대로 입력하면 DALL-E 3가 자동으로 이미지 생성
2. **OpenAI API** (`gpt-image-1`): 프로그래밍 방식으로 대량 생성 시 사용
3. **Midjourney**: 더 높은 품질이 필요할 때 (별도 가입 필요)

### 후처리 워크플로우

1. 생성된 이미지를 Canva에서 열기
2. 한국어 텍스트 오버레이 추가 (서비스명, CTA 문구 등)
3. 내보내기 포맷:
   - **피드 광고**: 1080 x 1080 (1:1)
   - **릴스/스토리**: 1080 x 1920 (9:16)
   - **유튜브 썸네일**: 1280 x 720 (16:9)

### 이미지 후처리 팁

- AI 생성 이미지의 텍스트는 거의 항상 깨지므로, 텍스트는 반드시 Canva에서 별도 추가
- 브랜드 포인트 컬러 오렌지(`#F97316`) 사용
- 로고/서비스명은 하단 또는 코너에 작게 배치
- 9:16 비율이 필요하면 1:1 이미지를 위아래로 확장하고 여백에 텍스트 배치
- Before/After 이미지는 같은 구도(카메라 앵글)를 유지해야 효과적
- 사람이 등장하는 이미지는 한국인 외모가 자연스럽게 나오도록 "Korean" 명시 필수
