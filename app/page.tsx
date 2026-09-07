import AboutSection from "@/components/AboutSection";
import AchievementsSection from "@/components/AchievementsSection";
import ContactSection from "@/components/ContactSection";
import ExperienceSection from "@/components/ExperienceSection";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ScrollAnimWrapper from "@/components/ScrollAnimWrapper";

export default function Home() {
  return (
    <>
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

      <AchievementsSection />

      <ExperienceSection />

      <ScrollAnimWrapper delay={0.05}>
        <ContactSection />
      </ScrollAnimWrapper>
    </>
  );
}
