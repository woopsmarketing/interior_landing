"use client";

import { useState } from "react";
import { FormData } from "../MultiStepForm";

interface Step1Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
}

const SPACE_TYPES = [
  "아파트",
  "빌라/연립",
  "단독주택",
  "오피스텔",
  "사무실",
  "상가",
  "카페",
  "음식점",
  "병원/의원",
  "기타",
];

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

export default function Step1({ formData, onChange }: Step1Props) {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className="space-y-5">
      {/* 공간 유형 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공간 유형 <span className="text-orange-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SPACE_TYPES.map((type) => (
            <label
              key={type}
              className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                formData.spaceType === type
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
              }`}
            >
              <input
                type="radio"
                name="spaceType"
                value={type}
                checked={formData.spaceType === type}
                onChange={(e) => onChange("spaceType", e.target.value)}
                className="sr-only"
              />
              {type}
            </label>
          ))}
        </div>
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
