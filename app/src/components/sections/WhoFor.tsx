"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const WHO_FOR_ITEMS = [
  "인테리어가 처음이라 어디서부터 시작해야 할지 모르겠는 분",
  "원하는 스타일은 있지만 업체에 설명하는 것이 어려운 분",
  "여러 견적을 받아도 무엇을 비교해야 할지 헷갈리는 분",
  "업체를 직접 하나씩 찾고 상담하는 과정이 부담스러운 분",
  "예산 안에서 더 만족스러운 선택을 하고 싶은 분",
] as const;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function WhoFor() {
  return (
    <section className="w-full bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
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
            🙋 이런 분들에게 특히 잘 맞습니다
          </h2>
        </motion.div>

        {/* 체크리스트 */}
        <div className="flex flex-col gap-4">
          {WHO_FOR_ITEMS.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.09 }}
              className="flex items-start gap-4 rounded-2xl border border-orange-100 bg-orange-50 px-6 py-5"
            >
              <CheckCircle2
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500"
                strokeWidth={2}
              />
              <p className="text-base leading-relaxed text-gray-700">{item}</p>
            </motion.div>
          ))}
        </div>

        {/* 마무리 문구 */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center text-base font-medium leading-relaxed text-gray-500 sm:text-lg"
        >
          혼자 정리하기 어려웠던 인테리어,{" "}
          <span className="text-orange-500 font-semibold">
            이제는 더 부담 없이 시작해보세요
          </span>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <a
            href="/form"
            className="w-full rounded-full bg-orange-500 px-8 py-4 text-center text-sm font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700 sm:w-auto sm:text-base"
          >
            무료 견적 요청하기
          </a>
        </motion.div>
      </div>
    </section>
  );
}
