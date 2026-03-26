"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionIntro from "@/components/SectionIntro";
import { projects } from "@/lib/site-data";

gsap.registerPlugin(ScrollTrigger);

// Icon map for tech tags
const TECH_ICONS: Record<string, string> = {
  "React": "⚛",
  "Next.js": "▲",
  "Laravel": "🔴",
  "PHP": "🐘",
  "Flutter": "💙",
  "Python": "🐍",
  "JavaScript": "JS",
  "TypeScript": "TS",
  "MySQL": "🗄",
  "Dart": "🎯",
  "C#": "◆",
  "Godot": "🎮",
};

function ProjectCard({
  project,
  index,
  featured,
}: {
  project: (typeof projects)[0];
  index: number;
  featured?: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const previewY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.article
      ref={cardRef}
      className={`project-card${featured ? " project-card-featured" : ""}`}
      style={{ "--project-accent": project.accent } as CSSProperties}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.65,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -10 }}
    >
      {/* Preview area */}
      <div className="project-preview">
        <motion.div className="project-preview-inner" style={{ y: previewY }}>
          <div className="project-preview-panel project-preview-panel-lg" />
          <div className="project-preview-panel project-preview-panel-sm" />
          <div className="project-preview-dots" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="project-preview-dot" />
            ))}
          </div>
        </motion.div>
        <div className="project-preview-line" />
        <span className="project-preview-status">{project.status}</span>
      </div>

      {/* Info */}
      <div className="project-info">
        <p className="project-category">{project.category}</p>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-summary">{project.summary}</p>

        <div className="tag-group project-tags">
          {project.stack.map((item) => (
            <span key={item} className="tag">
              {TECH_ICONS[item] && (
                <span className="tag-icon" aria-hidden>{TECH_ICONS[item]}</span>
              )}
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Subtle section-wide parallax on the heading
      gsap.fromTo(
        headingRef.current,
        { y: 0 },
        {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "center top",
            scrub: 1.5,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <section id="projects" ref={sectionRef} className="section">
      <div className="container">
        <div ref={headingRef}>
          <SectionIntro
            eyebrow="Projects"
            title="Work I've built and shipped."
            description="A curated selection of projects — from web apps to mobile builds. More coming soon."
          />
        </div>

        {/* Featured project row */}
        {featured && (
          <div className="project-featured-row">
            <ProjectCard project={featured} index={0} featured />
          </div>
        )}

        {/* Grid for remaining projects */}
        {rest.length > 0 && (
          <div className="project-grid-multi">
            {rest.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}