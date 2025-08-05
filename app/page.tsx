import LayoutWrapper from "@/components/LayoutWrapper";
import Hero from "@/components/Hero";
import ContactSection from "@/components/ContactSection";
import SocialMediaAdsSection from "@/components/SocialMediaAdsSection";
import ProcessSection from "@/components/ProcessSection";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  return (
    <LayoutWrapper>
      <Hero />
      <SocialMediaAdsSection />
      <ProcessSection/>
      <FaqSection/>
      <ContactSection />
    </LayoutWrapper>
  );
}
