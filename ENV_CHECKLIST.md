# ENV_CHECKLIST.md — 환경변수 체크리스트

> 배포 전 / 환경변수 변경 시 반드시 확인

## 필수 환경변수 (하나라도 빠지면 500 에러)

### Supabase 연결
| 변수 | 예시 | 확인 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | [ ] |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhb...` | [ ] |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhb...` | [ ] |

### 관리자 인증 (없으면 /admin 로그인 시 "서버 설정 오류" 500 에러)
| 변수 | 예시 | 확인 |
|------|------|------|
| `ADMIN_USERNAME` | `admin` | [ ] |
| `ADMIN_PASSWORD` | `your-password` | [ ] |
| `ADMIN_SECRET` | `랜덤 hex 64자` | [ ] |

### 업체 인증
| 변수 | 예시 | 확인 |
|------|------|------|
| `COMPANY_SECRET` | `랜덤 hex 64자` | [ ] |

### AI 이미지 생성
| 변수 | 예시 | 확인 |
|------|------|------|
| `OPENAI_API_KEY` | `sk-...` | [ ] |

### 푸시 알림 (선택 — 없으면 푸시 기능만 비활성)
| 변수 | 예시 | 확인 |
|------|------|------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `BM7...` | [ ] |
| `VAPID_PRIVATE_KEY` | `k3...` | [ ] |

### 전환 추적 (선택 — 없으면 추적만 비활성)
| 변수 | 예시 | 확인 |
|------|------|------|
| `NEXT_PUBLIC_GA4_ID` | `G-XXXXXXX` | [ ] |
| `NEXT_PUBLIC_META_PIXEL_ID` | `12345...` | [ ] |
| `NEXT_PUBLIC_NAVER_ID` | `s_xxx...` | [ ] |

---

## 환경변수 생성 방법

### 랜덤 키 생성 (ADMIN_SECRET, COMPANY_SECRET)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### VAPID 키 생성
```bash
node scripts/generate-vapid-keys.js
```

---

## 설정 위치

1. **로컬 개발**: `.env.local` 파일 (git에 포함되지 않음)
2. **Vercel 배포**: Vercel Dashboard → Settings → Environment Variables
3. **주의**: Vercel 환경변수 변경 후 반드시 **Redeploy** 필요

---

## 자주 발생하는 오류

| 증상 | 원인 | 해결 |
|------|------|------|
| `/admin` 로그인 시 "서버 설정 오류" (500) | `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SECRET` 중 하나 이상 미설정 | Vercel에 3개 모두 설정 → Redeploy |
| 업체 로그인 토큰 무효 | `COMPANY_SECRET` 미설정 (기본값 사용 중) | Vercel에 설정 → Redeploy |
| AI 이미지 생성 실패 | `OPENAI_API_KEY` 미설정 또는 만료 | API 키 확인 후 설정 |
| 이미지 업로드 실패 | Supabase 키 미설정 또는 Storage 버킷 미생성 | 키 확인 + `schema.sql` 섹션 3, 7 실행 |
| 푸시 알림 미동작 | VAPID 키 미설정 | `generate-vapid-keys.js` 실행 후 설정 |
