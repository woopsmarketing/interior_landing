"use client";

import { useState } from "react";
import { FormData } from "../MultiStepForm";

interface Step1Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
}

const SPACE_CATEGORIES = {
  주거용: [
    "아파트",
    "오피스텔",
    "전원주택/단독주택",
    "원룸/빌라",
    "투룸/빌라",
    "타운하우스",
  ],
  상업용: [
    "카페",
    "음식점",
    "술집/바",
    "사무실",
    "병원/의원",
    "미용실/네일샵",
    "헬스장/스튜디오",
    "상가/매장",
    "기타(직접입력)",
  ],
} as const;

type Category = keyof typeof SPACE_CATEGORIES;

const REGIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "기타",
];

const CONDITIONS = ["공실", "거주 중", "운영 중", "입주 전"];
const BUILDING_AGES = ["신축", "부분 노후", "전체 노후", "잘 모르겠음"];

function getCategory(spaceType: string): Category | null {
  if (SPACE_CATEGORIES["주거용"].includes(spaceType as never)) return "주거용";
  if (SPACE_CATEGORIES["상업용"].includes(spaceType as never)) return "상업용";
  // 직접입력 값이면 상업용
  if (spaceType && !SPACE_CATEGORIES["주거용"].includes(spaceType as never) && !SPACE_CATEGORIES["상업용"].includes(spaceType as never)) return "상업용";
  return null;
}

export default function Step1({ formData, onChange }: Step1Props) {
  const [showExtra, setShowExtra] = useState(false);
  const detectedCategory = getCategory(formData.spaceType);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(detectedCategory);
  const [customType, setCustomType] = useState(
    // 기존에 직접입력한 값 복원
    formData.spaceType && !SPACE_CATEGORIES["주거용"].includes(formData.spaceType as never) && !SPACE_CATEGORIES["상업용"].includes(formData.spaceType as never)
      ? formData.spaceType
      : ""
  );

  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat);
    // 카테고리 바꾸면 기존 선택 초기화
    if (detectedCategory !== cat) {
      onChange("spaceType", "");
      setCustomType("");
    }
  };

  const handleSubTypeSelect = (type: string) => {
    if (type === "기타(직접입력)") {
      // 기타 선택 시 직접입력 모드
      onChange("spaceType", customType || "");
    } else {
      onChange("spaceType", type);
      setCustomType("");
    }
  };

  const isCustomMode = selectedCategory === "상업용" && (
    formData.spaceType === "" ||
    formData.spaceType === customType ||
    (!SPACE_CATEGORIES["주거용"].includes(formData.spaceType as never) && !SPACE_CATEGORIES["상업용"].includes(formData.spaceType as never))
  ) && customType !== "";

  const subTypes = selectedCategory ? SPACE_CATEGORIES[selectedCategory] : [];

  return (
    <div className="space-y-5">
      {/* 공간 유형 - 대분류 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공간 유형 <span className="text-orange-500">*</span>
        </label>

        {/* 대분류: 주거용 / 상업용 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {(Object.keys(SPACE_CATEGORIES) as Category[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`flex items-center justify-center rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "border-orange-400 bg-orange-50 text-orange-600 shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-orange-200 hover:bg-orange-50/50"
              }`}
            >
              <span className="mr-1.5">
                {cat === "주거용" ? (
                  <svg className="inline h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                ) : (
                  <svg className="inline h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              {cat}
            </button>
          ))}
        </div>

        {/* 소분류: 세부 유형 */}
        {selectedCategory && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 animate-in fade-in duration-200">
            {subTypes.map((type) => {
              const isCustomOption = type === "기타(직접입력)";
              const isSelected = isCustomOption
                ? isCustomMode
                : formData.spaceType === type;

              return (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                    isSelected
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="spaceType"
                    value={type}
                    checked={isSelected}
                    onChange={() => handleSubTypeSelect(type)}
                    className="sr-only"
                  />
                  {type}
                </label>
              );
            })}
          </div>
        )}

        {/* 기타 직접입력 필드 */}
        {selectedCategory === "상업용" && (
          formData.spaceType === "" || isCustomMode || formData.spaceType === "기타(직접입력)"
        ) && (
          (() => {
            // 기타(직접입력)이 선택된 상태인지
            const showInput = isCustomMode || formData.spaceType === "" && customType !== "" ||
              (!SPACE_CATEGORIES["상업용"].includes(formData.spaceType as never) && formData.spaceType !== "");
            return showInput ? (
              <div className="mt-2">
                <input
                  type="text"
                  value={customType}
                  onChange={(e) => {
                    setCustomType(e.target.value);
                    onChange("spaceType", e.target.value);
                  }}
                  placeholder="예: 네일샵, 스터디카페, 공유오피스..."
                  className="w-full rounded-xl border border-orange-300 bg-orange-50/30 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
                />
              </div>
            ) : null;
          })()
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
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* 면적 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          면적 <span className="text-orange-500">*</span>
        </label>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
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

      {/* 추가 공간 정보 펼치기 */}
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
          <path
            d="M6 3L11 8L6 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        추가 공간 정보 입력하기 <span className="text-xs text-gray-300">(선택)</span>
      </button>

      {showExtra && (
        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-4">
          {/* 현재 상태 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              현재 상태
            </label>
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

          {/* 노후도 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              노후도
            </label>
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
