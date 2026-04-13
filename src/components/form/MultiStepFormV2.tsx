"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  trackFormStart,
  trackStepComplete,
  trackFormSubmit,
  trackAIImageGenerated,
  captureUtmParams,
} from "@/lib/tracking";

// ─────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────

export interface FormDataV2 {
  // Step 1 — 공간 + 공사 정보
  spaceType: string;
  area: string;
  areaUnknown: boolean;
  constructionScope: string;
  budget: string;
  // Step 2 — 상세 요청 (선택 중심)
  desiredTiming: string;
  additionalRequest: string;
  spacePhoto: File | null;
  // Step 3 — 연락처 + 동의
  name: string;
  phone: string;
  email: string;
  agreePrivacy: boolean;
  agreeConsult: boolean;
  agreeMarketing: boolean;
}

// ─────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────

const INITIAL_FORM_DATA: FormDataV2 = {
  spaceType: "",
  area: "",
  areaUnknown: false,
  constructionScope: "",
  budget: "",
  desiredTiming: "",
  additionalRequest: "",
  spacePhoto: null,
  name: "",
  phone: "",
  email: "",
  agreePrivacy: false,
  agreeConsult: false,
  agreeMarketing: false,
};

const TOTAL_STEPS = 3;

const STEP_LABELS = ["공간 및 공사 정보", "상세 요청", "연락처 및 동의"];

const SPACE_TYPES = [
  "아파트",
  "오피스텔",
  "빌라/원룸",
  "단독주택",
  "카페/음식점",
  "사무실/기타",
];

