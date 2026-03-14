import { NextRequest, NextResponse } from "next/server";
import { savePushSubscription } from "@/lib/push";

// POST /api/push/subscribe — 고객 푸시 구독 저장
export async function POST(request: NextRequest) {
  try {
    const { submissionId, subscription, customerName } = await request.json();

    if (!submissionId || !subscription) {
      return NextResponse.json({ error: "필수 정보 누락" }, { status: 400 });
    }

    await savePushSubscription(submissionId, subscription, customerName || "");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[push/subscribe] error:", err);
    return NextResponse.json({ error: "구독 저장 실패" }, { status: 500 });
  }
}
