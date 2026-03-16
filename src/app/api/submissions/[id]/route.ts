import { NextRequest, NextResponse } from "next/server";
import { getSubmission, getSubmissionImageUrl } from "@/lib/submissions";
import { sendPushToCustomer } from "@/lib/push";

// 상태별 푸시 알림 메시지 매핑
const STATUS_PUSH_MESSAGES: Record<string, { title: string; body: string }> = {
  matching: {
    title: "업체 매칭 시작",
    body: "조건에 맞는 업체를 선별하고 있습니다. 곧 견적을 받아보실 수 있어요!",
  },
  quoted: {
    title: "견적이 도착했습니다!",
    body: "업체에서 견적을 보내왔습니다. 지금 확인해보세요!",
  },
};

// GET /api/submissions/[id]?type=space|reference|generated
// type 없으면 JSON 데이터, type 있으면 Storage URL로 리다이렉트
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const type = request.nextUrl.searchParams.get("type") as "space" | "reference" | "generated" | null;

  if (type) {
    const url = await getSubmissionImageUrl(id, type);
    if (!url) {
      return NextResponse.json({ error: "이미지 없음" }, { status: 404 });
    }
    // Supabase Storage URL로 리다이렉트
    return NextResponse.redirect(url);
  }

  const submission = await getSubmission(id);
  if (!submission) {
    return NextResponse.json({ error: "제출 데이터 없음" }, { status: 404 });
  }
  return NextResponse.json(submission);
}

// PATCH /api/submissions/[id] — 상태 변경 (관리자용)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { status, adminNote } = await request.json();
    const { supabase } = await import("@/lib/supabase");

    const updates: Record<string, string> = {};
    if (status) updates.status = status;
    if (adminNote !== undefined) updates.admin_note = adminNote;

    const { error } = await supabase.from("submissions").update(updates).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // 상태 변경 성공 후 자동 푸시 알림 발송
    if (status && STATUS_PUSH_MESSAGES[status]) {
      const pushMessage = STATUS_PUSH_MESSAGES[status];
      try {
        await sendPushToCustomer(id, {
          title: pushMessage.title,
          body: pushMessage.body,
          url: `/my/${id}`,
        });
      } catch (pushErr) {
        console.error(`[submissions/patch] 자동 푸시 발송 실패 (${id}):`, pushErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submissions/patch] error:", err);
    return NextResponse.json({ error: "업데이트 실패" }, { status: 500 });
  }
}
