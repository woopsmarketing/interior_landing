"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const STATS = [
  { value: "100+", label: "등록 파트너 업체" },
  { value: "0원", label: "신청 및 상담 비용" },
  { value: "4단계", label: "쉬운 요청 프로세스" },
  { value: "직접 선택", label: "계약 강요 없음" },
] as const;

const TESTIMONIALS = [
  {
    name: "김○○",
    location: "서울 · 아파트 (30평대)",
    text: "업체마다 견적이 너무 달라서 어디를 믿어야 할지 몰랐는데, 조건을 정리해서 비교하니 생각보다 훨씬 합리적인 선택이 가능했어요.",
  },
  {
    name: "이○○",
    location: "경기 성남 · 주택",
    text: "인테리어 스타일은 있는데 어떻게 설명해야 할지 막막했거든요. 정리된 내용으로 업체에 전달되니 상담이 훨씬 수월했습니다.",
  },
  {
    name: "박○○",
    location: "인천 · 오피스",
    text: "공사비보다 추가 비용이 무서웠는데, 조건이 명확하게 정리된 덕분에 업체와 처음부터 확실하게 얘기할 수 있어서 안심됐어요.",
  },
  {
    name: "최○○",
    location: "서울 강남 · 아파트",
    text: "직접 업체 여러 곳을 알아보다가 지쳐서 이용했는데, 한 번에 가격 차이를 보고 나서 선택하니 훨씬 마음이 편했어요.",
  },
  {
    name: "정○○",
    location: "경기 수원 · 주택",
    text: "처음 인테리어라 막막했는데, 단계별로 안내해줘서 뭘 준비해야 할지 자연스럽게 알 수 있었어요. 생각보다 어렵지 않았어요.",
  },
  {
    name: "강○○",
    location: "부산 · 아파트",
    text: "직장 다니면서 인테리어 알아보기가 너무 힘들었는데, 조건 한 번 입력으로 여러 견적을 받을 수 있어서 시간이 많이 절약됐어요.",
  },
  {
    name: "윤○○",
    location: "서울 마포 · 빌라",
    text: "소규모 공사라서 업체가 관심 없을 것 같았는데, 부담 없이 비교할 수 있었고 원하는 조건에 맞는 업체도 찾을 수 있었어요.",
  },
  {
    name: "임○○",
    location: "경기 고양 · 아파트",
    text: "예전에 인테리어 실패한 경험이 있어서 이번엔 신중하게 알아봤어요. 충분히 비교하고 나서 선택하니 훨씬 믿음이 갔습니다.",
  },
] as const;

const CARD_WIDTH = 320;
const CARD_GAP = 20;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const AUTO_INTERVAL = 3500;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = TESTIMONIALS.length;
  const displayIndex = currentIndex % total;
  const translateX = -displayIndex * CARD_STEP;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    resetTimer();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    resetTimer();
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
    resetTimer();
  };

  const handleDragStart = (clientX: number) => {
    setDragStart(clientX);
  };

  const handleDragEnd = (clientX: number) => {
    if (dragStart === null) return;
    const delta = dragStart - clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) handleNext();
      else handlePrev();
    }
    setDragStart(null);
  };

  return (
    <section className="w-full bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-5xl">

        {/* 통계 배너 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center"
        >
          <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
            숫자로 보는 서비스
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
              <p className="mt-1.5 text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* 구분선 + 섹션 제목 */}
        <div className="my-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-100" />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-sm font-medium text-gray-400"
          >
            💬 실제 이용하신 분들의 이야기입니다
          </motion.p>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* 드래그 캐러셀 + 화살표 */}
        <div className="relative">
          {/* 왼쪽 화살표 */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50 transition-colors sm:-translate-x-5"
            aria-label="이전 후기"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>

          {/* 오른쪽 화살표 */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 z-10 translate-x-4 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-gray-100 hover:bg-gray-50 transition-colors sm:translate-x-5"
            aria-label="다음 후기"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>

          <div
            ref={containerRef}
            className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseUp={(e) => handleDragEnd(e.clientX)}
            onMouseLeave={() => setDragStart(null)}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
          >
            <motion.div
              className="flex gap-5"
              animate={{ x: translateX }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {TESTIMONIALS.map((review) => (
                <div
                  key={review.name}
                  className="w-[85vw] max-w-[320px] flex-shrink-0 flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm"
                >
                  <p className="flex-1 text-[15px] leading-relaxed text-gray-700">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.location}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dot indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === displayIndex
                  ? "w-5 bg-orange-500"
                  : "w-2 bg-gray-200 hover:bg-gray-300"
              }`}
              aria-label={`후기 ${i + 1}번으로 이동`}
            />
          ))}
        </div>

        {/* 면책 문구 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center text-xs text-gray-400"
        >
          실제 이용자의 경험을 바탕으로 구성된 예시입니다.
        </motion.p>
      </div>
    </section>
  );
}
