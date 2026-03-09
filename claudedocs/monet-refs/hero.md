# Hero 섹션 컴포넌트 레퍼런스

## 추천 컴포넌트
- 컴포넌트명: `landingfolio-hero-5`
- 미리보기: https://monet.design/c/landingfolio-hero-5
- 카테고리: hero
- 스타일: light-theme, minimal, modern, gradient
- 레이아웃: two-column
- 산업: saas, fintech, creative, startup, ai

## 의존성
```bash
npm install motion
```
next/image는 Next.js 내장 (별도 설치 불필요)

## 코드
```tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

// ============================================================================
// CUSTOMIZATION - 이 섹션의 값들을 수정하여 프로젝트에 맞게 조정하세요
// ============================================================================

const COLORS = {
  light: {
    cardGradientFrom: "#FFD700",
    cardGradientMid: "#FFC107",
    cardGradientTo: "#FF9800",
    cardChipBg: "#E5A800",
    accent: "#F97316",
  },
  dark: {
    cardGradientFrom: "#FFD700",
    cardGradientMid: "#FFC107",
    cardGradientTo: "#FF9800",
    cardChipBg: "#E5A800",
    accent: "#F97316",
  },
} as const;

const IMAGES = {
  woman: {
    path: "/registry/landingfolio-hero-5/woman.png",
    alt: "Happy developer with credit card",
    prompt: `Professional portrait of a young woman holding a credit card.
Style: Clean, bright, professional photography with white/light background
Layout: Full body or 3/4 shot, centered composition, PNG with transparency
Composition: Confident pose, holding credit card, professional attire
Color palette: Clean, bright, natural skin tones
Mood: Happy, confident, successful, approachable
Technical: High resolution, PNG transparency, professional lighting`,
  },
} as const;

// ============================================================================
// END CUSTOMIZATION
// ============================================================================

interface NavItem {
  label: string;
  href: string;
}

interface StatItem {
  value: string;
  label: string;
}

interface LandingfolioHero5Props {
  mode?: "light" | "dark";
  logoText?: string;
  navItems?: NavItem[];
  headline?: string;
  description?: string;
  inputPlaceholder?: string;
  ctaText?: string;
  signInText?: string;
  createAccountText?: string;
  stats?: StatItem[];
  cardholderName?: string;
  cardCompanyName?: string;
  onSubmit?: (email: string) => void;
}

function WavyLines() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20C20 20 20 40 30 40C40 40 40 20 50 20C60 20 60 40 70 40" stroke="#1D2939" strokeWidth="2" fill="none" />
      <path d="M10 35C20 35 20 55 30 55C40 55 40 35 50 35C60 35 60 55 70 55" stroke="#1D2939" strokeWidth="2" fill="none" />
      <path d="M10 50C20 50 20 70 30 70C40 70 40 50 50 50C60 50 60 70 70 70" stroke="#1D2939" strokeWidth="2" fill="none" />
    </svg>
  );
}

function StatDivider() {
  return (
    <div className="flex flex-col gap-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-3 w-[2px] bg-[#D1D5DB]" />
      ))}
    </div>
  );
}

const defaultNavItems: NavItem[] = [
  { label: "Solutions", href: "#" },
  { label: "Industries", href: "#" },
  { label: "Fees", href: "#" },
  { label: "About Rareblocks", href: "#" },
];

const defaultStats: StatItem[] = [
  { value: "2943", label: "Cards\nDelivered" },
  { value: "$1M+", label: "Transaction\nCompleted" },
];

export default function LandingfolioHero5({
  mode = "light",
  logoText = "RAREBLOCKS",
  navItems = defaultNavItems,
  headline = "A special credit\ncard made for\nDevelopers.",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vehicula massa in enim luctus. Rutrum arcu.",
  inputPlaceholder = "Enter email address",
  ctaText = "Get Free Card",
  signInText = "Sign in",
  createAccountText = "Create free account",
  stats = defaultStats,
  cardholderName = "ESTHER HOWARD",
  cardCompanyName = "RJ DEVELOPMENT INC",
  onSubmit,
}: LandingfolioHero5Props) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#F9FAFC]">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16"
      >
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-[#1D2939]">/</span>
          <span className="text-sm font-semibold tracking-[0.2em] text-[#1D2939]">{logoText}</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm text-[#1D2939] transition-colors hover:text-[#4B5563]">
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hidden text-sm text-[#1D2939] transition-colors hover:text-[#4B5563] sm:block">
            {signInText}
          </a>
          <a href="#" className="rounded-full bg-[#1D2939] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#374151]">
            {createAccountText}
          </a>
        </div>
      </motion.nav>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pt-12 sm:px-10 md:grid-cols-2 md:gap-12 md:px-16 md:pt-16">
        <div className="flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="whitespace-pre-line text-4xl font-medium italic leading-tight text-[#111827] sm:text-5xl lg:text-[56px]"
          >
            {headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 max-w-md text-base leading-relaxed text-[#6B7280]"
          >
            {description}
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="mt-8 flex max-w-md items-center rounded-full border border-[#E5E7EB] bg-white p-1.5 shadow-sm"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={inputPlaceholder}
              className="flex-1 bg-transparent px-4 py-2 text-sm text-[#1D2939] placeholder:text-[#9CA3AF] focus:outline-none"
            />
            <button type="submit" className="rounded-full bg-[#1D2939] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#374151]">
              {ctaText}
            </button>
          </motion.form>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex items-center gap-6"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-6">
                {index > 0 && <StatDivider />}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-[#1D2939] sm:text-4xl">{stat.value}</span>
                  <span className="whitespace-pre-line text-xs leading-tight text-[#6B7280]">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative min-h-[500px]">
          <div className="absolute -left-4 top-0 z-20"><WavyLines /></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative ml-auto h-[450px] w-full max-w-[380px] md:h-[520px] md:max-w-[400px]"
          >
            <Image src={IMAGES.woman.path} alt={IMAGES.woman.alt} fill className="rounded-lg object-cover object-top" priority />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

## 적용 가이드

### PRD 맞춤 수정 포인트

1. **헤드라인 교체**
   ```tsx
   headline="지금 가장 비싸게 내고 있는 인테리어 견적,\nAI가 딱 잡아드립니다"
   ```

2. **email form → dual CTA 버튼으로 교체**
   - `<motion.form>` 블록을 제거하고 아래 코드로 대체:
   ```tsx
   <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
     <button className="rounded-full bg-[#1D2939] px-8 py-4 text-base font-semibold text-white hover:bg-[#374151] transition-colors">
       무료 견적 받기
     </button>
     <button className="rounded-full border border-[#1D2939] px-8 py-4 text-base font-semibold text-[#1D2939] hover:bg-gray-50 transition-colors">
       실제 사례 보기
     </button>
   </div>
   ```

3. **stats → 공감 포인트 3개로 교체**
   ```tsx
   // 예시: "100+ 파트너 업체 | 평균 23% 절감 | 48시간 내 비교"
   stats={[
     { value: "100+", label: "파트너\n업체" },
     { value: "23%", label: "평균\n비용 절감" },
     { value: "48h", label: "견적\n비교 완료" },
   ]}
   ```

4. **이미지 교체**: `/registry/landingfolio-hero-5/woman.png` → 인테리어 시공 사진 또는 before/after 이미지

5. **크레딧 카드 UI 제거**: 인테리어 서비스와 무관하므로 `<CreditCard />` 컴포넌트 전체 삭제
