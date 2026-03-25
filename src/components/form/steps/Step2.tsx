"use client";

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

const STRUCTURAL_CHANGES = [
  { value: "있음", label: "있음 (벽 철거/확장 등)", desc: "벽을 허물거나 공간을 합치는 공사" },
  { value: "없음", label: "없음", desc: "기존 구조 유지, 마감재 교체 위주" },
  { value: "모르겠음", label: "잘 모르겠음", desc: "상담 시 결정할게요" },
];

export default function Step2({ formData, onChange }: Step2Props) {
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
            <option key={t} value={t}>{t}</option>
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
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* 구조 변경 여부 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          구조 변경 (벽 철거/확장) <span className="text-xs text-gray-400">(선택)</span>
        </label>
        <div className="space-y-2">
          {STRUCTURAL_CHANGES.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-all ${
                formData.structuralChange === opt.value
                  ? "border-orange-400 bg-orange-50"
                  : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/50"
              }`}
            >
              <input
                type="radio"
                name="structuralChange"
                value={opt.value}
                checked={formData.structuralChange === opt.value}
                onChange={(e) => onChange("structuralChange", e.target.value)}
                className="sr-only"
              />
              <div>
                <span className={`text-sm font-medium ${
                  formData.structuralChange === opt.value ? "text-orange-600" : "text-gray-700"
                }`}>
                  {opt.label}
                </span>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
