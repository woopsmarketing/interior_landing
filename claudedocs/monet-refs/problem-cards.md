# Problem Cards 섹션 컴포넌트 레퍼런스

## 추천 컴포넌트
- 컴포넌트명: `features-x`
- 미리보기: https://monet.design/c/features-x (카테고리: feature)
- 카테고리: feature
- 스타일: dark-theme, minimal
- 레이아웃: 4-card grid (lg:grid-cols-4), 2x2 가능 (sm:grid-cols-2)
- 특징: 각 카드에 시각적 목업 + 제목 + 설명, motion 애니메이션, 순차 진입 효과

## 의존성
```bash
npm install motion lucide-react
```

## 코드
```tsx
"use client";

import { motion } from "motion/react";
import { Check, CircleDot, ArrowRight, Triangle } from "lucide-react";

// ============================================================================
// CUSTOMIZATION
// ============================================================================

const COLORS = { light: {}, dark: {} } as const;
const IMAGES = {} as const;

// ============================================================================
// END CUSTOMIZATION
// ============================================================================

interface FeatureCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}

interface FeaturesXProps {
  mode?: "light" | "dark";
  heading?: string;
  features?: {
    title: string;
    description: string;
    type: "badges" | "radar" | "jobs" | "handle";
    data?: any;
  }[];
}

function FeatureCard({ title, description, children, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col"
    >
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 mb-6 min-h-[220px] flex items-center justify-center">
        {children}
      </div>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

const defaultFeatures: FeaturesXProps["features"] = [
  {
    title: "신뢰 향상 및 발견 가능성 증대",
    description: "금색 체크마크로 차별화하고 제휴 계정을 추가해 인지도를 높이세요.",
    type: "badges",
    data: [
      { name: "Coinbase", verified: true, icon: "coinbase" },
      { name: "tobi lutke", verified: true, icon: "twitter" },
      { name: "Tesla", verified: true, icon: "tesla" },
    ],
  },
  {
    title: "실시간 인사이트 확보",
    description: "Radar를 활용해 브랜드와 업계 전반에 관한 대화와 정서를 모니터링하세요.",
    type: "radar",
    data: [{ label: "Crypto" }, { label: "Fintech" }, { label: "Series A" }],
  },
  {
    title: "최고의 인재 채용",
    description: "세계에서 가장 똑똑하고 영향력 있는 사람들에게 귀사의 공개 채용 포지션을 알리세요.",
    type: "jobs",
    data: [
      { title: "Senior Product Marketing Manager, v0", location: "San Francisco", type: "hybrid" },
      { title: "Software Engineer, Lua", location: "United States", type: "remote" },
      { title: "Software Engineer, Accounts", location: "Berlin", type: "hybrid" },
    ],
  },
  {
    title: "우선순위 사용자 아이디 획득",
    description: "추가 비용 없이 우선순위 사용자 아이디를 획득하고 가치 있는 비활성 사용자 아이디를 구매하세요.",
    type: "handle",
    data: { handle: "loop", available: true },
  },
];

export default function FeaturesX({
  mode = "light",
  heading = "성장을 위한 도구로 앞서 나가세요",
  features = defaultFeatures,
}: FeaturesXProps) {
  return (
    <section className="w-full bg-black px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-12 lg:mb-16"
        >
          {heading}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features?.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            >
              {/* 카드 내부 시각 요소 — 아이콘/일러스트로 교체 */}
              <div className="text-zinc-500 text-sm">{feature.type}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 적용 가이드

### PRD "문제/공감" 섹션 4개 카드로 전면 교체

아래는 인테리어 서비스에 맞게 완전히 재작성한 버전입니다. 기존 Badge/Radar/Jobs/Handle 목업을 제거하고 아이콘 + 공감 일러스트 구조로 교체합니다:

```tsx
import { AlertCircle, Clock, Search, Star } from "lucide-react";

// 문제 카드 데이터
const PROBLEM_CARDS = [
  {
    icon: <AlertCircle className="w-10 h-10 text-red-400" />,
    title: "가격이 얼마인지 알 수가 없어요",
    description: "업체마다 부르는 가격이 다르고, 왜 다른지 설명도 없습니다. 견적서를 받아도 항목이 불투명해서 비교조차 어렵습니다.",
  },
  {
    icon: <Search className="w-10 h-10 text-yellow-400" />,
    title: "믿을 수 있는 업체를 찾기 어려워요",
    description: "인터넷에 업체는 넘쳐나지만 어디가 진짜 잘 하는지 모릅니다. 지인 추천 없이는 결정하기 무섭습니다.",
  },
  {
    icon: <Clock className="w-10 h-10 text-blue-400" />,
    title: "견적 받는 것 자체가 너무 피곤해요",
    description: "여러 업체에 일일이 연락하고, 방문 약속 잡고, 설명하기를 반복하는 과정이 일처럼 느껴집니다.",
  },
  {
    icon: <Star className="w-10 h-10 text-purple-400" />,
    title: "시공 품질을 어떻게 믿어요?",
    description: "계약 전엔 다들 친절하지만, 시공 후 하자가 생겨도 책임지는 업체가 없을까봐 불안합니다.",
  },
];

// 카드 컴포넌트 (라이트 테마 전환 버전)
function ProblemCard({ card, index }: { card: typeof PROBLEM_CARDS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
        {card.icon}
      </div>
      <h3 className="text-gray-900 font-bold text-lg mb-3">{card.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
    </motion.div>
  );
}

export default function ProblemCards() {
  return (
    <section className="w-full bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-gray-500 mb-3">많은 분들이 이런 고민을 합니다</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            인테리어, 왜 이렇게 어려울까요?
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PROBLEM_CARDS.map((card, index) => (
            <ProblemCard key={card.title} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 핵심 수정 사항 요약

| 항목 | 원본 (features-x) | 인테리어 맞춤 버전 |
|------|-------------------|------------------|
| 배경 | `bg-black` (다크) | `bg-gray-50` (라이트) |
| 카드 배경 | `bg-zinc-900/30` | `bg-white` |
| 그리드 | `lg:grid-cols-4` | `sm:grid-cols-2` (2x2 고정) |
| 카드 내부 | Badge/Radar 목업 | 아이콘 + 텍스트만 |
| 텍스트 | `text-white` / `text-zinc-500` | `text-gray-900` / `text-gray-500` |

### 그리드 2x2 고정 방법
```tsx
// lg:grid-cols-4 제거, sm:grid-cols-2만 유지하면 항상 2x2
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
```
