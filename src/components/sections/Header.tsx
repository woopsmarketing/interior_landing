"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";

export default function Header() {
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-white"
    >
      {/* 프로모션 배너 — 문구만, 버튼 없음 */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2.5 sm:py-3 sm:px-8 lg:px-12">
              <div className="flex flex-1 items-center justify-center gap-2.5 sm:gap-3">
                <span className="hidden shrink-0 rounded-md bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:inline-block">
                  국내 최초
                </span>

                <Sparkles className="h-4.5 w-4.5 shrink-0 text-amber-200" />

                <span className="text-center text-xs font-bold text-white sm:text-sm">
                  <span className="sm:hidden">
                    100% 무료로 시공 전 완성된 내 인테리어를 미리 확인하세요
                  </span>
                  <span className="hidden sm:inline">
                    100% 무료로 1분 만에 시공 전에 완성된 내 공간의 인테리어를 미리 확인해보세요
                  </span>
                </span>
              </div>

              <button
                onClick={() => setBannerVisible(false)}
                className="shrink-0 rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="배너 닫기"
              >
                <X className="h-4 w-4" />
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
              인테리어<span className="text-orange-500">모아</span>
            </span>
          </a>

          {/* 우측: CTA 버튼 하나만 */}
          <Link
            href="/form"
            className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-orange-200/50 transition-all hover:bg-orange-600 hover:shadow-md hover:shadow-orange-200/60 active:bg-orange-700 sm:px-7 sm:text-base"
          >
            1분 인테리어 결과 미리보기
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
