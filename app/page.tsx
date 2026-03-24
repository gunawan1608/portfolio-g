import CursorFollower   from "@/components/CursorFollower";
import Navbar           from "@/components/Navbar";
import HeroSection      from "@/components/HeroSection";
import ProjectsSection  from "@/components/ProjectsSection";
import SkillsSection    from "@/components/SkillsSection";
import AboutSection     from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection   from "@/components/ContactSection";
import Footer           from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CursorFollower />
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}