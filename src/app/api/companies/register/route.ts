import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";

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
      status: "pending",
    });

    if (error) {
      console.error("[companies/register] insert error:", error.message);
      return NextResponse.json({ error: "등록 실패" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[companies/register] error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
