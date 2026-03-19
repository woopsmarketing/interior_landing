import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCompany } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET — 포트폴리오 단건 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    const { data: portfolio, error } = await supabaseAdmin
      .from("portfolios")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !portfolio) {
      return NextResponse.json({ error: "포트폴리오를 찾을 수 없습니다" }, { status: 404 });
    }

    // 소유권 검증
    if (portfolio.company_id !== company.id) {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }

    return NextResponse.json({ portfolio });
  } catch (err) {
    console.error("[companies/portfolios/id] GET error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

// PATCH — 포트폴리오 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    // 소유권 확인
    const { data: portfolio } = await supabaseAdmin
      .from("portfolios")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!portfolio || portfolio.company_id !== company.id) {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }

    const body = await request.json();
    const allowedFields = [
      "title", "description", "space_type", "style",
      "area", "budget", "region", "duration",
      "image_urls", "is_public",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const { error } = await supabaseAdmin
      .from("portfolios")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[companies/portfolios/id] PATCH error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

// DELETE — 포트폴리오 삭제
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    // 소유권 확인
    const { data: portfolio } = await supabaseAdmin
      .from("portfolios")
      .select("company_id")
      .eq("id", id)
      .single();

    if (!portfolio || portfolio.company_id !== company.id) {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }

    const { error } = await supabaseAdmin
      .from("portfolios")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[companies/portfolios/id] DELETE error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
