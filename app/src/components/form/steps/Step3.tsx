"use client";

import { useRef } from "react";
import { FormData } from "../MultiStepForm";

interface Step3Props {
  formData: FormData;
  onFileChange: (field: "spacePhoto" | "referenceImage", file: File | null) => void;
  onSkip: () => void;
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

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onFileChange(selected);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">선택사항</span>
      </div>
      <div
        onClick={handleClick}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-7 cursor-pointer transition-colors ${
          file
            ? "border-orange-300 bg-orange-50/60"
            : "border-gray-200 bg-gray-50 hover:border-orange-200 hover:bg-orange-50/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
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

export default function Step3({ formData, onFileChange, onSkip }: Step3Props) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-orange-50 border border-orange-100 px-4 py-3.5">
        <p className="text-sm text-orange-800 leading-relaxed">
          사진을 첨부해주시면 요청 내용을 더 구체적으로 정리할 수 있으며,
          AI 예시 이미지 제공에도 도움이 됩니다.
        </p>
      </div>

      <FileUploadArea
        label="공간 사진 업로드 (선택)"
        hint="JPG, PNG, WEBP 등 이미지 파일"
        file={formData.spacePhoto}
        onFileChange={(file) => onFileChange("spacePhoto", file)}
      />

      <FileUploadArea
        label="참고 이미지 업로드 (선택)"
        hint="원하는 스타일의 참고 이미지"
        file={formData.referenceImage}
        onFileChange={(file) => onFileChange("referenceImage", file)}
      />

      <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3.5">
        <div className="flex gap-2.5">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3a1 1 0 01.993.883L9 6v3.5a1 1 0 01-1.993.117L7 9.5V6a1 1 0 011-1zm0 6.5a1 1 0 110-2 1 1 0 010 2z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-gray-500 leading-relaxed">
            제공되는 이미지는 AI가 생성한 예시 이미지이며, 실제 시공 결과와는 차이가 있을 수 있습니다.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          사진 없이 계속하기 →
        </button>
      </div>
    </div>
  );
}
