# FAQ 섹션 컴포넌트 레퍼런스

## 추천 컴포넌트
- 컴포넌트명: `trackit-so-faq-7`
- 미리보기: https://monet.design/c/trackit-so-faq-7
- 카테고리: faq
- 스타일: light-theme, minimal
- 레이아웃: centered, single-column
- 특징: accordion, animation (AnimatePresence), 한국어 콘텐츠 내장

## 의존성
```bash
npm install motion
```

## 코드
```tsx
"use client";

// ============================================================================
// CUSTOMIZATION
// ============================================================================

const CONTENT = {
  badge: "FAQ",
  title: "자주 묻는 질문",
  description: "트래킷에 대해 자주 받는 질문을 모았습니다.\n그래도 궁금한 점이 있다면 언제든 편하게 채팅 문의 주세요!",
  faqs: [
    {
      question: "트래킷은 어떤 기업에 적합한가요?",
      answer: "트래킷은 B2B 영업을 하는 중소기업부터 대기업까지 모든 규모의 기업에 적합합니다. 특히 영업 데이터 관리와 팀 협업이 필요한 기업에 최적화되어 있습니다.",
    },
    {
      question: "트래킷은 무엇을 커스터마이징할 수 있나요?",
      answer: "데이터 필드, 파이프라인 단계, 대시보드 레이아웃, 권한 설정 등 거의 모든 요소를 기업의 비즈니스 프로세스에 맞게 커스터마이징할 수 있습니다.",
    },
    {
      question: "기존 사용 중인 도구들과 연동이 가능한가요?",
      answer: "네, 이메일, 캘린더, 카카오톡, 슬랙, 노션 등 다양한 외부 서비스와 연동할 수 있습니다. API를 통한 커스텀 연동도 지원합니다.",
    },
    {
      question: "모바일에서도 사용할 수 있나요?",
      answer: "네, iOS와 Android 앱을 제공합니다. 모바일에서도 고객 정보 확인, 영업기회 관리, 팀 알림 등 주요 기능을 모두 사용할 수 있습니다.",
    },
    {
      question: "도입하는 데 시간이 얼마나 걸리나요?",
      answer: "기본적인 설정은 당일 완료 가능하며, 기업 맞춤 커스터마이징과 데이터 마이그레이션을 포함하면 보통 1-2주 정도 소요됩니다.",
    },
  ],
} as const;

// ============================================================================
// END CUSTOMIZATION
// ============================================================================

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface TrackitSoFaq7Props {
  mode?: "light" | "dark";
}

export default function TrackitSoFaq7({ mode = "light" }: TrackitSoFaq7Props) {
  const isDark = mode === "dark";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className={`w-full py-24 ${
        isDark ? "bg-gray-950" : "bg-gradient-to-b from-white to-green-50"
      }`}
    >
      <div className="max-w-[800px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
              isDark ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700"
            }`}
          >
            {CONTENT.badge}
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            {CONTENT.title}
          </h2>
          <p className={`text-lg whitespace-pre-line ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {CONTENT.description}
          </p>
        </motion.div>

        <div className="space-y-4">
          {CONTENT.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl overflow-hidden ${
                isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  {faq.question}
                </span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                    isDark ? "bg-gray-800" : "bg-gray-100"
                  } ${openIndex === index ? "rotate-45" : ""}`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={isDark ? "text-gray-400" : "text-gray-600"}>
                    <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`px-6 pb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 적용 가이드

### PRD 기반 6개 FAQ 항목으로 교체

CONTENT.faqs 배열을 아래 내용으로 교체합니다:

```tsx
faqs: [
  {
    question: "견적 비교 서비스는 완전 무료인가요?",
    answer: "네, 견적 신청과 비교는 100% 무료입니다. 저희는 계약이 성사될 때만 파트너 업체로부터 수수료를 받으며, 고객님께는 어떠한 비용도 청구하지 않습니다.",
  },
  {
    question: "업체들이 제 개인정보를 무분별하게 연락하지는 않나요?",
    answer: "걱정하지 마세요. 저희 플랫폼을 통해 매칭된 업체만 연락할 수 있으며, 원하지 않는 연락은 즉시 차단할 수 있습니다. 개인정보는 견적 목적 외에 사용되지 않습니다.",
  },
  {
    question: "AI 견적은 얼마나 정확한가요?",
    answer: "AI 견적은 유사 시공 사례 데이터를 기반으로 한 참고 범위이며, 실제 견적은 업체 방문 후 확정됩니다. AI 분석은 업체 선택의 기준이 되는 보조 도구로 활용해 주세요.",
  },
  {
    question: "사진을 반드시 업로드해야 하나요?",
    answer: "아니요, 사진 업로드는 선택 사항입니다. 도면이나 참고 이미지를 첨부하면 더 정확한 견적을 받을 수 있지만, 없어도 기본 정보만으로 견적 신청이 가능합니다.",
  },
  {
    question: "파트너 업체는 어떻게 검증되나요?",
    answer: "모든 파트너 업체는 사업자 등록증 확인, 시공 이력 검토, 고객 리뷰 분석의 3단계 검증을 거칩니다. 또한 시공 완료 후 만족도 평가를 통해 지속적으로 품질을 관리합니다.",
  },
  {
    question: "견적을 받은 후 꼭 계약해야 하나요?",
    answer: "전혀 그렇지 않습니다. 견적은 참고용이며 계약 의무가 없습니다. 마음에 드는 업체가 없으면 언제든 거절할 수 있고, 추가 업체 추천을 요청할 수도 있습니다.",
  },
],
```

### 추가 수정 포인트
- `badge` 배지 색상: 인테리어 브랜드 컬러에 맞춰 `green` → 원하는 컬러로 변경
- `description` 텍스트: 서비스명에 맞게 수정
- 배경 그라디언트: `to-green-50` → 브랜드 컬러 계열로 교체
