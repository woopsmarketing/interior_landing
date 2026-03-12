"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative z-50 w-full overflow-hidden bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:py-4 sm:px-8 lg:px-12">
            {/* 메인 컨텐츠 */}
            <Link
              href="/form"
              className="flex flex-1 items-center justify-center gap-2.5 sm:gap-4"
            >
              {/* NEW 뱃지 */}
              <span className="hidden shrink-0 rounded-md bg-white/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:inline-block">
                국내 최초
              </span>

              <Sparkles className="h-5 w-5 shrink-0 text-amber-200" />

              <span className="text-center text-sm font-bold text-white sm:text-lg">
                <span className="sm:hidden">
                  AI로 완성된 인테리어 미리보기
                </span>
                <span className="hidden sm:inline">
                  원하시는 완성된 인테리어를 AI로 미리 확인하세요
                </span>
              </span>

              <span className="shrink-0 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30">
                무료 체험 →
              </span>
            </Link>

            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsVisible(false)}
              className="shrink-0 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="배너 닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
