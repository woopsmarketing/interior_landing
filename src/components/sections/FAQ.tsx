"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const FAQ_ITEMS = [
  {
    question: "공간 사진이 꼭 필요한가요?",
    answer:
      "아닙니다. 사진 없이도 요청을 남기실 수 있습니다. 다만 공간 사진과 참고 이미지를 함께 첨부해주시면 더 자세한 요청 정리와 예시 이미지 제공에 도움이 됩니다.",
  },
  {
    question: "AI 예시 이미지는 누구나 받을 수 있나요?",
    answer:
      "공간 사진과 원하는 스타일, 참고 이미지 등을 자세히 남겨주신 경우 더 구체적인 예시 이미지 제공에 도움이 됩니다.",
  },
  {
    question: "AI 이미지와 실제 시공 결과는 같은가요?",
    answer:
      "아닙니다. AI 이미지는 방향을 이해하기 위한 예시 이미지이며, 실제 시공 결과와는 차이가 있을 수 있습니다.",
  },
  {
    question: "견적 요청은 무료인가요?",
    answer: "네. 상담 신청과 견적 요청은 무료입니다.",
  },
  {
    question: "여러 업체 견적을 받아볼 수 있나요?",
    answer:
      "네. 등록된 다양한 인테리어 업체가 고객 요청을 검토하고 견적을 제안할 수 있습니다.",
  },
  {
    question: "꼭 계약까지 해야 하나요?",
    answer:
      "아닙니다. 비교 후 원하는 경우에만 선택하시면 됩니다.",
  },
  {
    question: "업체는 어떤 기준으로 등록되어 있나요?",
    answer:
      "등록 업체는 사전 검토 및 파트너 등록 과정을 거친 인테리어 전문 업체로 구성되어 있습니다. 시공 경력, 포트폴리오, 고객 응대 방식 등을 기준으로 검토 후 등록됩니다.",
  },
  {
    question: "견적은 어떻게 받게 되나요?",
    answer:
      "요청이 접수되면 영업일 기준 2~3일 이내에 담당자가 입력하신 연락처로 직접 연락드립니다. 업체 매칭 및 견적 결과를 안내해드립니다.",
  },
] as const;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? FAQ_ITEMS : FAQ_ITEMS.slice(0, 5);

  return (
    <section className="w-full bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-2xl">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-600 mb-4">
            ❓ 자주 묻는 질문
          </span>
          <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
            🙋‍♀️ 궁금한 점이 있으신가요?
          </h2>
        </motion.div>

        {/* 아코디언 */}
        <div className="flex flex-col gap-3">
          {visibleItems.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                  strokeWidth={2}
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                  >
                    <div className="border-t border-gray-100 px-6 pb-6 pt-4 text-sm font-semibold leading-relaxed text-gray-800">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-4 w-full rounded-2xl border border-gray-200 py-4 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
          >
            나머지 질문 더 보기 ({FAQ_ITEMS.length - 5}개) ↓
          </button>
        )}

        {/* 하단 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/form"
            className="rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700"
          >
            무료 견적 요청하기
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
