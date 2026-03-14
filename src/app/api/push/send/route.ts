import { NextRequest, NextResponse } from "next/server";
import { sendPushToCustomer } from "@/lib/push";

// POST /api/push/send — 관리자가 고객에게 푸시 알림 발송
export async function POST(request: NextRequest) {
  try {
    const { submissionId, title, body, url } = await request.json();

    if (!submissionId) {
      return NextResponse.json({ error: "submissionId 필수" }, { status: 400 });
    }

    const payload = {
      title: title || "인테리어 견적 알림",
      body: body || "견적 관련 새로운 소식이 있습니다.",
      url: url || `/my/${submissionId}`,
    };

    const result = await sendPushToCustomer(submissionId, payload);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (err) {
    console.error("[push/send] error:", err);
    return NextResponse.json({ error: "발송 실패" }, { status: 500 });
  }
}
