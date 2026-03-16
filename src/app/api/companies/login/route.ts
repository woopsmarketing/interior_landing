import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, generateCompanyToken, verifyCompanyToken } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";

// POST — 로그인
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("*")
      .eq("email", email)
      .single();

    if (!company) {
      return NextResponse.json(
        { error: "등록되지 않은 이메일입니다." },
        { status: 401 }
      );
    }

    if (!verifyPassword(password, company.password_hash, company.salt)) {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    if (company.status === "pending") {
      return NextResponse.json(
        { error: "관리자 승인 대기 중입니다." },
        { status: 403 }
      );
    }

    if (company.status === "rejected") {
      return NextResponse.json(
        { error: "등록이 거절되었습니다." },
        { status: 403 }
      );
    }

    const token = generateCompanyToken(company.id);
    const response = NextResponse.json({ success: true });

    response.cookies.set("company_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    return response;
  } catch (err) {
    console.error("[companies/login] error:", err);
    return NextResponse.json({ error: "로그인 처리 실패" }, { status: 500 });
  }
}

// GET — 인증 상태 확인
export async function GET(request: NextRequest) {
  const token = request.cookies.get("company_token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const companyId = verifyCompanyToken(token);
  if (!companyId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, companyId });
}

// DELETE — 로그아웃
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("company_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
