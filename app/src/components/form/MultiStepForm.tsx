"use client";

import { useState } from "react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

export interface FormData {
  // Step 1
  name: string;
  phone: string;
  region: string;
  spaceType: string;
  // Step 2
  budget: string;
  scope: string[];
  style: string[];
  priorities: string[];
  details: string;
  // Step 3
  spacePhoto: File | null;
  referenceImage: File | null;
  // Step 4
  agreePrivacy: boolean;
  agreeConsult: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  phone: "",
  region: "",
  spaceType: "",
  budget: "",
  scope: [],
  style: [],
  priorities: [],
  details: "",
  spacePhoto: null,
  referenceImage: null,
  agreePrivacy: false,
  agreeConsult: false,
};

const TOTAL_STEPS = 4;

const STEP_LABELS = ["기본 정보", "인테리어 정보", "사진 첨부", "동의 및 제출"];

function validateStep(step: number, formData: FormData): string | null {
  if (step === 1) {
    if (!formData.name.trim()) return "이름을 입력해주세요.";
    if (!formData.phone.trim()) return "연락처를 입력해주세요.";
    if (!formData.region) return "지역을 선택해주세요.";
    if (!formData.spaceType) return "공간 유형을 선택해주세요.";
  }
  if (step === 4) {
    if (!formData.agreePrivacy) return "개인정보 수집 및 이용에 동의해주세요.";
    if (!formData.agreeConsult) return "상담 및 견적 요청에 동의해주세요.";
  }
  return null;
}

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleMultiChange = (
    field: keyof FormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      const updated = checked
        ? [...current, value]
        : current.filter((v) => v !== value);
      return { ...prev, [field]: updated };
    });
    setError(null);
  };

  const handleFileChange = (
    field: "spacePhoto" | "referenceImage",
    file: File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
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

  const handleSubmit = () => {
    const validationError = validateStep(4, formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    // TODO: 실제 API 연동 시 여기서 formData를 전송합니다.
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div id="form" className="w-full max-w-lg mx-auto">
        <div className="rounded-2xl bg-white shadow-lg shadow-gray-100/60 border border-gray-100 px-6 py-10 sm:px-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <svg
              className="h-8 w-8 text-orange-500"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            요청이 접수되었습니다
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            입력해주신 내용을 바탕으로 요청 사항을 정리한 뒤,
            업체 검토 및 견적 진행에 활용할 예정입니다.
          </p>
          {(formData.spacePhoto || formData.referenceImage) && (
            <p className="mt-3 text-gray-500 text-sm leading-relaxed">
              공간 사진과 참고 이미지를 첨부해주신 경우에는
              예시 이미지 제공에도 반영될 수 있습니다.
            </p>
          )}
        </div>
      </div>
    );
  }

  const progressPercent = ((currentStep - 1) / TOTAL_STEPS) * 100;

  return (
    <div id="form" className="w-full max-w-lg mx-auto">
      <div className="rounded-2xl bg-white shadow-lg shadow-gray-100/60 border border-gray-100 overflow-hidden">
        {/* Progress Header */}
        <div className="px-6 pt-6 pb-4 sm:px-8 sm:pt-7">
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
          {/* Progress Bar */}
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent + 100 / TOTAL_STEPS}%` }}
            />
          </div>
          {/* Step indicators */}
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
                      <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="none">
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

        {/* Form Content */}
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
              <Step1
                formData={formData}
                onChange={handleChange as (field: keyof FormData, value: string) => void}
              />
            )}
            {currentStep === 2 && (
              <Step2
                formData={formData}
                onChange={handleChange as (field: keyof FormData, value: string) => void}
                onMultiChange={handleMultiChange}
              />
            )}
            {currentStep === 3 && (
              <Step3
                formData={formData}
                onFileChange={handleFileChange}
              />
            )}
            {currentStep === 4 && (
              <Step4
                formData={formData}
                onChange={handleChange as (field: keyof FormData, value: boolean) => void}
              />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <svg className="h-4 w-4 shrink-0 text-red-400" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3.5a.5.5 0 01.5.5v4a.5.5 0 01-1 0V5a.5.5 0 01.5-.5zm0 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
              >
                무료 견적 요청 완료하기
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
