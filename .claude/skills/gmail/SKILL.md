---
name: gmail
description: gogcli를 사용하여 Gmail 메일을 검색, 조회, 발송하는 skill. "메일 검색해줘", "이메일 보내줘", "gmail search", "메일 확인해줘", "최근 메일", "메일 답장", "gmail send", "메일 보내줘", "안 읽은 메일" 등 Gmail 관련 요청에 트리거된다.
---

# Gmail — gogcli 기반 메일 검색/조회/발송

gogcli(`gog`) CLI를 사용하여 Gmail 메일을 검색, 조회, 발송한다.

## 디렉토리 구조

```
gmail/
├── SKILL.md
└── references/
    └── gog-gmail-commands.md   # 주요 명령어 레퍼런스
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

> **Gmail 인증 설정 가이드**
>
> 1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 프로젝트 생성
> 2. [Gmail API 활성화](https://console.cloud.google.com/apis/api/gmail.googleapis.com)
> 3. [OAuth 동의 화면 설정](https://console.cloud.google.com/auth/branding) → 테스트 사용자 추가
> 4. [OAuth 클라이언트 생성](https://console.cloud.google.com/auth/clients) → "Desktop app" → JSON 다운로드
> 5. 터미널에서 아래 명령 실행:
>
> ```bash
> gog auth credentials ~/Downloads/client_secret_....json
> gog auth add <your-email@gmail.com> --services gmail
> ```
>
> 브라우저가 열리면 Google 계정으로 로그인하여 권한을 허용해주세요.

인증이 확인되면 `GOG_ACCOUNT` 환경변수 또는 `--account` 플래그로 계정을 지정한다.

#### 계정 선택 규칙

- 등록된 계정이 **1개**뿐이면 해당 계정을 그대로 사용한다.
- 등록된 계정이 **여러 개**인 경우:
  - 사용자가 계정을 명시했거나, 요청 맥락에서 어떤 계정을 써야 하는지 파악 가능하면 해당 계정을 사용한다.
  - 어떤 계정을 써야 할지 파악할 수 없으면 **AskUserQuestion**으로 사용자에게 어떤 계정을 사용할지 물어본다.

### 3. 요청 분류 및 실행

사용자 요청을 아래 중 하나로 분류하여 실행한다.

#### 메일 검색

```bash
gog gmail search '<Gmail 검색 쿼리>' --max <N> --json
```

자주 쓰는 검색 쿼리:
- 최근 N일: `newer_than:7d`
- 안 읽은 메일: `is:unread`
- 특정 발신자: `from:someone@example.com`
- 첨부파일 있는 메일: `has:attachment`
- 복합 조건: `from:boss@example.com newer_than:3d is:unread`

#### 메시지 수준 검색 (본문 포함)

```bash
gog gmail messages search '<query>' --max <N> --include-body --json
```

#### 스레드 조회

```bash
gog gmail thread get <threadId> --json
```

#### 메시지 조회

```bash
gog gmail get <messageId> --json
```

#### 메일 발송

```bash
gog gmail send --to <수신자> --subject "<제목>" --body "<본문>"
```

CC/BCC 추가:
```bash
gog gmail send --to <수신자> --cc <참조> --bcc <숨은참조> --subject "<제목>" --body "<본문>"
```

HTML 본문:
```bash
gog gmail send --to <수신자> --subject "<제목>" --body "Plain fallback" --body-html "<p>HTML 본문</p>"
```

#### 답장

```bash
gog gmail send --reply-to-message-id <messageId> --quote --to <수신자> --subject "Re: <원제목>" --body "<답장 내용>"
```

#### 라벨 조회

```bash
gog gmail labels list --json
```

#### 첨부파일 다운로드

```bash
gog gmail thread get <threadId> --download --out-dir <다운로드경로>
```

#### 초안 관리

```bash
# 초안 목록
gog gmail drafts list --json

# 초안 생성
gog gmail drafts create --to <수신자> --subject "<제목>" --body "<본문>"

# 초안 발송
gog gmail drafts send <draftId>
```

### 4. 결과 출력

JSON 결과를 파싱하여 사용자에게 읽기 좋게 정리한다:
- 검색 결과: 발신자, 제목, 날짜, 스니펫을 테이블 형태로
- 메시지 조회: 헤더(From/To/Subject/Date) + 본문
- 발송 결과: 성공 여부와 메시지 ID

## Invariants

- 조회 명령에는 항상 `--json` 플래그를 붙여 파싱 가능한 출력을 얻는다
- **메일 발송은 실행 전 반드시 사용자에게 수신자, 제목, 본문을 확인**받는다
- gogcli 미설치 또는 미인증 상태에서는 명령을 실행하지 않고 설정 안내를 진행한다
- OAuth 자격증명은 gogcli 자체 keyring에 저장된다 — skill 디렉토리에 저장하지 않는다
- `GOG_ACCOUNT` 환경변수가 설정되어 있으면 우선 사용한다

## 주의사항

- Gmail 검색 쿼리는 Gmail 검색 문법을 따른다 (Google 검색 연산자).
- 대량 조회 시 `--max` 플래그로 결과 수를 제한한다.
- 발송 시 `--track` 옵션으로 읽음 추적이 가능하나, 사전 설정이 필요하다.
