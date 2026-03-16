import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 클라이언트 사이드 (공개)
export const supabase = createClient(url, anonKey);

// 서버 사이드 전용 (API 라우트에서만 사용)
export const supabaseAdmin = createClient(url, serviceKey ?? anonKey);
