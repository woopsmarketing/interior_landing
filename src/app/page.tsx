import dynamic from "next/dynamic";
import Header from "@/components/sections/Header";
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
      <Header />
      <div id="hero"><Hero /></div>
      <div id="benefits"><QuickBenefits /></div>
      <div id="before-after"><BeforeAfter /></div>
      <div id="problem"><Problem /></div>
      <div id="service"><CoreValue /></div>
      <div id="compare"><ComparisonTable /></div>
      <div id="how"><HowItWorks /></div>
      <div id="review"><SocialProof /></div>
      <div id="who"><WhoFor /></div>
      <div id="outcome"><Outcomes /></div>
      <div id="trust"><Trust /></div>
      <div id="faq"><FAQ /></div>
      <div id="apply"><FinalCTA /></div>
    </main>
  );
}
