import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET — 고객용: 업체 상세 (응답한 업체만)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; companyId: string }> }
) {
  try {
    const { id, companyId } = await params;

    // 해당 submission에 해당 company가 응답했는지 검증
    const { data: response } = await supabaseAdmin
      .from("company_responses")
      .select("*")
      .eq("submission_id", id)
      .eq("company_id", companyId)
      .single();

    if (!response) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 업체 프로필 (password_hash, salt 제외)
    const { data: company } = await supabaseAdmin
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .single();

    if (!company) {
      return NextResponse.json({ error: "업체 정보 없음" }, { status: 404 });
    }

    const { password_hash: _h, salt: _s, ...profile } = company;

    // 포트폴리오 목록
    const { data: portfolios } = await supabaseAdmin
      .from("portfolios")
      .select("*")
      .eq("company_id", companyId)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      company: profile,
      portfolios: portfolios ?? [],
      response,
    });
  } catch (err) {
    console.error("[submissions/id/companies/companyId] GET error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
