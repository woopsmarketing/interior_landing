"use client";

import { FormData } from "../MultiStepForm";

interface Step5Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
  onMultiChange: (field: keyof FormData, value: string, checked: boolean) => void;
}

const CONTACT_METHODS = ["전화", "문자", "카카오톡", "이메일"];
const AVAILABLE_TIMES = ["오전 (9~12시)", "오후 (12~18시)", "저녁 (18시 이후)"];

function CheckboxItem({
  checked,
  onChange,
  label,
  subLabel,
  required,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  subLabel?: string;
  required?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 transition-colors hover:border-orange-200 hover:bg-orange-50/30">
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
            checked ? "border-orange-500 bg-orange-500" : "border-gray-300 bg-white"
          }`}
        >
          {checked && (
            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">
          {label}{" "}
          {required !== undefined && (
            <span className={required ? "text-orange-500" : "text-gray-400"}>
              ({required ? "필수" : "선택"})
            </span>
          )}
        </p>
        {subLabel && <p className="mt-0.5 text-xs text-gray-500">{subLabel}</p>}
      </div>
    </label>
  );
}

function ChipMulti({
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
      {options.map((opt) => {
        const isChecked = selected.includes(opt);
        return (
          <label
            key={opt}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
              isChecked
                ? "border-orange-400 bg-orange-50 text-orange-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => onMultiChange(fieldName, opt, e.target.checked)}
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
            {opt}
          </label>
        );
      })}
    </div>
  );
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function Step5({ formData, onChange, onMultiChange }: Step5Props) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        연락처를 입력하시면 상담 신청이 완료됩니다.
      </p>

      {/* 이름 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          이름 <span className="text-orange-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="홍길동"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
        />
      </div>

      {/* 연락처 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          연락처 <span className="text-orange-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange("phone", formatPhone(e.target.value))}
          placeholder="010-0000-0000"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
        />
      </div>

      {/* 이메일 (선택) */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700">이메일</label>
          <span className="text-xs text-gray-400">선택사항</span>
        </div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="example@email.com"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors"
        />
      </div>

      {/* 상담 희망 방식 */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">상담 희망 방식</label>
          <span className="text-xs text-gray-400">선택사항</span>
        </div>
        <ChipMulti
          options={CONTACT_METHODS}
          selected={formData.contactMethod}
          fieldName="contactMethod"
          onMultiChange={onMultiChange}
        />
      </div>

      {/* 연락 가능 시간 */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">연락 가능 시간대</label>
          <span className="text-xs text-gray-400">선택사항</span>
        </div>
        <ChipMulti
          options={AVAILABLE_TIMES}
          selected={formData.availableTime}
          fieldName="availableTime"
          onMultiChange={onMultiChange}
        />
      </div>

      {/* 동의 항목 */}
      <div className="space-y-2.5">
        <CheckboxItem
          checked={formData.agreePrivacy}
          onChange={(v) => onChange("agreePrivacy", v)}
          label="개인정보 수집 및 이용 동의"
          subLabel="이름, 연락처 등 입력하신 정보를 견적 요청 목적으로 수집합니다."
          required={true}
        />
        <CheckboxItem
          checked={formData.agreeConsult}
          onChange={(v) => onChange("agreeConsult", v)}
          label="상담 진행을 위한 연락 수신 동의"
          subLabel="등록된 인테리어 업체가 요청 내용을 바탕으로 연락드릴 수 있습니다."
          required={true}
        />
        <CheckboxItem
          checked={formData.agreeMarketing}
          onChange={(v) => onChange("agreeMarketing", v)}
          label="이벤트/프로모션/포트폴리오 안내 수신 동의"
          required={false}
        />
      </div>

      <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3.5">
        <p className="text-sm text-orange-800 leading-relaxed text-center">
          꼭 계약하지 않아도 됩니다. 비교 후 원하시는 경우에만 선택하시면 됩니다.
        </p>
      </div>
    </div>
  );
}
