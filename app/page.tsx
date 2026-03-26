import AboutSection from "@/components/AboutSection";
import AchievementsSection from "@/components/AchievementsSection";
import ContactSection from "@/components/ContactSection";
import CursorFollower from "@/components/CursorFollower";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ScrollAnimWrapper from "@/components/ScrollAnimWrapper";

export default function Home() {
  return (
    <div className="site-shell">
      <CursorFollower />
      <Navbar />
      <main className="site-main">
        {/* Hero has its own entrance animation, no wrapper needed */}
        <HeroSection />

        <ScrollAnimWrapper>
          <ProjectsSection />
        </ScrollAnimWrapper>

        <ScrollAnimWrapper delay={0.05}>
          <SkillsSection />
        </ScrollAnimWrapper>

        <ScrollAnimWrapper>
          <AboutSection />
        </ScrollAnimWrapper>

        <ScrollAnimWrapper delay={0.05}>
          <AchievementsSection />
        </ScrollAnimWrapper>

        <ScrollAnimWrapper>
          <ExperienceSection />
        </ScrollAnimWrapper>

        <ScrollAnimWrapper delay={0.05}>
          <ContactSection />
        </ScrollAnimWrapper>
      </main>
      <Footer />
    </div>
  );
}