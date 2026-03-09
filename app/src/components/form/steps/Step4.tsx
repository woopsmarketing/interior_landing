"use client";

import { FormData } from "../MultiStepForm";

interface Step4Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: boolean) => void;
}

export default function Step4({ formData, onChange }: Step4Props) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        아래 내용에 동의하시면 견적 요청이 완료됩니다.
      </p>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 transition-colors hover:border-orange-200 hover:bg-orange-50/30">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={formData.agreePrivacy}
              onChange={(e) => onChange("agreePrivacy", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                formData.agreePrivacy
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300 bg-white"
              }`}
            >
              {formData.agreePrivacy && (
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
              개인정보 수집 및 이용 동의{" "}
              <span className="text-orange-500">(필수)</span>
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              이름, 연락처 등 입력하신 정보를 견적 요청 목적으로 수집합니다.{" "}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-orange-500 underline hover:text-orange-600"
              >
                개인정보처리방침 보기
              </a>
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 transition-colors hover:border-orange-200 hover:bg-orange-50/30">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={formData.agreeConsult}
              onChange={(e) => onChange("agreeConsult", e.target.checked)}
              className="sr-only"
            />
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                formData.agreeConsult
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-300 bg-white"
              }`}
            >
              {formData.agreeConsult && (
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
              상담 및 견적 요청 동의{" "}
              <span className="text-orange-500">(필수)</span>
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              등록된 인테리어 업체가 요청 내용을 바탕으로 견적을 제안할 수 있습니다.
            </p>
          </div>
        </label>
      </div>

      <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3.5">
        <p className="text-sm text-orange-800 leading-relaxed text-center">
          꼭 계약하지 않아도 됩니다. 비교 후 원하시는 경우에만 선택하시면 됩니다.
        </p>
      </div>
    </div>
  );
}
