import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCompany } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";

const ADMIN_EMAIL = "vnfm0580@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://moahome.kr";

export async function POST(request: NextRequest) {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    const formData = await request.formData();
    const type = formData.get("type") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string | null;

    if (!content?.trim()) {
      return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
    }

    // 이미지 업로드 (Supabase Storage)
    const imageUrls: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === "images" && value instanceof File && value.size > 0) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const ext = value.name.split(".").pop() || "jpg";
        const fileName = `feedback/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data } = await supabaseAdmin.storage
          .from("company-assets")
          .upload(fileName, buffer, { contentType: value.type });

        if (data?.path) {
          const { data: urlData } = supabaseAdmin.storage
            .from("company-assets")
            .getPublicUrl(data.path);
          imageUrls.push(urlData.publicUrl);
        }
      }
    }

    // DB 저장
    const { error: dbError } = await supabaseAdmin.from("feedbacks").insert({
      company_id: company.id,
      company_name: company.company_name,
      company_email: company.email,
      type,
      category: category || "",
      content,
      image_urls: imageUrls,
      status: "pending",
    });

    if (dbError) {
      console.error("[feedback] DB 저장 실패:", dbError.message);
      return NextResponse.json({ error: "저장 실패" }, { status: 500 });
    }

    // 관리자에게 알림 이메일 (간단하게)
    const isFeedback = type === "feedback";
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: isFeedback
          ? `[모아견적] 새 피드백 — ${company.company_name}`
          : `[모아견적] 새 문의 — ${company.company_name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
            <div style="background: ${isFeedback ? "#f97316" : "#3b82f6"}; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
              <h1 style="color: white; font-size: 18px; margin: 0;">
                ${isFeedback ? "💡 새 피드백이 도착했습니다" : "📩 새 문의가 도착했습니다"}
              </h1>
            </div>
            <div style="background: #f9fafb; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">업체</p>
              <p style="color: #111827; font-size: 15px; font-weight: 700; margin: 0;">${company.company_name}</p>
            </div>
            ${category ? `
            <div style="background: #f9fafb; border-radius: 10px; padding: 16px; margin-bottom: 16px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px;">카테고리</p>
              <p style="color: #111827; font-size: 14px; margin: 0;">${category}</p>
            </div>
            ` : ""}
            <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
              <p style="color: #111827; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${content.length > 200 ? content.slice(0, 200) + "..." : content}</p>
            </div>
            <div style="text-align: center;">
              <a href="${SITE_URL}/admin" style="display: inline-block; background: #f97316; color: white; font-weight: 700; font-size: 14px; padding: 12px 32px; border-radius: 8px; text-decoration: none;">
                관리자 페이지에서 확인하기
              </a>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("[feedback] 알림 이메일 발송 실패:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[companies/feedback] POST error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
