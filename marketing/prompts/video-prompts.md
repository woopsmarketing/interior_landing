# AI 영상 제작 프롬프트 + 워크플로우

> AI 인테리어 견적 비교 랜딩페이지 광고용 영상 제작 가이드

---

## 영상 제작 방법 3가지

### 방법 1: CapCut 이미지 슬라이드쇼 (권장, 무료)

**난이도**: 쉬움 | **비용**: 무료 | **소요 시간**: 30분~1시간

#### 워크플로우

1. `image-prompts.md`의 프롬프트로 이미지 4~5장 생성
2. CapCut 앱 또는 데스크톱 버전 열기
3. 프로젝트 생성
   - 16:9 → 유튜브 광고
   - 9:16 → 릴스/쇼츠/스토리
4. 이미지를 순서대로 타임라인에 배치
5. 각 이미지 길이 설정
   - 6초 범퍼용: 2~3초씩
   - 15초 광고용: 3~4초씩
6. 텍스트 오버레이 추가
   - **폰트**: 나눔고딕 또는 프리텐다드 (굵은 체)
   - **크기**: 화면의 1/3 이상 (모바일에서 읽히도록)
   - **색상**: 흰색 + 그림자 또는 오렌지(`#F97316`)
7. 전환 효과: 페이드 또는 슬라이드 (0.3~0.5초)
8. BGM: CapCut 내장 라이브러리 → "Corporate" 또는 "Happy" 카테고리
9. 마지막 프레임: CTA + URL을 3초 유지
10. 내보내기: 1080p, 30fps, MP4

---

### 방법 2: Canva Video (쉬움, 무료/유료)

**난이도**: 매우 쉬움 | **비용**: 무료(기본) / Pro 유료 | **소요 시간**: 20~40분

#### 워크플로우

