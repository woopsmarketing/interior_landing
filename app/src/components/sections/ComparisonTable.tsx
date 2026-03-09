"use client";

import { motion } from "motion/react";
import { X, Check } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const ROWS = [
  {
    item: "업체 탐색",
    direct: "직접 검색, 시간 소요",
    service: "한 번 요청으로 완료",
  },
  {
    item: "견적 요청",
    direct: "업체마다 개별 연락",
    service: "일괄 전달",
  },
  {
    item: "조건 정리",
    direct: "스스로 정리 어려움",
    service: "자동 정리",
  },
  {
    item: "비교 기준",
    direct: "기준 없이 가격만 비교",
    service: "조건 기반 비교",
  },
  {
    item: "계약 압박",
    direct: "업체 재촉 받기도 함",
    service: "내가 원할 때 선택",
  },
  {
    item: "비용",
    direct: "무료지만 시간 소요",
    service: "무료 + 빠름",
  },
] as const;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function ComparisonTable() {
  return (
    <section className="w-full bg-gray-50 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
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
            📊 직접 알아볼 때 vs 인테리어비교
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            어떤 점이 다른지 한눈에 비교해보세요
          </p>
        </motion.div>

        {/* 데스크톱 테이블 — sm 이상 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden sm:block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50 px-6 py-4">
            <p className="text-sm font-semibold text-gray-500">항목</p>
            <p className="text-sm font-semibold text-gray-400">직접 알아볼 때</p>
            <p className="text-sm font-bold text-orange-500">인테리어비교 이용 시</p>
          </div>

          {/* 테이블 행 */}
          {ROWS.map((row, index) => (
            <div
              key={row.item}
              className={`grid grid-cols-3 items-center gap-4 px-6 py-4 ${
                index < ROWS.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <p className="text-sm font-medium text-gray-700">{row.item}</p>
              <div className="flex items-start gap-2">
                <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300" strokeWidth={2.5} />
                <p className="text-sm leading-relaxed text-gray-400">{row.direct}</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" strokeWidth={2.5} />
                <p className="text-sm font-medium leading-relaxed text-gray-700">{row.service}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* 모바일 카드 스택 — sm 미만 */}
        <div className="flex flex-col gap-4 sm:hidden">
          {ROWS.map((row, index) => (
            <motion.div
              key={row.item}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <p className="border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500">
                {row.item}
              </p>
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                <div className="flex items-start gap-2 p-4">
                  <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300" strokeWidth={2.5} />
                  <p className="text-xs leading-relaxed text-gray-400">{row.direct}</p>
                </div>
                <div className="flex items-start gap-2 p-4">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" strokeWidth={2.5} />
                  <p className="text-xs font-medium leading-relaxed text-gray-700">{row.service}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
