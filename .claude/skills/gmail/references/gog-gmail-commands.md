# gogcli Gmail 명령어 레퍼런스

## 검색 및 조회

```bash
# 스레드 검색
gog gmail search '<query>' --max 10 --json

# 메시지 수준 검색 (본문 포함)
gog gmail messages search '<query>' --max 10 --include-body --json

# 스레드 상세 조회
gog gmail thread get <threadId> --json

# 스레드 첨부파일 다운로드
gog gmail thread get <threadId> --download --out-dir ./attachments

# 메시지 상세 조회
gog gmail get <messageId> --json
gog gmail get <messageId> --format metadata --json

# 개별 첨부파일 다운로드
gog gmail attachment <messageId> <attachmentId> --out ./file.bin

# Gmail 웹 URL
gog gmail url <threadId>
```

## 발송

```bash
# 기본 발송
gog gmail send --to a@b.com --subject "제목" --body "본문"

# HTML 본문
gog gmail send --to a@b.com --subject "제목" --body "Plain" --body-html "<p>HTML</p>"

# 파일에서 본문 읽기
gog gmail send --to a@b.com --subject "제목" --body-file ./message.txt

# 답장 (원문 인용 포함)
gog gmail send --reply-to-message-id <messageId> --quote --to a@b.com --subject "Re: 제목" --body "답장"

# 읽음 추적 (사전 설정 필요)
gog gmail send --to a@b.com --subject "제목" --body-html "<p>내용</p>" --track
```

## 초안

```bash
gog gmail drafts list --json
gog gmail drafts create --to a@b.com --subject "제목" --body "본문"
gog gmail drafts create --reply-to-message-id <messageId> --quote --subject "Re: 제목" --body "답장"
gog gmail drafts update <draftId> --subject "수정된 제목" --body "수정된 본문"
gog gmail drafts send <draftId>
```

## 라벨

```bash
gog gmail labels list --json
gog gmail labels get INBOX --json
gog gmail labels create "My Label"
gog gmail labels rename "Old" "New"
gog gmail labels delete <labelIdOrName>
```

## 스레드/메시지 수정

```bash
# 스레드 라벨 변경
gog gmail thread modify <threadId> --add STARRED --remove INBOX

# 배치 수정
gog gmail batch modify <msgId1> <msgId2> --add STARRED --remove INBOX

# 배치 삭제
gog gmail batch delete <msgId1> <msgId2>
```

## 필터

```bash
gog gmail filters list --json
gog gmail filters create --from 'noreply@example.com' --add-label 'Notifications'
gog gmail filters delete <filterId>
gog gmail filters export --out ./filters.json
```

## 설정

```bash
# 부재중 자동응답
gog gmail vacation get
gog gmail vacation enable --subject "부재중" --message "..."
gog gmail vacation disable

# 전달 설정
gog gmail forwarding list
gog gmail forwarding add --email forward@example.com

# 발신 주소
gog gmail sendas list
```

## 자주 쓰는 Gmail 검색 쿼리

| 쿼리 | 설명 |
|---|---|
| `newer_than:7d` | 최근 7일 |
| `older_than:1y` | 1년 이상 된 메일 |
| `is:unread` | 안 읽은 메일 |
| `is:starred` | 별표 메일 |
| `from:someone@example.com` | 특정 발신자 |
| `to:me` | 나에게 온 메일 |
| `has:attachment` | 첨부파일 포함 |
| `filename:pdf` | PDF 첨부 |
| `subject:"meeting"` | 제목에 특정 단어 |
| `label:INBOX` | 특정 라벨 |
| `in:sent` | 보낸 메일 |
