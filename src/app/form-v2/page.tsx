import type { Metadata } from "next";
import Link from "next/link";
import MultiStepFormV2 from "@/components/form/MultiStepFormV2";
import AdLandingBanner from "@/components/form/AdLandingBanner";

export const metadata: Metadata = {
  title: "무료 견적 요청 | 인테리어 견적 비교",
  description: "1분 안에 작성하고 비교견적 + AI 인테리어 미리보기를 받으세요.",
  robots: { index: false, follow: false },
};

export default function FormV2Page() {
  return (
    <main className="min-h-screen bg-[#FFF9F5]">
      {/* 간소화 헤더 */}
      <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-[#FFF9F5]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <span className="text-base font-bold text-gray-900">
            인테리어 견적 비교
          </span>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
          >
            ← 메인으로
          </Link>
        </div>
      </header>

      {/* 서비스 요약 배너 */}
      <AdLandingBanner />

      {/* 폼 영역 — 배너 바로 아래에 붙여 배치 */}
      <div className="flex flex-col items-center px-5 pt-4 pb-10 sm:pt-6 sm:pb-16 sm:px-8">
        <MultiStepFormV2 />
      </div>
    </main>
  );
}
