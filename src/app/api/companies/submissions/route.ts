import { NextResponse } from "next/server";
import { getAuthenticatedCompany } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET — 업체용 견적 요청 목록 (개인정보 제외)
export async function GET() {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    if (company.status !== "approved") {
      return NextResponse.json({ error: "승인된 업체만 접근 가능합니다." }, { status: 403 });
    }

    // 견적 요청 목록 (개인정보 제외)
    const { data: submissions, error } = await supabaseAdmin
      .from("submissions")
      .select(
        "id, created_at, status, space_type, region, region_detail, building_name, area, area_unknown, current_condition, building_age, construction_scope, desired_timing, budget, structural_change, renovation_areas, renovation_note, additional_request, has_space_photo, has_reference_image, has_generated_image, space_photo_url, reference_image_url, generated_image_url"
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 자기가 이미 응답한 건 표시
    const { data: responses } = await supabaseAdmin
      .from("company_responses")
      .select("submission_id")
      .eq("company_id", company.id);

    const respondedIds = new Set((responses ?? []).map((r) => r.submission_id));

    const result = (submissions ?? []).map((s) => ({
      ...s,
      hasResponded: respondedIds.has(s.id),
    }));

    return NextResponse.json({ submissions: result });
  } catch (err) {
    console.error("[companies/submissions] GET error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
