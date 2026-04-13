"use client";

import { useSearchParams } from "next/navigation";

export default function AdLandingBanner() {
  const searchParams = useSearchParams();
  const utmSource = searchParams.get("utm_source");

  // 광고 유입(utm_source가 있을 때)만 배너 표시
  if (!utmSource) return null;

  return (
    <div className="w-full bg-gradient-to-b from-[#1A1A2E] to-[#2D2D44] text-white">
      <div className="mx-auto max-w-lg px-5 py-6">
        {/* 핵심 가치 */}
        <h2 className="text-center text-lg font-bold leading-snug sm:text-xl">
          같은 인테리어, 업체마다
          <br />
          <span className="text-orange-400">수백~수천만원</span> 차이납니다
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          1분 안에 작성하면 <strong className="text-white">모두 무료</strong>로 받아보실 수 있어요
        </p>

        {/* 혜택 카드 */}
        <div className="mt-5 space-y-2.5">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-lg">
              📊
            </span>
            <div>
              <p className="text-sm font-semibold text-white">업체 3곳+ 비교견적</p>
              <p className="text-xs text-gray-400">검증된 업체들의 견적을 한눈에 비교</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
              무료
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-lg">
              🎨
            </span>
            <div>
              <p className="text-sm font-semibold text-white">AI 인테리어 완성 미리보기</p>
              <p className="text-xs text-gray-400">사진 업로드 시 완성된 모습을 미리 확인</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-400">
              무료
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/[0.07] px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-lg">
              🛡️
            </span>
            <div>
              <p className="text-sm font-semibold text-white">계약 의무 없음</p>
              <p className="text-xs text-gray-400">비교만 하고 마음에 안 들면 무시해도 OK</p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          아래 정보를 입력하시면 바로 시작됩니다
        </p>
      </div>
    </div>
  );
}
