---
name: google-calendar
description: gogcli를 사용하여 Google Calendar 일정을 조회, 검색, 생성, 수정, 삭제하는 skill. "일정 확인해줘", "캘린더 보여줘", "오늘 일정", "이번주 일정", "미팅 잡아줘", "일정 추가", "calendar events", "일정 생성", "스케줄 확인", "빈 시간 확인", "일정 삭제" 등 Google Calendar 관련 요청에 트리거된다.
---

# Google Calendar — gogcli 기반 일정 조회/생성/관리

gogcli(`gog`) CLI를 사용하여 Google Calendar 일정을 조회, 검색, 생성, 수정, 삭제한다.

## 디렉토리 구조

```
google-calendar/
├── SKILL.md
└── references/
    └── gog-calendar-commands.md   # 주요 명령어 레퍼런스
```

스크립트 없이 `gog` CLI를 직접 실행한다.

## 플로우

### 1. gogcli 설치 확인

```bash
which gog
```

명령이 실패하면 사용자에게 설치를 안내한다:

> **gogcli 설치 안내**
>
> ```bash
> brew install gogcli
> ```
>
> 설치 완료 후 다시 시도해주세요.

설치가 확인되면 다음 단계로 진행한다.

### 2. 인증 확인

```bash
gog auth list
```

계정이 없으면 OAuth 설정을 안내한다:

> **Google Calendar 인증 설정 가이드**
>
> 1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 프로젝트 생성
> 2. [Google Calendar API 활성화](https://console.cloud.google.com/apis/api/calendar-json.googleapis.com)
> 3. [OAuth 동의 화면 설정](https://console.cloud.google.com/auth/branding) → 테스트 사용자 추가
> 4. [OAuth 클라이언트 생성](https://console.cloud.google.com/auth/clients) → "Desktop app" → JSON 다운로드
> 5. 터미널에서 아래 명령 실행:
>
> ```bash
> gog auth credentials ~/Downloads/client_secret_....json
> gog auth add <your-email@gmail.com> --services calendar
> ```
>
> 브라우저가 열리면 Google 계정으로 로그인하여 권한을 허용해주세요.

인증이 확인되면 `GOG_ACCOUNT` 환경변수 또는 `--account` 플래그로 계정을 지정한다.

### 3. 요청 분류 및 실행

사용자 요청을 아래 중 하나로 분류하여 실행한다. 캘린더 ID는 기본적으로 `primary`를 사용한다.

#### 캘린더 목록 조회

```bash
gog calendar calendars --json
```

#### 오늘 일정

```bash
gog calendar events primary --today --json
```

#### 이번주 일정

```bash
gog calendar events primary --week --json
```

#### N일간 일정

```bash
gog calendar events primary --days <N> --json
```

#### 특정 기간 일정

```bash
gog calendar events primary --from <시작일> --to <종료일> --json
```

- 상대 날짜 지원: `--from today --to friday`
- ISO 8601: `--from 2026-04-01T00:00:00Z --to 2026-04-08T00:00:00Z`

#### 모든 캘린더의 일정

```bash
gog calendar events --all --today --json
```

#### 일정 검색

```bash
gog calendar search "<키워드>" --today --json
gog calendar search "<키워드>" --days <N> --json
```

검색 기본 범위: 30일 전 ~ 90일 후 (--from/--to로 조정 가능)

#### 일정 생성

```bash
gog calendar create primary \
  --summary "<일정 제목>" \
  --from <시작시간> \
  --to <종료시간> \
  [--attendees "alice@example.com,bob@example.com"] \
  [--location "<장소>"] \
  [--send-updates all]
```

종일 일정:
```bash
gog calendar create primary \
  --summary "<일정 제목>" \
  --from 2026-04-15 \
  --to 2026-04-16 \
  --all-day
```

반복 일정:
```bash
gog calendar create primary \
  --summary "<일정 제목>" \
  --from <시작시간> \
  --to <종료시간> \
  --rrule "RRULE:FREQ=WEEKLY;COUNT=4"
```

#### 일정 수정

```bash
gog calendar update primary <eventId> \
  --summary "<수정된 제목>" \
  --from <새 시작시간> \
  --to <새 종료시간>
```

참석자 추가 (기존 유지):
```bash
gog calendar update primary <eventId> \
  --add-attendee "newperson@example.com"
```

#### 일정 삭제

```bash
gog calendar delete primary <eventId> --force
```

참석자에게 알림 전송:
```bash
gog calendar delete primary <eventId> --send-updates all --force
```

#### 초대 응답

```bash
gog calendar respond primary <eventId> --status accepted
gog calendar respond primary <eventId> --status declined
gog calendar respond primary <eventId> --status tentative
```

#### 빈 시간 확인 (Free/Busy)

```bash
gog calendar freebusy --calendars "primary" \
  --from <시작시간> \
  --to <종료시간> \
  --json
```

#### 일정 충돌 확인

```bash
gog calendar conflicts --all --today --json
```

### 4. 쓰기 작업 확인

일정 **생성, 수정, 삭제** 전에 반드시 사용자에게 아래 내용을 확인받는다:

- **생성**: 제목, 시간, 참석자, 장소
- **수정**: 변경 항목과 변경 내용
- **삭제**: 삭제 대상 일정 제목과 시간

### 5. 결과 출력

JSON 결과를 파싱하여 사용자에게 읽기 좋게 정리한다:
- 일정 목록: 날짜, 시간, 제목, 장소를 테이블 형태로
- 일정 상세: 제목, 시간, 참석자, 장소, 설명 등
- 생성/수정 결과: 성공 여부와 이벤트 ID

## Invariants

- 조회 명령에는 항상 `--json` 플래그를 붙여 파싱 가능한 출력을 얻는다
- **일정 생성/수정/삭제는 실행 전 반드시 사용자에게 내용을 확인**받는다
- 캘린더 ID를 지정하지 않으면 `primary`를 기본값으로 사용한다
- gogcli 미설치 또는 미인증 상태에서는 명령을 실행하지 않고 설정 안내를 진행한다
- OAuth 자격증명은 gogcli 자체 keyring에 저장된다 — skill 디렉토리에 저장하지 않는다
- `GOG_ACCOUNT` 환경변수가 설정되어 있으면 우선 사용한다
- 시간은 사용자의 로컬 타임존 기준으로 표시한다

## 주의사항

- `--send-updates all`을 명시하지 않으면 참석자에게 알림이 가지 않는다.
- 반복 일정 수정 시 단일 인스턴스만 변경할지, 전체를 변경할지 확인한다.
- `GOG_TIMEZONE` 환경변수로 기본 출력 타임존을 설정할 수 있다 (예: `Asia/Seoul`).
