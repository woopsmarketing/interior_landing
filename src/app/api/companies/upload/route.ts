import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getAuthenticatedCompany } from "@/lib/company-auth";
import { supabaseAdmin } from "@/lib/supabase";

async function compressToWebP(buffer: Buffer, quality = 82): Promise<Buffer> {
  try {
    return await sharp(buffer).webp({ quality }).toBuffer();
  } catch {
    return buffer;
  }
}

export async function POST(request: NextRequest) {
  try {
    const company = await getAuthenticatedCompany();
    if (!company) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const compressed = await compressToWebP(buffer);

    const timestamp = Date.now();
    const filename = `${company.id}/${timestamp}.webp`;

    const { error } = await supabaseAdmin.storage
      .from("company-assets")
      .upload(filename, compressed, {
        contentType: "image/webp",
        upsert: true,
      });

    if (error) {
      console.error("[companies/upload] storage error:", error.message);
      return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage
      .from("company-assets")
      .getPublicUrl(filename);

    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error("[companies/upload] error:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
