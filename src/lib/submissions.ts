import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "submissions");
const IMAGES_DIR = path.join(process.cwd(), "data", "images");

export interface SubmissionData {
  id: string;
  createdAt: string;
  // Step 1
  spaceType: string;
  region: string;
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
  priorities: string[];
  preferredStyles: string[];
  preferredAtmosphere: string;
  currentProblems: string[];
  // Step 4
  additionalRequest: string;
  hasSpacePhoto: boolean;
  hasReferenceImage: boolean;
  // Step 5
  name: string;
  phone: string;
  email: string;
  contactMethod: string[];
  availableTime: string[];
  agreePrivacy: boolean;
  agreeConsult: boolean;
  agreeMarketing: boolean;
  // AI
  hasGeneratedImage: boolean;
}

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });
}

function generateId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 8);
  return `${date}_${rand}`;
}

export async function saveSubmission(
  data: Omit<SubmissionData, "id" | "createdAt" | "hasSpacePhoto" | "hasReferenceImage" | "hasGeneratedImage">,
  images: {
    spacePhoto?: Buffer | null;
    referenceImage?: Buffer | null;
    generatedImage?: Buffer | null;
  }
): Promise<string> {
  await ensureDirs();

  const id = generateId();
  const imageDir = path.join(IMAGES_DIR, id);
  await fs.mkdir(imageDir, { recursive: true });

  const hasSpacePhoto = !!images.spacePhoto;
  const hasReferenceImage = !!images.referenceImage;
  const hasGeneratedImage = !!images.generatedImage;

  // 이미지 파일 저장
  if (images.spacePhoto) {
    await fs.writeFile(path.join(imageDir, "space.jpg"), images.spacePhoto);
  }
  if (images.referenceImage) {
    await fs.writeFile(path.join(imageDir, "reference.jpg"), images.referenceImage);
  }
  if (images.generatedImage) {
    await fs.writeFile(path.join(imageDir, "generated.png"), images.generatedImage);
  }

  const submission: SubmissionData = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    hasSpacePhoto,
    hasReferenceImage,
    hasGeneratedImage,
  };

  await fs.writeFile(
    path.join(DATA_DIR, `${id}.json`),
    JSON.stringify(submission, null, 2),
    "utf-8"
  );

  return id;
}

export async function saveGeneratedImage(id: string, imageBase64: string): Promise<void> {
  const imageDir = path.join(IMAGES_DIR, id);
  await fs.mkdir(imageDir, { recursive: true });
  const buffer = Buffer.from(imageBase64, "base64");
  await fs.writeFile(path.join(imageDir, "generated.png"), buffer);

  // submission JSON 업데이트
  const filePath = path.join(DATA_DIR, `${id}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as SubmissionData;
    data.hasGeneratedImage = true;
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // submission 파일이 없으면 무시
  }
}

export async function listSubmissions(): Promise<SubmissionData[]> {
  await ensureDirs();

  const files = await fs.readdir(DATA_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const submissions: SubmissionData[] = [];
  for (const file of jsonFiles) {
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
      submissions.push(JSON.parse(raw));
    } catch {
      // 파싱 실패 시 무시
    }
  }

  // 최신 순 정렬
  submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return submissions;
}

export async function getSubmission(id: string): Promise<SubmissionData | null> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${id}.json`), "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getSubmissionImage(
  id: string,
  type: "space" | "reference" | "generated"
): Promise<Buffer | null> {
  const filename = type === "space" ? "space.jpg" : type === "reference" ? "reference.jpg" : "generated.png";
  try {
    return await fs.readFile(path.join(IMAGES_DIR, id, filename));
  } catch {
    return null;
  }
}
