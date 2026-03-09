"use client";

import { motion } from "motion/react";
import {
  ClipboardList,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const STEPS = [
  {
    step: 1,
    icon: ClipboardList,
    title: "원하는 인테리어를 작성합니다",
    description:
      "원하는 분위기, 예산, 시공 범위, 중요하게 생각하는 조건 등을 남겨주세요. 아직 완벽하게 정리되지 않았어도 괜찮습니다.",
    note: "공간 사진과 참고 이미지는 선택사항입니다.",
  },
  {
    step: 2,
    icon: Sparkles,
    title: "요청 내용을 더 이해하기 쉽게 정리합니다",
    description:
      "남겨주신 내용을 바탕으로 원하는 인테리어 방향과 핵심 니즈를 더 보기 쉽게 정리합니다.",
    note: "사진과 참고 이미지를 함께 첨부한 경우 AI 예시 이미지도 제공될 수 있습니다.",
  },
  {
    step: 3,
    icon: Building2,
    title: "전국 인테리어 업체가 내용을 검토합니다",
    description:
      "정리된 요청 내용을 바탕으로 전국 100개 이상의 등록 인테리어 업체가 견적과 작업 방향을 제안합니다.",
    note: null,
  },
  {
    step: 4,
    icon: CheckCircle2,
    title: "견적 결과를 비교하고 원하는 업체를 선택합니다",
    description:
      "여러 업체의 견적과 제안을 비교한 뒤 고객이 원하는 업체를 직접 선택할 수 있습니다.",
    note: null,
  },
] as const;

// ============================================================================
// 서브 컴포넌트
// ============================================================================

interface StepCardProps {
  item: (typeof STEPS)[number];
  index: number;
  isLast: boolean;
}

function StepCard({ item, index, isLast }: StepCardProps) {
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="relative flex flex-col items-center text-center"
    >
      {/* 연결선 — 데스크톱: 수평, 마지막 카드는 숨김 */}
      {!isLast && (
        <div
          aria-hidden="true"
          className="absolute left-[calc(50%+2.5rem)] top-7 hidden h-px w-[calc(100%-5rem)] bg-gray-200 lg:block"
        />
      )}

      {/* 스텝 번호 + 아이콘 */}
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
        <Icon className="h-7 w-7 text-orange-500" strokeWidth={1.8} />
        {/* 스텝 번호 뱃지 */}
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
          {item.step}
        </span>
      </div>

      <h3 className="mb-3 text-base font-bold leading-snug text-gray-900 sm:text-lg">
        {item.title}
      </h3>
      <p className="mb-2 text-sm leading-relaxed text-gray-500">
        {item.description}
      </p>

      {/* 보조 안내 문구 */}
      {item.note && (
        <p className="text-xs leading-relaxed text-gray-400">{item.note}</p>
      )}
    </motion.div>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function HowItWorks() {
  return (
    <section className="w-full bg-gray-50 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
            복잡하게 알아보지 않아도,{" "}
            <br className="hidden sm:block" />
            아래 순서대로 쉽게 시작할 수 있습니다
          </h2>
        </motion.div>

        {/* 스텝 그리드 — 데스크톱: 4열 가로, 모바일: 1열 세로 */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((item, index) => (
            <StepCard
              key={item.step}
              item={item}
              index={index}
              isLast={index === STEPS.length - 1}
            />
          ))}
        </div>

        {/* AI 면책 문구 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center text-xs leading-relaxed text-gray-400"
        >
          제공되는 이미지는 AI가 생성한 예시 이미지이며, 실제 시공 결과와는 차이가 있을 수 있습니다.
        </motion.p>
      </div>
    </section>
  );
}
