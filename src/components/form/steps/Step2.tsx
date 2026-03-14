"use client";

import { useState } from "react";
import { FormData } from "../MultiStepForm";

interface Step2Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

const CONSTRUCTION_SCOPES = [
  "전체 리모델링",
  "부분 리모델링",
  "설계 + 시공",
  "설계만",
  "시공만",
  "스타일링/홈스타일링",
];

const DESIRED_TIMINGS = [
  "1개월 이내",
  "1~3개월",
  "3~6개월",
  "6개월 이후",
  "미정",
];

const BUDGETS = [
  "500만원 이하",
  "500~1,000만원",
  "1,000~2,000만원",
  "2,000~3,000만원",
  "3,000~5,000만원",
  "5,000만원 이상",
  "미정 / 상담 후 결정",
];

const PURPOSES = [
  "첫 입주",
  "이사 전 리모델링",
  "노후 개선",
  "매장 오픈",
  "브랜드 리뉴얼",
  "임대용 세팅",
  "기타",
];

const FLEXIBILITIES = ["날짜 고정", "1주 조정 가능", "2주 이상 조정 가능"];

const OCCUPANCIES = ["비워둘 예정", "일부 거주", "일부 운영", "완전 비우기 어려움"];

export default function Step2({ formData, onChange }: Step2Props) {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <div className="space-y-5">
      {/* 공사 범위 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공사 범위 <span className="text-orange-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CONSTRUCTION_SCOPES.map((scope) => (
            <label
              key={scope}
              className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-medium text-center transition-all ${
                formData.constructionScope === scope
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
              }`}
            >
              <input
                type="radio"
                name="constructionScope"
                value={scope}
                checked={formData.constructionScope === scope}
                onChange={(e) => onChange("constructionScope", e.target.value)}
                className="sr-only"
              />
              {scope}
            </label>
          ))}
        </div>
      </div>

      {/* 공사 희망 시기 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          공사 희망 시기 <span className="text-orange-500">*</span>
        </label>
        <select
          value={formData.desiredTiming}
          onChange={(e) => onChange("desiredTiming", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors bg-white"
        >
          <option value="">희망 시기를 선택해주세요</option>
          {DESIRED_TIMINGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* 예산 범위 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          예산 범위 <span className="text-orange-500">*</span>
        </label>
        <select
          value={formData.budget}
          onChange={(e) => onChange("budget", e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors bg-white"
        >
          <option value="">예산 범위를 선택해주세요</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* 세부 일정 펼치기 */}
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
        세부 일정 입력하기 <span className="text-xs text-gray-300">(선택)</span>
      </button>

      {showExtra && (
        <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-4">
          {/* 공사 목적 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              공사 목적
            </label>
            <div className="flex flex-wrap gap-2">
              {PURPOSES.map((p) => (
                <label
                  key={p}
                  className={`flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                    formData.constructionPurpose === p
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="constructionPurpose"
                    value={p}
                    checked={formData.constructionPurpose === p}
                    onChange={(e) => onChange("constructionPurpose", e.target.value)}
                    className="sr-only"
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>

          {/* 일정 유연성 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              일정 유연성
            </label>
            <div className="flex flex-wrap gap-2">
              {FLEXIBILITIES.map((f) => (
                <label
                  key={f}
                  className={`flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                    formData.scheduleFlexibility === f
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="scheduleFlexibility"
                    value={f}
                    checked={formData.scheduleFlexibility === f}
                    onChange={(e) => onChange("scheduleFlexibility", e.target.value)}
                    className="sr-only"
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          {/* 공사 중 사용 여부 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              공사 중 사용 여부
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCUPANCIES.map((o) => (
                <label
                  key={o}
                  className={`flex cursor-pointer items-center rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
                    formData.occupancyDuringWork === o
                      ? "border-orange-400 bg-orange-50 text-orange-600"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="occupancyDuringWork"
                    value={o}
                    checked={formData.occupancyDuringWork === o}
                    onChange={(e) => onChange("occupancyDuringWork", e.target.value)}
                    className="sr-only"
                  />
                  {o}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
