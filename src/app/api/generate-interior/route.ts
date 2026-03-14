import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
}

// 한국어 → 영어 매핑
const PRIORITY_MAP: Record<string, string> = {
  "가격": "cost-efficiency",
  "기간": "fast completion",
  "품질": "high quality craftsmanship",
  "디자인": "aesthetic design",
  "내구성": "durability",
  "친환경": "eco-friendly materials",
  "편의성": "functional convenience",
};

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
// Step 1: GPT-4o Vision — 공간 구조 분석 (FIXED / REMOVABLE 분류)
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeSpaceStructure(photoBase64: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${photoBase64}`,
              detail: "high",
            },
          },
          {
            type: "text",
            text: `You are a renovation planning assistant. Analyze this interior space photo and identify PERMANENT structural elements that will remain unchanged after renovation.

Extract and describe precisely:
1. ROOM GEOMETRY: exact shape, proportions, approximate dimensions (width × depth × height)
2. CEILING: height estimate, permanent structure type (exposed pipes/ducts, concrete slab, beams, cassette AC unit positions)
3. WALLS: positions of all walls, any columns or pillars, fixed openings (doors, windows) with locations
4. FLOOR LEVEL: any level changes, steps
5. CAMERA ANGLE: viewpoint position, lens perspective (wide/normal), shooting direction

Classify each element as FIXED (structural, cannot be removed) or REMOVABLE (finishes, non-structural).
Write as two short paragraphs:
- Paragraph 1: Fixed structural elements only (for preservation constraints)
- Paragraph 2: Current removable finishes (will be replaced in renovation)

Be precise and technical. Use spatial terms like "left wall", "rear center", "ceiling center".`,
          },
        ],
      },
    ],
    max_tokens: 600,
  });

  return response.choices[0].message.content ?? "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 (optional): GPT-4o Vision — 참고 이미지 스타일 분석
// 목적: 참고 이미지를 images.edit()에 직접 전달하지 않고 텍스트 스타일 브리프로 변환
//       → 구조 복사 없이 색상/재질/분위기만 프롬프트에 주입
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeReferenceStyle(referenceBase64: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${referenceBase64}`,
              detail: "high",
            },
          },
          {
            type: "text",
            text: `You are an interior design style analyst. Analyze this reference image and extract its visual style for use as INSPIRATION ONLY — not as a layout or structure to copy.

Extract and describe:
1. COLOR PALETTE: dominant colors, accent colors, overall tone (warm/cool/dark/light), saturation level
2. MATERIALS & TEXTURES: flooring material, wall finish, upholstery, wood treatments, metal accents
3. LIGHTING MOOD: warmth (kelvin feel), intensity (bright/dim/dramatic), key light sources visible
4. ATMOSPHERE: 3-5 adjectives that best describe the mood and feel

Output as a concise style brief (5-7 sentences). Be specific about colors (e.g., "deep charcoal walls", "burgundy velvet upholstery") rather than vague terms.
Do NOT describe the layout, room shape, or furniture positions — only style, color, and material language.`,
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  return response.choices[0].message.content ?? "";
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 1: 출력 타입 + 절대 제약 (항상 프롬프트 첫 번째)
// ─────────────────────────────────────────────────────────────────────────────
const CONSTRAINT_LAYER = `OUTPUT TYPE: Photorealistic commercial interior renovation proposal photo. \
This must look like a completed renovation photographed on-site with a DSLR camera — \
NOT a 3D render, NOT CGI, NOT an illustration, NOT an architectural visualization.

ABSOLUTE CONSTRAINTS (non-negotiable):
- GEOMETRY: Do not alter room dimensions, ceiling height, wall positions, or floor plan. Spatial proportions must match the original photo exactly.
- STRUCTURE: Preserve all permanent elements — structural columns, exposed pipes/ducts, ceiling-mounted AC units, fixed openings (doors, windows). These may be painted or trimmed but not removed or repositioned.
- SCALE: Furniture and fixtures must match the actual room volume. No exaggerated spatial expansion. No impossible architectural changes.
- MATERIALS: Use physically plausible materials — real wood grain with natural variation, actual tile with visible grout lines, fabric with natural texture and drape. No plastic-looking surfaces.
- LIGHTING: Match the realistic light level for the space size and concept. Warm ambient light is acceptable. No HDR-style over-illumination. No studio-bright artificial flatness.
- REALISM: No decorative excess, no fantasy props, no unbuilt structural elements. The result must be persuasive as an actual construction proposal.
- PERSPECTIVE: Maintain the exact same camera angle, viewpoint height, and lens perspective as the input photo.
- CAMERA SIMULATION: Render as if shot on a DSLR (Canon EOS R5, 16–24mm wide lens, ISO 800–1600, f/2.8, available light). Subtle natural grain, slight depth-of-field falloff in background, no post-processing filter look.`;

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 3: 디자인 콘셉트 조합
// referenceStyleBrief가 있으면 LAYER 3 하단에 참고 이미지 스타일 섹션 추가
// ─────────────────────────────────────────────────────────────────────────────
function buildDesignLayer(data: {
  spaceType: string;
  area: string;
  preferredStyles: string[];
  preferredAtmosphere: string;
  additionalRequest: string;
  referenceStyleBrief?: string | null;
}): string {
  const space = SPACE_MAP[data.spaceType] ?? data.spaceType ?? "commercial space";
  const styles = mapList(data.preferredStyles, STYLE_MAP) || "modern";
  const atmosphere = ATMOSPHERE_MAP[data.preferredAtmosphere] ?? data.preferredAtmosphere ?? "balanced";
  const area = data.area ? `${data.area}sqm ` : "";
  const additional = data.additionalRequest?.trim()
    ? `- Layout and design requirements: ${data.additionalRequest}.`
    : "";
  // 참고 이미지 스타일은 LAYER 3 하단에 별도 섹션으로 추가 — 레이아웃 복사 금지 명시
  const refBrief = data.referenceStyleBrief?.trim()
    ? `\nSTYLE INSPIRATION (from reference image — apply mood/color/material only, do NOT copy layout or structure):\n${data.referenceStyleBrief}`
    : "";

  return `DESIGN CONCEPT for ${area}${space}:
- Style direction: ${styles}
- Atmosphere: ${atmosphere}
${additional}${refBrief}`.trimEnd();
}

// ─────────────────────────────────────────────────────────────────────────────
// 최종 프롬프트 조합: LAYER 1 + LAYER 2(공간 구조) + LAYER 3(디자인 + 참고 스타일)
// ─────────────────────────────────────────────────────────────────────────────
function buildFinalPrompt(data: {
  spaceType: string;
  area: string;
  preferredStyles: string[];
  preferredAtmosphere: string;
  additionalRequest: string;
  structureAnalysis: string;
  referenceStyleBrief?: string | null;
}): string {
  const designLayer = buildDesignLayer(data);

  return [
    CONSTRAINT_LAYER,
    `ORIGINAL SPACE STRUCTURE (from photo analysis — preserve exactly):\n${data.structureAnalysis}`,
    designLayer,
  ].join("\n\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/generate-interior
//
// 파이프라인 (공간 사진 필수):
//   공간 사진 O + 참고 이미지 O → Step1 + Step2 + Step3 (API 3회)
//   공간 사진 O + 참고 이미지 X → Step1 + Step3 (API 2회)
//   공간 사진 X                  → 400 에러 반환 (파이프라인 미실행)
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const priorities: string[] = JSON.parse((formData.get("priorities") as string) || "[]");
    const preferredStyles: string[] = JSON.parse((formData.get("preferredStyles") as string) || "[]");
    const preferredAtmosphere = (formData.get("preferredAtmosphere") as string) || "";
    const additionalRequest = (formData.get("additionalRequest") as string) || "";
    const spaceType = (formData.get("spaceType") as string) || "";
    const area = (formData.get("area") as string) || "";
    const budget = (formData.get("budget") as string) || "";

    const spacePhotoFile = formData.get("spacePhoto") as File | null;
    const referenceImageFile = formData.get("referenceImage") as File | null;

    const hasSpacePhoto = !!(spacePhotoFile && spacePhotoFile.size > 0);
    const hasReferenceImage = !!(referenceImageFile && referenceImageFile.size > 0);

    // 공간 사진 없으면 파이프라인 전체 중단
    if (!hasSpacePhoto) {
      return NextResponse.json(
        { error: "현재 공간 사진이 필요합니다. 사진을 업로드해주세요." },
        { status: 400 }
      );
    }

    // 공간 사진 → Buffer + base64
    const spaceBuffer = Buffer.from(await spacePhotoFile!.arrayBuffer());
    const spacePhotoBase64 = spaceBuffer.toString("base64");

    // 참고 이미지 → base64 (있을 때만)
    let referencePhotoBase64: string | null = null;
    if (hasReferenceImage) {
      const referenceBuffer = Buffer.from(await referenceImageFile!.arrayBuffer());
      referencePhotoBase64 = referenceBuffer.toString("base64");
    }

    // ── Step 1: 공간 구조 분석 (항상 실행) ────────────────────────
    console.log("[generate-interior] Step 1: GPT-4o 공간 구조 분석...");
    const structureAnalysis = await analyzeSpaceStructure(spacePhotoBase64);
    console.log("[generate-interior] Step 1 완료:\n", structureAnalysis);

    // ── Step 2: 참고 이미지 스타일 분석 (참고 이미지 있을 때만) ────
    let referenceStyleBrief: string | null = null;
    if (hasReferenceImage && referencePhotoBase64) {
      console.log("[generate-interior] Step 2: GPT-4o 참고 이미지 스타일 분석...");
      referenceStyleBrief = await analyzeReferenceStyle(referencePhotoBase64);
      console.log("[generate-interior] Step 2 완료:\n", referenceStyleBrief);
    }

    // ── Step 3: 최종 프롬프트 조합 + 이미지 생성 ─────────────────
    const prompt = buildFinalPrompt({
      spaceType, area, preferredStyles,
      preferredAtmosphere, additionalRequest,
      structureAnalysis, referenceStyleBrief,
    });

    console.log("[generate-interior] Step 3: 이미지 생성...\n", prompt);

    const spaceFile = await toFile(spaceBuffer, "space.png", { type: "image/png" });
    const result = await getClient().images.edit({
      model: "gpt-image-1",
      image: spaceFile,
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json({ error: "이미지 생성에 실패했습니다." }, { status: 500 });
    }

    const debugInfo = {
      model: "gpt-image-1",
      mode: "edit",
      apiCallCount: hasReferenceImage ? 3 : 2,
      hasSpacePhoto,
      hasReferenceImage,
      structureAnalysis,
      referenceStyleBrief: referenceStyleBrief ?? null,
      prompt,
      inputs: { spaceType, area, budget, priorities, preferredStyles, preferredAtmosphere, additionalRequest },
    };

    console.log("[generate-interior] 완료. API 호출 횟수:", debugInfo.apiCallCount);
    return NextResponse.json({ imageBase64, debug: debugInfo });
  } catch (err) {
    console.error("[generate-interior] Error:", err);
    return NextResponse.json({ error: "이미지 생성에 실패했습니다." }, { status: 500 });
  }
}
