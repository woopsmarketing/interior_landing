"use client";

import { motion } from "motion/react";
import { CheckCircle2, HelpCircle, AlertTriangle } from "lucide-react";

const trustBadges = [
  "상담 신청 무료",
  "원하는 업체 직접 선택 가능",
  "여러 업체 비교 가능",
] as const;

const empathyPoints = [
  {
    Icon: HelpCircle,
    text: "원하는 스타일은 있는데, 어떻게 설명해야 할지 모르겠는 분",
  },
  {
    Icon: CheckCircle2,
    text: "여러 견적을 받아도 무엇을 비교해야 하는지 헷갈리는 분",
  },
  {
    Icon: AlertTriangle,
    text: "공사비보다 더 무서운 추가금과 업체 선택 실패가 걱정되는 분",
  },
] as const;

const exampleCard = {
  style: "모던 미니멀",
  space: "거실 + 주방 (약 28평)",
  budget: "1,500만 원 내외",
  priorities: ["시공 품질 우선", "추가 비용 없는 업체", "소통이 원활한 업체"],
};

export default function Hero() {
  const handlePrimaryCtaClick = () => {
    const formSection = document.getElementById("form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSecondaryCtaClick = () => {
    const formSection = document.getElementById("form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#FFF9F5] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* 좌측: 카피 + CTA */}
          <div className="flex flex-col">
            {/* 헤드라인 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.6rem] lg:leading-snug"
            >
              인테리어를 바꾸고 싶은 마음은 분명한데,{" "}
              <span className="text-orange-500">
                어디서부터 시작해야 할지 막막하셨나요?
              </span>
            </motion.h1>

            {/* 서브카피 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg"
            >
              예산은 한정적이고, 원하는 분위기는 있는데, 어떤 업체를 골라야
              할지 모르겠다면 이제 혼자 헤매지 마세요.
              <br className="hidden sm:block" />
              <span className="mt-2 block">
                당신의 취향과 공간 조건, 예산을 먼저 정리하고, 그에 맞는
                인테리어 업체를 비교할 수 있도록 도와드립니다.
              </span>
            </motion.p>

            {/* CTA 버튼 2개 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center"
            >
              <button
                onClick={handlePrimaryCtaClick}
                className="w-full rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-orange-600 active:bg-orange-700 sm:w-auto"
              >
                무료로 내 조건 전달하기
              </button>
              <button
                onClick={handleSecondaryCtaClick}
                className="w-full rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 sm:w-auto"
              >
                나에게 맞는 업체 알아보기
              </button>
            </motion.div>

            {/* 보조 신뢰 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2"
            >
              {trustBadges.map((badge) => (
                <span key={badge} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-orange-400" />
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* 공감 포인트 3개 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-col gap-4"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                이런 분들께 꼭 맞습니다
              </p>
              {empathyPoints.map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-50">
                    <Icon className="h-4 w-4 text-orange-400" />
                  </span>
                  <p className="text-sm leading-relaxed text-gray-600">{text}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 우측: 예시 카드 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col gap-4"
          >
            {/* 메인 예시 카드 */}
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-md">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-orange-400">
                요청 예시
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-400">스타일</span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                    {exampleCard.style}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-400">공간</span>
                  <span className="text-sm font-medium text-gray-700">
                    {exampleCard.space}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm text-gray-400">예산</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {exampleCard.budget}
                  </span>
                </div>

                <div>
                  <span className="mb-2 block text-sm text-gray-400">중요 포인트</span>
                  <div className="flex flex-wrap gap-2">
                    {exampleCard.priorities.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 안내 보조 카드 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-400">등록 업체</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  100<span className="text-base font-semibold text-orange-500">+</span>
                </p>
                <p className="mt-0.5 text-xs text-gray-500">전국 인테리어 업체</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-xs text-gray-400">신청 비용</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">무료</p>
                <p className="mt-0.5 text-xs text-gray-500">상담 및 견적 요청</p>
              </div>
            </div>

            {/* 하단 안내 문구 */}
            <div className="rounded-xl bg-orange-50 px-5 py-4">
              <p className="text-sm leading-relaxed text-orange-700">
                <span className="font-semibold">사진 없이도 요청 가능합니다.</span>{" "}
                조건을 남겨주시면 어떤 업체가 잘 맞는지 비교할 수 있도록 도와드립니다.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
