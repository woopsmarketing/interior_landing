import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Vercel 함수 타임아웃 설정 (최대 300초)
export const maxDuration = 120;

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

// 한국어 → 영어 매핑
const STYLE_MAP: Record<string, string> = {
  "미니멀": "minimal",
  "모던": "modern",
  "북유럽": "Scandinavian",
  "빈티지": "vintage",
  "내추럴": "natural",
  "클래식": "classic",
  "인더스트리얼": "industrial",
  "럭셔리": "luxury",
};

const ATMOSPHERE_MAP: Record<string, string> = {
  "따뜻한": "warm and cozy",
  "시원한": "cool and bright",
  "아늑한": "snug and intimate",
  "개방적인": "open and airy",
  "차분한": "calm and serene",
  "활기찬": "vibrant and energetic",
};

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
// 최종 프롬프트 조합
// ─────────────────────────────────────────────────────────────────────────────
function buildPrompt(data: {
  spaceType: string;
  area: string;
  preferredStyles: string[];
  preferredAtmosphere: string;
  additionalRequest: string;
  structureAnalysis: string;
  referenceStyleBrief?: string | null;
}): string {
  const space = SPACE_MAP[data.spaceType] ?? data.spaceType ?? "interior space";
  const styles = mapList(data.preferredStyles, STYLE_MAP) || "modern";
  const atmosphere = ATMOSPHERE_MAP[data.preferredAtmosphere] ?? data.preferredAtmosphere ?? "balanced";
  const area = data.area ? `${data.area}sqm ` : "";
  const additional = data.additionalRequest?.trim()
    ? `Special requirements: ${data.additionalRequest}.`
    : "";
  const refStyle = data.referenceStyleBrief?.trim()
    ? `\nSTYLE REFERENCE (color/material/mood only — do not copy layout):\n${data.referenceStyleBrief}`
    : "";

  return `Photorealistic interior renovation proposal photo of a ${area}${space}. Shot with DSLR camera, architectural photography style.

SPACE STRUCTURE (preserve exactly — same room dimensions, windows, doors, ceiling height):
${data.structureAnalysis}

DESIGN:
- Style: ${styles}
- Atmosphere: ${atmosphere}
- ${additional}${refStyle}

Requirements: Photorealistic, not a 3D render. Real materials with natural texture. Consistent lighting. Same camera angle as described. Professional interior photography quality.`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/generate-interior
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const preferredStyles: string[] = JSON.parse((formData.get("preferredStyles") as string) || "[]");
    const preferredAtmosphere = (formData.get("preferredAtmosphere") as string) || "";
    const additionalRequest = (formData.get("additionalRequest") as string) || "";
    const spaceType = (formData.get("spaceType") as string) || "";
    const area = (formData.get("area") as string) || "";
    const budget = (formData.get("budget") as string) || "";
    const priorities: string[] = JSON.parse((formData.get("priorities") as string) || "[]");

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

    // 이미지 → Buffer + base64 (실제 MIME 타입 사용)
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
    console.log("[generate-interior] Step 1 완료");

    // Step 2: 참고 이미지 스타일 분석 (선택)
    let referenceStyleBrief: string | null = null;
    if (hasReferenceImage && referencePhotoBase64) {
      console.log("[generate-interior] Step 2: 참고 이미지 스타일 분석...");
      referenceStyleBrief = await analyzeReferenceStyle(referencePhotoBase64, referenceMime);
      console.log("[generate-interior] Step 2 완료");
    }

    // Step 3: 프롬프트 조합 + 이미지 생성 (gpt-image-1 via images.generate)
    const prompt = buildPrompt({
      spaceType, area, preferredStyles,
      preferredAtmosphere, additionalRequest,
      structureAnalysis, referenceStyleBrief,
    });

    console.log("[generate-interior] Step 3: 이미지 생성 중...");
    const result = await getClient().images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      console.error("[generate-interior] b64_json 없음:", result);
      return NextResponse.json({ error: "이미지 생성에 실패했습니다." }, { status: 500 });
    }

    console.log("[generate-interior] 완료!");
    return NextResponse.json({
      imageBase64,
      debug: {
        model: "gpt-image-1",
        mode: "generate",
        apiCallCount: hasReferenceImage ? 3 : 2,
        hasSpacePhoto,
        hasReferenceImage,
        structureAnalysis,
        referenceStyleBrief: referenceStyleBrief ?? null,
        prompt,
        inputs: { spaceType, area, budget, priorities, preferredStyles, preferredAtmosphere, additionalRequest },
      },
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    console.error("[generate-interior] Error:", error.status, error.message);
    return NextResponse.json(
      { error: `이미지 생성 실패: ${error.message ?? "알 수 없는 오류"}` },
      { status: 500 }
    );
  }
}
