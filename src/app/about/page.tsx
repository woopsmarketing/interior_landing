import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "왜 무료인가요? | 인테리어 견적 비교",
  description:
    "고객에게 100% 무료인 인테리어 견적 비교 플랫폼. 업체 수수료 0원, 검증된 우수 업체만 선별, 높은 퀄리티와 합리적 가격.",
};

const STATS = [
  { value: "100+", label: "검증된 우수 업체" },
  { value: "3,700+", label: "누적 매칭 건수" },
  { value: "0원", label: "고객 부담 비용" },
  { value: "0원", label: "업체 수수료" },
];

const VALUES = [
  {
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "고객이 우선입니다",
    desc: "이 플랫폼은 업체가 아닌 고객의 입장에서 설계되었습니다. 더 많은 분들이 인테리어를 부담 없이 시작할 수 있도록, 고객의 편의와 안심을 가장 먼저 생각합니다.",
  },
  {
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "검증된 우수 업체만 선별합니다",
    desc: "아무 업체나 등록하지 않습니다. 포트폴리오를 직접 검수하고, 실제 고객 리뷰를 기반으로 실력이 확인된 인테리어 업체만 선별하여 제공합니다. 개인 업체 중에서도 실력 있는 곳을 발굴합니다.",
  },
  {
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: "퀄리티는 높게, 가격은 합리적으로",
    desc: "다른 플랫폼과 달리 업체에게 수수료를 받지 않기 때문에, 업체가 수수료를 견적에 포함시킬 필요가 없습니다. 실력 있는 개인 업체까지 폭넓게 검수하여, 퀄리티는 유지하면서 가격은 낮추는 방향으로 설계했습니다.",
  },
  {
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "AI 기술로 더 나은 경험",
    desc: "사진을 첨부하면 AI가 완성된 인테리어 모습을 미리 보여드립니다. 막연하게 상상하지 않아도, 눈으로 확인하고 결정할 수 있습니다.",
  },
];

const FLOW_STEPS = [
  {
    step: "01",
    title: "고객이 조건을 작성합니다",
    desc: "원하는 스타일, 예산, 공간 정보를 1분 만에 입력합니다.",
  },
  {
    step: "02",
    title: "요청 내용을 자동으로 정리합니다",
    desc: "서비스가 고객의 니즈를 업체가 이해하기 쉽게 정리합니다.",
  },
  {
    step: "03",
    title: "검증된 100개+ 업체가 검토하고 답변합니다",
    desc: "포트폴리오와 리뷰로 검증된 업체가 먼저 견적과 제안을 보내드립니다.",
  },
  {
    step: "04",
    title: "고객이 직접 비교하고 선택합니다",
    desc: "마음에 드는 업체에만 직접 연락합니다. 의무 없습니다.",
  },
];

