import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(`${ADMIN_SECRET}:`);
  } catch {
    return false;
  }
}

// GET — 업체 목록 (관리자)
export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  }

  try {
    const status = request.nextUrl.searchParams.get("status");

    let query = supabaseAdmin
      .from("companies")
      .select("id, email, company_name, representative_name, phone, status, created_at")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ companies: data ?? [] });
  } catch (err) {
    console.error("[admin/companies] GET error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
