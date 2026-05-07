import { EmotionalStyling } from "@/components/landing/EmotionalStyling";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ImpactSections } from "@/components/landing/ImpactSections";
import { Testimonials } from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeatureGrid />
      <EmotionalStyling />
      <ImpactSections />
      <Testimonials />
    </>
  );
}
