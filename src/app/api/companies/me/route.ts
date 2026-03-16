import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCompany } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET — 자기 프로필 조회
export async function GET() {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    // password_hash, salt 제외
    const { password_hash: _h, salt: _s, ...profile } = company;
    return NextResponse.json(profile);
  } catch (err) {
    console.error("[companies/me] GET error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

// PATCH — 프로필 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    const body = await request.json();

    const allowedFields = [
      "company_name", "representative_name", "business_number",
      "founded_year", "employee_count", "phone",
      "website_url", "instagram_url", "blog_url",
      "service_regions", "specialties", "preferred_styles",
      "min_budget", "max_budget", "min_area", "max_area",
      "total_projects", "years_in_business", "certifications",
      "warranty_period", "warranty_description",
      "introduction", "strengths",
      "logo_url", "main_image_url", "intro_video_url",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "변경할 항목이 없습니다." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("companies")
      .update(updates)
      .eq("id", company.id);

    if (error) {
      console.error("[companies/me] PATCH error:", error.message);
      return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[companies/me] PATCH error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
