"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import { trackFormStart, trackStepComplete, trackFormSubmit, trackAIImageGenerated, captureUtmParams } from "@/lib/tracking";

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
    if (!formData.email.trim()) return "이메일을 입력해주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "올바른 이메일 형식으로 입력해주세요.";
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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [pushStatus, setPushStatus] = useState<"idle" | "subscribed" | "denied" | "unsupported">("idle");
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [loadingStep, setLoadingStep] = useState<"step1" | "step2" | "step3">("step1");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    trackFormStart();
    captureUtmParams();
  }, []);

  // 브라우저 뒤로가기 버튼으로 이전 단계 이동
  useEffect(() => {
    // 초기 히스토리 상태 설정
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
        // 제출/로딩 중에는 뒤로가기 무시
        window.history.pushState(null, "");
        return;
      }
      const prevStep = e.state?.step;
      if (typeof prevStep === "number" && prevStep >= 1 && prevStep < currentStep) {
        setError(null);
        setCurrentStep(prevStep);
      } else if (!prevStep && currentStep > 1) {
        // state가 없으면 1단계로
        setError(null);
        setCurrentStep(1);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep, isSubmitted, isLoading]);

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
    const validationError = validateStep(5, formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    trackFormSubmit();

    // 제출 데이터를 관리자 페이지용으로 저장하는 함수
    const saveToAdmin = async (generatedImageBase64?: string | null) => {
      try {
        const body = new FormData();
        // 모든 폼 필드 전송
        body.append("spaceType", formData.spaceType);
        body.append("region", formData.region);
        body.append("area", formData.area);
        body.append("areaUnknown", String(formData.areaUnknown));
        body.append("currentCondition", formData.currentCondition);
        body.append("buildingAge", formData.buildingAge);
        body.append("constructionScope", formData.constructionScope);
        body.append("desiredTiming", formData.desiredTiming);
        body.append("budget", formData.budget);
        body.append("constructionPurpose", formData.constructionPurpose);
        body.append("scheduleFlexibility", formData.scheduleFlexibility);
        body.append("occupancyDuringWork", formData.occupancyDuringWork);
        body.append("priorities", JSON.stringify(formData.priorities));
        body.append("preferredStyles", JSON.stringify(formData.preferredStyles));
        body.append("preferredAtmosphere", formData.preferredAtmosphere);
        body.append("currentProblems", JSON.stringify(formData.currentProblems));
        body.append("additionalRequest", formData.additionalRequest);
        body.append("name", formData.name);
        body.append("phone", formData.phone);
        body.append("email", formData.email);
        body.append("contactMethod", JSON.stringify(formData.contactMethod));
        body.append("availableTime", JSON.stringify(formData.availableTime));
        body.append("agreePrivacy", String(formData.agreePrivacy));
        body.append("agreeConsult", String(formData.agreeConsult));
        body.append("agreeMarketing", String(formData.agreeMarketing));
        // 이미지 파일
        if (formData.spacePhoto) body.append("spacePhoto", formData.spacePhoto);
        if (formData.referenceImage) body.append("referenceImage", formData.referenceImage);
        if (generatedImageBase64) body.append("generatedImage", generatedImageBase64);

        const res = await fetch("/api/submissions", { method: "POST", body });
        const result = await res.json();
        if (result.id) setSubmissionId(result.id);
      } catch {
        console.error("[saveToAdmin] 저장 실패");
      }
    };

    // 공간 사진 없으면 AI 생성 없이 바로 완료
    if (!formData.spacePhoto) {
      saveToAdmin();
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

    // 로딩 스텝 전환 (서버 처리 시간 추정)
    const hasRef = !!formData.referenceImage;
    setTimeout(() => setLoadingStep(hasRef ? "step2" : "step3"), 8000);
    if (hasRef) setTimeout(() => setLoadingStep("step3"), 13000);

    try {
      const body = new FormData();
      body.append("spacePhoto", formData.spacePhoto);
      if (formData.referenceImage) body.append("referenceImage", formData.referenceImage);
      body.append("priorities", JSON.stringify(formData.priorities));
      body.append("preferredStyles", JSON.stringify(formData.preferredStyles));
      body.append("preferredAtmosphere", formData.preferredAtmosphere);
      body.append("additionalRequest", formData.additionalRequest);
      body.append("spaceType", formData.spaceType);
      body.append("area", formData.area);
      body.append("budget", formData.budget);

      const res = await fetch("/api/generate-interior", { method: "POST", body });
      const data = await res.json();

      if (data.imageBase64) {
        setGeneratedImage(data.imageBase64);
        trackAIImageGenerated();
        if (data.debug) setDebugInfo(data.debug);
        saveToAdmin(data.imageBase64);
      } else {
        setGenerationError(data.error ?? "이미지 생성에 실패했습니다.");
        saveToAdmin();
      }
    } catch {
      setGenerationError("네트워크 오류가 발생했습니다.");
      saveToAdmin();
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsLoading(false);
      setIsSubmitted(true);
    }
  };

  if (isLoading) {
    const LOADING_STEPS = [
      { key: "step1", label: "공간 구조 분석 중", desc: "AI가 공간의 구조와 특징을 파악합니다" },
      { key: "step2", label: "참고 이미지 스타일 분석 중", desc: "원하시는 색상과 분위기를 추출합니다" },
      { key: "step3", label: "인테리어 이미지 생성 중", desc: "분석 결과를 바탕으로 완성본을 만듭니다" },
    ] as const;
    const hasRef = !!formData.referenceImage;
    const visibleSteps = hasRef ? LOADING_STEPS : [LOADING_STEPS[0], LOADING_STEPS[2]];
    const currentIdx = visibleSteps.findIndex((s) => s.key === loadingStep);

    return (
      <div id="form" className="w-full max-w-lg mx-auto">
        <div className="rounded-2xl bg-white shadow-lg shadow-gray-100/60 border border-gray-100 px-6 py-10 sm:px-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <div className="h-8 w-8 animate-spin rounded-full border-orange-200 border-t-orange-500" style={{ borderWidth: "3px" }} />
            </div>
            <p className="text-base font-semibold text-gray-800">인테리어 미리보기 생성 중</p>
            <p className="mt-1 text-sm text-gray-400">{elapsed}초 경과 · 약 {hasRef ? "50~70" : "30~45"}초 소요</p>
          </div>

          <ol className="space-y-3">
            {visibleSteps.map((s, i) => {
              const isDone = i < currentIdx;
              const isActive = i === currentIdx;
              return (
                <li key={s.key} className={`flex items-start gap-3 rounded-xl px-4 py-3 transition-colors ${
                  isActive ? "bg-orange-50 border border-orange-100" : isDone ? "bg-gray-50" : "bg-gray-50 opacity-40"
                }`}>
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isDone ? "bg-orange-500 text-white" : isActive ? "bg-orange-100 text-orange-600" : "bg-gray-200 text-gray-400"
                  }`}>
                    {isDone ? (
                      <svg className="h-3 w-3" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4.5 7.5L8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : i + 1}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${isActive ? "text-orange-700" : isDone ? "text-gray-500" : "text-gray-400"}`}>
                      {s.label}
                      {isActive && <span className="ml-1.5 animate-pulse">...</span>}
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
                src={generatedImage ? `data:image/png;base64,${generatedImage}` : "/after.jpg"}
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
              <p className="text-sm font-medium text-red-600 mb-1">이미지 생성 오류</p>
              <p className="text-xs text-red-400">{generationError}</p>
            </div>
          ) : (
            <>
              <div
                className="relative w-full aspect-video cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
              >
                <Image
                  src={generatedImage ? `data:image/png;base64,${generatedImage}` : "/after.jpg"}
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
            </>
          )}

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

            {/* 디버그 패널 */}
            {debugInfo && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setIsDebugOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6.5 1a.5.5 0 000 1h3a.5.5 0 000-1h-3zM11 2.5v1h1a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2h1v-1H4a3 3 0 00-3 3v7a3 3 0 003 3h8a3 3 0 003-3v-7a3 3 0 00-3-3h-1zM8 7a.5.5 0 01.5.5v2.793l1.146-1.147a.5.5 0 01.708.708l-2 2a.5.5 0 01-.708 0l-2-2a.5.5 0 01.708-.708L7.5 10.293V7.5A.5.5 0 018 7z" />
                    </svg>
                    AI 프롬프트 디버그 정보
                  </span>
                  <svg
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDebugOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 16 16" fill="currentColor"
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
                        <span className={`rounded-full px-2.5 py-0.5 font-medium ${debugInfo.hasSpacePhoto ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          spacePhoto: {debugInfo.hasSpacePhoto ? "✓" : "✗"}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 font-medium ${debugInfo.hasReferenceImage ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                          referenceImage: {debugInfo.hasReferenceImage ? "✓" : "✗"}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <p className="mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prompt</p>
                      <p className="text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap break-all bg-white rounded-lg border border-gray-100 px-3 py-2">
                        {String(debugInfo.prompt)}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-3">
                      <p className="mb-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Raw Inputs</p>
                      <pre className="text-xs text-gray-600 leading-relaxed overflow-x-auto bg-white rounded-lg border border-gray-100 px-3 py-2">
                        {JSON.stringify(debugInfo.inputs, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 푸시 알림 CTA */}
            {submissionId && pushStatus === "idle" && (
              <div className="mt-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 px-5 py-5 text-white text-left">
                <p className="text-sm font-bold mb-1">견적 도착 알림 받기</p>
                <p className="text-xs text-orange-100 mb-3">
                  업체에서 견적을 보내면 즉시 알림을 보내드립니다. 브라우저를 닫아도 알림이 도착합니다.
                </p>
                <button
                  onClick={async () => {
                    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
                      setPushStatus("unsupported");
                      return;
                    }
                    try {
                      const permission = await Notification.requestPermission();
                      if (permission !== "granted") { setPushStatus("denied"); return; }
                      const reg = await navigator.serviceWorker.ready;
                      const sub = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
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
                    } catch { setPushStatus("unsupported"); }
                  }}
                  className="w-full rounded-lg bg-white text-orange-600 py-2.5 text-sm font-bold hover:bg-orange-50 transition-colors"
                >
                  알림 허용하기
                </button>
              </div>
            )}
            {pushStatus === "subscribed" && (
              <div className="mt-5 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-center">
                <p className="text-sm font-medium text-green-700">알림이 설정되었습니다!</p>
              </div>
            )}
            {pushStatus === "denied" && (
              <div className="mt-5 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">알림이 차단되었습니다. 브라우저 설정에서 허용해주세요.</p>
              </div>
            )}

            {/* 내 견적 페이지 링크 */}
            {submissionId && (
              <a
                href={`/my/${submissionId}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                내 견적 상태 확인하기
              </a>
            )}
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
