"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ListChecks, SlidersHorizontal, UserCheck } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const KEY_POINTS = [
  {
    icon: ListChecks,
    text: "한 번의 요청으로 다양한 업체 견적 비교",
  },
  {
    icon: SlidersHorizontal,
    text: "고객의 조건을 먼저 정리한 뒤 전달",
  },
  {
    icon: UserCheck,
    text: "원하는 업체는 고객이 직접 선택",
  },
] as const;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function CoreValue() {
  return (
    <section className="w-full bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16">

          {/* 좌측: 텍스트 영역 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex-1"
          >
            <h2 className="mb-6 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
              💡 우리는 업체를 무작정 연결하는 것이 아니라,{" "}
              <br className="hidden sm:block" />
              먼저 당신의 조건을 정리합니다
            </h2>
            <p className="mb-8 text-base leading-loose text-gray-500 sm:text-lg">
              인테리어가 어려운 이유는 업체가 없어서가 아니라,
              나에게 맞는 업체를 고를 기준이 분명하지 않기 때문입니다.
              <br /><br />
              고객이 원하는 스타일, 예산, 공간 조건, 중요하게 생각하는 요소를 먼저 정리하고
              그 내용을 바탕으로 다양한 인테리어 업체가 검토할 수 있도록 돕습니다.
            </p>

            {/* CTA 버튼 */}
            <Link
              href="/form"
              className="w-full rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700 sm:w-auto sm:text-base inline-block text-center"
            >
              미리 인테리어 결과물 확인하기
            </Link>
          </motion.div>

          {/* 우측: 숫자 강조 + 핵심 포인트 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="w-full max-w-sm flex-shrink-0 lg:max-w-xs"
          >
            {/* 100+ 숫자 강조 카드 */}
            <div className="mb-6 rounded-2xl bg-orange-50 px-8 py-8 text-center">
              <span className="block text-4xl font-extrabold tracking-tight text-orange-500 sm:text-5xl">
                100<span className="text-3xl sm:text-4xl">+</span>
              </span>
              <span className="mt-2 block text-sm font-medium text-orange-700">
                전국 등록 인테리어 업체
              </span>
              <p className="mt-3 text-xs leading-relaxed text-orange-600">
                한 번의 요청만으로도 다양한 견적과 제안을 받아볼 수 있습니다.
              </p>
            </div>

            {/* 핵심 포인트 3개 */}
            <ul className="flex flex-col gap-3">
              {KEY_POINTS.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.li
                    key={point.text}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Icon className="h-4.5 w-4.5 text-orange-500" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{point.text}</span>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
