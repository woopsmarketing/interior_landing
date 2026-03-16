import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCompany } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { sendPushToCustomer } from "@/lib/push";

// POST — 견적 응답 제출
export async function POST(request: NextRequest) {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    if (company.status !== "approved") {
      return NextResponse.json({ error: "승인된 업체만 응답 가능합니다." }, { status: 403 });
    }

    const { submission_id, message, estimated_price } = await request.json();

    if (!submission_id) {
      return NextResponse.json({ error: "견적 요청 ID는 필수입니다." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("company_responses")
      .insert({
        company_id: company.id,
        submission_id,
        message: message || null,
        estimated_price: estimated_price || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "이미 응답한 견적 요청입니다." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 고객에게 자동 푸시 알림 발송 (실패해도 응답 저장은 유지)
    try {
      await sendPushToCustomer(submission_id, {
        title: "업체 견적 응답 도착!",
        body: `${company.company_name}에서 견적 응답을 보냈습니다.`,
        url: `/my/${submission_id}`,
      });
    } catch (pushErr) {
      console.error("[companies/responses] 푸시 발송 실패:", pushErr);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[companies/responses] POST error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

// GET — 내 응답 목록
export async function GET() {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("company_responses")
      .select(
        "*, submissions:submission_id(id, space_type, region, area, budget, construction_scope, desired_timing, created_at)"
      )
      .eq("company_id", company.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ responses: data ?? [] });
  } catch (err) {
    console.error("[companies/responses] GET error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
