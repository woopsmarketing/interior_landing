"use client";

import { useRef } from "react";
import { FormData } from "../MultiStepForm";

interface Step4Props {
  formData: FormData;
  onFileChange: (field: "spacePhoto" | "referenceImage", file: File | null) => void;
  onChange: (field: keyof FormData, value: string) => void;
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
              <svg className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 5 2-3 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600">클릭하여 파일 선택</p>
            <p className="mt-1 text-xs text-gray-400">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function Step4({ formData, onFileChange, onChange }: Step4Props) {
  return (
    <div className="space-y-5">
      {/* 안내 문구 */}
      <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3.5">
        <p className="text-sm text-orange-800 leading-relaxed">
          현재 공간 이미지와 원하는 감성 이미지를 업로드해주시면,
          이를 바탕으로 완성된 인테리어 미리보기를 제안해드릴 수 있습니다.
        </p>
      </div>

      <FileUploadArea
        label="현재 공간 이미지"
        hint="현재 공간 사진을 올려주시면 상태를 더 정확히 파악할 수 있습니다"
        file={formData.spacePhoto}
        onFileChange={(file) => onFileChange("spacePhoto", file)}
      />

      {/* 참고 이미지: 공간 사진 있을 때만 활성화 */}
      <div className={!formData.spacePhoto ? "opacity-50 pointer-events-none" : ""}>
        <FileUploadArea
          label="참고/감성 이미지"
          hint={
            formData.spacePhoto
              ? "원하는 분위기와 비슷한 이미지를 올려주시면 색상·분위기 반영에 도움이 됩니다"
              : "현재 공간 이미지를 먼저 업로드해야 사용할 수 있습니다"
          }
          file={formData.referenceImage}
          onFileChange={(file) => onFileChange("referenceImage", file)}
        />
      </div>

      {/* 추가 요청사항 */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700">추가 요청사항</label>
          <span className="text-xs text-gray-400">선택사항</span>
        </div>
        <textarea
          value={formData.additionalRequest}
          onChange={(e) => onChange("additionalRequest", e.target.value)}
          placeholder={"- 원하는 분위기나 꼭 반영해주셨으면 하는 요소를 적어주세요\n- 피하고 싶은 스타일이나 자재가 있다면 알려주세요\n- 상세히 작성할수록 인테리어 업체가 정확한 견적을 산출하는 데 도움이 됩니다\n- 작성 내용은 완성된 인테리어 미리보기 결과에도 직접 반영됩니다"}
          rows={4}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 placeholder:text-xs focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-colors resize-none"
        />
      </div>

      {/* 다음 단계 안내 */}
      <p className="text-center text-xs text-gray-400">
        사진 없이도 진행 가능합니다. 다음 단계에서 연락처 입력 후 최종 제출됩니다.
      </p>
    </div>
  );
}
