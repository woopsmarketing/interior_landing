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
} from "lucide-react";

// ============================================================================
// 데이터
// ============================================================================

const HERO_BADGES = [
  "가입비 무료",
  "견적 중개 수수료 0원",
  "고객 직접 매칭",
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

const STEPS = [
  {
    step: 1,
    icon: ClipboardList,
    title: "무료 회원가입",
    description: "업체 정보를 입력하고 가입하세요. 승인 없이 즉시 이용 가능합니다.",
  },
  {
    step: 2,
    icon: Star,
    title: "포트폴리오 등록",
    description: "시공 사례와 이미지를 등록하면 고객에게 더 높은 신뢰를 줄 수 있습니다.",
  },
  {
    step: 3,
    icon: MessageSquare,
    title: "견적 요청 확인 & 응답",
    description: "고객의 상세 요청을 확인하고, 견적 금액과 메시지를 보내세요.",
  },
  {
    step: 4,
    icon: Handshake,
    title: "고객과 직접 연결",
    description: "고객이 답변을 비교하고 마음에 드는 업체에 직접 연락합니다.",
  },
] as const;

const STATS = [
  { icon: Users, value: "100+", label: "등록 업체" },
  { icon: ClipboardList, value: "매일", label: "신규 견적 요청" },
  { icon: BadgeCheck, value: "0원", label: "수수료" },
  { icon: BarChart3, value: "5분", label: "평균 응답 시간" },
] as const;

const FAQS = [
  {
    q: "가입비나 이용료가 있나요?",
    a: "아닙니다. 가입비, 월 이용료, 건당 수수료 모두 무료입니다. 고객과 직접 계약하시면 됩니다.",
  },
  {
    q: "어떤 고객 요청이 들어오나요?",
    a: "공간 유형, 면적, 예산, 시공 범위, 선호 스타일 등이 상세하게 작성된 요청만 전달됩니다. 고객이 사진을 첨부한 경우 함께 확인할 수 있습니다.",
  },
  {
    q: "견적 응답은 어떻게 하나요?",
    a: "대시보드에서 견적 요청 상세 내용을 확인하고, 예상 금액과 메시지를 입력해 응답하면 됩니다.",
  },
  {
    q: "가입 후 바로 이용할 수 있나요?",
    a: "네, 가입 즉시 대시보드를 이용할 수 있습니다. 별도의 관리자 승인 대기 없이 바로 시작하세요.",
  },
] as const;

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function CompanyLandingPage() {
  const router = useRouter();

  // ── 로그인 폼 상태 ──
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoginLoading(true);
    try {
      const res = await fetch("/api/companies/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/company/dashboard");
      } else {
        setError(data.error || "로그인 실패");
      }
    } catch {
      setError("서버 연결 실패");
    } finally {
      setLoginLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors";

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
              href="#login"
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
      {/* 히어로 + 로그인 */}
      {/* ================================================================== */}
      <section className="relative w-full overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-[#FFF9F5]" />
        <div className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-orange-200/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-[380px] w-[380px] rounded-full bg-amber-100/40 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* 좌: 텍스트 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3.5 py-1.5 text-xs font-bold text-orange-600 mb-6">
                <Building2 className="h-3.5 w-3.5" />
                인테리어 업체 전용
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">
                고객이 먼저 찾아오는
                <br />
                <span className="text-orange-500">새로운 영업 채널</span>을 만드세요
              </h1>

              <p className="mt-6 text-lg font-semibold leading-relaxed text-gray-700">
                매일 새로운 견적 요청이 들어옵니다.
                <br />
                <span className="text-orange-500 font-bold">가입비·수수료 완전 무료</span>로 시작하세요.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                {HERO_BADGES.map((badge) => (
                  <span key={badge} className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <CheckCircle2 className="h-5 w-5 text-orange-500" />
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/company/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-200/60 hover:bg-orange-600 hover:shadow-xl transition-all"
                >
                  지금 무료로 시작하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* 우: 로그인 카드 */}
            <motion.div
              id="login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="mx-auto max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-100/60">
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-bold text-gray-900">파트너 로그인</h2>
                  <p className="mt-1 text-sm text-gray-400">이미 가입하셨나요? 바로 시작하세요</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="hero-email" className="block text-xs font-semibold text-gray-500 mb-1.5">
                      이메일
                    </label>
                    <input
                      id="hero-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      placeholder="이메일을 입력하세요"
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="hero-pw" className="block text-xs font-semibold text-gray-500 mb-1.5">
                      비밀번호
                    </label>
                    <input
                      id="hero-pw"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputCls}
                      placeholder="비밀번호를 입력하세요"
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  {error && <p className="text-xs text-red-500 text-center">{error}</p>}

                  <button
                    type="submit"
                    disabled={loginLoading || !email.trim() || !password.trim()}
                    className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {loginLoading ? "로그인 중..." : "로그인"}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <Link
                    href="/company/register"
                    className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline"
                  >
                    아직 회원이 아니신가요? 무료 가입하기 →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 통계 바 */}
      {/* ================================================================== */}
      <section className="w-full border-y border-gray-100 bg-white px-5 py-6">
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <Icon className="h-5 w-5 text-orange-500" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-lg font-extrabold text-gray-900">{value}</p>
                <p className="text-xs font-medium text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* 왜 모아견적인가 — 혜택 4가지 */}
      {/* ================================================================== */}
      <section className="w-full bg-white px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
              왜 <span className="text-orange-500">모아견적 파트너</span>인가요?
            </h2>
            <p className="mt-4 text-base font-medium text-gray-500">
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
                className="rounded-2xl border border-gray-100 bg-gray-50/50 p-7 hover:shadow-lg hover:border-orange-100 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 mb-5">
                  <Icon className="h-6 w-6 text-orange-500" strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm font-medium leading-relaxed text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 이용 방법 — 4스텝 */}
      {/* ================================================================== */}
      <section className="w-full bg-gray-50 px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
              📋 시작부터 계약까지,<br className="hidden sm:block" />
              이렇게 간단합니다
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map(({ step, icon: Icon, title, description }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
                  <Icon className="h-7 w-7 text-orange-500" strokeWidth={1.8} />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                    {step}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">{title}</h3>
                <p className="text-sm font-medium leading-relaxed text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/company/register"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-200/60 hover:bg-orange-600 transition-all"
            >
              <Zap className="h-4 w-4" />
              지금 무료 가입하기
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ */}
      {/* ================================================================== */}
      <section className="w-full bg-white px-5 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              자주 묻는 질문
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-base font-bold text-gray-900">{q}</span>
                  <span className={`text-orange-500 text-xl font-bold transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
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
      <section className="w-full bg-gradient-to-b from-orange-500 to-orange-600 px-5 py-20 sm:py-28">
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
            className="mx-auto mt-6 max-w-lg text-base leading-loose text-white/90 sm:text-lg"
          >
            가입비 없이, 수수료 없이,
            <br />
            지금 바로 시작할 수 있습니다.
            <br />
            <br />
            매일 새로운 견적 요청이 기다리고 있습니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/company/register"
              className="w-full rounded-full bg-white px-8 py-4 text-base font-bold text-orange-600 shadow-lg hover:bg-orange-50 transition-colors sm:w-auto"
            >
              무료 회원가입
            </Link>
            <Link
              href="#login"
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
          </div>
        </div>
      </footer>
    </main>
  );
}
