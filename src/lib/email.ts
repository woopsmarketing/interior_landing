const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@moaestimates.kr";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "모아견적";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  if (!BREVO_API_KEY) {
    console.warn("[email] BREVO_API_KEY 없음 — 이메일 발송 건너뜀");
    return;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
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

export function customerSubmissionConfirmEmail(customerName: string, submissionId: string): string {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/my/${submissionId}`;
  return `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;">
  <div style="margin-bottom:24px;">
    <span style="background:#f97316;color:#fff;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:700;">모아견적</span>
  </div>
  <h2 style="font-size:20px;font-weight:700;color:#111;margin:0 0 12px;">견적 요청이 접수되었습니다 ✅</h2>
  <p style="font-size:15px;color:#444;line-height:1.6;margin:0 0 24px;">
    안녕하세요, <strong>${customerName}</strong>님.<br/>
    견적 요청이 정상적으로 접수되었습니다.<br/>
    업체 매칭 후 견적이 도착하면 알림을 보내드릴게요.
  </p>
  <div style="background:#fff8f3;border:1px solid #fed7aa;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
    <p style="font-size:13px;color:#c2410c;font-weight:600;margin:0 0 8px;">📌 내 견적 확인 링크 (저장해두세요)</p>
    <p style="font-size:12px;color:#78350f;margin:0 0 12px;word-break:break-all;">${url}</p>
    <a href="${url}"
       style="display:inline-block;background:#f97316;color:#fff;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
      내 견적 현황 보기
    </a>
  </div>
  <p style="font-size:12px;color:#999;line-height:1.6;">이 링크를 북마크하거나 저장해두시면 언제든지 견적 진행 현황을 확인하실 수 있습니다.</p>
  <p style="font-size:12px;color:#ccc;margin-top:24px;">이 메일은 자동 발송된 알림입니다.</p>
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
