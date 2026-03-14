import { NextRequest, NextResponse } from "next/server";
import { getSubmission, getSubmissionImage } from "@/lib/submissions";

// GET /api/submissions/[id]?type=space|reference|generated
// type 없으면 JSON 데이터, type 있으면 이미지 바이너리 반환
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const type = request.nextUrl.searchParams.get("type") as "space" | "reference" | "generated" | null;

  if (type) {
    const image = await getSubmissionImage(id, type);
    if (!image) {
      return NextResponse.json({ error: "이미지 없음" }, { status: 404 });
    }
    const contentType = type === "generated" ? "image/png" : "image/jpeg";
    return new NextResponse(new Uint8Array(image), {
      headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=3600" },
    });
  }

  const submission = await getSubmission(id);
  if (!submission) {
    return NextResponse.json({ error: "제출 데이터 없음" }, { status: 404 });
  }
  return NextResponse.json(submission);
}
