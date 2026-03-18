import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail, companyApprovedEmail, companyRejectedEmail } from "@/lib/email";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(`${ADMIN_SECRET}:`);
  } catch {
    return false;
  }
}

// PATCH — 업체 승인/거절
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "상태는 approved 또는 rejected만 가능합니다." },
        { status: 400 }
      );
    }

    // 이메일 발송을 위해 업체 정보 먼저 조회
    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("company_name, email")
      .eq("id", id)
      .single();

    const { error } = await supabaseAdmin
      .from("companies")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 이메일 알림 발송 (실패해도 승인 처리는 유지)
    if (company?.email) {
      try {
        if (status === "approved") {
          await sendEmail({
            to: company.email,
            subject: "[AI 인테리어] 업체 가입이 승인되었습니다",
            html: companyApprovedEmail(company.company_name),
          });
        } else {
          await sendEmail({
            to: company.email,
            subject: "[AI 인테리어] 업체 심사 결과 안내",
            html: companyRejectedEmail(company.company_name),
          });
        }
      } catch (emailErr) {
        console.error("[admin/companies/id] 이메일 발송 실패:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/companies/id] PATCH error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
