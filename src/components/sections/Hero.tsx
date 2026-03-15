"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, HelpCircle, AlertTriangle, Sparkles } from "lucide-react";

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
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
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
            <p className="mt-6 text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl">
              업체를 일일이 찾고 연락하지 않아도 됩니다.
              <br />
              <span className="text-orange-500">내 조건을 한 번 작성하면</span>,
              <br className="hidden sm:block" />
              전국 100개 넘는 업체가 먼저 답변합니다.
            </p>
            <p className="mt-5 text-lg font-bold leading-snug text-gray-900 sm:text-xl">
              답변을 비교하고, <span className="text-orange-500">마음에 드는 업체를 직접 골라서</span> 연락하세요.
            </p>
          </motion.div>

          {/* CTA 버튼 + 보조 링크 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex w-full flex-col items-center gap-4"
          >
            <Link
              href="/form"
              className="w-full rounded-full bg-orange-500 px-10 py-4.5 text-center text-lg font-bold text-white shadow-lg shadow-orange-200/60 transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-200/80 active:bg-orange-700 sm:w-auto"
            >
              양식 1회 작성 → 100+ 업체 견적 받기
            </Link>
            <Link
              href="/form"
              className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 transition-colors hover:text-orange-600"
            >
              <Sparkles className="h-4 w-4" />
              1분 인테리어 결과 미리보기 →
            </Link>
          </motion.div>

          {/* 보조 신뢰 배지 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5"
          >
            {trustBadges.map((badge) => (
              <span key={badge} className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-orange-500" />
                {badge}
              </span>
            ))}
          </motion.div>

          {/* 공감 포인트 3개 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 w-full max-w-xl flex flex-col gap-3 text-left"
          >
            <p className="text-lg font-bold text-gray-900 text-center mb-3">
              이런 분들께 꼭 맞습니다
            </p>
            {empathyPoints.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-white/70 px-5 py-4 backdrop-blur-sm">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50">
                  <Icon className="h-5.5 w-5.5 text-orange-500" />
                </span>
                <p className="text-base font-semibold leading-snug text-gray-900">{text}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
