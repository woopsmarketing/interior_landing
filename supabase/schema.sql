-- ============================================================
-- 인테리어모아 Supabase 스키마
-- Supabase SQL Editor에서 전체 실행
-- ============================================================

-- ── 1. 견적 요청 테이블 ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'received',       -- received | matching | quoted

  -- Step 1
  space_type TEXT DEFAULT '',
  region TEXT DEFAULT '',
  area TEXT DEFAULT '',
  area_unknown BOOLEAN DEFAULT FALSE,
  current_condition TEXT DEFAULT '',
  building_age TEXT DEFAULT '',

  -- Step 2
  construction_scope TEXT DEFAULT '',
  desired_timing TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  construction_purpose TEXT DEFAULT '',
  schedule_flexibility TEXT DEFAULT '',
  occupancy_during_work TEXT DEFAULT '',

  -- Step 3
  renovation_areas JSONB DEFAULT '[]',
  renovation_note TEXT DEFAULT '',

  -- Step 4
  additional_request TEXT DEFAULT '',
  space_photo_url TEXT,
  reference_image_url TEXT,
  generated_image_url TEXT,
  has_space_photo BOOLEAN DEFAULT FALSE,
  has_reference_image BOOLEAN DEFAULT FALSE,
  has_generated_image BOOLEAN DEFAULT FALSE,

  -- Step 5
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  contact_method JSONB DEFAULT '[]',
  available_time JSONB DEFAULT '[]',
  agree_privacy BOOLEAN DEFAULT FALSE,
  agree_consult BOOLEAN DEFAULT FALSE,
  agree_marketing BOOLEAN DEFAULT FALSE,

  -- 관리자
  admin_note TEXT DEFAULT ''
);

-- RLS 비활성화 (MVP — 추후 인증 도입 시 활성화)
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

-- ── 2. 푸시 구독 테이블 ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  submission_id TEXT REFERENCES submissions(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  customer_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE push_subscriptions DISABLE ROW LEVEL SECURITY;

-- ── 3. Storage 버킷 생성 ────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('interior-images', 'interior-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책: 누구나 읽기 가능 (public 버킷)
CREATE POLICY "public read interior-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'interior-images');

-- Storage 정책: 누구나 업로드 가능 (서버에서만 호출)
CREATE POLICY "anon upload interior-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'interior-images');

-- Storage 정책: 누구나 삭제/갱신 가능 (서버에서만 호출)
CREATE POLICY "anon update interior-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'interior-images');

-- ── 4. 업체 테이블 ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  -- 인증
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  -- 기본 정보
  company_name TEXT NOT NULL,
  representative_name TEXT,
  business_number TEXT,
  founded_year INTEGER,
  employee_count TEXT,
  phone TEXT,
  website_url TEXT,
  instagram_url TEXT,
  blog_url TEXT,
  -- 서비스 정보
  service_regions JSONB DEFAULT '[]',
  specialties JSONB DEFAULT '[]',
  preferred_styles JSONB DEFAULT '[]',
  min_budget INTEGER,
  max_budget INTEGER,
  min_area INTEGER,
  max_area INTEGER,
  -- 경력/신뢰
  total_projects INTEGER DEFAULT 0,
  years_in_business INTEGER,
  certifications JSONB DEFAULT '[]',
  warranty_period TEXT,
  warranty_description TEXT,
  -- 소개 콘텐츠
  introduction TEXT,
  strengths JSONB DEFAULT '[]',
  logo_url TEXT,
  main_image_url TEXT,
  intro_video_url TEXT,
  -- 상태
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE companies DISABLE ROW LEVEL SECURITY;

-- ── 5. 포트폴리오 테이블 ───────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  space_type TEXT,
  style TEXT,
  area TEXT,
  budget TEXT,
  region TEXT,
  duration TEXT,
  image_urls JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE portfolios DISABLE ROW LEVEL SECURITY;

-- ── 6. 업체 견적 응답 테이블 ───────────────────────────────
CREATE TABLE IF NOT EXISTS company_responses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  message TEXT,
  estimated_price TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, submission_id)
);

ALTER TABLE company_responses DISABLE ROW LEVEL SECURITY;

-- ── 7. 피드백/문의 테이블 ─────────────────────────────────
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

-- ── 8. 업체 에셋 Storage 버킷 ─────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "company-assets-anon-upload" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'company-assets');
CREATE POLICY "company-assets-anon-read" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'company-assets');
