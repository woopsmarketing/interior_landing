"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Building2,
  Users,
  TrendingUp,
  Shield,
  ClipboardList,
  MessageSquare,
  Handshake,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  BadgeCheck,
  BarChart3,
  Eye,
  Heart,
  Gift,
  Megaphone,
  Wallet,
  Clock,
  Target,
  Award,
  CircleDollarSign,
  Lightbulb,
  ThumbsUp,
} from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const HERO_BADGES = [
  "가입비 무료",
  "견적 중개 수수료 0원",
  "고객 직접 매칭",
  "승인 없이 즉시 시작",
] as const;

const STATS = [
  { icon: Users, value: "100+", label: "등록 업체" },
  { icon: ClipboardList, value: "매일", label: "신규 견적 요청" },
  { icon: BadgeCheck, value: "0원", label: "수수료" },
  { icon: BarChart3, value: "5분", label: "평균 응답 시간" },
] as const;

const BENEFITS = [
  {
    icon: Users,
    title: "검증된 고객 요청만 전달",
    description:
      "공간 정보, 예산, 스타일, 시공 범위까지 상세하게 작성된 고객 요청만 전달합니다. 막연한 문의가 아닌, 진짜 시공 의향이 있는 고객입니다.",
  },
  {
    icon: TrendingUp,
    title: "매출 채널 확장",
    description:
      "기존 영업 방식에 온라인 채널을 추가하세요. 블로그, SNS 광고 없이도 꾸준히 견적 요청이 들어옵니다.",
  },
  {
    icon: Eye,
    title: "포트폴리오 무료 홍보",
    description:
      "시공 사례를 등록하면 견적 비교 중인 고객에게 직접 노출됩니다. 별도 광고비 없이 시공 실력을 어필할 수 있습니다.",
  },
  {
    icon: Shield,
    title: "수수료 걱정 제로",
    description:
      "가입비, 월 이용료, 건당 수수료 모두 무료입니다. 고객과 직접 계약하므로 중간 수수료가 발생하지 않습니다.",
  },
] as const;

const FREE_POINTS = [
  { icon: CircleDollarSign, text: "회원가입 무료" },
  { icon: Wallet, text: "월 이용료 0원" },
  { icon: Target, text: "건당 수수료 0원" },
  { icon: Megaphone, text: "포트폴리오 홍보 무료" },
  { icon: MessageSquare, text: "견적 응답 무제한" },
  { icon: Award, text: "프리미엄 기능 무료 제공" },
] as const;

const STEPS = [
  {
    step: 1,
    icon: ClipboardList,
    title: "무료 회원가입",
    description:
      "이메일과 업체명만 입력하면 끝. 복잡한 서류 제출이나 관리자 승인 대기 없이, 가입 즉시 모든 기능을 이용할 수 있습니다.",
  },
  {
    step: 2,
    icon: Star,
    title: "프로필 & 포트폴리오 등록",
    description:
      "업체 소개, 전문 분야, 서비스 지역을 설정하고 시공 사례 사진을 업로드하세요. 풍부한 포트폴리오는 고객의 선택에 큰 영향을 줍니다.",
  },
  {
    step: 3,
    icon: MessageSquare,
    title: "견적 요청 확인 & 응답",
    description:
      "고객이 작성한 상세 요청서를 확인하세요. 공간 사진, 참고 이미지, 예산, 시공 범위까지 한눈에 파악하고 맞춤 견적을 보낼 수 있습니다.",
  },
  {
    step: 4,
    icon: Handshake,
    title: "고객과 직접 연결",
    description:
      "고객이 여러 업체의 답변을 비교한 뒤, 마음에 드는 업체에 직접 연락합니다. 중간 단계 없이 고객과 1:1로 소통하세요.",
  },
] as const;

