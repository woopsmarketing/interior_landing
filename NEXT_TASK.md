# NEXT TASK
> 우선순위 순으로 정렬

## 1순위 — 미커밋 코드 커밋 & 푸시

현재 전환 추적 시스템, About 페이지, 이미지 파일들이 로컬에만 있음.

```bash
git add src/components/tracking/ src/lib/ src/app/about/ \
        src/app/layout.tsx src/components/form/MultiStepForm.tsx \
        src/app/page.tsx public/home1_subinterior.png \
        public/home2_subinterior.png public/office1_subinterior.png \
        .gitignore claudedocs/ marketing/
git commit -m "feat: 전환 추적 시스템(GA4/Meta/네이버) + About 페이지 + 마케팅 가이드"
git push landing main
```

## 2순위 — Vercel 환경변수 설정

Vercel Dashboard → Settings → Environment Variables에 추가:

| 변수명 | 값 |
|--------|-----|
| `NEXT_PUBLIC_GA4_ID` | GA4 측정 ID (`G-XXXXXXXXXX`) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID |
| `NEXT_PUBLIC_NAVER_CONVERSION_ID` | 네이버 전환 추적 ID |
| `OPENAI_API_KEY` | OpenAI API 키 (이미 설정됐을 수 있음) |

설정 후 Vercel Redeploy 필요.

## 3순위 — 광고 집행 시작

`marketing/README.md` 타임라인 기준:
1. `marketing/tracking/setup-guide.md` — GA4/Meta/네이버 전환추적 실제 설치 확인
2. `marketing/tracking/utm-templates.md` — 채널별 UTM URL 생성
3. 네이버 검색광고 키워드 세팅 (`marketing/naver/keywords.md`)
4. 인스타그램 광고 소재 제작 (`marketing/instagram/creative-specs.md`)

## 완료 기준

- [ ] GitHub에 모든 변경사항 push 완료
- [ ] Vercel에서 전환 추적 환경변수 설정 완료
- [ ] GA4 실시간 보고서에서 PageView 이벤트 수신 확인
- [ ] 폼 제출 시 `form_submit` 이벤트 GA4에 기록 확인
- [ ] 광고 1개 이상 집행 시작
