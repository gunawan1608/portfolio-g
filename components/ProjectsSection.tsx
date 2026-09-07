"use client";

import SectionIntro from "@/components/SectionIntro";
import RetroTvProjects from "@/components/RetroTvProjects";

export default function ProjectsSection() {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionIntro
          eyebrow="Projects"
          title="Flip through what I've built."
          description="A small TV full of real builds from school, practice, and experiments — switch channels to browse, then open one for the full story."
        />

        <RetroTvProjects />
      </div>
    </section>
  );
}
