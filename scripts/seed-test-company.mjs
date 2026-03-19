/**
 * 테스트 업체 + 포트폴리오 시드 스크립트
 * 실행: node scripts/seed-test-company.mjs
 */

import { randomBytes, pbkdf2Sync } from "crypto";

const SUPABASE_URL = "https://ctmkdkhcvfxyigeswlwr.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bWtka2hjdmZ4eWlnZXN3bHdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzYxMzA0NywiZXhwIjoyMDg5MTg5MDQ3fQ.dac7WbLGaGcC1Im2ZVsILszgjz_XotuUKwQoH8aCiQU";

const headers = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

// Unsplash 인테리어 이미지 세트 (seed별로 다른 이미지 반환)
const UNSPLASH_IMAGE_SETS = {
  "apt-gangnam": [
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
  "cafe-mapo": [
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
  "studio-pangyo": [
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
  "apt-seocho": [
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
  "house-yongsan": [
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
};

// 폴백: 알려지지 않은 seed에 사용할 기본 이미지 목록
const FALLBACK_IMAGES = [
  "photo-1618221195710-dd6b41faaea6",
  "photo-1616486338812-3dadae4b4ace",
  "photo-1600210492486-724fe5c67fb3",
  "photo-1556909114-f6e7ad7d3136",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600585154340-be6161a56a0c",
  "photo-1560448204-e02f11c3d0e2",
  "photo-1586023492125-27b2c045efd7",
  "photo-1556912173-3bb406ef7e77",
  "photo-1600566753190-17f0baa2a6c0",
];

function makeImages(seed, count = 10) {
  const set = UNSPLASH_IMAGE_SETS[seed] || FALLBACK_IMAGES;
  return set.slice(0, count).map(
    (id) => `https://images.unsplash.com/${id}?w=800&h=600&fit=crop`
  );
}

async function supabaseInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${table} insert 실패: ${err}`);
  }
  return await res.json();
}

async function main() {
  console.log("🌱 테스트 업체 데이터 시드 시작...\n");

  // 1. 업체 등록
  const { hash, salt } = hashPassword("test1234");

  const companyData = {
    email: "test@moahome.kr",
    password_hash: hash,
    salt,
    company_name: "모아 인테리어",
    representative_name: "김모아",
    business_number: "123-45-67890",
    founded_year: 2018,
    employee_count: "5-10명",
    phone: "010-1234-5678",
    website_url: "https://moahome.kr",
    instagram_url: "https://instagram.com/moainterior",
    service_regions: ["서울", "경기", "인천"],
    specialties: ["아파트", "주거공간", "상업공간"],
    preferred_styles: ["모던", "미니멀", "스칸디나비안"],
    min_budget: 1000,
    max_budget: 10000,
    min_area: 10,
    max_area: 100,
    total_projects: 47,
    years_in_business: 7,
    certifications: ["실내건축기사", "인테리어디자인 자격증"],
    warranty_period: "2년",
    warranty_description: "시공 후 2년간 하자 발생 시 무상 A/S 보증",
    introduction:
      "7년간 서울/경기 지역 500여 가구를 시공한 경험을 바탕으로 고객 맞춤형 인테리어를 제공합니다. 모던하고 실용적인 공간을 합리적인 가격으로 완성해드립니다.",
    strengths: [
      "공사 기간 100% 준수",
      "투명한 견적서 제공",
      "24시간 고객 응대",
      "협력 업체 직영 운영으로 중간 비용 절감",
    ],
    main_image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=600&fit=crop",
    status: "approved",
  };

  let company;
  try {
    const result = await supabaseInsert("companies", companyData);
    company = Array.isArray(result) ? result[0] : result;
    console.log(`✅ 업체 등록 완료: ${company.company_name} (ID: ${company.id})`);
  } catch (err) {
    if (err.message.includes("duplicate") || err.message.includes("unique")) {
      console.log("⚠️  이미 존재하는 이메일 — 기존 업체 조회 중...");
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/companies?email=eq.test@moahome.kr&select=id,company_name`,
        { headers }
      );
      const rows = await res.json();
      if (!rows[0]) throw new Error("기존 업체 조회 실패");
      company = rows[0];
      console.log(`✅ 기존 업체 사용: ${company.company_name} (ID: ${company.id})`);
    } else {
      throw err;
    }
  }

  // 2. 포트폴리오 5개 생성
  const portfolios = [
    {
      title: "강남구 아파트 33평 풀패키지 리모델링",
      description:
        "거실, 주방, 침실 2개, 욕실 2개를 모두 새단장. 오래된 아파트를 모던 미니멀 스타일로 완전히 탈바꿈시킨 프로젝트입니다. 화이트&그레이 베이스에 포인트 컬러를 활용해 세련된 공간을 완성했습니다.",
      space_type: "아파트",
      style: "모던 미니멀",
      area: "33평",
      budget: "4,500만원",
      region: "서울 강남구",
      duration: "5주",
      image_urls: makeImages("apt-gangnam", 10),
    },
    {
      title: "마포구 카페 인테리어 — 50석 규모",
      description:
        "브런치 카페를 위한 내추럴 우드 감성 인테리어. 빈티지 조명과 식물을 활용해 아늑한 분위기를 연출했습니다. 테이블 배치부터 포스 카운터, 주방 동선까지 철저히 계획된 프로젝트입니다.",
      space_type: "카페/상업공간",
      style: "내추럴 빈티지",
      area: "165m²",
      budget: "6,800만원",
      region: "서울 마포구",
      duration: "6주",
      image_urls: makeImages("cafe-mapo", 10),
    },
    {
      title: "판교 오피스텔 원룸 미니멀 인테리어",
      description:
        "20평형 원룸을 최대한 넓어 보이도록 설계한 프로젝트. 내장 수납장을 활용해 가구를 최소화하고 화이트 베이스에 우드 포인트로 깔끔한 공간을 완성했습니다. 재택근무자를 위한 홈오피스 공간도 별도로 구성했습니다.",
      space_type: "오피스텔",
      style: "스칸디나비안 미니멀",
      area: "20평",
      budget: "1,800만원",
      region: "경기 성남시 분당구",
      duration: "3주",
      image_urls: makeImages("studio-pangyo", 10),
    },
    {
      title: "서초구 신혼부부 아파트 25평 인테리어",
      description:
        "신혼부부를 위한 아늑하고 실용적인 공간. 수납공간을 최대화하면서도 깔끔한 라인의 모던 인테리어를 구현했습니다. 드레스룸 설계와 주방 아일랜드 설치로 생활 편의성을 크게 높인 프로젝트입니다.",
      space_type: "아파트",
      style: "모던 내추럴",
      area: "25평",
      budget: "3,200만원",
      region: "서울 서초구",
      duration: "4주",
      image_urls: makeImages("apt-seocho", 10),
    },
    {
      title: "용산구 복층 주택 35평 리노베이션",
      description:
        "1980년대 단독주택을 현대적으로 재해석한 대규모 리노베이션 프로젝트. 복층 구조를 살려 1층은 오픈형 거실+주방, 2층은 프라이빗 침실 공간으로 구성했습니다. 노출 콘크리트와 우드의 조화로 인더스트리얼 감성을 표현했습니다.",
      space_type: "단독주택",
      style: "모던 인더스트리얼",
      area: "35평",
      budget: "8,200만원",
      region: "서울 용산구",
      duration: "8주",
      image_urls: makeImages("house-yongsan", 10),
    },
  ];

  for (let i = 0; i < portfolios.length; i++) {
    const p = portfolios[i];
    const result = await supabaseInsert("portfolios", {
      ...p,
      company_id: company.id,
      image_urls: p.image_urls,
      is_public: true,
    });
    const created = Array.isArray(result) ? result[0] : result;
    console.log(`✅ 포트폴리오 ${i + 1}/5: "${p.title}" (ID: ${created.id})`);
  }

  console.log("\n🎉 시드 완료!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📧 이메일: test@moahome.kr`);
  console.log(`🔑 비밀번호: test1234`);
  console.log(`🔗 로그인: http://localhost:포트/company/login`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((err) => {
  console.error("❌ 오류:", err.message);
  process.exit(1);
});
