const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@yourdomain.com";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY 없음 — 이메일 발송 건너뜀");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[email] 발송 실패: ${err}`);
  }
}

// ── 이메일 템플릿 ──────────────────────────────────────────

export function companyApprovedEmail(companyName: string): string {
  return `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;">
  <div style="margin-bottom:24px;">
    <span style="background:#f97316;color:#fff;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:700;">AI 인테리어 견적 비교</span>
  </div>
  <h2 style="font-size:20px;font-weight:700;color:#111;margin:0 0 12px;">업체 가입이 승인되었습니다 🎉</h2>
  <p style="font-size:15px;color:#444;line-height:1.6;margin:0 0 24px;">
    안녕하세요, <strong>${companyName}</strong>님.<br/>
    업체 심사가 완료되어 정식 파트너로 승인되었습니다.<br/>
    지금 바로 로그인하여 견적 요청에 응답해보세요.
  </p>
  <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/company/login"
     style="display:inline-block;background:#f97316;color:#fff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
    업체 포털 로그인
  </a>
  <p style="font-size:12px;color:#999;margin-top:32px;">문의: ${FROM_EMAIL}</p>
</div>`;
}

export function companyRejectedEmail(companyName: string): string {
  return `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;">
  <div style="margin-bottom:24px;">
    <span style="background:#f97316;color:#fff;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:700;">AI 인테리어 견적 비교</span>
  </div>
  <h2 style="font-size:20px;font-weight:700;color:#111;margin:0 0 12px;">업체 심사 결과 안내</h2>
  <p style="font-size:15px;color:#444;line-height:1.6;margin:0 0 24px;">
    안녕하세요, <strong>${companyName}</strong>님.<br/>
    아쉽게도 이번 심사에서 승인이 어렵습니다.<br/>
    추가 문의는 아래 이메일로 연락해주세요.
  </p>
  <p style="font-size:12px;color:#999;margin-top:32px;">문의: ${FROM_EMAIL}</p>
</div>`;
}

export function customerQuoteArrivedEmail(customerName: string, companyName: string, submissionId: string): string {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/my/${submissionId}`;
  return `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;">
  <div style="margin-bottom:24px;">
    <span style="background:#f97316;color:#fff;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:700;">AI 인테리어 견적 비교</span>
  </div>
  <h2 style="font-size:20px;font-weight:700;color:#111;margin:0 0 12px;">견적이 도착했습니다 📩</h2>
  <p style="font-size:15px;color:#444;line-height:1.6;margin:0 0 24px;">
    안녕하세요, <strong>${customerName}</strong>님.<br/>
    <strong>${companyName}</strong>에서 견적 응답을 보내왔습니다.<br/>
    지금 확인하고 업체 정보를 비교해보세요.
  </p>
  <a href="${url}"
     style="display:inline-block;background:#f97316;color:#fff;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
    견적 확인하기
  </a>
  <p style="font-size:12px;color:#999;margin-top:32px;">이 메일은 자동 발송된 알림입니다.</p>
</div>`;
}
