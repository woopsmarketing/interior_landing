"use client";

import { motion } from "motion/react";
import { BarChart3, MessageSquare, ShieldQuestion, RefreshCcw } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const PROBLEM_CARDS = [
  {
    icon: BarChart3,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    title: "견적이 제각각이라 비교가 어렵습니다",
    description:
      "같은 공간인데도 업체마다 금액과 설명이 달라 판단이 쉽지 않습니다.",
  },
  {
    icon: MessageSquare,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    title: "내 취향을 말로 설명하기 어렵습니다",
    description:
      "원하는 느낌은 분명한데, 전문가처럼 정리해서 전달하기는 어렵습니다.",
  },
  {
    icon: ShieldQuestion,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    title: "업체 선택이 가장 불안합니다",
    description:
      "정말 잘 맞는 업체인지, 믿고 맡겨도 되는지 고민됩니다.",
  },
  {
    icon: RefreshCcw,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    title: "상담할수록 오히려 더 헷갈립니다",
    description:
      "같은 이야기를 반복할수록 피로는 쌓이고 비교는 더 어려워집니다.",
  },
] as const;

// ============================================================================
// 서브 컴포넌트
// ============================================================================

interface ProblemCardProps {
  card: (typeof PROBLEM_CARDS)[number];
  index: number;
}

function ProblemCard({ card, index }: ProblemCardProps) {
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
      <p className="text-base font-medium leading-relaxed text-gray-900">{card.description}</p>
    </motion.div>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function Problem() {
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
          <h2 className="mb-5 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
            😔 인테리어가 어려운 이유는,{" "}
            <br className="hidden sm:block" />
            하고 싶은 마음보다 걱정이 먼저 앞서기 때문입니다
          </h2>
          <p className="mx-auto max-w-2xl text-base font-medium leading-loose text-gray-900 sm:text-lg">
            인테리어는 누구나 기대를 안고 시작하지만,
            막상 준비하려고 하면 생각보다 더 많은 고민이 생깁니다.
            <br className="hidden sm:block" />
            그래서 많은 분들이 인테리어를 하고 싶어도 쉽게 시작하지 못합니다.
          </p>
        </motion.div>

        {/* 카드 2×2 그리드 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PROBLEM_CARDS.map((card, index) => (
            <ProblemCard key={card.title} card={card} index={index} />
          ))}
        </div>

        {/* 브리지 문구 */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center text-lg font-semibold text-orange-500 sm:text-xl"
        >
          이 문제들, 혼자 해결하지 않아도 됩니다.
        </motion.p>
      </div>
    </section>
  );
}
