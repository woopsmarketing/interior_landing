import Link from "next/link";
import MultiStepForm from "@/components/form/MultiStepForm";

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

      {/* 폼 영역 */}
      <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-5 py-12 sm:px-8">
        <MultiStepForm />
      </div>
    </main>
  );
}