const WHY_DIFFERENT = [
  {
    icon: Target,
    title: "고객이 먼저 찾아옵니다",
    description:
      "직접 고객을 찾아다니는 대신, 시공 의향이 있는 고객의 요청이 대시보드로 들어옵니다. 영업에 쓰는 시간을 시공에 집중할 수 있습니다.",
  },
  {
    icon: Clock,
    title: "응답 한 번으로 충분합니다",
    description:
      "여러 플랫폼에 같은 내용을 반복 등록할 필요 없습니다. 한 곳에서 견적 요청을 확인하고, 한 번의 응답으로 고객과 연결됩니다.",
  },
  {
    icon: Lightbulb,
    title: "데이터로 성장합니다",
    description:
      "응답률, 선택률 등 업체 활동 데이터를 제공합니다. 어떤 유형의 고객에게 강한지 파악하고, 영업 전략을 데이터 기반으로 세울 수 있습니다.",
  },
] as const;

const FAQS = [
  {
    q: "정말 모든 기능이 무료인가요?",
    a: "네, 100% 무료입니다. 가입비, 월 이용료, 건당 수수료가 없습니다. 고객과 직접 계약하므로 중간 수수료도 발생하지 않습니다. 앞으로도 기본 기능은 무료로 유지할 계획입니다.",
  },
  {
    q: "어떤 고객 요청이 들어오나요?",
    a: "공간 유형, 면적, 예산, 시공 범위, 선호 스타일, 희망 시기 등이 상세하게 작성된 요청만 전달됩니다. 고객이 공간 사진이나 참고 이미지를 첨부한 경우 함께 확인할 수 있습니다.",
  },
  {
    q: "견적 응답은 어떻게 하나요?",
    a: "대시보드에서 견적 요청의 상세 내용(공간 정보, 예산, 시공 범위, 첨부 이미지 등)을 확인하고, 예상 금액과 메시지를 입력해 응답하면 됩니다. 응답에는 제한이 없습니다.",
  },
  {
    q: "가입 후 바로 이용할 수 있나요?",
    a: "네, 가입 즉시 대시보드를 이용할 수 있습니다. 별도의 관리자 승인 대기 없이 바로 시작하세요. 포트폴리오를 등록하면 고객에게 더 높은 신뢰를 줄 수 있습니다.",
  },
  {
    q: "고객 개인정보는 어떻게 관리되나요?",
    a: "고객의 연락처 등 개인정보는 업체에 직접 공개되지 않습니다. 고객이 업체의 답변을 확인한 후, 원하는 업체에 직접 연락하는 방식이므로 개인정보가 안전하게 보호됩니다.",
  },
  {
    q: "포트폴리오는 몇 개까지 등록할 수 있나요?",
    a: "제한 없이 무제한으로 등록할 수 있습니다. 다양한 시공 사례를 등록할수록 고객에게 더 풍부한 정보를 제공할 수 있어 선택 확률이 높아집니다.",
  },
] as const;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function CompanyLandingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    fetch("/api/companies/login")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.replace("/company/dashboard");
      })
      .catch(() => {});
  }, [router]);

  return (
    <main className="min-h-screen bg-white">
      {/* ================================================================== */}
      {/* 헤더 */}
      {/* ================================================================== */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/company" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">
              B
            </div>
            <span className="text-base font-bold text-gray-900">
              모아견적 <span className="text-orange-500">파트너</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/company/login"
              className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/company/register"
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              무료 가입
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* 히어로 (로그인 카드 제거, 중앙 정렬) */}
      {/* ================================================================== */}
      <section className="relative w-full overflow-hidden py-20 sm:py-28 lg:py-32">
        <div className="absolute inset-0 bg-[#FFF9F5]" />
        <div className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-orange-200/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-[380px] w-[380px] rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full bg-orange-100/30 blur-2xl" />

        <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-4 py-2 text-xs font-bold text-orange-600 mb-8">
              <Building2 className="h-3.5 w-3.5" />
              인테리어 업체 전용 플랫폼
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              고객이 먼저 찾아오는
              <br />
              <span className="text-orange-500">새로운 영업 채널</span>
            </h1>

            <p className="mt-8 text-lg font-semibold leading-relaxed text-gray-700 sm:text-xl">
              매일 새로운 견적 요청이 들어옵니다.
              <br />
              <span className="text-orange-500 font-bold">가입비·수수료 완전 무료</span>로 시작하세요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {HERO_BADGES.map((badge) => (
              <span key={badge} className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <CheckCircle2 className="h-5 w-5 text-orange-500" />
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/company/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-10 py-4.5 text-lg font-bold text-white shadow-lg shadow-orange-200/60 hover:bg-orange-600 hover:shadow-xl transition-all"
            >
              지금 무료로 시작하기
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/company/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-orange-200 px-8 py-4 text-base font-bold text-orange-600 hover:bg-orange-50 transition-all"
            >
              이미 회원이신가요? 로그인
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 통계 바 */}
      {/* ================================================================== */}
      <section className="w-full border-y border-gray-100 bg-white px-5 py-8">
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <Icon className="h-6 w-6 text-orange-500" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900">{value}</p>
                <p className="text-xs font-semibold text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* 왜 모아견적인가 — 혜택 4가지 */}
      {/* ================================================================== */}
      <section className="w-full bg-white px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
              왜 <span className="text-orange-500">모아견적 파트너</span>인가요?
            </h2>
            <p className="mt-4 text-base font-medium text-gray-500 sm:text-lg">
              업체가 성장할 수 있는 환경을 무료로 제공합니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 hover:shadow-lg hover:border-orange-100 transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 mb-5">
                  <Icon className="h-7 w-7 text-orange-500" strokeWidth={1.8} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm font-medium leading-relaxed text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 100% 무료 강조 섹션 */}
      {/* ================================================================== */}
      <section className="w-full bg-[#FFF9F5] px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
              💰 진짜로, <span className="text-orange-500">100% 무료</span>입니다
            </h2>
            <p className="mt-4 text-base font-medium text-gray-600 sm:text-lg max-w-2xl mx-auto">
              숨겨진 비용 없습니다. 가입부터 고객 매칭까지 모든 과정이 무료이며,
              <br className="hidden sm:block" />
              고객과 직접 계약하므로 중간 수수료도 발생하지 않습니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FREE_POINTS.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-2xl bg-white border border-orange-100 p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                  <Icon className="h-5 w-5 text-orange-500" strokeWidth={1.8} />
                </div>
                <span className="text-sm font-bold text-gray-900">{text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <p className="text-sm font-medium text-gray-500">
              현재 오픈 베타 기간으로 모든 프리미엄 기능을 무료로 제공하고 있습니다.
              <br />
              <span className="font-bold text-orange-500">지금 가입하면 향후에도 기본 기능은 영구 무료</span>로 이용하실 수 있습니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 다른 플랫폼과 다른 점 */}
      {/* ================================================================== */}
      <section className="w-full bg-white px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
              🏆 다른 플랫폼과 <span className="text-orange-500">이렇게</span> 다릅니다
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {WHY_DIFFERENT.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl bg-gray-50 border border-gray-100 p-7 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 mb-5">
                  <Icon className="h-7 w-7 text-orange-500" strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm font-medium leading-relaxed text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 이용 방법 — 4스텝 */}
      {/* ================================================================== */}
      <section className="w-full bg-gray-50 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
              📋 시작부터 계약까지,<br className="hidden sm:block" />
              이렇게 간단합니다
            </h2>
            <p className="mt-4 text-base font-medium text-gray-500">
              복잡한 절차 없이 4단계로 고객과 연결됩니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map(({ step, icon: Icon, title, description }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-[calc(50%+2.5rem)] top-7 hidden h-px w-[calc(100%-5rem)] bg-gray-200 lg:block"
                  />
                )}
                <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                  <Icon className="h-8 w-8 text-orange-500" strokeWidth={1.8} />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                    {step}
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm font-medium leading-relaxed text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-14 text-center"
          >
            <Link
              href="/company/register"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-10 py-4.5 text-lg font-bold text-white shadow-lg shadow-orange-200/60 hover:bg-orange-600 transition-all"
            >
              <Zap className="h-5 w-5" />
              지금 무료 가입하기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 피드백 & 프로모션 섹션 */}
      {/* ================================================================== */}
      <section className="w-full bg-gradient-to-br from-orange-50 to-amber-50 px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-600 mb-8">
              <Heart className="h-4 w-4" />
              함께 만들어가는 플랫폼
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl leading-snug">
              파트너분들의 <span className="text-orange-500">피드백</span>으로
              <br />
              매일 더 좋아지고 있습니다
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-8 space-y-6"
          >
            <p className="text-base font-semibold leading-relaxed text-gray-700 sm:text-lg">
              저희 플랫폼은 업체 파트너분들의 피드백을 통해
              <br className="hidden sm:block" />
              <span className="text-orange-500 font-bold">꾸준히 업데이트</span>되고 있습니다.
            </p>

            <div className="rounded-2xl bg-white border border-orange-100 p-8 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Megaphone className="h-6 w-6 text-orange-500" />
                <p className="text-lg font-bold text-gray-900">피드백을 마구마구 보내주세요!</p>
              </div>
              <p className="text-base font-medium text-gray-600 leading-relaxed">
                &ldquo;이런 기능이 있었으면 좋겠어요&rdquo;
                <br />
                &ldquo;이 부분이 불편해요&rdquo;
                <br />
                &ldquo;이렇게 바꾸면 더 좋을 것 같아요&rdquo;
                <br />
                <br />
                <span className="font-bold text-gray-800">어떤 의견이든 환영합니다.</span>
                <br />
                보내주신 모든 피드백은 직접 검토하고 반영합니다.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-orange-100 p-8 shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="h-6 w-6 text-orange-500" />
                <p className="text-lg font-bold text-gray-900">유용한 피드백에는 보답합니다</p>
              </div>
              <p className="text-base font-medium text-gray-600 leading-relaxed">
                보내주신 피드백이 실제 서비스 개선에 반영되면,
                <br />
                <span className="text-orange-500 font-bold">특별 이벤트와 프로모션 혜택</span>을 제공해 드립니다.
                <br />
                <br />
                플랫폼을 함께 만들어가는 파트너에게
                <br />
                더 큰 기회를 드리겠습니다.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="flex items-center gap-1.5 rounded-full bg-white border border-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
                <ThumbsUp className="h-4 w-4" /> 피드백 반영 보상
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white border border-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
                <Gift className="h-4 w-4" /> 프로모션 우선 참여
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white border border-orange-100 px-4 py-2 text-sm font-bold text-orange-600">
                <Star className="h-4 w-4" /> 우수 파트너 혜택
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ */}
      {/* ================================================================== */}
      <section className="w-full bg-white px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
              자주 묻는 질문
            </h2>
            <p className="mt-3 text-base font-medium text-gray-500">
              궁금한 점이 해결되지 않으셨다면 언제든 문의해주세요
            </p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-base font-bold text-gray-900 pr-4">{q}</span>
                  <span className={`text-orange-500 text-xl font-bold shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm font-medium leading-relaxed text-gray-600">{a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 최종 CTA */}
      {/* ================================================================== */}
      <section className="w-full bg-gradient-to-b from-orange-500 to-orange-600 px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-extrabold leading-snug text-white sm:text-3xl lg:text-4xl"
          >
            🏗️ 더 많은 고객을 만나고,
            <br />
            매출을 키워보세요
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-8 max-w-lg text-base leading-loose text-white/90 sm:text-lg"
          >
            가입비 없이, 수수료 없이,
            <br />
            지금 바로 시작할 수 있습니다.
            <br />
            <br />
            매일 새로운 견적 요청이 기다리고 있습니다.
            <br />
            <span className="font-bold text-white">파트너와 함께 성장하는 모아견적</span>이 되겠습니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/company/register"
              className="w-full rounded-full bg-white px-10 py-4.5 text-lg font-bold text-orange-600 shadow-lg hover:bg-orange-50 transition-colors sm:w-auto"
            >
              무료 회원가입
            </Link>
            <Link
              href="/company/login"
              className="w-full rounded-full border-2 border-white/40 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors sm:w-auto"
            >
              로그인하러 가기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 푸터 */}
      {/* ================================================================== */}
      <footer className="w-full border-t border-gray-100 bg-white px-5 py-8">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-400">
            © 2026 모아견적. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              고객용 홈페이지
            </Link>
            <Link href="/company/register" className="hover:text-orange-500 transition-colors">
              업체 가입
            </Link>
            <Link href="/company/login" className="hover:text-orange-500 transition-colors">
              업체 로그인
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
