// ──────────────────────────────────────────────
// 공통 타입 정의
// ──────────────────────────────────────────────

/** 업체 프로필 (company dashboard, admin, customer view) */
export interface CompanyProfile {
  id: string;
  email: string;
  company_name: string;
  representative_name: string | null;
  business_number: string | null;
  founded_year: number | null;
  employee_count: string | null;
  phone: string | null;
  website_url: string | null;
  instagram_url: string | null;
  blog_url: string | null;
  service_regions: string[];
  specialties: string[];
  preferred_styles: string[];
  min_budget: number | null;
  max_budget: number | null;
  min_area: number | null;
  max_area: number | null;
  total_projects: number;
  years_in_business: number | null;
  certifications: string[];
  warranty_period: string | null;
  warranty_description: string | null;
  introduction: string | null;
  strengths: string[];
  logo_url: string | null;
  main_image_url: string | null;
  intro_video_url: string | null;
  status: string;
}

/** 포트폴리오 */
export interface Portfolio {
  id: string;
  title: string;
  description: string | null;
  space_type: string | null;
  style: string | null;
  area: string | null;
  budget: string | null;
  region: string | null;
  duration: string | null;
  image_urls: string[];
  is_public: boolean;
  created_at: string;
}

/** 업체가 보는 견적 요청 (개인정보 제외) */
export interface CompanySubmission {
  id: string;
  created_at: string;
  status: string;
  space_type: string;
  region: string;
  area: string;
  area_unknown: boolean;
  current_condition: string;
  building_age: string;
  budget: string;
  construction_scope: string;
  desired_timing: string;
  construction_purpose: string;
  schedule_flexibility: string;
  occupancy_during_work: string;
  renovation_areas: string[];
  renovation_note: string;
  additional_request: string;
  has_space_photo: boolean;
  has_reference_image: boolean;
  has_generated_image: boolean;
  space_photo_url: string | null;
  reference_image_url: string | null;
  generated_image_url: string | null;
  hasResponded: boolean;
}

/** 업체의 견적 응답 */
export interface CompanyResponse {
  id: string;
  message: string | null;
  estimated_price: string | null;
  created_at: string;
  submissions: {
    id: string;
    space_type: string;
    region: string;
    area: string;
    budget: string;
    construction_scope: string;
    desired_timing: string;
    created_at: string;
  } | null;
}

/** 관리자가 보는 견적 요청 (개인정보 포함) */
export interface AdminSubmission {
  id: string;
  createdAt: string;
  spaceType: string;
  region: string;
  area: string;
  areaUnknown: boolean;
  currentCondition: string;
  buildingAge: string;
  constructionScope: string;
  desiredTiming: string;
  budget: string;
  constructionPurpose: string;
  scheduleFlexibility: string;
  occupancyDuringWork: string;
  priorities: string[];
  preferredStyles: string[];
  preferredAtmosphere: string;
  currentProblems: string[];
  additionalRequest: string;
  hasSpacePhoto: boolean;
  hasReferenceImage: boolean;
  name: string;
  phone: string;
  email: string;
  contactMethod: string[];
  availableTime: string[];
  agreePrivacy: boolean;
  agreeConsult: boolean;
  agreeMarketing: boolean;
  hasGeneratedImage: boolean;
  status: string;
}

/** 관리자가 보는 업체 정보 (간략) */
export interface AdminCompany {
  id: string;
  email: string;
  company_name: string;
  representative_name: string | null;
  phone: string | null;
  status: string;
  created_at: string;
}
