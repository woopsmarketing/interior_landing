"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Gift, HandshakeIcon } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const FEATURED_POINTS = [
  {
    icon: Gift,
    title: "상담 신청 무료",
    description: "견적 요청과 업체 비교까지 비용이 전혀 없습니다.",
  },
  {
    icon: HandshakeIcon,
    title: "꼭 계약하지 않아도 됩니다",
    description: "비교 후 원하시는 경우에만 선택하시면 됩니다.",
  },
] as const;

const TRUST_BADGES = [
  "사진 첨부 시 더 자세한 검토 가능",
  "선택 시 AI 예시 이미지 제공 가능",
  "여러 업체 비교 가능",
  "원하는 업체 직접 선택 가능",
] as const;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function Trust() {
  return (
    <section className="w-full bg-[#FFF9F5] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-3xl">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
            🛡️ 부담 없이 시작할 수 있도록 준비했습니다
          </h2>
        </motion.div>

        {/* 강조 카드 2개 */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURED_POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4 rounded-2xl border border-orange-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50">
                  <Icon className="h-6 w-6 text-orange-500" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{point.title}</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-gray-900">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 안심 포인트 배지 그리드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {TRUST_BADGES.map((point, index) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-5 py-2.5 shadow-sm"
            >
              <CheckCircle2
                className="h-4 w-4 flex-shrink-0 text-orange-500"
                strokeWidth={2}
              />
              <span className="text-sm font-semibold text-gray-900">{point}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* 마무리 문장 */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mx-auto mt-10 max-w-xl text-center text-base font-medium leading-loose text-gray-900"
        >
          인테리어는 쉽게 결정할 일이 아니기 때문에
          <br className="hidden sm:block" />
          조금 더 편하게 시작하고, 충분히 비교한 뒤 선택할 수 있어야 합니다.
        </motion.p>

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/form"
            className="rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
          >
            최저가 견적 요청받기
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
