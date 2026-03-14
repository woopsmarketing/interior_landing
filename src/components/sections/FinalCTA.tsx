"use client";

import Link from "next/link";
import { motion } from "motion/react";

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function FinalCTA() {
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
          🏡 막막했던 인테리어,
          <br />
          이제는 더 쉽게 시작해보세요
        </motion.h2>

        {/* 본문 */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mx-auto mt-6 max-w-lg text-base leading-loose text-white/90 sm:text-lg"
        >
          업체를 일일이 찾고, 같은 이야기를 반복하고,
          <br className="hidden sm:block" />
          견적을 하나씩 비교하는 과정이 지치셨다면
          <br />
          <br />
          이제는 한 번만 작성하세요.
          <br className="hidden sm:block" />
          전국 100개 넘는 업체가 내 조건을 검토하고,
          <br className="hidden sm:block" />
          관심 있는 업체만 먼저 답변합니다.
          <br />
          답변을 비교한 뒤, 마음에 드는 업체에 직접 연락하세요.
          <br />
          <br />
          <span className="text-sm text-orange-200">
            공간 사진은 선택사항이며, 함께 첨부해주시면 더 자세한 요청 정리와
            예시 이미지 제공에도 도움이 됩니다.
          </span>
        </motion.p>

        {/* CTA 버튼 영역 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          {/* 주 CTA */}
          <Link
            href="/form"
            className="w-full rounded-full bg-white px-8 py-4 text-base font-semibold text-orange-600 shadow-lg transition-colors hover:bg-orange-50 active:bg-orange-100 sm:w-auto"
          >
            나의 요구에 맞는 업체 받아보기
          </Link>

        </motion.div>
      </div>
    </section>
  );
}
