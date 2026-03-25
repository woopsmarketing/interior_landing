// ──────────────────────────────────────────────
// 공통 유틸리티 함수 & 상수
// ──────────────────────────────────────────────

/** 날짜 포맷 (한국어) */
export function formatDate(iso: string, includeTime = false) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return new Date(iso).toLocaleDateString("ko-KR", options);
}

// ──────────── 업체 관련 상수 ──────────────

export const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "광주",
  "대전", "울산", "세종", "강원", "충북", "충남",
  "전북", "전남", "경북", "경남", "제주",
] as const;

export const SPECIALTIES = [
  "아파트", "빌라/주택", "오피스텔", "상업공간", "사무실",
  "원룸/투룸", "전원주택", "카페/식당",
] as const;

export const STYLES = [
  "모던", "미니멀", "북유럽", "내추럴", "클래식",
  "인더스트리얼", "빈티지", "한국전통", "럭셔리",
] as const;

// ──────────── 관리자 견적 필드 라벨 ──────────────

export const SUBMISSION_FIELD_LABELS: Record<string, string> = {
  spaceType: "공간 유형",
  region: "지역",
  regionDetail: "지역 상세",
  buildingName: "건물명",
  area: "면적",
  currentCondition: "현재 상태",
  buildingAge: "건물 연식",
  constructionScope: "공사 범위",
  desiredTiming: "희망 시기",
  budget: "예산",
  structuralChange: "구조 변경",
  renovationAreas: "인테리어 공간",
  renovationNote: "공간 참고사항",
  additionalRequest: "추가 요청사항",
  contactMethod: "선호 연락 방법",
  availableTime: "가능 시간대",
};
