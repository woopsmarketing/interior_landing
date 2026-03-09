"use client";

import { FormData } from "../MultiStepForm";

interface Step2Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onMultiChange: (field: keyof FormData, value: string, checked: boolean) => void;
}

const BUDGETS = [
  "500만원 이하",
  "500–1,000만원",
  "1,000–2,000만원",
  "2,000–3,000만원",
  "3,000만원 이상",
];

const SCOPES = [
  "전체 리모델링",
  "부분 인테리어",
  "가구",
  "조명",
  "기타",
];

const STYLES = [
  "모던",
  "미니멀",
  "내추럴",
  "빈티지",
  "우드톤",
  "기타",
];

const PRIORITIES = [
  "수납",
  "동선",
  "채광",
  "관리 편의",
  "심미성",
];

function CheckboxGroup({
  label,
  options,
  selected,
  fieldName,
  onMultiChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  fieldName: keyof FormData;
  onMultiChange: (field: keyof FormData, value: string, checked: boolean) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
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
    </div>
  );
}

export default function Step2({ formData, onChange, onMultiChange }: Step2Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          예산
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

      <CheckboxGroup
        label="시공 범위 (복수 선택 가능)"
        options={SCOPES}
        selected={formData.scope}
        fieldName="scope"
        onMultiChange={onMultiChange}
      />

      <CheckboxGroup
        label="원하는 스타일 (복수 선택 가능)"
        options={STYLES}
        selected={formData.style}
        fieldName="style"
        onMultiChange={onMultiChange}
      />

      <CheckboxGroup
        label="중요하게 생각하는 요소 (복수 선택 가능)"
        options={PRIORITIES}
        selected={formData.priorities}
        fieldName="priorities"
        onMultiChange={onMultiChange}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          상세 요청사항
        </label>
        <textarea
          value={formData.details}
          onChange={(e) => onChange("details", e.target.value)}
          placeholder="원하는 분위기, 특별히 신경 써야 할 부분 등 자유롭게 적어주세요. 아직 완벽하게 정리되지 않았어도 괜찮습니다."
          rows={4}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors resize-none"
        />
      </div>
    </div>
  );
}
