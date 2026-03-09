"use client";

import { motion } from "motion/react";
import { Eye, MessageCircle, Scale, Lightbulb } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const OUTCOME_CARDS = [
  {
    icon: Eye,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    title: "막연했던 인테리어가 더 구체적으로 보입니다",
    description: "무엇을 원하는지 조금 더 명확하게 정리할 수 있습니다.",
  },
  {
    icon: MessageCircle,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    title: "업체와의 대화가 쉬워집니다",
    description:
      "원하는 내용이 정리된 상태로 전달되기 때문에 상담이 수월해집니다.",
  },
  {
    icon: Scale,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    title: "견적 비교가 훨씬 쉬워집니다",
    description:
      "가격만이 아니라 어떤 범위와 방향인지 함께 비교할 수 있습니다.",
  },
  {
    icon: Lightbulb,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    title: "선택에 대한 부담이 줄어듭니다",
    description:
      "무작정 고르는 것이 아니라 내 기준으로 선택하게 됩니다.",
  },
] as const;

// ============================================================================
// 서브 컴포넌트
// ============================================================================

interface OutcomeCardProps {
  card: (typeof OUTCOME_CARDS)[number];
  index: number;
}

function OutcomeCard({ card, index }: OutcomeCardProps) {
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg}`}
      >
        <Icon className={`h-7 w-7 ${card.iconColor}`} strokeWidth={1.8} />
      </div>
      <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900">
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-500">{card.description}</p>
    </motion.div>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function Outcomes() {
  return (
    <section className="w-full bg-gray-50 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-5xl">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
            이용하면 이런 점이 달라집니다
          </h2>
        </motion.div>

        {/* 카드 2×2 그리드 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {OUTCOME_CARDS.map((card, index) => (
            <OutcomeCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
