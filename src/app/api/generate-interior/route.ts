import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Vercel 함수 타임아웃 설정
export const maxDuration = 120;

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

// 한국어 → 영어 매핑
const SPACE_MAP: Record<string, string> = {
  "아파트": "apartment",
  "오피스텔": "officetel studio",
  "전원주택/단독주택": "detached house",
  "원룸/빌라": "studio villa",
  "투룸/빌라": "two-room villa",
  "타운하우스": "townhouse",
  "카페": "cafe",
  "음식점": "restaurant",
  "술집/바": "bar",
  "사무실": "office",
  "병원/의원": "clinic",
  "미용실/네일샵": "beauty salon",
  "헬스장/스튜디오": "fitness studio",
  "상가/매장": "retail store",
};

function mapList(items: string[], map: Record<string, string>): string {
  return items.map((v) => map[v] ?? v).join(", ");
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1: GPT-4o Vision — 공간 구조 분석
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeSpaceStructure(photoBase64: string, mimeType: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${photoBase64}`,
              detail: "high",
            },
          },
          {
            type: "text",
            text: `You are a renovation planning assistant. Analyze this interior space photo.

Describe precisely:
1. ROOM TYPE & SIZE: approximate dimensions, shape, ceiling height
2. FIXED ELEMENTS: structural columns, beams, windows (location/size), doors, AC units, pipes
3. CAMERA ANGLE: viewpoint, shooting direction, lens perspective
4. CURRENT FINISHES: floor, wall, ceiling materials (these will be replaced)

Write concisely in 3-4 sentences. Focus on spatial structure that must be preserved in renovation.`,
          },
        ],
      },
    ],
    max_tokens: 400,
  });

  return response.choices[0].message.content ?? "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 (optional): GPT-4o Vision — 참고 이미지 스타일 분석
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeReferenceStyle(referenceBase64: string, mimeType: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${referenceBase64}`,
              detail: "high",
            },
          },
          {
            type: "text",
            text: `Analyze this interior reference image for style inspiration only.

Extract:
1. COLOR PALETTE: dominant/accent colors, tone (warm/cool/dark/light)
2. MATERIALS: flooring, wall finish, upholstery, wood, metal accents
3. LIGHTING: warmth, intensity, key sources
4. MOOD: 3-5 adjectives

Output as 4-5 sentences. Be specific (e.g. "deep charcoal walls", "oak herringbone floor"). Do NOT describe layout or furniture positions.`,
          },
        ],
      },
    ],
    max_tokens: 250,
  });

  return response.choices[0].message.content ?? "";
}

// ─────────────────────────────────────────────────────────────────────────────
// 프롬프트 조합
// ─────────────────────────────────────────────────────────────────────────────
const AREA_MAP: Record<string, string> = {
  "거실": "living room",
  "주방/다이닝": "kitchen and dining area",
  "안방": "master bedroom",
  "작은방/자녀방": "secondary bedroom",
  "욕실/화장실": "bathroom",
  "현관": "entryway",
  "드레스룸/옷장": "walk-in closet",
  "서재/작업실": "home office",
  "발코니/베란다": "balcony",
  "다용도실": "utility room",
  "홀/객석": "main hall and seating area",
  "주방/조리공간": "kitchen and cooking area",
  "카운터/바": "counter and bar",
  "화장실": "restroom",
  "테라스/야외석": "terrace and outdoor seating",
  "외관/파사드": "exterior facade",
  "창고/보관실": "storage room",
  "대기공간": "waiting area",
  "직원 공간": "staff area",
  "개인 업무공간": "individual workstations",
  "회의실": "meeting room",
  "로비/리셉션": "lobby and reception",
  "탕비실/휴게공간": "break room",
  "임원실": "executive office",
  "시술 공간": "treatment area",
  "샴푸/세척 공간": "shampoo and wash area",
  "운동 공간": "workout area",
  "탈의실": "locker room",
  "샤워실/화장실": "shower and restroom",
  "영업/판매 공간": "retail sales floor",
  "쇼케이스/디스플레이": "display and showcase area",
  "카운터/계산대": "checkout counter",
  "피팅룸/탈의실": "fitting room",
};

