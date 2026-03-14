# How It Works 섹션 컴포넌트 레퍼런스

## 추천 컴포넌트
- 컴포넌트명: `patenty-ai-how-it-works-3`
- 미리보기: https://monet.design/c/patenty-ai-how-it-works-3
- 카테고리: how-it-works
- 스타일: dark-theme, modern, minimal
- 레이아웃: centered, full-width, grid
- 특징: STEP 번호 + 아이콘 + 제목 + 설명, 한국어 콘텐츠 내장, 5단계 → 4단계로 수정 가능

## 의존성
```bash
npm install motion lucide-react
```

## 코드
```tsx
"use client";

// ============================================================================
// CUSTOMIZATION - 이 섹션의 값들을 수정하여 프로젝트에 맞게 조정하세요
// ============================================================================

const CONTENT = {
  title: "AI와 함께 만드는 특허 종합 솔루션",
  subtitle: "특허명세서 생성부터 OA대응, 다국가 출원준비까지",
  steps: [
    {
      step: 1,
      title: "AI 청구항 생성",
      description: "AI가 발명을 분석하고\n청구항을 먼저 제안합니다",
      isHighlighted: true,
    },
    {
      step: 2,
      title: "초안 생성 & 피드백",
      description: "AI가 초안을 작성하고\n변리사는 초안을 검수하며\n피드백을 제공합니다",
      isHighlighted: false,
    },
    {
      step: 3,
      title: "세부 편집 & 완성",
      description: "섹션별·문단별·문장별로 수정\n요청하면 AI가 즉각 수정을\n반영하고 완성합니다",
      isHighlighted: false,
    },
    {
      step: 4,
      title: "OA 대응",
      description: "심사관 의견에 대한 AI 기반\n답변서 작성 및 보정",
      isHighlighted: false,
    },
    {
      step: 5,
      title: "글로벌 출원",
      description: "다국가 특허 출원을 위한\n번역 및 현지화",
      isHighlighted: false,
    },
  ],
} as const;

// ============================================================================
// END CUSTOMIZATION
// ============================================================================

import { motion } from "motion/react";
import { Brain, FileText, Users, CheckCircle, Globe } from "lucide-react";

interface StepItem {
  step: number;
  title: string;
  description: string;
  isHighlighted?: boolean;
}

interface PatentyAiHowItWorks3Props {
  mode?: "light" | "dark";
  title?: string;
  subtitle?: string;
  steps?: StepItem[];
}

const StepIcon = ({ step, isHighlighted }: { step: number; isHighlighted: boolean }) => {
  const iconClass = isHighlighted ? "w-7 h-7 text-black" : "w-7 h-7 text-neutral-400";
  switch (step) {
    case 1: return <Brain className={iconClass} />;
    case 2: return <FileText className={iconClass} />;
    case 3: return <Users className={iconClass} />;
    case 4: return <CheckCircle className={iconClass} />;
    case 5: return <Globe className={iconClass} />;
    default: return <Brain className={iconClass} />;
  }
};

export default function PatentyAiHowItWorks3({
  mode = "dark",
  title = CONTENT.title,
  subtitle = CONTENT.subtitle,
  steps = [...CONTENT.steps],
}: PatentyAiHowItWorks3Props) {
  return (
    <section className="relative w-full bg-black py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
                  item.isHighlighted ? "bg-white" : "bg-neutral-800"
                }`}
              >
                <StepIcon step={item.step} isHighlighted={item.isHighlighted ?? false} />
              </div>
              <span className="text-xs font-medium text-neutral-500 tracking-wider mb-2">
                STEP {item.step}
              </span>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 적용 가이드

### PRD 4단계 프로세스로 교체

CONTENT 전체를 아래 내용으로 교체합니다:

```tsx
const CONTENT = {
  title: "견적 받기, 이렇게 간단합니다",
  subtitle: "복잡한 절차 없이 4단계로 AI 인테리어 견적 비교 완료",
  steps: [
    {
      step: 1,
      title: "기본 정보 입력",
      description: "공간 유형, 면적, 지역,\n예산 범위를 간단히\n입력합니다",
      isHighlighted: true,
    },
    {
      step: 2,
      title: "AI 견적 분석",
      description: "AI가 유사 시공 사례를\n분석해 적정 견적 범위를\n산출합니다",
      isHighlighted: false,
    },
    {
      step: 3,
      title: "업체 매칭",
      description: "검증된 파트너 업체 3곳이\n맞춤 견적을 제출합니다",
      isHighlighted: false,
    },
    {
      step: 4,
      title: "비교 & 선택",
      description: "견적을 한눈에 비교하고\n마음에 드는 업체를\n선택합니다",
      isHighlighted: false,
    },
  ],
} as const;
```

### 구조 수정 포인트

1. **5단계 → 4단계**: `lg:grid-cols-5` → `lg:grid-cols-4`로 변경
   ```tsx
   // 변경 전
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
   // 변경 후
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
   ```

2. **아이콘 교체** (lucide-react 기준):
   - STEP 1: `ClipboardList` (정보 입력)
   - STEP 2: `Sparkles` (AI 분석)
   - STEP 3: `Building2` (업체 매칭)
   - STEP 4: `CheckCircle2` (비교 선택)

3. **배경색 선택**:
   - 다크 테마 유지: `bg-black` 그대로 사용 (PRD의 신뢰/세련 이미지)
   - 라이트 테마 전환: `bg-black` → `bg-gray-50`, 텍스트 색상 반전

4. **STEP 강조**: 첫 번째 단계만 `isHighlighted: true`로 설정하면 흰색 배경 아이콘으로 자동 강조됨
