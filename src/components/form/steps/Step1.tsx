"use client";

import { FormData } from "../MultiStepForm";

interface Step1Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

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

const SPACE_TYPES = [
  "아파트",
  "주택",
  "오피스",
  "상업공간",
  "기타",
];

export default function Step1({ formData, onChange }: Step1Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          지역 <span className="text-orange-500">*</span>
        </label>
        <select
          value={formData.region}
          onChange={(e) => onChange("region", e.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors bg-white"
        >
          <option value="">지역을 선택해주세요</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공간 유형 <span className="text-orange-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SPACE_TYPES.map((type) => (
            <label
              key={type}
              className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          이름 <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="홍길동"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          연락처 <span className="text-orange-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="010-0000-0000"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
        />
      </div>
    </div>
  );
}
