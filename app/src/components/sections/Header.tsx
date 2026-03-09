"use client";

import { motion } from "motion/react";

export default function Header() {
  const handleCtaClick = () => {
    const formSection = document.getElementById("form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
        {/* 로고 */}
        <a href="/" className="flex items-center gap-1.5">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            인테리어비교
          </span>
        </a>

        {/* 우측: 신뢰 문구 + CTA */}
        <div className="flex items-center gap-4">
          {/* 신뢰 문구 — 모바일에서 숨김 */}
          <span className="hidden text-sm text-gray-500 sm:block">
            상담 신청 무료
          </span>

          {/* CTA 버튼 */}
          <button
            onClick={handleCtaClick}
            className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
          >
            무료로 견적 요청하기
          </button>
        </div>
      </div>
    </motion.header>
  );
}
