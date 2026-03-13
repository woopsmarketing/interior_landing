# RUNBOOK
> 개발 환경 설정 및 실행 방법

## 설치

```bash
# 의존성 설치
npm install

# 환경변수 파일 생성 (.env.local은 git에 포함 안 됨)
cp .env.example .env.local   # 없으면 직접 생성
```

### `.env.local` 필수 항목
```
OPENAI_API_KEY=sk-...

# 전환 추적 (선택 — 없으면 추적 비활성화됨)
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_NAVER_CONVERSION_ID=XXXXXXXXXX
```

## 실행

```bash
# 개발 서버 (localhost:3000)
npm run dev

# 특정 포트로 실행
npm run dev -- -p 3001
```

## 테스트

별도 테스트 파일 없음. 수동 확인:
1. `http://localhost:3000` — 랜딩 메인
2. `http://localhost:3000/form` — 폼 단독 페이지
3. `http://localhost:3000/about` — About 페이지
4. 폼 Step 1→5 진행 후 제출 → AI 이미지 생성 확인

## 빌드

```bash
# 프로덕션 빌드 (Vercel 배포 전 로컬 검증)
npm run build

# 빌드 결과 로컬 실행
npm start
```

## 배포

```bash
# GitHub push → Vercel 자동 배포
git push landing main

# 브랜치 확인
git remote -v   # landing → https://github.com/woopsmarketing/interior_landing.git
```

## 프로젝트 구조 요약

```
src/
├── app/
│   ├── page.tsx              — 랜딩 메인
│   ├── layout.tsx            — 루트 레이아웃 (TrackingScripts 포함)
│   ├── about/page.tsx        — About 페이지
│   ├── form/page.tsx         — 폼 단독 페이지
│   └── api/
│       └── generate-interior/route.ts  — AI 이미지 생성 API
├── components/
│   ├── sections/             — 랜딩 섹션 컴포넌트 14개
│   ├── form/                 — MultiStepForm + Step1~5
│   └── tracking/
│       └── TrackingScripts.tsx  — GA4 / Meta Pixel / 네이버 스크립트
└── lib/
    └── tracking.ts           — 전환 이벤트 유틸리티
```

## 자주 나는 오류

### `OPENAI_API_KEY` 미설정 에러
```
Error: OpenAI API key is required
```
→ `.env.local`에 `OPENAI_API_KEY` 추가 후 서버 재시작

### Vercel 빌드 실패 — OpenAI 초기화 에러
```
Error: Cannot find module 'openai' or OpenAI client initialization error
```
→ `src/app/api/generate-interior/route.ts`에서 OpenAI 클라이언트는 lazy 초기화 패턴 사용 중 (함수 호출 시 생성). Vercel Dashboard의 환경변수 확인.

### `turbopack` 관련 경로 충돌
```
Error: Cannot resolve 'D:\Documents\package-lock.json'
```
→ `next.config.ts`에 `turbopack.root: path.resolve(__dirname)` 설정으로 해결됨. 건드리지 말 것.

### `motion/react` import 에러
```
Module not found: 'framer-motion'
```
→ `framer-motion`이 아닌 `motion/react`로 import해야 함. `"use client"` 선언 필수.

### 포트 충돌
```
Error: listen EADDRINUSE :::3000
```
→ `npm run dev -- -p 3001`로 다른 포트 사용
