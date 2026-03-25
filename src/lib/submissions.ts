import sharp from "sharp";
import { supabaseAdmin as supabase } from "./supabase";

export interface SubmissionData {
  id: string;
  createdAt: string;
  status: string;
  // Step 1
  spaceType: string;
  region: string;
  regionDetail: string;
  buildingName: string;
  area: string;
  areaUnknown: boolean;
  currentCondition: string;
  buildingAge: string;
  // Step 2
  constructionScope: string;
  desiredTiming: string;
  budget: string;
  constructionPurpose: string;
  scheduleFlexibility: string;
  occupancyDuringWork: string;
  // Step 3
  renovationAreas: string[];
  renovationNote: string;
  // Step 4
  additionalRequest: string;
  spacePhotoUrl: string | null;
  referenceImageUrl: string | null;
  generatedImageUrl: string | null;
  hasSpacePhoto: boolean;
  hasReferenceImage: boolean;
  hasGeneratedImage: boolean;
  // Step 5
  name: string;
  phone: string;
  email: string;
  contactMethod: string[];
  availableTime: string[];
  agreePrivacy: boolean;
  agreeConsult: boolean;
  agreeMarketing: boolean;
  // Admin
  adminNote: string;
}

// DB row → SubmissionData
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: any): SubmissionData {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status ?? "received",
    spaceType: row.space_type ?? "",
    region: row.region ?? "",
    regionDetail: row.region_detail ?? "",
    buildingName: row.building_name ?? "",
    area: row.area ?? "",
    areaUnknown: row.area_unknown ?? false,
    currentCondition: row.current_condition ?? "",
    buildingAge: row.building_age ?? "",
    constructionScope: row.construction_scope ?? "",
    desiredTiming: row.desired_timing ?? "",
    budget: row.budget ?? "",
    constructionPurpose: row.construction_purpose ?? "",
    scheduleFlexibility: row.schedule_flexibility ?? "",
    occupancyDuringWork: row.occupancy_during_work ?? "",
    renovationAreas: row.renovation_areas ?? [],
    renovationNote: row.renovation_note ?? "",
    additionalRequest: row.additional_request ?? "",
    spacePhotoUrl: row.space_photo_url ?? null,
    referenceImageUrl: row.reference_image_url ?? null,
    generatedImageUrl: row.generated_image_url ?? null,
    hasSpacePhoto: row.has_space_photo ?? false,
    hasReferenceImage: row.has_reference_image ?? false,
    hasGeneratedImage: row.has_generated_image ?? false,
    name: row.name ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    contactMethod: row.contact_method ?? [],
    availableTime: row.available_time ?? [],
    agreePrivacy: row.agree_privacy ?? false,
    agreeConsult: row.agree_consult ?? false,
    agreeMarketing: row.agree_marketing ?? false,
    adminNote: row.admin_note ?? "",
  };
}

function generateId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 8);
  return `${date}_${rand}`;
}

// 이미지를 WebP로 압축 (업로드 전 용량 절감)
async function compressToWebP(buffer: Buffer, quality = 82): Promise<Buffer> {
  try {
    return await sharp(buffer).webp({ quality }).toBuffer();
  } catch {
    // sharp 실패 시 원본 그대로 사용
    return buffer;
  }
}

async function uploadImage(
  id: string,
  buffer: Buffer,
  filename: string,
): Promise<string | null> {
  // .jpg / .png → .webp 변환
  const webpFilename = filename.replace(/\.(jpe?g|png)$/i, ".webp");
  const quality = filename.includes("generated") ? 88 : 82;
  const compressed = await compressToWebP(buffer, quality);

  const { error } = await supabase.storage
    .from("interior-images")
    .upload(`${id}/${webpFilename}`, compressed, { contentType: "image/webp", upsert: true });

  if (error) {
    console.error(`[storage] upload error (${webpFilename}):`, error.message);
    return null;
  }

  const { data } = supabase.storage
    .from("interior-images")
    .getPublicUrl(`${id}/${webpFilename}`);

  return data.publicUrl;
}

export async function saveSubmission(
  data: Omit<
    SubmissionData,
    "id" | "createdAt" | "status" | "hasSpacePhoto" | "hasReferenceImage" | "hasGeneratedImage" | "spacePhotoUrl" | "referenceImageUrl" | "generatedImageUrl" | "adminNote"
  >,
  images: {
    spacePhoto?: Buffer | null;
    referenceImage?: Buffer | null;
    generatedImage?: Buffer | null;
  }
): Promise<string> {
  const id = generateId();

  const [spacePhotoUrl, referenceImageUrl, generatedImageUrl] = await Promise.all([
    images.spacePhoto ? uploadImage(id, images.spacePhoto, "space.jpg") : null,
    images.referenceImage ? uploadImage(id, images.referenceImage, "reference.jpg") : null,
    images.generatedImage ? uploadImage(id, images.generatedImage, "generated.png") : null,
  ]);

  const { error } = await supabase.from("submissions").insert({
    id,
    status: "received",
    space_type: data.spaceType,
    region: data.region,
    region_detail: data.regionDetail,
    building_name: data.buildingName,
    area: data.area,
    area_unknown: data.areaUnknown,
    current_condition: data.currentCondition,
    building_age: data.buildingAge,
    construction_scope: data.constructionScope,
    desired_timing: data.desiredTiming,
    budget: data.budget,
    construction_purpose: data.constructionPurpose,
    schedule_flexibility: data.scheduleFlexibility,
    occupancy_during_work: data.occupancyDuringWork,
    renovation_areas: data.renovationAreas,
    renovation_note: data.renovationNote,
    additional_request: data.additionalRequest,
    space_photo_url: spacePhotoUrl,
    reference_image_url: referenceImageUrl,
    generated_image_url: generatedImageUrl,
    has_space_photo: !!spacePhotoUrl,
    has_reference_image: !!referenceImageUrl,
    has_generated_image: !!generatedImageUrl,
    name: data.name,
    phone: data.phone,
    email: data.email,
    contact_method: data.contactMethod,
    available_time: data.availableTime,
    agree_privacy: data.agreePrivacy,
    agree_consult: data.agreeConsult,
    agree_marketing: data.agreeMarketing,
    admin_note: "",
  });

  if (error) throw new Error(`[submissions] insert error: ${error.message}`);

  return id;
}

export async function saveGeneratedImage(id: string, imageBase64: string): Promise<void> {
  const buffer = Buffer.from(imageBase64, "base64");
  const url = await uploadImage(id, buffer, "generated.png");

  if (url) {
    await supabase
      .from("submissions")
      .update({ generated_image_url: url, has_generated_image: true })
      .eq("id", id);
  }
}

export async function listSubmissions(): Promise<SubmissionData[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[submissions] list error:", error.message);
    return [];
  }

  return (data ?? []).map(fromRow);
}

export async function getSubmission(id: string): Promise<SubmissionData | null> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return fromRow(data);
}

export async function updateSubmissionStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("submissions")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(`[submissions] update status error: ${error.message}`);
}

// 이미지는 이제 Storage URL로 직접 접근 — 하위 호환용 URL 반환
export async function getSubmissionImageUrl(
  id: string,
  type: "space" | "reference" | "generated"
): Promise<string | null> {
  const submission = await getSubmission(id);
  if (!submission) return null;

  if (type === "space") return submission.spacePhotoUrl;
  if (type === "reference") return submission.referenceImageUrl;
  return submission.generatedImageUrl;
}
