import { NextRequest, NextResponse } from "next/server";
import { saveSubmission, listSubmissions } from "@/lib/submissions";

// GET /api/submissions — 전체 목록 조회
export async function GET() {
  try {
    const submissions = await listSubmissions();
    return NextResponse.json({ submissions });
  } catch (err) {
    console.error("[submissions] GET error:", err);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}

// POST /api/submissions — 새 제출 저장
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const data = {
      spaceType: (formData.get("spaceType") as string) || "",
      region: (formData.get("region") as string) || "",
      area: (formData.get("area") as string) || "",
      areaUnknown: formData.get("areaUnknown") === "true",
      currentCondition: (formData.get("currentCondition") as string) || "",
      buildingAge: (formData.get("buildingAge") as string) || "",
      constructionScope: (formData.get("constructionScope") as string) || "",
      desiredTiming: (formData.get("desiredTiming") as string) || "",
      budget: (formData.get("budget") as string) || "",
      constructionPurpose: (formData.get("constructionPurpose") as string) || "",
      scheduleFlexibility: (formData.get("scheduleFlexibility") as string) || "",
      occupancyDuringWork: (formData.get("occupancyDuringWork") as string) || "",
      renovationAreas: JSON.parse((formData.get("renovationAreas") as string) || "[]"),
      renovationNote: (formData.get("renovationNote") as string) || "",
      additionalRequest: (formData.get("additionalRequest") as string) || "",
      name: (formData.get("name") as string) || "",
      phone: (formData.get("phone") as string) || "",
      email: (formData.get("email") as string) || "",
      contactMethod: JSON.parse((formData.get("contactMethod") as string) || "[]"),
      availableTime: JSON.parse((formData.get("availableTime") as string) || "[]"),
      agreePrivacy: formData.get("agreePrivacy") === "true",
      agreeConsult: formData.get("agreeConsult") === "true",
      agreeMarketing: formData.get("agreeMarketing") === "true",
    };

    // 이미지 파일 처리
    const spacePhotoFile = formData.get("spacePhoto") as File | null;
    const referenceImageFile = formData.get("referenceImage") as File | null;
    const generatedImageBase64 = formData.get("generatedImage") as string | null;

    const spacePhoto = spacePhotoFile && spacePhotoFile.size > 0
      ? Buffer.from(await spacePhotoFile.arrayBuffer())
      : null;
    const referenceImage = referenceImageFile && referenceImageFile.size > 0
      ? Buffer.from(await referenceImageFile.arrayBuffer())
      : null;
    const generatedImage = generatedImageBase64
      ? Buffer.from(generatedImageBase64, "base64")
      : null;

    const id = await saveSubmission(data, { spacePhoto, referenceImage, generatedImage });

    return NextResponse.json({ id, success: true });
  } catch (err) {
    console.error("[submissions] POST error:", err);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
