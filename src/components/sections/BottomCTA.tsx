"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function BottomCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY >= 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
        >
          {/* 모바일: 전체 너비 / 데스크탑: 중앙 정렬 max-w-lg */}
          <div className="mx-auto max-w-lg">
            <Link
              href="/form"
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-300/40 transition-colors hover:bg-orange-600 active:bg-orange-700"
            >
              <span>내 공간 미리보고, 딱 맞는 업체 받기</span>
              <ArrowRight className="h-5 w-5 shrink-0" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
