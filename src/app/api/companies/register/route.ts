import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail, companyApprovedEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email, password, company_name } = await request.json();

    if (!email || !password || !company_name) {
      return NextResponse.json(
        { error: "이메일, 비밀번호, 업체명은 필수입니다." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "비밀번호는 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 중복 이메일 확인
    const { data: existing } = await supabaseAdmin
      .from("companies")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 409 }
      );
    }

    const { hash, salt } = hashPassword(password);

    const { error } = await supabaseAdmin.from("companies").insert({
      email,
      password_hash: hash,
      salt,
      company_name,
      status: "approved",
    });

    if (error) {
      console.error("[companies/register] insert error:", error.message);
      return NextResponse.json({ error: "등록 실패" }, { status: 500 });
    }

    // 가입 완료 이메일 발송
    try {
      await sendEmail({
        to: email,
        subject: "[모아견적] 업체 가입이 완료되었습니다",
        html: companyApprovedEmail(company_name),
      });
    } catch (emailErr) {
      console.error("[companies/register] 이메일 발송 실패:", emailErr);
    }

    return NextResponse.json(
      { message: "가입이 완료되었습니다. 바로 로그인하여 이용할 수 있습니다." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[companies/register] error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
