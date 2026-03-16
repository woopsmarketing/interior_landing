import { NextResponse } from "next/server";
import { listSubmissions } from "@/lib/submissions";

// 이름 마스킹: "박철수" → "박**"
function maskName(name: string): string {
  if (!name || name.length === 0) return "익**";
  const first = name[0];
  return first + "**";
}

// GET /api/submissions/public — 개인정보 제외한 최신 10개 반환
export async function GET() {
  try {
    const all = await listSubmissions();
    const latest10 = all.slice(0, 10);

    const public_data = latest10.map((s) => ({
      id: s.id,
      maskedName: maskName(s.name),
      region: s.region,
      spaceType: s.spaceType,
      budget: s.budget,
      createdAt: s.createdAt,
    }));

    return NextResponse.json({ requests: public_data });
  } catch {
    return NextResponse.json({ requests: [] });
  }
}
