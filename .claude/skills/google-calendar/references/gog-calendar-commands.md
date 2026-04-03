# gogcli Calendar 명령어 레퍼런스

## 캘린더 관리

```bash
# 캘린더 목록
gog calendar calendars --json

# 접근 권한 조회
gog calendar acl <calendarId> --json

# 사용 가능한 색상
gog calendar colors --json

# 현재 시간 (타임존 확인)
gog calendar time --timezone Asia/Seoul
```

## 일정 조회

```bash
# 오늘
gog calendar events primary --today --json

# 내일
gog calendar events primary --tomorrow --json

# 이번주 (월-일)
gog calendar events primary --week --json

# N일간
gog calendar events primary --days 3 --json

# 상대 날짜
gog calendar events primary --from today --to friday --json

# 절대 날짜
gog calendar events primary --from 2026-04-01T00:00:00Z --to 2026-04-08T00:00:00Z --json

# 요일 컬럼 포함
gog calendar events primary --today --weekday --json

# 모든 캘린더
gog calendar events --all --today --json

# 특정 캘린더들
gog calendar events --cal Work --cal Personal --today --json

# 개별 일정 상세
gog calendar event primary <eventId> --json
gog calendar get primary <eventId> --json
```

## 일정 검색

```bash
# 키워드 검색 (기본: 30일전 ~ 90일후)
gog calendar search "meeting" --json

# 오늘 중 검색
gog calendar search "standup" --today --json

# 기간 지정 검색
gog calendar search "review" --from 2026-04-01 --to 2026-04-30 --max 50 --json
```

## 일정 생성

```bash
# 기본 생성
gog calendar create primary \
  --summary "팀 미팅" \
  --from 2026-04-15T10:00:00+09:00 \
  --to 2026-04-15T11:00:00+09:00

# 참석자 + 장소
gog calendar create primary \
  --summary "프로젝트 킥오프" \
  --from 2026-04-15T14:00:00+09:00 \
  --to 2026-04-15T15:00:00+09:00 \
  --attendees "alice@example.com,bob@example.com" \
  --location "회의실 A"

# 종일 일정
gog calendar create primary \
  --summary "연차" \
  --from 2026-04-20 \
  --to 2026-04-21 \
  --all-day

# 반복 일정
gog calendar create primary \
  --summary "주간 회의" \
  --from 2026-04-15T10:00:00+09:00 \
  --to 2026-04-15T11:00:00+09:00 \
  --rrule "RRULE:FREQ=WEEKLY;COUNT=8"

# 알림 설정
gog calendar create primary \
  --summary "결제일" \
  --from 2026-05-11T09:00:00+09:00 \
  --to 2026-05-11T09:15:00+09:00 \
  --reminder "email:3d" \
  --reminder "popup:30m"

# 참석자에게 알림 전송
gog calendar create primary \
  --summary "팀 싱크" \
  --from 2026-04-15T14:00:00+09:00 \
  --to 2026-04-15T15:00:00+09:00 \
  --send-updates all
```

## 특수 일정 타입

```bash
# 집중 시간
gog calendar create primary \
  --event-type focus-time \
  --from 2026-04-15T13:00:00+09:00 \
  --to 2026-04-15T14:00:00+09:00

# 부재중
gog calendar create primary \
  --event-type out-of-office \
  --from 2026-04-20 \
  --to 2026-04-21 \
  --all-day

# 근무 장소
gog calendar create primary \
  --event-type working-location \
  --working-location-type office \
  --working-office-label "본사" \
  --from 2026-04-22 \
  --to 2026-04-23
```

## 일정 수정

```bash
# 제목/시간 변경
gog calendar update primary <eventId> \
  --summary "수정된 미팅" \
  --from 2026-04-15T11:00:00+09:00 \
  --to 2026-04-15T12:00:00+09:00

# 참석자 추가 (기존 유지)
gog calendar update primary <eventId> \
  --add-attendee "newperson@example.com"

# 알림 전송
gog calendar update primary <eventId> \
  --send-updates all
```

## 일정 삭제

```bash
gog calendar delete primary <eventId> --force
gog calendar delete primary <eventId> --send-updates all --force
```

## 초대 응답

```bash
gog calendar respond primary <eventId> --status accepted
gog calendar respond primary <eventId> --status declined
gog calendar respond primary <eventId> --status tentative
```

## 빈 시간 / 충돌 확인

```bash
# 빈 시간 조회
gog calendar freebusy --calendars "primary,work@example.com" \
  --from 2026-04-15T00:00:00+09:00 \
  --to 2026-04-16T00:00:00+09:00 \
  --json

# 충돌 확인
gog calendar conflicts --all --today --json
```

## 타임존 관련

- `GOG_TIMEZONE` 환경변수: 기본 출력 타임존 설정 (예: `Asia/Seoul`, `UTC`, `local`)
- `--timezone` 플래그: 개별 명령에서 타임존 지정
- JSON 출력에는 `startDayOfWeek`, `endDayOfWeek`, `startLocal`, `endLocal`, `timezone` 필드 포함
