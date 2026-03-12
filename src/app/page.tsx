import dynamic from "next/dynamic";
import Header from "@/components/sections/Header";
import PromoBanner from "@/components/sections/PromoBanner";
import Hero from "@/components/sections/Hero";
import QuickBenefits from "@/components/sections/QuickBenefits";

const BeforeAfter = dynamic(() => import("@/components/sections/BeforeAfter"));
const Problem = dynamic(() => import("@/components/sections/Problem"));
const CoreValue = dynamic(() => import("@/components/sections/CoreValue"));
const ComparisonTable = dynamic(
  () => import("@/components/sections/ComparisonTable")
);
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"));
const SocialProof = dynamic(() => import("@/components/sections/SocialProof"));
const WhoFor = dynamic(() => import("@/components/sections/WhoFor"));
const Outcomes = dynamic(() => import("@/components/sections/Outcomes"));
const Trust = dynamic(() => import("@/components/sections/Trust"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <PromoBanner />
      <Header />
      <Hero />
      <QuickBenefits />
      <BeforeAfter />
      <Problem />
      <CoreValue />
      <ComparisonTable />
      <HowItWorks />
      <SocialProof />
      <WhoFor />
      <Outcomes />
      <Trust />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
