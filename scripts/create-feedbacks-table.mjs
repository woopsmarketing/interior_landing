/**
 * feedbacks 테이블 생성 스크립트
 * 실행: node scripts/create-feedbacks-table.mjs
 *
 * Supabase Dashboard > SQL Editor에서 직접 실행해도 됩니다:
 */

const SQL = `
CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL DEFAULT '',
  company_email TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('feedback', 'inquiry')),
  category TEXT DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image_urls JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'resolved')),
  admin_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feedbacks DISABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_feedbacks_type ON feedbacks(type);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);
`;

console.log("아래 SQL을 Supabase Dashboard > SQL Editor에서 실행해주세요:\n");
console.log("━".repeat(60));
console.log(SQL);
console.log("━".repeat(60));

// Supabase REST API로는 DDL 실행이 안 되므로 안내만 출력
console.log("\n또는 Supabase Dashboard > SQL Editor에서 실행하세요:");
console.log("https://supabase.com/dashboard/project/ctmkdkhcvfxyigeswlwr/sql/new");
