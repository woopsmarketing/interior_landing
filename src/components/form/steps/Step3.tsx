"use client";

import { useState } from "react";
import { FormData } from "../MultiStepForm";

interface Step3Props {
  formData: FormData;
  onMultiChange: (field: keyof FormData, value: string, checked: boolean) => void;
  onChange: (field: keyof FormData, value: string) => void;
}

const PRIORITIES = [
  "가성비",
  "디자인",
  "편의성",
  "수납력",
  "내구성",
  "청소 편의성",
  "채광",
  "조명 분위기",
  "방음",
  "친환경 자재",
  "반려동물 친화",
  "아이 안전",
  "공사 기간",
  "유지관리",
  "공간 활용도",
];

const STYLES = [
  "미니멀",
  "모던",
  "내추럴",
  "북유럽",
  "호텔식",
  "럭셔리",
  "인더스트리얼",
  "빈티지",
  "한옥 감성",
  "잘 모르겠음",
];

const ATMOSPHERES = [
  "밝고 깨끗한",
  "따뜻하고 아늑한",
  "세련되고 도시적인",
  "고급스럽고 묵직한",
  "감성적이고 부드러운",
  "오래 질리지 않는",
];

const PROBLEMS = [
  "수납 부족",
  "좁아 보임",
  "동선 불편",
  "조명 부족",
  "주방 불편",
  "욕실 낡음",
  "소음 문제",
  "콘센트 부족",
  "공간 분리 안 됨",
  "청소 불편",
];

function ChipCheckbox({
  options,
  selected,
  fieldName,
  onMultiChange,
}: {
  options: string[];
  selected: string[];
  fieldName: keyof FormData;
  onMultiChange: (field: keyof FormData, value: string, checked: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isChecked = selected.includes(option);
        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
              isChecked
                ? "border-orange-400 bg-orange-50 text-orange-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => onMultiChange(fieldName, option, e.target.checked)}
              className="sr-only"
            />
            {isChecked && (
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7L5.5 10L11.5 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {option}
          </label>
        );
      })}
    </div>
  );
}

export default function Step3({ formData, onMultiChange, onChange }: Step3Props) {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className="space-y-5">
      {/* 중요 요소 - 필수 */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            중요하게 생각하는 요소 <span className="text-orange-500">*</span>
          </label>
          <span className="text-xs text-gray-400">1개 이상 선택</span>
        </div>
        <ChipCheckbox
          options={PRIORITIES}
          selected={formData.priorities}
          fieldName="priorities"
          onMultiChange={onMultiChange}
        />
      </div>

      {/* 스타일 취향 펼치기 */}
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
        스타일 취향 더 선택하기 <span className="text-xs text-gray-300">(선택)</span>
      </button>

      {showExtra && (
        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-4">
          {/* 선호 스타일 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              선호 스타일
            </label>
            <ChipCheckbox
              options={STYLES}
              selected={formData.preferredStyles}
              fieldName="preferredStyles"
              onMultiChange={onMultiChange}
            />
          </div>

          {/* 선호 분위기 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              선호 분위기
            </label>
            <div className="flex flex-wrap gap-2">
              {ATMOSPHERES.map((a) => (
                <label
                  key={a}
                  className={`flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                    formData.preferredAtmosphere === a
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredAtmosphere"
                    value={a}
                    checked={formData.preferredAtmosphere === a}
                    onChange={(e) => onChange("preferredAtmosphere", e.target.value)}
                    className="sr-only"
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          {/* 불편한 점 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              현재 공간에서 불편한 점
            </label>
            <ChipCheckbox
              options={PROBLEMS}
              selected={formData.currentProblems}
              fieldName="currentProblems"
              onMultiChange={onMultiChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
