/**
 * 잘못 저장된 JSONB 문자열을 올바른 배열로 수정 +
 * picsum.photos URL을 Unsplash URL로 교체
 * 실행: node scripts/fix-jsonb-data.mjs
 */

const SUPABASE_URL = "https://ctmkdkhcvfxyigeswlwr.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bWtka2hjdmZ4eWlnZXN3bHdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzYxMzA0NywiZXhwIjoyMDg5MTg5MDQ3fQ.dac7WbLGaGcC1Im2ZVsILszgjz_XotuUKwQoH8aCiQU";

const headers = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

// companies.main_image_url 교체용
const MAIN_IMAGE_URL =
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=600&fit=crop";

// 포트폴리오별 Unsplash 이미지 (각 10장)
// 순서: 강남 아파트 / 마포 카페 / 판교 원룸 / 서초 신혼 / 용산 복층
const PORTFOLIO_IMAGE_SETS = [
  // 포트폴리오 1 — 강남 아파트 (모던 미니멀)
  [
    "photo-1616486338812-3dadae4b4ace",
    "photo-1600210492486-724fe5c67fb3",
    "photo-1556909114-f6e7ad7d3136",
    "photo-1600607687939-ce8a6c25118c",
    "photo-1600585154340-be6161a56a0c",
    "photo-1560448204-e02f11c3d0e2",
    "photo-1586023492125-27b2c045efd7",
    "photo-1556912173-3bb406ef7e77",
    "photo-1600566753190-17f0baa2a6c0",
    "photo-1554995207-c18c203602cb",
  ],
  // 포트폴리오 2 — 마포 카페 (내추럴 빈티지)
  [
    "photo-1493809842364-78817add7ffb",
    "photo-1600566753086-00f18fb6b3ea",
    "photo-1540518614846-7eded433c457",
    "photo-1522708323590-d24dbb6b0267",
    "photo-1600210491892-ed2e1d478943",
    "photo-1615529182904-14819c35db37",
    "photo-1560185893-a55cbc8c57e8",
    "photo-1616627977160-2e0f7c1a3b53",
    "photo-1614846384571-1e31322ed3a9",
    "photo-1567225557594-88d73e55f2cb",
  ],
  // 포트폴리오 3 — 판교 원룸 (스칸디나비안 미니멀)
  [
    "photo-1600573472591-ee6b68d14c68",
    "photo-1507652313519-d4e9174996dd",
    "photo-1595514535215-95a10e0c07c4",
    "photo-1616137466211-f939a420be84",
    "photo-1604709177225-055f99402ea3",
    "photo-1618219908412-a29a1bb7b86b",
    "photo-1597218868981-1b68e15f0065",
    "photo-1600121848594-d8644e57abab",
    "photo-1560185127-6ed189bf02f4",
    "photo-1517502884422-41eaead166d4",
  ],
  // 포트폴리오 4 — 서초 신혼 (모던 내추럴)
  [
    "photo-1590381105924-c72589b9ef3f",
    "photo-1592928302636-c83cf1e1c887",
    "photo-1559599238-308793637427",
    "photo-1564540586988-aa4e53ab3394",
    "photo-1555041469-a586c61ea9bc",
    "photo-1595428774223-ef52624120d2",
    "photo-1565538810643-b5bdb714032a",
    "photo-1600489000022-c2086d79f9d4",
    "photo-1560440021-33f9b867899d",
    "photo-1574180045827-780bbf9e945d",
  ],
  // 포트폴리오 5 — 용산 복층 (모던 인더스트리얼)
  [
    "photo-1613575831056-0acd5da8f085",
    "photo-1600210491369-e753d80a41f3",
    "photo-1615873968403-89e068629265",
    "photo-1560185008-a33f5c7b1844",
    "photo-1583847268964-b28dc8f51f92",
    "photo-1617104551722-3b2d51366400",
    "photo-1571508601891-ca5e7a713859",
    "photo-1560449752-3fd4bdbe7df0",
    "photo-1618221195710-dd6b41faaea6",
    "photo-1616486338812-3dadae4b4ace",
  ],
];

function makeUnsplashUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?w=800&h=600&fit=crop`;
}

function parseIfString(v) {
  if (!v) return v;
  if (typeof v === "string") {
    try { return JSON.parse(v); } catch { return v; }
  }
  return v;
}

function hasPicsum(value) {
  if (!value) return false;
  if (typeof value === "string") return value.includes("picsum.photos");
  if (Array.isArray(value)) return value.some((v) => typeof v === "string" && v.includes("picsum.photos"));
  return false;
}

async function main() {
  // 1. 업체 조회
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/companies?email=eq.test@moahome.kr&select=id,service_regions,specialties,preferred_styles,certifications,strengths,main_image_url`,
    { headers }
  );
  const companies = await res.json();
  if (!companies[0]) { console.log("업체 없음"); return; }

  const company = companies[0];

  // JSONB 파싱 + main_image_url picsum 교체
  const updates = {
    service_regions: parseIfString(company.service_regions),
    specialties: parseIfString(company.specialties),
    preferred_styles: parseIfString(company.preferred_styles),
    certifications: parseIfString(company.certifications),
    strengths: parseIfString(company.strengths),
  };

  if (hasPicsum(company.main_image_url)) {
    updates.main_image_url = MAIN_IMAGE_URL;
    console.log("  main_image_url: picsum → Unsplash 교체");
  }

  const patch = await fetch(
    `${SUPABASE_URL}/rest/v1/companies?id=eq.${company.id}`,
    {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify(updates),
    }
  );
  console.log(`companies JSONB + 이미지 수정 완료 (${patch.status})`);

  // 2. 포트폴리오 이미지 수정
  const pRes = await fetch(
    `${SUPABASE_URL}/rest/v1/portfolios?company_id=eq.${company.id}&select=id,image_urls&order=created_at.asc`,
    { headers }
  );
  const portfolios = await pRes.json();

  for (let i = 0; i < portfolios.length; i++) {
    const p = portfolios[i];
    let imageUrls = parseIfString(p.image_urls);

    // picsum URL이 포함된 경우 해당 포트폴리오 세트로 교체
    if (hasPicsum(imageUrls)) {
      const imageSet = PORTFOLIO_IMAGE_SETS[i] || PORTFOLIO_IMAGE_SETS[0];
      imageUrls = imageSet.map(makeUnsplashUrl);
      console.log(`  portfolio ${i + 1}: picsum → Unsplash ${imageUrls.length}장 교체`);
    }

    const pp = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolios?id=eq.${p.id}`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({ image_urls: imageUrls }),
      }
    );
    console.log(`portfolio ${p.id.slice(0, 8)} 수정 완료 (${pp.status})`);
  }

  console.log("\n완료!");
}

main().catch(console.error);
