"use client";

import { useState } from "react";
import { FormData } from "../MultiStepForm";

interface Step1Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
}

const RESIDENTIAL_TYPES = [
  "아파트",
  "오피스텔",
  "전원주택/단독주택",
  "원룸/빌라",
  "투룸/빌라",
  "타운하우스",
  "기타(직접입력)",
];

const COMMERCIAL_TYPES = [
  "카페",
  "음식점",
  "술집/바",
  "사무실",
  "병원/의원",
  "미용실/네일샵",
  "헬스장/스튜디오",
  "상가/매장",
  "기타(직접입력)",
];

const PRESET_ALL = [...RESIDENTIAL_TYPES, ...COMMERCIAL_TYPES].filter(
  (t) => t !== "기타(직접입력)"
);

const REGIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "기타"];
const CONDITIONS = ["공실", "거주 중", "운영 중", "입주 전"];
const BUILDING_AGES = ["신축", "부분 노후", "전체 노후", "잘 모르겠음"];

type Category = "주거용" | "상업용";

function detectCategory(spaceType: string): Category | null {
  if (!spaceType) return null;
  if (RESIDENTIAL_TYPES.includes(spaceType)) return "주거용";
  if (COMMERCIAL_TYPES.includes(spaceType)) return "상업용";
  // 프리셋에 없는 값 = 직접입력 → 어느 카테고리인지 알 수 없으므로 null 반환
  return null;
}

export default function Step1({ formData, onChange }: Step1Props) {
  const [showExtra, setShowExtra] = useState(false);

  // 대분류 선택 상태
  const [category, setCategory] = useState<Category | null>(() => {
    if (RESIDENTIAL_TYPES.filter((t) => t !== "기타(직접입력)").includes(formData.spaceType)) return "주거용";
    if (COMMERCIAL_TYPES.filter((t) => t !== "기타(직접입력)").includes(formData.spaceType)) return "상업용";
    return null;
  });

  // 직접입력 모드 여부
  const [isCustom, setIsCustom] = useState<boolean>(
    !!formData.spaceType && !PRESET_ALL.includes(formData.spaceType)
  );

  // 직접입력 텍스트
  const [customText, setCustomText] = useState<string>(
    !PRESET_ALL.includes(formData.spaceType) ? formData.spaceType : ""
  );

  const handleCategoryClick = (cat: Category) => {
    if (category === cat) return;
    setCategory(cat);
    setIsCustom(false);
    setCustomText("");
    onChange("spaceType", "");
  };

  const handleTypeClick = (type: string) => {
    if (type === "기타(직접입력)") {
      setIsCustom(true);
      onChange("spaceType", customText); // 이미 입력된 값 있으면 유지
    } else {
      setIsCustom(false);
      setCustomText("");
      onChange("spaceType", type);
    }
  };

  const handleCustomInput = (val: string) => {
    setCustomText(val);
    onChange("spaceType", val);
  };

  const subTypes = category === "주거용" ? RESIDENTIAL_TYPES : category === "상업용" ? COMMERCIAL_TYPES : [];

  // 현재 소분류에서 선택된 항목 표시 판단
  const selectedType = isCustom ? "기타(직접입력)" : formData.spaceType;

  return (
    <div className="space-y-5">
      {/* 공간 유형 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공간 유형 <span className="text-orange-500">*</span>
        </label>

        {/* 대분류 버튼 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {(["주거용", "상업용"] as Category[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                category === cat
                  ? "border-orange-400 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-orange-200 hover:bg-orange-50/50"
              }`}
            >
              {cat === "주거용" ? (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* 소분류 버튼 */}
        {category && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {subTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeClick(type)}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  selectedType === type
                    ? "border-orange-400 bg-orange-50 text-orange-600"
                    : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* 직접입력 텍스트 필드 */}
        {isCustom && (
          <div className="mt-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => handleCustomInput(e.target.value)}
              placeholder={
                category === "주거용"
                  ? "예: 펜션, 기숙사, 고시원..."
                  : "예: 네일샵, 스터디카페, 공유오피스..."
              }
              autoFocus
              className="w-full rounded-xl border border-orange-300 bg-orange-50/30 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
            />
          </div>
        )}
      </div>

      {/* 지역 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          지역 <span className="text-orange-500">*</span>
        </label>
        <select
          value={formData.region}
          onChange={(e) => onChange("region", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors bg-white"
        >
          <option value="">지역을 선택해주세요</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* 면적 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          면적 <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={formData.area}
            onChange={(e) => onChange("area", e.target.value)}
            placeholder="예: 25"
            disabled={formData.areaUnknown as boolean}
            min="0"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-14 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
            평
          </span>
        </div>
        <label className="mt-2 flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={formData.areaUnknown as boolean}
            onChange={(e) => {
              onChange("areaUnknown", e.target.checked);
              if (e.target.checked) onChange("area", "");
            }}
            className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
          />
          <span className="text-sm text-gray-500">잘 모르겠음</span>
        </label>
      </div>

      {/* 추가 공간 정보 */}
      <button
        type="button"
        onClick={() => setShowExtra(!showExtra)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition-colors"
      >
        <svg
          className={`h-4 w-4 transition-transform ${showExtra ? "rotate-90" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        추가 공간 정보 입력하기 <span className="text-xs text-gray-300">(선택)</span>
      </button>

      {showExtra && (
        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">현재 상태</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <label
                  key={c}
                  className={`flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                    formData.currentCondition === c
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="currentCondition"
                    value={c}
                    checked={formData.currentCondition === c}
                    onChange={(e) => onChange("currentCondition", e.target.value)}
                    className="sr-only"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">노후도</label>
            <div className="flex flex-wrap gap-2">
              {BUILDING_AGES.map((a) => (
                <label
                  key={a}
                  className={`flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                    formData.buildingAge === a
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="buildingAge"
                    value={a}
                    checked={formData.buildingAge === a}
                    onChange={(e) => onChange("buildingAge", e.target.value)}
                    className="sr-only"
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
