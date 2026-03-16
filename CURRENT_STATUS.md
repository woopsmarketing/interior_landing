# CURRENT_STATUS.md — 프로젝트 현황

> 마지막 업데이트: 2026-03-16

## 서비스 개요
AI 인테리어 견적 비교 랜딩페이지 — 고객이 견적 요청 → 업체가 응답 → 고객이 업체 비교

## 배포
- **URL**: Vercel 자동 배포 (git push → 빌드)
- **DB**: Supabase (PostgreSQL + Storage)
- **Git**: `landing` → `https://github.com/woopsmarketing/interior_landing.git`

---

## 구현 완료 기능

### 1. 고객 플로우
- [x] 랜딩 페이지 (`/`) — 14개 섹션, 전환 최적화
- [x] 멀티스텝 견적 요청 폼 (`/form`) — 5단계
- [x] AI 인테리어 이미지 생성 (gpt-image-1) — 폼 제출 후 완성 이미지 출력
- [x] 내 견적 상태 확인 (`/my/[id]`) — 진행 상태 표시 + 응답 업체 목록
- [x] 업체 소개 열람 (`/my/[id]/companies/[companyId]`) — 응답한 업체만 접근 가능
- [x] 웹 푸시 알림 구독 — 고객이 알림 허용 시 상태 변경 알림 수신
- [x] 전환 추적 — GA4, Meta Pixel, 네이버 전환 추적

### 2. 업체 플로우
- [x] 회원가입 (`/company/register`) — 이메일 + 비밀번호 + 업체명
- [x] 로그인 (`/company/login`) — 관리자 승인 후 이용 가능
- [x] 대시보드 (`/company/dashboard`) — 4개 탭
  - **내 프로필**: 기본정보, 서비스정보, 경력/신뢰, 소개콘텐츠 (30+ 필드)
  - **포트폴리오**: CRUD + 무제한 이미지 업로드 (WebP 자동 압축)
  - **견적 요청**: 전체 견적 요청 열람 (고객 개인정보 제외)
  - **내 응답**: 견적 응답 이력 확인
- [x] 견적 응답 — 메시지 + 예상 견적금액 제출

### 3. 관리자 플로우
- [x] 관리자 로그인 (`/admin`) — 환경변수 기반 인증
- [x] 견적 요청 관리 — 목록 조회 + 상세 보기 + 이미지 확인
- [x] 업체 관리 탭 — 대기/승인/거절 필터 + 승인/거절 버튼
- [x] 푸시 알림 발송 — 개별 고객에게 커스텀 메시지 발송
- [x] 페이지 이동 메뉴 — 모든 주요 페이지 바로 이동

---

## DB 테이블

| 테이블 | 용도 |
|--------|------|
| `submissions` | 고객 견적 요청 데이터 |
| `push_subscriptions` | 푸시 알림 구독 정보 |
| `companies` | 업체 정보 (인증 + 프로필 30+ 필드) |
| `portfolios` | 업체 포트폴리오 (이미지 무제한) |
| `company_responses` | 업체의 견적 응답 (메시지 + 금액) |

## Storage 버킷

| 버킷 | 용도 |
|------|------|
| `interior-images` | 고객 공간 사진, 참고 이미지, AI 생성 이미지 |
| `company-assets` | 업체 로고, 대표이미지, 포트폴리오 이미지 |

---

## API 라우트 전체 목록

### 고객
- `POST /api/submissions` — 견적 요청 제출
- `GET /api/submissions/[id]` — 견적 상세 / 이미지 조회
- `GET /api/submissions/[id]/responses` — 응답 업체 목록
- `GET /api/submissions/[id]/companies/[companyId]` — 업체 상세 (접근 검증)
- `POST /api/generate-interior` — AI 이미지 생성
- `POST /api/push/subscribe` — 푸시 알림 구독

### 업체
- `POST /api/companies/register` — 회원가입
- `POST /api/companies/login` — 로그인
- `GET /api/companies/login` — 인증 상태 확인
- `DELETE /api/companies/login` — 로그아웃
- `GET/PATCH /api/companies/me` — 프로필 조회/수정
- `GET/POST /api/companies/portfolios` — 포트폴리오 목록/생성
- `PATCH/DELETE /api/companies/portfolios/[id]` — 포트폴리오 수정/삭제
- `GET /api/companies/submissions` — 견적 요청 목록 (개인정보 제외)
- `GET/POST /api/companies/responses` — 응답 목록/제출
- `POST /api/companies/upload` — 이미지 업로드

### 관리자
- `POST /api/admin/login` — 관리자 로그인
- `GET /api/admin/login` — 인증 확인
- `DELETE /api/admin/login` — 로그아웃
- `GET /api/admin/companies` — 업체 목록
- `PATCH /api/admin/companies/[id]` — 업체 승인/거절
- `PATCH /api/submissions/[id]` — 견적 상태 변경
- `POST /api/push/send` — 푸시 알림 발송

---

## 환경변수

| 변수 | 용도 | 위치 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | .env.local + Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 | .env.local + Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서버 키 | .env.local + Vercel |
| `OPENAI_API_KEY` | OpenAI API (이미지 생성) | .env.local + Vercel |
| `ADMIN_USERNAME` | 관리자 아이디 | .env.local + Vercel |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | .env.local + Vercel |
| `ADMIN_SECRET` | 관리자 토큰 서명 키 | .env.local + Vercel |
| `COMPANY_SECRET` | 업체 토큰 서명 키 | .env.local + Vercel |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | 푸시 알림 공개 키 | .env.local + Vercel |
| `VAPID_PRIVATE_KEY` | 푸시 알림 비밀 키 | .env.local + Vercel |

---

## 미구현 (향후 과제)

- [ ] 업체 응답 시 고객 자동 알림 (푸시 + 이메일)
- [ ] 지역/분야 기반 업체-견적 매칭
- [ ] 이메일 알림 시스템 (승인/거절/견적 도착)
- [ ] 고객 견적 비교 UI (여러 업체 한눈에)
- [ ] 업체 평점/리뷰 시스템
- [ ] 카카오 알림톡 연동
