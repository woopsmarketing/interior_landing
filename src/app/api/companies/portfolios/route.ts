import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCompany } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET — 자기 포트폴리오 목록
export async function GET() {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("portfolios")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ portfolios: data ?? [] });
  } catch (err) {
    console.error("[companies/portfolios] GET error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

// POST — 포트폴리오 생성
export async function POST(request: NextRequest) {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: "제목은 필수입니다." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("portfolios")
      .insert({
        company_id: company.id,
        title: body.title,
        description: body.description || null,
        space_type: body.space_type || null,
        style: body.style || null,
        area: body.area || null,
        budget: body.budget || null,
        region: body.region || null,
        duration: body.duration || null,
        image_urls: body.image_urls || [],
        is_public: body.is_public !== false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[companies/portfolios] POST error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
