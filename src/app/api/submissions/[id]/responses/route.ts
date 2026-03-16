import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET — 고객용: 자기 견적 응답 업체 목록
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // submission 존재 확인
    const { data: submission } = await supabaseAdmin
      .from("submissions")
      .select("id")
      .eq("id", id)
      .single();

    if (!submission) {
      return NextResponse.json({ error: "견적 요청 없음" }, { status: 404 });
    }

    // 응답 업체 목록 조회
    const { data: responses, error } = await supabaseAdmin
      .from("company_responses")
      .select(
        "id, message, estimated_price, created_at, companies:company_id(id, company_name, logo_url, specialties, preferred_styles)"
      )
      .eq("submission_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 각 업체의 포트폴리오 개수 추가
    const result = await Promise.all(
      (responses ?? []).map(async (r) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const company = r.companies as any;
        const { count } = await supabaseAdmin
          .from("portfolios")
          .select("id", { count: "exact", head: true })
          .eq("company_id", company?.id ?? "");

        return {
          ...r,
          portfolio_count: count ?? 0,
        };
      })
    );

    return NextResponse.json({ responses: result });
  } catch (err) {
    console.error("[submissions/id/responses] GET error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
