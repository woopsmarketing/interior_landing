"use client";

import { motion } from "motion/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

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
  {
    name: "한○○",
    location: "서울 송파 · 카페",
    text: "카페 인테리어는 분위기가 전부인데, 내가 원하는 감성을 말로 설명하기 어려웠어요. 조건을 정리해주니 업체들이 딱 맞는 제안을 해줬습니다.",
  },
  {
    name: "조○○",
    location: "대전 · 음식점",
    text: "음식점 리모델링이라 영업 중단 기간이 걱정됐는데, 여러 업체의 공사 일정을 비교할 수 있어서 가장 빠른 곳을 선택할 수 있었어요.",
  },
  {
    name: "서○○",
    location: "서울 강서 · 헬스장",
    text: "헬스장은 바닥재랑 환기 시스템이 중요한데 이런 조건을 정리해서 전달하니 전문 업체들만 답변이 와서 좋았어요.",
  },
  {
    name: "배○○",
    location: "경기 분당 · 아파트 (40평대)",
    text: "신혼집 인테리어라 이것저것 신경 쓸 게 많았는데, 한 번에 여러 업체 제안을 볼 수 있어서 둘이서 편하게 비교했어요.",
  },
  {
    name: "송○○",
    location: "부산 해운대 · 술집",
    text: "바(Bar) 인테리어는 조명이랑 동선이 핵심인데, 이런 세부 조건까지 전달되니 업체들이 정말 구체적인 견적을 보내줬어요.",
  },
  {
    name: "오○○",
    location: "대구 · 주택",
    text: "30년 된 노후 주택이라 리모델링 범위가 넓었는데, 조건별로 정리가 되니 업체마다 어디까지 해주는지 명확하게 비교할 수 있었어요.",
  },
  {
    name: "황○○",
    location: "서울 종로 · 카페",
    text: "작은 카페라 예산이 빠듯했는데, 예산 범위를 미리 알려주니 그 안에서 최대한 맞춰주는 업체들을 찾을 수 있었습니다.",
  },
  {
    name: "신○○",
    location: "광주 · 아파트 (20평대)",
    text: "지방이라 업체 선택지가 적을 줄 알았는데, 전국 단위로 비교가 되니 생각보다 다양한 제안을 받을 수 있었어요.",
  },
  {
    name: "권○○",
    location: "서울 성수 · 음식점",
    text: "브런치 카페 느낌의 음식점을 원했는데, 스타일 키워드만 입력했더니 딱 맞는 포트폴리오를 가진 업체들이 연락을 줬어요.",
  },
  {
    name: "장○○",
    location: "인천 · 헬스장",
    text: "넓은 공간이라 견적 차이가 클 줄 알았는데, 실제로 업체마다 2배 가까이 차이나더라고요. 비교 안 했으면 큰일 날 뻔했어요.",
  },
  {
    name: "유○○",
    location: "경기 일산 · 아파트",
    text: "아이 방이랑 거실 위주로 부분 인테리어를 원했는데, 전체 공사만 하는 줄 알았던 업체들도 부분 시공 견적을 보내줘서 선택 폭이 넓었어요.",
  },
  {
    name: "노○○",
    location: "서울 이태원 · 술집",
    text: "감성 주점 콘셉트라 일반 인테리어와 달랐는데, 상업 공간 전문 업체들의 답변을 한눈에 비교할 수 있어서 만족스러웠어요.",
  },
  {
    name: "하○○",
    location: "제주 · 카페",
    text: "제주에서 카페를 준비하면서 서울 업체랑 제주 현지 업체를 동시에 비교할 수 있었어요. 결국 현지 업체로 결정했는데 가격도 합리적이었어요.",
  },
  {
    name: "문○○",
    location: "서울 잠실 · 아파트 (50평대)",
    text: "큰 평수라 업체마다 설계 방향이 완전히 달랐어요. 여러 제안을 한 번에 비교하니 어떤 방향이 우리 집에 맞는지 감이 왔습니다.",
  },
  {
    name: "안○○",
    location: "수원 · 음식점",
    text: "프랜차이즈가 아니라 개인 식당이라 인테리어 감 잡기가 어려웠는데, 비슷한 규모의 시공 사례를 가진 업체들을 찾을 수 있어서 좋았어요.",
  },
  {
    name: "전○○",
    location: "서울 홍대 · 술집",
    text: "오픈 일정이 빠듯해서 빠르게 업체를 정해야 했는데, 하루 만에 여러 견적이 들어와서 일정 맞추기가 수월했습니다.",
  },
  {
    name: "양○○",
    location: "경기 평택 · 주택",
    text: "시골 단독주택이라 인테리어 업체가 올지 걱정했는데, 생각보다 관심 있는 업체들이 많아서 놀랐어요. 좋은 업체 만났습니다.",
  },
  {
    name: "홍○○",
    location: "대전 · 헬스장",
    text: "기구 배치까지 고려한 인테리어가 필요했는데, 헬스장 시공 경험이 있는 업체들만 골라볼 수 있어서 전문성 있는 곳을 찾았어요.",
  },
  {
    name: "남○○",
    location: "서울 영등포 · 아파트",
    text: "세입자가 나간 후 빠르게 리모델링해야 했는데, 급한 일정에도 맞춰줄 수 있는 업체를 금방 찾았어요. 시간 절약이 컸습니다.",
  },
  {
    name: "류○○",
    location: "부산 서면 · 카페",
    text: "인스타 감성 카페를 만들고 싶었는데, 원하는 분위기를 사진으로 첨부했더니 업체들이 비슷한 시공 사례와 함께 견적을 보내줘서 비교가 쉬웠어요.",
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

        {/* 섹션 제목 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl lg:text-4xl">
            💬 실제 이용하신 분들의 이야기입니다
          </h2>
        </motion.div>

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
                  <p className="flex-1 text-base font-semibold leading-relaxed text-gray-900">
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

        {/* 카운터 */}
        <div className="mt-6 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-500">
            {displayIndex + 1} / {TESTIMONIALS.length}
          </span>
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
