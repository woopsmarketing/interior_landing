"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const STYLE_OPTIONS = ["미니멀", "모던", "북유럽", "빈티지", "내추럴", "클래식", "인더스트리얼", "럭셔리"];
const SPACE_OPTIONS = ["거실", "주방", "침실", "욕실", "사무실", "원룸", "전체", "상가"];
const ATMOSPHERE_OPTIONS = ["따뜻한", "시원한", "아늑한", "개방적인", "차분한", "활기찬"];

type LoadingStep = "idle" | "step1" | "step2" | "step3";

type DebugInfo = {
  model: string;
  mode: string;
  apiCallCount: number;
  hasSpacePhoto: boolean;
  hasReferenceImage: boolean;
  referenceStyleBrief?: string | null;
  structureAnalysis?: string | null;
  prompt: string;
  inputs: Record<string, unknown>;
};

type Result = {
  imageBase64?: string;
  debug?: DebugInfo;
  error?: string;
};

export default function TestGeneratePage() {
  const [spacePhoto, setSpacePhoto] = useState<File | null>(null);
  const [spacePhotoPreview, setSpacePhotoPreview] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [refPreview, setRefPreview] = useState<string | null>(null);
  const [spaceType, setSpaceType] = useState("상가");
  const [area, setArea] = useState("20");
  const [styles, setStyles] = useState<string[]>([]);
  const [atmosphere, setAtmosphere] = useState("따뜻한");
  const [additionalRequest, setAdditionalRequest] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleSpacePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSpacePhoto(file);
    setSpacePhotoPreview(file ? URL.createObjectURL(file) : null);
    // 공간 사진이 없어지면 참고 이미지도 초기화
    if (!file) {
      setReferenceImage(null);
      setRefPreview(null);
    }
  };

  const handleRefImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setReferenceImage(file);
    setRefPreview(file ? URL.createObjectURL(file) : null);
  };

  const toggleStyle = (s: string) => {
    setStyles((prev) => prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]);
  };

  const handleSubmit = async () => {
    if (!spacePhoto) return;

    setIsLoading(true);
    setResult(null);
    setElapsed(null);
    setLoadingStep("step1");
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    try {
      const body = new FormData();
      body.append("spacePhoto", spacePhoto);
      if (referenceImage) body.append("referenceImage", referenceImage);
      body.append("spaceType", spaceType);
      body.append("area", area);
      body.append("budget", "");
      body.append("priorities", JSON.stringify(["디자인"]));
      body.append("preferredStyles", JSON.stringify(styles));
      body.append("preferredAtmosphere", atmosphere);
      body.append("additionalRequest", additionalRequest);

      // 로딩 스텝 전환 (서버 처리 시간 추정 기반)
      // Step1(공간분석) ~8s → Step2(참고이미지 있으면 ~5s) → Step3(이미지생성)
      const step2Delay = referenceImage ? 8000 : null;
      const step3Delay = referenceImage ? 13000 : 8000;

      if (step2Delay) {
        setTimeout(() => setLoadingStep("step2"), step2Delay);
      }
      setTimeout(() => setLoadingStep("step3"), step3Delay);

      const res = await fetch("/api/generate-interior", { method: "POST", body });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setIsLoading(false);
      setLoadingStep("idle");
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }
  };

  const loadingLabel = {
    idle: "",
    step1: `Step 1: 공간 구조 분석 중... ${elapsed ?? 0}초`,
    step2: `Step 2: 참고 이미지 스타일 분석 중... ${elapsed ?? 0}초`,
    step3: `Step 3: 인테리어 이미지 생성 중... ${elapsed ?? 0}초`,
  }[loadingStep];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto max-w-3xl space-y-5">

        {/* 헤더 */}
        <div className="rounded-2xl bg-orange-500 px-6 py-4 text-white">
          <h1 className="text-lg font-bold">🧪 AI 이미지 생성 테스트</h1>
          <p className="mt-0.5 text-sm text-orange-100">폼 5단계 없이 바로 API를 테스트합니다</p>
        </div>

        {/* 파이프라인 안내 */}
        <div className="rounded-2xl bg-blue-50 border border-blue-100 px-5 py-4">
          <p className="text-xs font-semibold text-blue-700 mb-2">3단계 파이프라인 (공간 사진 필수)</p>
          <div className="space-y-1 text-xs text-blue-600">
            <p><span className="font-medium">Step 1</span> — GPT-4o: 공간 구조 분석 (천장·기둥·창문 위치 추출)</p>
            <p><span className="font-medium text-teal-600">Step 2</span> — GPT-4o: 참고 이미지 스타일 분석 <span className="text-gray-400">(참고 이미지 첨부 시에만)</span></p>
            <p><span className="font-medium">Step 3</span> — gpt-image-1: 공간 구조 + 스타일을 조합해 이미지 생성</p>
          </div>
          <p className="mt-2 text-xs text-blue-400">공간 사진 O + 참고 이미지 O → API 3회 / 공간 사진만 → API 2회</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* 이미지 업로드 */}
          <div className="rounded-2xl bg-white border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">이미지 입력</h2>

            {/* 공간 사진 (필수) */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                현재 공간 사진
                <span className="ml-1.5 rounded-full bg-orange-100 px-2 py-0.5 text-orange-600 text-[10px]">필수</span>
                <span className="ml-1 text-blue-500 text-[10px]">→ edit 모드 + GPT-4o 분석</span>
              </label>
              <input type="file" accept="image/*" onChange={handleSpacePhoto}
                className="block w-full text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-orange-600 hover:file:bg-orange-100"
              />
              {spacePhotoPreview && (
                <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden border border-gray-100">
                  <Image src={spacePhotoPreview} alt="space preview" fill className="object-cover" />
                </div>
              )}
            </div>

            {/* 참고 이미지 (공간 사진 있을 때만 활성화) */}
            <div className={!spacePhoto ? "opacity-40 pointer-events-none" : ""}>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                참고 이미지
                <span className="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-gray-500 text-[10px]">선택</span>
                <span className="ml-1 text-teal-600 text-[10px]">→ 색상/분위기 참고용</span>
              </label>
              {!spacePhoto && (
                <p className="mb-1.5 text-[10px] text-gray-400">공간 사진을 먼저 업로드해야 사용할 수 있습니다</p>
              )}
              <input type="file" accept="image/*" onChange={handleRefImage} disabled={!spacePhoto}
                className="block w-full text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-teal-600 hover:file:bg-teal-100"
              />
              {refPreview && (
                <div className="mt-2 relative w-full aspect-video rounded-lg overflow-hidden border border-gray-100">
                  <Image src={refPreview} alt="ref preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* 설정 */}
          <div className="rounded-2xl bg-white border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">설정</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">공간 유형</label>
                <select value={spaceType} onChange={(e) => setSpaceType(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-orange-400 focus:outline-none"
                >
                  {SPACE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">면적</label>
                <input type="text" value={area} onChange={(e) => setArea(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-orange-400 focus:outline-none"
                  placeholder="20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">분위기</label>
              <div className="flex flex-wrap gap-1.5">
                {ATMOSPHERE_OPTIONS.map((a) => (
                  <button key={a} type="button" onClick={() => setAtmosphere(a)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${atmosphere === a ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >{a}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">스타일 (복수 선택)</label>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_OPTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => toggleStyle(s)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${styles.includes(s) ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">추가 요청사항</label>
              <textarea value={additionalRequest} onChange={(e) => setAdditionalRequest(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 focus:border-orange-400 focus:outline-none resize-none"
                placeholder="이자카야 감성, 좌측 부엌, 우측 좌석..."
              />
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !spacePhoto}
          className="w-full rounded-2xl py-4 text-sm font-semibold text-white transition-colors bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {loadingLabel}
            </span>
          ) : spacePhoto ? (
            `🔬 이미지 생성 (${referenceImage ? "API 3회" : "API 2회"})`
          ) : (
            "공간 사진을 먼저 업로드해주세요"
          )}
        </button>

        {/* 결과 */}
        {result && (
          <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
            {result.error && (
              <div className="px-6 py-4 bg-red-50">
                <p className="text-sm font-medium text-red-600">오류</p>
                <p className="text-xs text-red-400 mt-1 font-mono">{result.error}</p>
              </div>
            )}

            {result.imageBase64 && (
              <div>
                <div className="relative w-full aspect-video">
                  <Image
                    src={`data:image/png;base64,${result.imageBase64}`}
                    alt="생성 결과"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {result.debug?.apiCallCount === 3 ? "3단계 파이프라인" : "2단계 파이프라인"}
                    </span>
                  </div>
                  {elapsed !== null && (
                    <span className="absolute top-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
                      총 {elapsed}초
                    </span>
                  )}
                </div>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <p className="text-xs text-gray-400">AI 생성 이미지 (실제 결과물과 다를 수 있음)</p>
                  <a
                    href={`data:image/png;base64,${result.imageBase64}`}
                    download={`generated-${Date.now()}.png`}
                    className="text-xs font-medium text-orange-500 hover:text-orange-600"
                  >
                    다운로드
                  </a>
                </div>
              </div>
            )}

            {/* 디버그 */}
            {result.debug && (
              <div className="px-5 py-4 space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">디버그 정보</p>

                {/* 배지 */}
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600">
                    mode: {result.debug.mode}
                  </span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                    API 호출: {result.debug.apiCallCount}회
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${result.debug.hasSpacePhoto ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    spacePhoto: {result.debug.hasSpacePhoto ? "✓" : "✗"}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${result.debug.hasReferenceImage ? "bg-teal-50 text-teal-600" : "bg-gray-100 text-gray-400"}`}>
                    referenceImage: {result.debug.hasReferenceImage ? "✓ (GPT-4o 분석 후 텍스트 주입)" : "✗"}
                  </span>
                </div>

                {/* Step 1: 공간 구조 분석 */}
                {result.debug.structureAnalysis && (
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-blue-600">
                      Step 1 — GPT-4o 공간 구조 분석
                    </p>
                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5">
                      <p className="text-xs text-blue-800 leading-relaxed font-mono whitespace-pre-wrap">
                        {result.debug.structureAnalysis}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: 참고 이미지 스타일 분석 (있을 때만) */}
                {result.debug.referenceStyleBrief && (
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-teal-600">
                      Step 2 — GPT-4o 참고 이미지 스타일 분석 (프롬프트 텍스트로 주입)
                    </p>
                    <div className="rounded-lg bg-teal-50 border border-teal-100 px-3 py-2.5">
                      <p className="text-xs text-teal-800 leading-relaxed font-mono whitespace-pre-wrap">
                        {result.debug.referenceStyleBrief}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: 최종 프롬프트 */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-500">
                    Step 3 — 최종 프롬프트 (LAYER 1 + 2 + 3 조합)
                  </p>
                  <pre className="whitespace-pre-wrap break-all rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5 text-xs text-gray-700 font-mono leading-relaxed">
                    {result.debug.prompt}
                  </pre>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">Raw Inputs</p>
                  <pre className="overflow-x-auto rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5 text-xs text-gray-600 leading-relaxed">
                    {JSON.stringify(result.debug.inputs, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