const PROMISES = [
  "고객에게 비용을 청구하지 않습니다",
  "업체에게 중개 수수료를 받지 않습니다",
  "계약을 강요하거나 재촉하지 않습니다",
  "고객의 개인정보를 무단으로 공유하지 않습니다",
  "검증되지 않은 업체를 등록하지 않습니다",
  "과장된 표현으로 고객을 현혹하지 않습니다",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
          <a href="/" className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight text-gray-900">
              인테리어<span className="text-orange-500">비교</span>
            </span>
          </a>
          <Link
            href="/#apply"
            className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm shadow-orange-200/50 transition-all hover:bg-orange-600 active:bg-orange-700"
          >
            무료 견적 신청
          </Link>
        </div>
      </header>

      {/* 히어로 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
          <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold text-orange-600">
            고객이 우선인 플랫폼
          </span>
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            왜 <span className="text-orange-500">무료</span>인가요?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg font-550 leading-relaxed text-gray-600 sm:text-xl">
            이 플랫폼은 고객과 업체 모두에게 수수료를 받지 않습니다.
            <br className="hidden sm:block" />
            좋은 매칭이 더 많은 고객과 업체를 만들어준다고 믿기 때문입니다.
          </p>
        </div>
      </section>

      {/* 숫자 */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-gray-200 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="px-4 py-8 text-center sm:py-10">
              <p className="text-2xl font-extrabold text-orange-500 sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-sm font-550 text-gray-500 sm:text-base">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 다른 플랫폼과의 차이 */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:py-24">
        <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-orange-500">
          Difference
        </h2>
        <p className="mb-12 text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          다른 플랫폼과 무엇이 다른가요?
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* 일반 플랫폼 */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-gray-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="mb-3 text-lg font-bold text-gray-700">일반 인테리어 중개 플랫폼</h3>
            <ul className="space-y-2.5 text-base font-550 text-gray-500">
              <li className="flex items-start gap-2">
                <span className="mt-1 shrink-0 text-gray-400">&#8226;</span>
                업체와 협력 계약을 맺고 고객을 매칭
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 shrink-0 text-gray-400">&#8226;</span>
                계약 성사 시 매출의 일정 비율을 수수료로 수취
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 shrink-0 text-gray-400">&#8226;</span>
                업체가 수수료를 견적에 포함 → 고객 부담 증가
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 shrink-0 text-gray-400">&#8226;</span>
                수수료를 내는 업체 위주로 노출 → 선택지 제한
              </li>
            </ul>
          </div>

          {/* 우리 플랫폼 */}
          <div className="rounded-2xl border-2 border-orange-300 bg-orange-50/50 p-7">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="mb-3 text-lg font-bold text-gray-900">이 플랫폼의 방식</h3>
            <ul className="space-y-2.5 text-base font-550 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 shrink-0 text-orange-500">&#10003;</span>
                업체에게 수수료를 받지 않음 → 순수 매칭만 제공
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 shrink-0 text-orange-500">&#10003;</span>
                수수료가 견적에 포함되지 않아 고객에게 합리적 가격
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 shrink-0 text-orange-500">&#10003;</span>
                포트폴리오와 실제 리뷰 기반으로 우수 업체만 선별
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 shrink-0 text-orange-500">&#10003;</span>
                실력 있는 개인 업체까지 발굴 → 퀄리티 높고 가격은 낮게
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center text-base font-550 leading-relaxed text-gray-500">
          수수료 기반 구조에서는 업체가 수수료만큼 견적을 올릴 수밖에 없습니다.
          <br />
          이 플랫폼은 그 구조 자체를 없앰으로써, 고객이 실제로 합리적인 가격에 좋은 업체를 만날 수 있도록 설계했습니다.
        </p>
      </section>

      {/* 핵심 가치 4개 */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-orange-500">
            Our Values
          </h2>
          <p className="mb-12 text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            이 플랫폼이 지키는 원칙
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  {v.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{v.title}</h3>
                <p className="text-base font-550 leading-relaxed text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 수수료 구조 설명 */}
      <section>
        <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            수수료 구조를 투명하게 공개합니다
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* 고객 카드 */}
            <div className="rounded-2xl border-2 border-orange-200 bg-white p-7 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                <svg className="h-7 w-7 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="text-base font-550 text-gray-500">고객이 내는 비용</p>
              <p className="mt-1 text-4xl font-black text-orange-500">0원</p>
              <p className="mt-3 text-sm font-550 leading-relaxed text-gray-500">
                견적 요청, 업체 비교, AI 미리보기
                <br />
                모든 서비스가 무료입니다
              </p>
            </div>
            {/* 업체 카드 */}
            <div className="rounded-2xl border-2 border-orange-200 bg-white p-7 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                <svg className="h-7 w-7 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                </svg>
              </div>
              <p className="text-base font-550 text-gray-500">업체가 내는 수수료</p>
              <p className="mt-1 text-4xl font-black text-orange-500">0원</p>
              <p className="mt-3 text-sm font-550 leading-relaxed text-gray-500">
                등록비, 중개 수수료, 성사 수수료
                <br />
                업체에게도 비용을 받지 않습니다
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-base font-550 leading-relaxed text-gray-500">
            수수료를 받지 않기 때문에 업체는 견적에 수수료를 얹지 않아도 됩니다.
            <br />
            고객은 더 합리적인 가격으로, 업체는 실력으로 승부할 수 있는 구조입니다.
          </p>
        </div>
      </section>

      {/* 업체 검증 프로세스 */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
          <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-widest text-orange-500">
            Verification
          </h2>
          <p className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            업체 선별 기준
          </p>
          <div className="space-y-4">
            {[
              {
                num: "1",
                title: "포트폴리오 직접 검수",
                desc: "실제 시공 사례와 결과물을 직접 확인합니다. 사진만 좋은 곳이 아니라 실제 완성도를 검증합니다.",
              },
              {
                num: "2",
                title: "실제 고객 리뷰 기반 평가",
                desc: "기존 고객의 만족도, 소통 방식, 사후 대응까지 실제 후기를 종합적으로 확인합니다.",
              },
              {
                num: "3",
                title: "실력 있는 개인 업체도 발굴",
                desc: "대형 업체만 우대하지 않습니다. 규모는 작지만 실력과 성실함이 검증된 개인 업체까지 적극적으로 발굴합니다.",
              },
              {
                num: "4",
                title: "지속적인 모니터링",
                desc: "한 번 등록으로 끝나지 않습니다. 매칭 이후 고객 피드백을 반영하여 업체 품질을 지속적으로 관리합니다.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="flex gap-4 rounded-xl border border-gray-100 bg-white px-6 py-5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {item.num}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-base font-550 leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이용 흐름 */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          이용 흐름
        </h2>
        <div className="space-y-6">
          {FLOW_STEPS.map((s, i) => (
            <div key={s.step} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {s.step}
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="mt-2 h-full w-px bg-orange-200" />
                )}
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-1 text-base font-550 text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 약속 */}
      <section className="bg-gray-900">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
          <h2 className="mb-10 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            이 플랫폼이 하지 않는 것
          </h2>
          <ul className="mx-auto max-w-md space-y-4 text-left">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-orange-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-550 leading-relaxed text-gray-300">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          부담 없이 시작해보세요
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base font-550 leading-relaxed text-gray-500">
          1분이면 견적 요청이 완료됩니다.
          <br />
          비용도, 계약 의무도, 업체의 재촉도 없습니다.
        </p>
        <Link
          href="/form"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-200/50 transition-all hover:bg-orange-600 hover:shadow-xl active:bg-orange-700"
        >
          무료 견적 비교 시작하기
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-6 text-center text-xs text-gray-400">
          &copy; 2025 고객이 우선인 인테리어 매칭 플랫폼
        </div>
      </footer>
    </main>
  );
}
