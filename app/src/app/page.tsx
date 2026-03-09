import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import QuickBenefits from "@/components/sections/QuickBenefits";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Problem from "@/components/sections/Problem";
import CoreValue from "@/components/sections/CoreValue";
import ComparisonTable from "@/components/sections/ComparisonTable";
import HowItWorks from "@/components/sections/HowItWorks";
import SocialProof from "@/components/sections/SocialProof";
import WhoFor from "@/components/sections/WhoFor";
import Outcomes from "@/components/sections/Outcomes";
import Trust from "@/components/sections/Trust";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
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
