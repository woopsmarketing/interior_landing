"use client";

import { useSearchParams } from "next/navigation";

export default function AdLandingBanner() {
  const searchParams = useSearchParams();
  const utmSource = searchParams.get("utm_source");

  // 광고 유입(utm_source가 있을 때)만 배너 표시
  if (!utmSource) return null;

  return (
    <div className="w-full bg-gradient-to-b from-[#1A1A2E] to-[#2D2D44] text-white">
      <div className="mx-auto max-w-lg px-5 py-6 text-center">
        {/* 핵심 가치 */}
        <h2 className="text-lg font-bold leading-snug sm:text-xl">
          같은 인테리어, 업체마다
          <br />
          <span className="text-orange-400">수백~수천만원</span> 차이납니다
        </h2>

        {/* 3가지 혜택 */}
        <div className="mt-4 flex justify-center gap-4 text-xs sm:text-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm">
              30초
            </span>
            <span className="text-gray-300">간편 입력</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm">
              3곳+
            </span>
            <span className="text-gray-300">비교견적</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm">
              0원
            </span>
            <span className="text-gray-300">완전 무료</span>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          아래 정보를 입력하시면 검증된 업체 견적을 비교해드립니다
        </p>
      </div>
    </div>
  );
}
