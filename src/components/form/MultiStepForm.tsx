"use client";

import { useState } from "react";
import Image from "next/image";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";

export interface FormData {
  // Step 1 - 공간 기본 정보
  spaceType: string;
  region: string;
  area: string;
  areaUnknown: boolean;
  currentCondition: string;
  buildingAge: string;
  // Step 2 - 공사 희망 정보
  constructionScope: string;
  desiredTiming: string;
  budget: string;
  constructionPurpose: string;
  scheduleFlexibility: string;
  occupancyDuringWork: string;
  // Step 3 - 취향 및 우선순위
  priorities: string[];
  preferredStyles: string[];
  preferredAtmosphere: string;
  currentProblems: string[];
  // Step 4 - 이미지 및 요청사항
  spacePhoto: File | null;
  referenceImage: File | null;
  additionalRequest: string;
  // Step 5 - 개인정보 및 동의
  name: string;
  phone: string;
  email: string;
  contactMethod: string[];
  availableTime: string[];
  agreePrivacy: boolean;
  agreeConsult: boolean;
  agreeMarketing: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  spaceType: "",
  region: "",
  area: "",
  areaUnknown: false,
  currentCondition: "",
  buildingAge: "",
  constructionScope: "",
  desiredTiming: "",
  budget: "",
  constructionPurpose: "",
  scheduleFlexibility: "",
  occupancyDuringWork: "",
  priorities: [],
  preferredStyles: [],
  preferredAtmosphere: "",
  currentProblems: [],
  spacePhoto: null,
  referenceImage: null,
  additionalRequest: "",
  name: "",
  phone: "",
  email: "",
  contactMethod: [],
  availableTime: [],
  agreePrivacy: false,
  agreeConsult: false,
  agreeMarketing: false,
};

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  "공간 기본 정보",
  "공사 희망 정보",
  "취향 및 우선순위",
  "이미지 및 요청사항",
  "개인정보 및 동의",
];

function validateStep(step: number, formData: FormData): string | null {
  if (step === 1) {
    if (!formData.spaceType) return "공간 유형을 선택해주세요.";
    if (!formData.region) return "지역을 선택해주세요.";
    if (!formData.area && !formData.areaUnknown) return "면적을 입력하거나 '잘 모르겠음'을 선택해주세요.";
  }
  if (step === 2) {
    if (!formData.constructionScope) return "공사 범위를 선택해주세요.";
    if (!formData.desiredTiming) return "공사 희망 시기를 선택해주세요.";
    if (!formData.budget) return "예산 범위를 선택해주세요.";
  }
  if (step === 3) {
    if (formData.priorities.length === 0) return "중요하게 생각하는 요소를 1개 이상 선택해주세요.";
  }
  if (step === 5) {
    if (!formData.name.trim()) return "이름을 입력해주세요.";
    if (!formData.phone.trim()) return "연락처를 입력해주세요.";
    if (!formData.agreePrivacy) return "개인정보 수집 및 이용에 동의해주세요.";
    if (!formData.agreeConsult) return "상담 진행을 위한 연락 수신에 동의해주세요.";
  }
  return null;
}

const COMPLETION_STEPS = [
  { step: 1, title: "견적 요청 검토", description: "입력하신 정보와 이미지를 바탕으로 준비합니다" },
  { step: 2, title: "업체 매칭 및 상담 준비", description: "조건에 맞는 업체를 선별합니다" },
  { step: 3, title: "담당자 연락 및 결과 전달", description: "작성하신 연락처로 순차 안내드립니다" },
] as const;

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleMultiChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      const updated = checked ? [...current, value] : current.filter((v) => v !== value);
      return { ...prev, [field]: updated };
    });
    setError(null);
  };

  const handleFileChange = (field: "spacePhoto" | "referenceImage", file: File | null) => {
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
    const validationError = validateStep(5, formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div id="form" className="w-full max-w-lg mx-auto">
        <div className="rounded-2xl bg-white shadow-lg shadow-gray-100/60 border border-gray-100 px-6 py-16 sm:px-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-orange-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
          </div>
          <p className="text-base font-semibold text-gray-800 animate-pulse">
            완성된 인테리어 미리보기를 생성 중입니다...
          </p>
          <p className="mt-2 text-sm text-gray-400">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div id="form" className="w-full max-w-lg mx-auto">
        {/* 라이트박스 전체화면 오버레이 */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative w-full h-full max-w-5xl mx-auto flex items-center justify-center p-4">
              <Image
                src="/after.jpg"
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
          <div
            className="relative w-full aspect-video cursor-zoom-in group"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image
              src="/after.jpg"
              alt="예상 완성 인테리어 이미지"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <span className="absolute top-3 left-3 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              예상 완성 인테리어 이미지
            </span>
            {/* 확대 힌트 아이콘 */}
            <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-sm">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 8V3m0 0h5M3 3l6 6m8-6h-5m5 0v5m0-5l-6 6M3 17v-5m0 5h5m-5 0l6-6m8 6l-6-6m6 6v-5m0 5h-5" />
              </svg>
            </div>
          </div>
          {/* 이미지 하단 면책 문구 */}
          <p className="px-4 py-2 text-center text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
            해당 이미지는 AI가 만든 이미지이므로 실제 결과물과 다를 수 있습니다.
          </p>

          <div className="px-6 py-8 sm:px-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
              <svg className="h-7 w-7 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 sm:text-2xl">
              견적 요청이 접수되었습니다
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              입력해주신 정보와 이미지를 바탕으로 상담 및 완성된 인테리어 미리보기 준비를 진행합니다.
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
                      <p className="text-sm font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
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
          {/* 안내 문구 */}
          <p className="mb-4 text-xs text-gray-400 leading-relaxed text-center bg-gray-50 rounded-lg px-3 py-2">
            필수 항목만 입력하셔도 상담 신청이 가능합니다.
            추가 정보를 작성해주실수록 더 정확한 견적과 완성된 인테리어 미리보기를 받을 수 있습니다.
          </p>

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
              <Step1 formData={formData} onChange={handleChange} />
            )}
            {currentStep === 2 && (
              <Step2
                formData={formData}
                onChange={handleChange as (field: keyof FormData, value: string) => void}
              />
            )}
            {currentStep === 3 && (
              <Step3
                formData={formData}
                onMultiChange={handleMultiChange}
                onChange={handleChange as (field: keyof FormData, value: string) => void}
              />
            )}
            {currentStep === 4 && (
              <Step4
                formData={formData}
                onFileChange={handleFileChange}
                onChange={handleChange as (field: keyof FormData, value: string) => void}
              />
            )}
            {currentStep === 5 && (
              <Step5
                formData={formData}
                onChange={handleChange}
                onMultiChange={handleMultiChange}
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
