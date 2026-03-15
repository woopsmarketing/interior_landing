"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function BottomCTA() {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
    >
      <div className="mx-auto max-w-lg">
        <Link
          href="/form"
          className="relative flex min-h-[56px] w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-[0_0_20px_4px_rgba(249,115,22,0.5)] transition-all hover:shadow-[0_0_28px_8px_rgba(249,115,22,0.6)] active:scale-[0.98]"
        >
          {/* 빛나는 shine 효과 */}
          <motion.span
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20"
            animate={{ translateX: ["−100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          />
          <span className="text-lg">✨</span>
          <span>내 공간 미리보고, 딱 맞는 업체 매칭</span>
          <span className="text-lg">🏠</span>
        </Link>
      </div>
    </motion.div>
  );
}