1. [canva.com](https://canva.com) 접속 → "동영상 만들기"
2. YouTube 광고 또는 Instagram 릴스 템플릿 선택
3. AI 생성 이미지를 업로드
4. 템플릿의 기본 이미지를 업로드한 이미지로 교체
5. 텍스트를 한국어 카피로 수정
6. 애니메이션 효과 적용 (페이드, 슬라이드 등)
7. BGM 추가 (Canva 오디오 라이브러리에서 선택)
8. 다운로드: MP4 1080p

#### 장점
- 템플릿 기반이라 디자인 감각 없어도 완성도 높음
- 텍스트 애니메이션이 자연스러움
- 팀 협업 가능

---

### 방법 3: Runway ML (AI 영상, 선택)

**난이도**: 중간 | **비용**: $12/월~ | **소요 시간**: 1~2시간

#### 워크플로우

1. [runwayml.com](https://runwayml.com) 계정 생성 ($12/월 플랜)
2. Gen-3 Alpha 모델 선택
3. 이미지를 업로드하고 모션 프롬프트 입력:

```
Camera slowly pans across a beautifully renovated Korean apartment living room. Warm natural light streams through large windows. Subtle movement of curtains. Photorealistic, cinematic.
```

4. 4초 영상 클립 생성 → 필요한 만큼 여러 개 생성
5. 최종 편집은 CapCut에서 클립 연결 + 텍스트 + BGM 추가

#### Runway 모션 프롬프트 변형

| 장면 | 프롬프트 |
|------|---------|
| 거실 패닝 | `Slow cinematic pan across a modern Korean living room. Warm wood tones, white walls. Sunlight casting soft shadows. Camera moves left to right smoothly.` |
| 주방 줌인 | `Gentle zoom into a modern Korean kitchen island. Steam rising from a coffee cup on the counter. Morning light. Photorealistic, steady camera.` |
| 침실 틸트다운 | `Camera slowly tilts down from ceiling to reveal a beautifully designed Korean bedroom. Soft ambient lighting, neutral bedding, wooden headboard. Calm, serene mood.` |
| 전체 공간 워크스루 | `First-person walkthrough of a renovated Korean apartment. Moving through hallway into bright living room. Smooth, steady camera movement. Natural daylight.` |

---

## 영상별 프레임 구성

### 6초 범퍼 (2프레임)

| 시간 | 이미지 컨셉 | 텍스트 오버레이 |
|------|-------------|----------------|
| 0~3초 | Before 이미지 (낡은 공간) | "우리 집, 이렇게 바뀔 수 있어요" |
| 3~6초 | After 이미지 + CTA | "무료 견적 비교 →" |

**용도**: YouTube 범퍼 광고, 인스타그램 스토리 앞 광고

---

### 15초 인스트림 (5프레임)

| 시간 | 이미지 컨셉 | 텍스트 오버레이 |
|------|-------------|----------------|
| 0~3초 | 고민하는 사람 (컨셉 2) | "인테리어, 어디서부터 시작하지?" |
| 3~6초 | 견적서 비교 화면 | "여러 업체 견적을 한 번에" |
| 6~9초 | AI 미리보기 (컨셉 5) | "AI가 완성 모습을 미리" |
| 9~12초 | 완성된 인테리어 (컨셉 1 After) | "검증된 업체만 매칭" |
| 12~15초 | CTA 화면 | "1분 무료 신청 →" |

**용도**: YouTube 인스트림, 네이버 동영상 광고

---

### 30초 릴스/쇼츠 (7~8프레임, 9:16)

| 시간 | 내용 | 텍스트 오버레이 |
|------|------|----------------|
| 0~4초 | 후킹: 강렬한 숫자/질문 | "인테리어 200만원 아끼는 법" |
| 4~8초 | 문제 제기 | "견적 하나만 받으면 비교 불가" |
| 8~12초 | 해결책 제시 | "한 번에 여러 업체 비교" |
| 12~16초 | 차별점 (AI) | "AI로 완성 모습 미리보기" |
| 16~22초 | 사용 흐름 | "1분 신청 → 매칭 → 비교" |
| 22~26초 | 사회적 증거 | "100건+ 견적 데이터 기반" |
| 26~30초 | CTA | "프로필 링크 클릭" |

**용도**: Instagram 릴스, YouTube 쇼츠, TikTok

---

### 60초 브랜드 영상 (확장 버전)

| 시간 | 내용 | 이미지 컨셉 |
|------|------|------------|
| 0~5초 | 후킹 질문 | 고민하는 사람 (컨셉 2) |
| 5~15초 | 문제 3가지 나열 | Before 이미지들 |
| 15~25초 | 서비스 소개 | 플랫폼 화면 + AI 미리보기 (컨셉 5) |
| 25~35초 | 작동 방식 4단계 | 단계별 아이콘/일러스트 |
| 35~45초 | 후기/결과물 | 행복한 가족 + After 인테리어 (컨셉 4) |
| 45~55초 | 신뢰 요소 | 숫자 임팩트 + 로고 (컨셉 3) |
| 55~60초 | CTA | 서비스 URL + 로고 |

**용도**: 랜딩페이지 내 삽입, 브랜드 채널, 유료 광고 롱폼

---

## BGM 추천 (저작권 프리)

### 무료 소스

| 소스 | 검색 키워드 | 특징 |
|------|------------|------|
| CapCut 내장 | "Inspiring Corporate" 카테고리 | 앱 내에서 바로 적용 |
| YouTube 오디오 라이브러리 | "Corporate", "Happy" | 유튜브 업로드 시 저작권 안전 |
| Pixabay Music | "corporate", "uplifting", "modern" | 상업용 무료 |
| Mixkit | "corporate", "technology" | 상업용 무료, 고품질 |

### BGM 선택 기준

- **템포**: 중간~약간 빠름 (100~130 BPM)
- **분위기**: 밝고 희망적, 과하지 않은
- **악기**: 피아노 + 어쿠스틱 기타 또는 가벼운 일렉트로닉
- **주의**: 보컬이 있는 곡은 피하기 (텍스트 읽기 방해)

---

## 영상 제작 체크리스트

### 제작 전

- [ ] 이미지 4~5장 생성 완료 (`image-prompts.md` 참고)
- [ ] 텍스트 카피 확정 (위 프레임 구성표 참고)
- [ ] 포맷 결정 (6초/15초/30초, 비율)
- [ ] BGM 선택

### 제작 중

- [ ] 텍스트 크기: 모바일에서 읽히는지 확인
- [ ] 텍스트 색상: 배경과 대비 충분한지 확인
- [ ] 전환 효과: 0.3~0.5초 (너무 길면 산만함)
- [ ] 첫 3초에 핵심 메시지 또는 후킹 포함
- [ ] 마지막 프레임에 CTA 3초 이상 유지
- [ ] 오렌지(`#F97316`) 포인트 컬러 일관 사용

### 내보내기

- [ ] 해상도: 1080p 이상
- [ ] 프레임레이트: 30fps
- [ ] 포맷: MP4 (H.264)
- [ ] 파일명: `[플랫폼]_[길이]_[컨셉]_v[버전].mp4`
  - 예: `instagram_30s_beforeafter_v1.mp4`

---

## 플랫폼별 영상 사양

| 플랫폼 | 포맷 | 비율 | 최대 길이 | 권장 길이 |
|--------|------|------|----------|----------|
| YouTube 범퍼 | MP4 | 16:9 | 6초 | 6초 |
| YouTube 인스트림 | MP4 | 16:9 | 3분 | 15~30초 |
| Instagram 피드 | MP4 | 1:1 또는 4:5 | 60초 | 15~30초 |
| Instagram 릴스 | MP4 | 9:16 | 90초 | 15~30초 |
| Instagram 스토리 | MP4 | 9:16 | 15초 | 6~15초 |
| YouTube 쇼츠 | MP4 | 9:16 | 60초 | 15~30초 |
| TikTok | MP4 | 9:16 | 3분 | 15~30초 |
| 네이버 GFA | MP4 | 16:9 | 30초 | 15초 |
| 카카오 비즈보드 | MP4 | 16:9 | 30초 | 15초 |
