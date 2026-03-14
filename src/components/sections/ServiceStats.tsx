"use client";

import { motion } from "motion/react";

const STATS = [
  { value: "3,700+", label: "누적 완료 건수" },
  { value: "100+", label: "등록 파트너 업체" },
  { value: "0원", label: "신청 및 상담 비용" },
  { value: "4단계", label: "쉬운 요청 프로세스" },
  { value: "직접 선택", label: "계약 강요 없음" },
] as const;

export default function ServiceStats() {
  return (
    <section className="w-full bg-white px-5 pb-2 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center rounded-2xl border border-orange-100 bg-orange-50 px-4 py-6 text-center"
            >
              <p className="text-2xl font-bold text-orange-500 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm font-medium text-gray-900">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
