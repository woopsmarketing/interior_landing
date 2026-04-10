import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "견적 요청하기 | 인테리어 견적 비교",
  description: "간단한 4단계로 인테리어 견적을 요청하세요.",
  robots: { index: false, follow: false },
};
import MultiStepForm from "@/components/form/MultiStepForm";
import AdLandingBanner from "@/components/form/AdLandingBanner";

export default function FormPage() {
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

      {/* 광고 유입 시 서비스 요약 배너 */}
      <Suspense fallback={null}>
        <AdLandingBanner />
      </Suspense>

      {/* 폼 영역 */}
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-5 py-12 sm:px-8">
        <MultiStepForm />
      </div>
    </main>
  );
}
