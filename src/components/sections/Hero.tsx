"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, HelpCircle, AlertTriangle } from "lucide-react";

const trustBadges = [
  "상담 신청 무료",
  "원하는 업체 직접 선택 가능",
  "여러 업체 비교 가능",
] as const;

const empathyPoints = [
  {
    Icon: HelpCircle,
    text: "원하는 스타일은 있는데, 어떻게 설명해야 할지 모르겠는 분",
  },
  {
    Icon: CheckCircle2,
    text: "여러 견적을 받아도 무엇을 비교해야 하는지 헷갈리는 분",
  },
  {
    Icon: AlertTriangle,
    text: "공사비보다 더 무서운 추가금과 업체 선택 실패가 걱정되는 분",
  },
] as const;

const handleSecondaryCtaClick = () => {
  if (typeof window !== "undefined") {
    const target = document.getElementById("how-it-works");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }
};

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-24">
      {/* ── 배경 레이어 ── */}
      {/* 기본 배경색 */}
      <div className="absolute inset-0 bg-[#FFF9F5]" />

      {/* 장식용 블러 서클 — 따뜻한 인테리어 감성 */}
      <div className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-orange-200/25 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-[380px] w-[380px] rounded-full bg-amber-100/40 blur-3xl" />
      <div className="absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-orange-100/30 blur-2xl" />

      {/* 배경 이미지 — 따뜻한 인테리어 감성 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.13]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80')" }}
      />

      {/* ── 컨텐츠 ── */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">

          {/* 헤드라인 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.6rem] lg:leading-snug"
          >
            🏠 막막한 인테리어,
            <br />
            <span className="text-orange-500">
              이제 쉽고 확실하게 시작하세요
            </span>
          </motion.h1>

          {/* 서브카피 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
              예산은 한정적이고, 원하는 분위기는 있는데, 어떤 업체를 골라야
              할지 모르겠다면 이제 혼자 헤매지 마세요.
            </p>
            <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">
              당신의 취향과 공간 조건, 예산을 먼저 정리하고, 그에 맞는
              인테리어 업체를 비교할 수 있도록 도와드립니다.
            </p>
          </motion.div>

          {/* CTA 버튼 2개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
          >
            <Link
              href="/form"
              className="w-full rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600 active:bg-orange-700 sm:w-auto"
            >
              무료 견적 요청하기
            </Link>
            <button
              onClick={handleSecondaryCtaClick}
              className="w-full rounded-full border-2 border-gray-300 bg-white/80 px-8 py-4 text-base font-semibold text-gray-700 backdrop-blur-sm transition-colors hover:border-gray-400 hover:bg-gray-50 sm:w-auto"
            >
              어떻게 진행되나요?
            </button>
          </motion.div>

          {/* 보조 신뢰 배지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          >
            {trustBadges.map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-orange-400" />
                {badge}
              </span>
            ))}
          </motion.div>

          {/* 공감 포인트 3개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 w-full max-w-xl flex flex-col gap-4 text-left"
          >
            <p className="text-base font-bold text-gray-700 text-center mb-2">
              이런 분들께 꼭 맞습니다
            </p>
            {empathyPoints.map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-50">
                  <Icon className="h-4 w-4 text-orange-400" />
                </span>
                <p className="text-base leading-relaxed text-gray-700">{text}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
