import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCompany } from "@/lib/company-auth";
import { sendEmail } from "@/lib/email";

const ADMIN_EMAIL = "vnfm0580@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    const formData = await request.formData();
    const type = formData.get("type") as string; // "feedback" | "inquiry"
    const content = formData.get("content") as string;
    const category = formData.get("category") as string | null;

    if (!content?.trim()) {
      return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
    }

    // 이미지 첨부 처리 (문의하기에서만)
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof File && value.size > 0) {
        imageFiles.push(value);
      }
    }

    // 이미지를 base64로 변환 (이메일 인라인 첨부)
    const imageAttachments: { name: string; content: string }[] = [];
    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      imageAttachments.push({
        name: file.name,
        content: buffer.toString("base64"),
      });
    }

    const isFeedback = type === "feedback";
    const subject = isFeedback
      ? `[모아견적 피드백] ${company.company_name} — ${category || "일반"}`
      : `[모아견적 문의] ${company.company_name}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h1 style="color: white; font-size: 20px; margin: 0;">
            ${isFeedback ? "💡 업체 피드백" : "📩 업체 문의"}
          </h1>
        </div>

        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">업체명</p>
          <p style="color: #111827; font-size: 16px; font-weight: 700; margin: 0;">${company.company_name}</p>
        </div>

        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">이메일</p>
          <p style="color: #111827; font-size: 14px; margin: 0;">${company.email}</p>
        </div>

        ${category ? `
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">카테고리</p>
          <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0;">${category}</p>
        </div>
        ` : ""}

        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px;">내용</p>
          <p style="color: #111827; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${content}</p>
        </div>

        ${imageAttachments.length > 0 ? `
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px;">
          <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px;">첨부 이미지 (${imageAttachments.length}개)</p>
          ${imageAttachments.map((img) => `
            <p style="color: #111827; font-size: 13px; margin: 4px 0;">📎 ${img.name}</p>
          `).join("")}
        </div>
        ` : ""}

        <p style="color: #9ca3af; font-size: 11px; margin-top: 24px; text-align: center;">
          모아견적 업체 포털에서 발송됨 · ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
        </p>
      </div>
    `;

    await sendEmail({ to: ADMIN_EMAIL, subject, html });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[companies/feedback] POST error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