function buildPrompt(data: {
  spaceType: string;
  area: string;
  renovationAreas: string[];
  renovationNote: string;
  additionalRequest: string;
  structureAnalysis: string;
  referenceStyleBrief?: string | null;
}): string {
  const space = SPACE_MAP[data.spaceType] ?? data.spaceType ?? "interior space";
  const areaSize = data.area ? `${data.area}sqm ` : "";
  const renovationList = data.renovationAreas.length > 0
    ? mapList(data.renovationAreas, AREA_MAP)
    : "entire space";
  const layoutNote = data.renovationNote?.trim()
    ? `Layout changes requested: ${data.renovationNote}.`
    : "";
  const additional = data.additionalRequest?.trim()
    ? `Additional requirements: ${data.additionalRequest}.`
    : "";
  const refStyle = data.referenceStyleBrief?.trim()
    ? `\nSTYLE REFERENCE (color/material/mood only):\n${data.referenceStyleBrief}`
    : "";

  return `Renovate this ${areaSize}${space} into a photorealistic interior design proposal. Keep the exact same room structure, dimensions, windows, doors and camera angle unless layout changes are explicitly requested below.

SPACE STRUCTURE (preserve exactly unless noted):
${data.structureAnalysis}

RENOVATION SCOPE:
- Areas to renovate: ${renovationList}
- Apply modern, clean, professional interior design
${layoutNote}
${additional}${refStyle}

Output: Photorealistic DSLR interior photography. Real materials with natural texture. Professional architectural photography quality.`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3: gpt-image-1 images.edit — SDK 우회하여 fetch로 직접 호출
// (OpenAI SDK 6.x가 client-side에서 gpt-image-1을 잘못 차단하므로)
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithImageEdit(
  imageBuffer: Buffer,
  imageMime: string,
  prompt: string
): Promise<string> {
  const formData = new FormData();

  // 파일 Blob 생성 (실제 MIME 타입 그대로 사용)
  const imageBlob = new Blob([new Uint8Array(imageBuffer)], { type: imageMime });
  const ext = imageMime.includes("png") ? "png" : imageMime.includes("webp") ? "webp" : "jpg";
  formData.append("image", imageBlob, `space.${ext}`);
  formData.append("model", "gpt-image-1");
  formData.append("prompt", prompt);
  formData.append("n", "1");
  formData.append("size", "1024x1024");

  const res = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI images.edit 실패 (${res.status}): ${errText.slice(0, 300)}`);
  }

  const json = await res.json() as { data?: Array<{ b64_json?: string }> };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("b64_json 응답 없음");
  return b64;
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/generate-interior
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const renovationAreas: string[] = JSON.parse((formData.get("renovationAreas") as string) || "[]");
    const renovationNote = (formData.get("renovationNote") as string) || "";
    const additionalRequest = (formData.get("additionalRequest") as string) || "";
    const spaceType = (formData.get("spaceType") as string) || "";
    const area = (formData.get("area") as string) || "";
    const budget = (formData.get("budget") as string) || "";

    const spacePhotoFile = formData.get("spacePhoto") as File | null;
    const referenceImageFile = formData.get("referenceImage") as File | null;

    const hasSpacePhoto = !!(spacePhotoFile && spacePhotoFile.size > 0);
    const hasReferenceImage = !!(referenceImageFile && referenceImageFile.size > 0);

    if (!hasSpacePhoto) {
      return NextResponse.json(
        { error: "현재 공간 사진이 필요합니다." },
        { status: 400 }
      );
    }

    const spaceBuffer = Buffer.from(await spacePhotoFile!.arrayBuffer());
    const spacePhotoBase64 = spaceBuffer.toString("base64");
    const spaceMime = spacePhotoFile!.type || "image/jpeg";

    let referencePhotoBase64: string | null = null;
    let referenceMime = "image/jpeg";
    if (hasReferenceImage) {
      const buf = Buffer.from(await referenceImageFile!.arrayBuffer());
      referencePhotoBase64 = buf.toString("base64");
      referenceMime = referenceImageFile!.type || "image/jpeg";
    }

    // Step 1: 공간 구조 분석
    console.log("[generate-interior] Step 1: 공간 구조 분석...");
    const structureAnalysis = await analyzeSpaceStructure(spacePhotoBase64, spaceMime);
    console.log("[generate-interior] Step 1 완료:", structureAnalysis.slice(0, 80));

    // Step 2: 참고 이미지 스타일 분석 (선택)
    let referenceStyleBrief: string | null = null;
    if (hasReferenceImage && referencePhotoBase64) {
      console.log("[generate-interior] Step 2: 참고 이미지 스타일 분석...");
      referenceStyleBrief = await analyzeReferenceStyle(referencePhotoBase64, referenceMime);
      console.log("[generate-interior] Step 2 완료");
    }

    // Step 3: gpt-image-1 images.edit (실제 사진 입력 → 고품질 리노베이션)
    const prompt = buildPrompt({
      spaceType, area, renovationAreas, renovationNote,
      additionalRequest, structureAnalysis, referenceStyleBrief,
    });

    console.log("[generate-interior] Step 3: gpt-image-1 images.edit 호출 중...");
    const imageBase64 = await generateWithImageEdit(spaceBuffer, spaceMime, prompt);
    console.log("[generate-interior] 완료! 이미지 생성 성공");

    return NextResponse.json({
      imageBase64,
      debug: {
        model: "gpt-image-1",
        mode: "edit (fetch direct)",
        apiCallCount: hasReferenceImage ? 3 : 2,
        hasSpacePhoto,
        hasReferenceImage,
        structureAnalysis,
        referenceStyleBrief: referenceStyleBrief ?? null,
        prompt,
        inputs: { spaceType, area, budget, renovationAreas, renovationNote, additionalRequest },
      },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    console.error("[generate-interior] Error:", error.message);
    return NextResponse.json(
      { error: `이미지 생성 실패: ${error.message ?? "알 수 없는 오류"}` },
      { status: 500 }
    );
  }
}
