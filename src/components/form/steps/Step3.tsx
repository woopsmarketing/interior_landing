"use client";

import { FormData } from "../MultiStepForm";

interface Step3Props {
  formData: FormData;
  onMultiChange: (field: keyof FormData, value: string, checked: boolean) => void;
}

// 주거용 공간 요소
const RESIDENTIAL_AREAS = [
  "거실",
  "주방/다이닝",
  "안방",
  "작은방/자녀방",
  "욕실/화장실",
  "현관",
  "드레스룸/옷장",
  "서재/작업실",
  "발코니/베란다",
  "다용도실",
];

// 상업용 공간 요소
const COMMERCIAL_AREAS_FOOD = [
  "홀/객석",
  "주방/조리공간",
  "카운터/바",
  "화장실",
  "테라스/야외석",
  "외관/파사드",
  "창고/보관실",
  "대기공간",
  "직원 공간",
];

const COMMERCIAL_AREAS_OFFICE = [
  "개인 업무공간",
  "회의실",
  "로비/리셉션",
  "탕비실/휴게공간",
  "화장실",
  "임원실",
  "창고/보관실",
  "직원 공간",
];

const COMMERCIAL_AREAS_BEAUTY = [
  "시술 공간",
  "대기공간",
  "화장실",
  "샴푸/세척 공간",
  "외관/파사드",
  "직원 공간",
  "창고/보관실",
];

const COMMERCIAL_AREAS_FITNESS = [
  "운동 공간",
  "탈의실",
  "샤워실/화장실",
  "로비/리셉션",
  "외관/파사드",
  "직원 공간",
  "창고/보관실",
];

const COMMERCIAL_AREAS_RETAIL = [
  "영업/판매 공간",
  "쇼케이스/디스플레이",
  "카운터/계산대",
  "피팅룸/탈의실",
  "화장실",
  "외관/파사드",
  "창고/보관실",
  "대기공간",
];

// 주거용 세부 유형 목록
const RESIDENTIAL_TYPES = [
  "아파트",
  "오피스텔",
  "전원주택/단독주택",
  "원룸/빌라",
  "투룸/빌라",
  "타운하우스",
];

const FOOD_TYPES = ["카페", "음식점", "술집/바"];
const OFFICE_TYPES = ["사무실", "병원/의원"];
const BEAUTY_TYPES = ["미용실/네일샵"];
const FITNESS_TYPES = ["헬스장/스튜디오"];
const RETAIL_TYPES = ["상가/매장"];

function getAreaList(spaceType: string): string[] {
  if (RESIDENTIAL_TYPES.includes(spaceType)) return RESIDENTIAL_AREAS;
  if (FOOD_TYPES.includes(spaceType)) return COMMERCIAL_AREAS_FOOD;
  if (OFFICE_TYPES.includes(spaceType)) return COMMERCIAL_AREAS_OFFICE;
  if (BEAUTY_TYPES.includes(spaceType)) return COMMERCIAL_AREAS_BEAUTY;
  if (FITNESS_TYPES.includes(spaceType)) return COMMERCIAL_AREAS_FITNESS;
  if (RETAIL_TYPES.includes(spaceType)) return COMMERCIAL_AREAS_RETAIL;
  // 직접입력 또는 미분류 → 주거용 기본
  return RESIDENTIAL_AREAS;
}

function isCommercial(spaceType: string): boolean {
  return [...FOOD_TYPES, ...OFFICE_TYPES, ...BEAUTY_TYPES, ...FITNESS_TYPES, ...RETAIL_TYPES].includes(spaceType);
}

export default function Step3({ formData, onMultiChange }: Step3Props) {
  const areas = getAreaList(formData.spaceType);
  const commercial = isCommercial(formData.spaceType);
  const selected = formData.renovationAreas;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            인테리어 할 공간 선택 <span className="text-orange-500">*</span>
          </label>
          <span className="text-xs text-gray-400">1개 이상 선택</span>
        </div>
        <p className="mb-3 text-xs text-gray-400">
          {commercial
            ? "공사가 필요한 공간을 모두 선택해주세요. 업체가 정확한 견적을 산출하는 데 도움이 됩니다."
            : "시공이 필요한 공간을 모두 선택해주세요. 선택한 범위를 바탕으로 견적이 산출됩니다."}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {areas.map((area) => {
            const isChecked = selected.includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => onMultiChange("renovationAreas", area, !isChecked)}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-medium transition-all text-center ${
                  isChecked
                    ? "border-orange-400 bg-orange-50 text-orange-600 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
                }`}
              >
                {isChecked && (
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {area}
              </button>
            );
          })}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
          <p className="text-xs text-orange-700">
            <span className="font-semibold">선택된 공간 {selected.length}곳:</span>{" "}
            {selected.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
