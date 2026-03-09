"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const TRUST_POINTS = [
  "상담 신청 무료",
  "사진 없이도 요청 가능",
  "사진 첨부 시 더 자세한 검토 가능",
  "선택 시 AI 예시 이미지 제공 가능",
  "여러 업체 비교 가능",
  "원하는 업체 직접 선택 가능",
  "꼭 계약하지 않아도 됨",
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
            부담 없이 시작할 수 있도록 준비했습니다
          </h2>
        </motion.div>

        {/* 안심 포인트 배지 그리드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {TRUST_POINTS.map((point, index) => (
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
              <span className="text-sm font-medium text-gray-700">{point}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* 마무리 문장 */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mx-auto mt-10 max-w-xl text-center text-base leading-loose text-gray-500"
        >
          인테리어는 쉽게 결정할 일이 아니기 때문에
          <br className="hidden sm:block" />
          조금 더 편하게 시작하고, 충분히 비교한 뒤 선택할 수 있어야 합니다.
        </motion.p>
      </div>
    </section>
  );
}
