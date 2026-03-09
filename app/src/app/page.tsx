import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import CoreValue from "@/components/sections/CoreValue";
import HowItWorks from "@/components/sections/HowItWorks";
import WhoFor from "@/components/sections/WhoFor";
import Outcomes from "@/components/sections/Outcomes";
import Trust from "@/components/sections/Trust";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import MultiStepForm from "@/components/form/MultiStepForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <MultiStepForm />
      <Problem />
      <CoreValue />
      <HowItWorks />
      <WhoFor />
      <Outcomes />
      <Trust />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