const CONSTRUCTION_SCOPES_V2 = [
  "전체 리모델링",
  "부분 리모델링",
  "설계만/기타",
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

const DESIRED_TIMINGS = [
  "1개월 이내",
  "1~3개월",
  "3~6개월",
  "6개월 이후",
  "미정",
];

const COMPLETION_STEPS = [
  {
    step: 1,
    title: "견적 요청 검토",
    description: "입력하신 정보와 이미지를 바탕으로 준비합니다",
  },
  {
    step: 2,
    title: "업체 매칭 및 상담 준비",
    description: "조건에 맞는 업체를 선별합니다",
  },
  {
    step: 3,
    title: "담당자 연락 및 결과 전달",
    description: "작성하신 연락처로 순차 안내드립니다",
  },
] as const;

// ─────────────────────────────────────────────
// 유효성 검사
// ─────────────────────────────────────────────

function validateStep(step: number, formData: FormDataV2): string | null {
  if (step === 1) {
    if (!formData.spaceType) return "공간 유형을 선택해주세요.";
    if (!formData.area && !formData.areaUnknown)
      return "면적을 입력하거나 '잘 모르겠음'을 선택해주세요.";
    if (!formData.constructionScope) return "공사 범위를 선택해주세요.";
    if (!formData.budget) return "예산 범위를 선택해주세요.";
  }
  if (step === 3) {
    if (!formData.name.trim()) return "이름을 입력해주세요.";
    if (!formData.phone.trim()) return "연락처를 입력해주세요.";
    if (!formData.agreePrivacy)
      return "개인정보 수집 및 이용에 동의해주세요.";
    if (!formData.agreeConsult)
      return "상담 진행을 위한 연락 수신에 동의해주세요.";
  }
  return null;
}

// ─────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

// ─────────────────────────────────────────────
// 서브 컴포넌트
// ─────────────────────────────────────────────

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
            checked
              ? "border-orange-500 bg-orange-500"
              : "border-gray-300 bg-white"
          }`}
        >
          {checked && (
            <svg
              className="h-3 w-3 text-white"
              viewBox="0 0 12 12"
              fill="none"
            >
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
        {subLabel && (
          <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
            {subLabel}
          </p>
        )}
      </div>
    </label>
  );
}

function FileUploadArea({
  label,
  hint,
  file,
  onFileChange,
}: {
  label: string;
  hint: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">선택사항</span>
      </div>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-6 cursor-pointer transition-colors ${
          file
            ? "border-orange-300 bg-orange-50/60"
            : "border-gray-200 bg-gray-50 hover:border-orange-200 hover:bg-orange-50/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          className="sr-only"
        />
        {file ? (
          <div className="flex w-full items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
              <svg
                className="h-5 w-5 text-orange-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 5 2-3 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {file.name}
              </p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-6 w-6 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600">
              클릭하여 파일 선택
            </p>
            <p className="mt-1 text-xs text-gray-400">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 1 — 공간 + 공사 정보
// ─────────────────────────────────────────────

function StepOne({
  formData,
  onChange,
}: {
  formData: FormDataV2;
  onChange: (field: keyof FormDataV2, value: string | boolean) => void;
}) {
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
              className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium text-center transition-all ${
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

      {/* 면적 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          면적 <span className="text-orange-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              value={formData.area}
              disabled={formData.areaUnknown}
              onChange={(e) => onChange("area", e.target.value)}
              placeholder="예: 25"
              min={0}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              평
            </span>
          </div>
          <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 transition-colors hover:border-orange-200 hover:bg-orange-50/30">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                formData.areaUnknown
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300 bg-white"
              }`}
            >
              {formData.areaUnknown && (
                <svg
                  className="h-3 w-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
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
            <input
              type="checkbox"
              checked={formData.areaUnknown}
              onChange={(e) => {
                onChange("areaUnknown", e.target.checked);
                if (e.target.checked) onChange("area", "");
              }}
              className="sr-only"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              잘 모르겠음
            </span>
          </label>
        </div>
      </div>

      {/* 공사 범위 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          공사 범위 <span className="text-orange-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CONSTRUCTION_SCOPES_V2.slice(0, 2).map((scope) => (
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
                onChange={(e) =>
                  onChange("constructionScope", e.target.value)
                }
                className="sr-only"
              />
              {scope}
            </label>
          ))}
          {/* 3번째 항목: 전체 너비 */}
          <label
            className={`col-span-2 flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-medium text-center transition-all ${
              formData.constructionScope === CONSTRUCTION_SCOPES_V2[2]
                ? "border-orange-400 bg-orange-50 text-orange-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50/50"
            }`}
          >
            <input
              type="radio"
              name="constructionScope"
              value={CONSTRUCTION_SCOPES_V2[2]}
              checked={
                formData.constructionScope === CONSTRUCTION_SCOPES_V2[2]
              }
              onChange={(e) => onChange("constructionScope", e.target.value)}
              className="sr-only"
            />
            {CONSTRUCTION_SCOPES_V2[2]}
          </label>
        </div>
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
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 2 — 상세 요청 (모두 선택)
// ─────────────────────────────────────────────

function StepTwo({
  formData,
  onChange,
  onFileChange,
}: {
  formData: FormDataV2;
  onChange: (field: keyof FormDataV2, value: string | boolean) => void;
  onFileChange: (file: File | null) => void;
}) {
  return (
    <div className="space-y-5">
      {/* 공사 희망 시기 */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700">
            공사 희망 시기
          </label>
          <span className="text-xs text-gray-400">선택사항</span>
        </div>
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

      {/* 추가 요청사항 */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700">
            추가 요청사항
          </label>
          <span className="text-xs text-gray-400">선택사항</span>
        </div>
        <textarea
          value={formData.additionalRequest}
          onChange={(e) => onChange("additionalRequest", e.target.value)}
          placeholder="원하는 스타일이나 특별히 반영해야 할 사항을 적어주세요"
          rows={4}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors resize-none"
        />
      </div>

      {/* 사진 업로드 */}
      <FileUploadArea
        label="현재 공간 사진"
        hint="사진이 있으면 더 정확한 견적을 받을 수 있어요 (선택)"
        file={formData.spacePhoto}
        onFileChange={onFileChange}
      />

      {/* 하단 안내 */}
      <p className="text-center text-xs text-gray-400">
        사진 없이도 견적 요청이 가능합니다
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 3 — 연락처 + 동의
// ─────────────────────────────────────────────

function StepThree({
  formData,
  onChange,
}: {
  formData: FormDataV2;
  onChange: (field: keyof FormDataV2, value: string | boolean) => void;
}) {
  const allAgreed =
    formData.agreePrivacy &&
    formData.agreeConsult &&
    formData.agreeMarketing;

  const handleAgreeAll = (checked: boolean) => {
    onChange("agreePrivacy", checked);
    onChange("agreeConsult", checked);
    onChange("agreeMarketing", checked);
  };

  return (
    <div className="space-y-5">
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
        <p className="mt-1.5 text-xs text-gray-400">
          견적서를 이메일로도 받고 싶으시면 입력해주세요
        </p>
      </div>

      {/* 동의 항목 */}
      <div className="space-y-2.5">
        {/* 개인정보 안내 + 모두 동의 */}
        <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-700">
                개인정보 안내
              </p>
              <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                견적 요청 목적만을 위해 수집되며, 귀하의 정보는 안전하게
                보관됩니다.
              </p>
            </div>
            <label className="flex shrink-0 cursor-pointer items-center gap-2">
              <span className="text-xs font-semibold text-orange-600 whitespace-nowrap">
                모두 동의
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={allAgreed}
                  onChange={(e) => handleAgreeAll(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                    allAgreed
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {allAgreed && (
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
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
            </label>
          </div>
        </div>

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
          subLabel="등록된 인테리어 업체가 요청 내용을 바탕으로 제안서를 보낼 수 있습니다."
          required={true}
        />
        <CheckboxItem
          checked={formData.agreeMarketing}
          onChange={(v) => onChange("agreeMarketing", v)}
          label="이벤트/프로모션 안내 수신 동의"
          subLabel="할인쿠폰, 시공 이벤트, 프로모션 등의 혜택 정보를 받아보실 수 있습니다."
          required={false}
        />
      </div>

      {/* 하단 안심 문구 */}
      <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3.5 text-center">
        <p className="text-sm font-semibold text-orange-700">계약 의무 없음</p>
        <p className="mt-0.5 text-xs text-orange-600 leading-relaxed">
          제안을 받아보신 후 마음에 드는 업체를 직접 고르시면 됩니다.
          <br />
          원하지 않으시면 언제든지 무시하셔도 됩니다.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 폼 컨트롤러
// ─────────────────────────────────────────────

export default function MultiStepFormV2() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormDataV2>(INITIAL_FORM_DATA);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(
    null
  );
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [pushStatus, setPushStatus] = useState<
    "idle" | "subscribed" | "denied" | "unsupported"
  >("idle");
  const [showPushModal, setShowPushModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [loadingStep, setLoadingStep] = useState<"step1" | "step2" | "step3">(
    "step1"
  );
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    trackFormStart();
    captureUtmParams();
  }, []);

  // 브라우저 뒤로가기 핸들링
  useEffect(() => {
    window.history.replaceState({ step: 1 }, "");
  }, []);

  useEffect(() => {
    if (currentStep > 1) {
      window.history.pushState({ step: currentStep }, "");
    }
  }, [currentStep]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isSubmitted || isLoading) {
        window.history.pushState(null, "");
        return;
      }
      const prevStep = e.state?.step;
      if (
        typeof prevStep === "number" &&
        prevStep >= 1 &&
        prevStep < currentStep
      ) {
        setError(null);
        setCurrentStep(prevStep);
      } else if (!prevStep && currentStep > 1) {
        setError(null);
        setCurrentStep(1);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep, isSubmitted, isLoading]);

  const handleChange = (
    field: keyof FormDataV2,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, spacePhoto: file }));
  };

  const transitionStep = (nextStep: number, dir: "forward" | "backward") => {
    setDirection(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setIsAnimating(false);
    }, 250);
  };

  const handleNext = () => {
    const validationError = validateStep(currentStep, formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    trackStepComplete(currentStep);
    if (currentStep < TOTAL_STEPS) {
      transitionStep(currentStep + 1, "forward");
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      transitionStep(currentStep - 1, "backward");
    }
  };

  const handleSubmit = async () => {
    const validationError = validateStep(3, formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    trackFormSubmit();

    // 관리자 페이지용 저장 — 기존 API 호환성 유지 (없는 필드는 빈 값)
    const saveToAdmin = async (generatedImageBase64?: string | null) => {
      try {
        const body = new FormData();
        body.append("spaceType", formData.spaceType);
        body.append("region", "");
        body.append("regionDetail", "");
        body.append("buildingName", "");
        body.append("area", formData.area);
        body.append("areaUnknown", String(formData.areaUnknown));
        body.append("currentCondition", "");
        body.append("buildingAge", "");
        body.append("constructionScope", formData.constructionScope);
        body.append("desiredTiming", formData.desiredTiming);
        body.append("budget", formData.budget);
        body.append("structuralChange", "");
        body.append("renovationAreas", "[]");
        body.append("renovationNote", "");
        body.append("additionalRequest", formData.additionalRequest);
        body.append("name", formData.name);
        body.append("phone", formData.phone);
        body.append("email", formData.email);
        body.append("contactMethod", "[]");
        body.append("availableTime", "[]");
        body.append("agreePrivacy", String(formData.agreePrivacy));
        body.append("agreeConsult", String(formData.agreeConsult));
        body.append("agreeMarketing", String(formData.agreeMarketing));
        if (formData.spacePhoto) body.append("spacePhoto", formData.spacePhoto);
        if (generatedImageBase64)
          body.append("generatedImage", generatedImageBase64);

        const res = await fetch("/api/submissions", { method: "POST", body });
        const result = await res.json();
        if (result.id) {
          setSubmissionId(result.id);
          setShowPushModal(true);
        }
      } catch {
        console.error("[saveToAdmin] 저장 실패");
      }
    };

    // 사진 없으면 AI 생성 없이 즉시 완료
    if (!formData.spacePhoto) {
      await saveToAdmin();
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);
    setLoadingStep("step1");
    setElapsed(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    setTimeout(() => setLoadingStep("step3"), 8000);

    try {
      const body = new FormData();
      body.append("spacePhoto", formData.spacePhoto);
      body.append("renovationAreas", "[]");
      body.append("additionalRequest", formData.additionalRequest);
      body.append("spaceType", formData.spaceType);
      body.append("area", formData.area);
      body.append("budget", formData.budget);

      const res = await fetch("/api/generate-interior", {
        method: "POST",
        body,
      });
      const data = await res.json();

      if (data.imageBase64) {
        setGeneratedImage(data.imageBase64);
        trackAIImageGenerated();
        if (data.debug) setDebugInfo(data.debug);
        await saveToAdmin(data.imageBase64);
      } else {
        setGenerationError(data.error ?? "이미지 생성에 실패했습니다.");
        await saveToAdmin();
      }
    } catch {
      setGenerationError("네트워크 오류가 발생했습니다.");
      await saveToAdmin();
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsLoading(false);
      setIsSubmitted(true);
    }
  };

  // ─── 로딩 화면 ───────────────────────────────

  if (isLoading) {
    const LOADING_STEPS = [
      {
        key: "step1",
        label: "공간 구조 분석 중",
        desc: "AI가 공간의 구조와 특징을 파악합니다",
      },
      {
        key: "step3",
        label: "인테리어 이미지 생성 중",
        desc: "분석 결과를 바탕으로 완성본을 만듭니다",
      },
    ] as const;
    const currentIdx = LOADING_STEPS.findIndex((s) => s.key === loadingStep);

    return (
      <div id="form" className="w-full max-w-lg mx-auto">
        <div className="rounded-2xl bg-white shadow-lg shadow-gray-100/60 border border-gray-100 px-6 py-10 sm:px-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <div
                className="h-8 w-8 animate-spin rounded-full border-orange-200 border-t-orange-500"
                style={{ borderWidth: "3px" }}
              />
            </div>
            <p className="text-base font-semibold text-gray-800">
              인테리어 미리보기 생성 중
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {elapsed}초 경과 · 약 30~45초 소요
            </p>
          </div>

          <ol className="space-y-3">
            {LOADING_STEPS.map((s, i) => {
              const isDone = i < currentIdx;
              const isActive = i === currentIdx;
              return (
                <li
                  key={s.key}
                  className={`flex items-start gap-3 rounded-xl px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-orange-50 border border-orange-100"
                      : isDone
                      ? "bg-gray-50"
                      : "bg-gray-50 opacity-40"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isDone
                        ? "bg-orange-500 text-white"
                        : isActive
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {isDone ? (
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5L4.5 7.5L8 3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-orange-700"
                          : isDone
                          ? "text-gray-500"
                          : "text-gray-400"
                      }`}
                    >
                      {s.label}
                      {isActive && (
                        <span className="ml-1.5 animate-pulse">...</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    );
  }

  // ─── 완료 화면 ───────────────────────────────

  if (isSubmitted) {
    return (
      <div id="form" className="w-full max-w-lg mx-auto">
        {/* 푸시 알림 모달 */}
        {showPushModal && pushStatus === "idle" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-6 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                  <svg
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">
                  견적 도착 알림 받기
                </h3>
                <p className="mt-1 text-sm text-orange-100">
                  무료로 설정할 수 있어요
                </p>
              </div>
              <div className="px-6 py-5">
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-orange-500">✓</span>
                    <span>
                      업체에서{" "}
                      <strong>견적을 보내면 즉시</strong> 알림을 받아요
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-orange-500">✓</span>
                    <span>브라우저를 닫아도 알림이 도착해요</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-orange-500">✓</span>
                    <span>광고 없이 견적 관련 알림만 발송해요</span>
                  </li>
                </ul>
                <button
                  onClick={async () => {
                    if (
                      !("Notification" in window) ||
                      !("serviceWorker" in navigator)
                    ) {
                      setPushStatus("unsupported");
                      setShowPushModal(false);
                      return;
                    }
                    try {
                      const permission =
                        await Notification.requestPermission();
                      if (permission !== "granted") {
                        setPushStatus("denied");
                        setShowPushModal(false);
                        return;
                      }
                      const reg = await navigator.serviceWorker.ready;
                      const sub = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey:
                          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                      });
                      await fetch("/api/push/subscribe", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          submissionId,
                          subscription: sub.toJSON(),
                          customerName: formData.name,
                        }),
                      });
                      setPushStatus("subscribed");
                      setShowPushModal(false);
                    } catch {
                      setPushStatus("unsupported");
                      setShowPushModal(false);
                    }
                  }}
                  className="mt-5 w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white hover:bg-orange-600 active:bg-orange-700 transition-colors"
                >
                  알림 허용하기
                </button>
                <button
                  onClick={() => setShowPushModal(false)}
                  className="mt-2 w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  나중에 하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 라이트박스 전체화면 */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center p-4">
              <Image
                src={
                  generatedImage
                    ? `data:image/png;base64,${generatedImage}`
                    : "/after.jpg"
                }
                alt="예상 완성 인테리어 이미지"
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </button>
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/50">
                화면을 클릭하면 닫힙니다
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white shadow-lg shadow-gray-100/60 border border-gray-100 overflow-hidden">
          {/* AI 생성 인테리어 이미지 */}
          {generationError ? (
            <div className="px-6 py-6 bg-red-50 border-b border-red-100 text-center">
              <p className="text-sm font-medium text-red-600 mb-1">
                이미지 생성 오류
              </p>
              <p className="text-xs text-red-400">{generationError}</p>
            </div>
          ) : (
            <>
              <div
                className="relative w-full aspect-video cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
              >
                <Image
                  src={
                    generatedImage
                      ? `data:image/png;base64,${generatedImage}`
                      : "/after.jpg"
                  }
                  alt="예상 완성 인테리어 이미지"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  예상 완성 인테리어 이미지
                </span>
                <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-sm">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 8V3m0 0h5M3 3l6 6m8-6h-5m5 0v5m0-5l-6 6M3 17v-5m0 5h5m-5 0l6-6m8 6l-6-6m6 6v-5m0 5h-5" />
                  </svg>
                </div>
              </div>
              <p className="px-4 py-2 text-center text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                해당 이미지는 AI가 만든 이미지이므로 실제 결과물과 다를 수
                있습니다.
              </p>
            </>
          )}

          <div className="px-6 py-8 sm:px-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
              <svg
                className="h-7 w-7 text-orange-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 sm:text-2xl">
              견적 요청이 접수되었습니다
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              입력해주신 정보를 바탕으로 상담 및 완성된 인테리어 미리보기
              준비를 진행합니다.
            </p>
            <p className="mt-2 text-gray-500 text-sm leading-relaxed">
              작성해주신 연락처로 순차적으로 안내드릴 예정입니다.
            </p>

            <div className="mt-7 rounded-xl bg-gray-50 border border-gray-100 px-5 py-5 text-left">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 text-center">
                이렇게 진행됩니다
              </p>
              <ol className="flex flex-col gap-3">
                {COMPLETION_STEPS.map((item) => (
                  <li key={item.step} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* 디버그 패널 */}
            {debugInfo && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setIsDebugOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-3.5 w-3.5 text-gray-400"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M6.5 1a.5.5 0 000 1h3a.5.5 0 000-1h-3zM11 2.5v1h1a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2h1v-1H4a3 3 0 00-3 3v7a3 3 0 003 3h8a3 3 0 003-3v-7a3 3 0 00-3-3h-1zM8 7a.5.5 0 01.5.5v2.793l1.146-1.147a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 01.708-.708L7.5 10.293V7.5A.5.5 0 018 7z" />
                    </svg>
                    AI 프롬프트 디버그 정보
                  </span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      isDebugOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z" />
                  </svg>
                </button>
                {isDebugOpen && (
                  <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                    <div className="border-b border-gray-200 px-4 py-2.5 bg-white">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-600">
                          model: {String(debugInfo.model)}
                        </span>
                        <span className="rounded-full bg-purple-50 px-2.5 py-0.5 font-medium text-purple-600">
                          mode: {String(debugInfo.mode)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-medium ${
                            debugInfo.hasSpacePhoto
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          spacePhoto: {debugInfo.hasSpacePhoto ? "✓" : "✗"}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <p className="mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Prompt
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap break-all bg-white rounded-lg border border-gray-100 px-3 py-2">
                        {String(debugInfo.prompt)}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-3">
                      <p className="mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Raw Inputs
                      </p>
                      <pre className="text-xs text-gray-600 leading-relaxed overflow-x-auto bg-white rounded-lg border border-gray-100 px-3 py-2">
                        {JSON.stringify(debugInfo.inputs, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 푸시 알림 상태 */}
            {pushStatus === "subscribed" && (
              <div className="mt-5 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-center">
                <p className="text-sm font-medium text-green-700">
                  알림이 설정되었습니다!
                </p>
              </div>
            )}
            {pushStatus === "denied" && (
              <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">
                  알림이 차단되었습니다. 브라우저 설정에서 허용해주세요.
                </p>
              </div>
            )}
            {submissionId && pushStatus === "idle" && !showPushModal && (
              <button
                onClick={() => setShowPushModal(true)}
                className="mt-4 w-full rounded-xl border border-orange-200 bg-orange-50 py-3 text-sm font-medium text-orange-600 hover:bg-orange-100 transition-colors"
              >
                견적 도착 알림 받기
              </button>
            )}

            {/* 내 견적 페이지 링크 */}
            {submissionId && (
              <div className="mt-4 rounded-xl bg-orange-50 border border-orange-200 p-4">
                <p className="text-xs font-semibold text-orange-700 mb-1">
                  견적 현황 페이지 (이메일로도 발송됨)
                </p>
                <p className="text-xs text-orange-500 mb-3 break-all">
                  /my/{submissionId}
                </p>
                <a
                  href={`/my/${submissionId}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  내 견적 현황 바로 보기
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── 폼 화면 ─────────────────────────────────

  const progressPercent = ((currentStep - 1) / TOTAL_STEPS) * 100;

  return (
    <div id="form" className="w-full max-w-lg mx-auto">
      <div className="rounded-2xl bg-white shadow-lg shadow-gray-100/60 border border-gray-100 overflow-hidden">
        {/* Progress Header */}
        <div className="px-6 pt-6 pb-4 sm:px-8 sm:pt-7">
          {/* Step 1에서만 서비스 안내 카드 */}
          {currentStep === 1 ? (
            <div className="mb-5 rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50/60 px-4 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-lg">
                  <svg
                    className="h-5 w-5 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                    />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    1분 안에 작성하고 비교견적 +{" "}
                    <span className="text-orange-600">AI 인테리어 미리보기</span>를
                    받으세요
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    간단한 정보만 입력하면 검증된 업체 견적을 한 번에 비교할 수
                    있어요
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200/60">
                  <svg
                    className="h-3 w-3 text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  검증된 업체 3곳+ 비교
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200/60">
                  <svg
                    className="h-3 w-3 text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  완전 무료
                </span>
              </div>
            </div>
          ) : (
            <p className="mb-4 text-xs text-gray-400 leading-relaxed text-center bg-gray-50 rounded-lg px-3 py-2">
              필수 항목만 입력하셔도 상담 신청이 가능합니다.
            </p>
          )}

          {/* 스텝 레이블 + 카운터 */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
              {STEP_LABELS[currentStep - 1]}
            </span>
            <span className="text-sm font-semibold text-gray-500">
              <span className="text-orange-500">{currentStep}</span>
              <span className="text-gray-300"> / </span>
              {TOTAL_STEPS}
            </span>
          </div>

          {/* 프로그레스 바 */}
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500 ease-out"
              style={{
                width: `${progressPercent + (100 / TOTAL_STEPS)}%`,
              }}
            />
          </div>

          {/* 스텝 인디케이터 */}
          <div className="mt-3 flex items-center justify-between">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const stepNum = i + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <div key={stepNum} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? "bg-orange-500 text-white"
                        : isCurrent
                        ? "bg-orange-100 text-orange-600 ring-2 ring-orange-300"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="h-2.5 w-2.5"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5L4.5 7.5L8 3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 폼 콘텐츠 */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div
            className={`transition-all duration-200 ${
              isAnimating
                ? direction === "forward"
                  ? "opacity-0 translate-x-4"
                  : "opacity-0 -translate-x-4"
                : "opacity-100 translate-x-0"
            }`}
          >
            {currentStep === 1 && (
              <StepOne formData={formData} onChange={handleChange} />
            )}
            {currentStep === 2 && (
              <StepTwo
                formData={formData}
                onChange={handleChange}
                onFileChange={handleFileChange}
              />
            )}
            {currentStep === 3 && (
              <StepThree formData={formData} onChange={handleChange} />
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <svg
                className="h-4 w-4 shrink-0 text-red-400"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.5a.5.5 0 01.5.5v4a.5.5 0 01-1 0V5a.5.5 0 01.5-.5zm0 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 네비게이션 버튼 */}
          <div className="mt-6 flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M10 3L5 8L10 13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                이전
              </button>
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
              >
                다음
                <svg
                  className="h-4 w-4"
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
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
              >
                무료 견적 요청 완료하기
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M2 8L6 12L14 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
