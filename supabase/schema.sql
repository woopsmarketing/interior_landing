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
