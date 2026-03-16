import { randomBytes, pbkdf2Sync, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";

const COMPANY_SECRET =
  process.env.COMPANY_SECRET || process.env.ADMIN_SECRET || "company-default-secret";

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return timingSafeEqual(Buffer.from(derived), Buffer.from(hash));
}

export function generateCompanyToken(companyId: string): string {
  const timestamp = Date.now().toString();
  const payload = `${companyId}:${timestamp}`;
  const signature = createHmac("sha256", COMPANY_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

export function verifyCompanyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const [companyId, timestamp, signature] = decoded.split(":");
    const expected = createHmac("sha256", COMPANY_SECRET)
      .update(`${companyId}:${timestamp}`)
      .digest("hex");
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    // Token expires in 7 days
    if (Date.now() - parseInt(timestamp) > 7 * 24 * 60 * 60 * 1000) return null;
    return companyId;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAuthenticatedCompany(): Promise<any | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("company_token")?.value;
  if (!token) return null;
  const companyId = verifyCompanyToken(token);
  if (!companyId) return null;
  const { data } = await supabaseAdmin
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();
  return data;
}
