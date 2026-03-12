"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";

export default function Header() {
  const [bannerVisible, setBannerVisible] = useState(true);

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
      className="sticky top-0 z-50 w-full bg-white"
    >
      {/* 프로모션 배너 */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:py-3.5 sm:px-8 lg:px-12">
              <Link
                href="/form"
                className="flex flex-1 items-center justify-center gap-2.5 sm:gap-4"
              >
                <span className="hidden shrink-0 rounded-md bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:inline-block">
                  국내 최초
                </span>

                <Sparkles className="h-5 w-5 shrink-0 text-amber-200" />

                <span className="text-center text-sm font-bold text-white sm:text-lg">
                  <span className="sm:hidden">
                    완성된 인테리어, 무료로 미리보기
                  </span>
                  <span className="hidden sm:inline">
                    시공 전에 완성된 내 인테리어를 미리 확인해보세요
                  </span>
                </span>

                <span className="shrink-0 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                  1분 인테리어 결과 미리보기 →
                </span>
              </Link>

              <button
                onClick={() => setBannerVisible(false)}
                className="shrink-0 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="배너 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메인 헤더 */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
          {/* 로고 */}
          <a href="/" className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-gray-900">
              인테리어<span className="text-orange-500">비교</span>
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
              1분 인테리어 미리보기
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
