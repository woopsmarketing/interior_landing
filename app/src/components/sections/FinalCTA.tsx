"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const TRUST_BADGES = ["사진 없이도 요청 가능", "상담 신청 무료"] as const;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function FinalCTA() {
  const handleScroll = () => {
    const formSection = document.getElementById("form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-orange-500 to-orange-600 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* 제목 */}
        <motion.h2
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl"
        >
          막막했던 인테리어,
          <br />
          이제는 더 쉽게 시작해보세요
        </motion.h2>

        {/* 본문 */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mx-auto mt-6 max-w-lg text-base leading-loose text-orange-100 sm:text-lg"
        >
          원하는 분위기를 설명하는 것도 어렵고,
          <br className="hidden sm:block" />
          업체를 찾는 것도 부담스럽고,
          <br className="hidden sm:block" />
          견적을 비교하는 일까지 막막하게 느껴졌다면
          <br />
          <br />
          이제는 혼자 헤매지 마세요.
          <br className="hidden sm:block" />
          당신의 조건을 먼저 정리하고, 다양한 업체의 견적을 비교한 뒤
          <br className="hidden sm:block" />
          원하는 선택을 할 수 있도록 도와드립니다.
          <br />
          <br />
          <span className="text-orange-200 text-sm">
            공간 사진은 선택사항이며, 함께 첨부해주시면 더 자세한 요청 정리와
            예시 이미지 제공에도 도움이 됩니다.
          </span>
        </motion.p>

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <button
            onClick={handleScroll}
            className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-orange-600 transition-colors hover:bg-orange-50 active:bg-orange-100 sm:w-auto"
          >
            무료로 견적 요청 시작하기
          </button>
          <button
            onClick={handleScroll}
            className="w-full rounded-full border-2 border-white/60 bg-transparent px-8 py-4 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10 sm:w-auto"
          >
            내 조건 먼저 전달하기
          </button>
        </motion.div>

        {/* 보조 신뢰 배지 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 text-sm text-orange-100"
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
