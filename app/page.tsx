import LayoutWrapper from "@/components/LayoutWrapper";
import Hero from "@/components/Hero";
import HelpSection from "@/components/HelpSection";
import ClientCriteria from "@/components/ClientCriteria";
import Experience from "@/components/Experience";
import ContactSection from "@/components/ContactSection";
import Navbar from "@/components/Navbar";
import SocialMediaAdsSection from "@/components/SocialMediaAdsSection";

export default function Home() {
  return (
    <LayoutWrapper>
      <Navbar />
      <Hero />
      <SocialMediaAdsSection />
      {/* <HelpSection /> */}
      {/* <ClientCriteria /> */}
      {/* <Experience /> */}
      {/* <ContactSection /> */}
    </LayoutWrapper>
  );
}
