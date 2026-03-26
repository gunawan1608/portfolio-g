"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionIntro from "@/components/SectionIntro";
import { projects } from "@/lib/site-data";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-project-preview]").forEach((element) => {
        gsap.to(element, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section">
      <div className="container">
        <SectionIntro
          eyebrow="Project"
          title="A cleaner project area, ready for the real work you will add next."
          description="This section is intentionally simple now, so new projects can be added one by one without making the layout feel crowded."
        />

        <div className="project-grid">
          {projects.map((project, index) => {
            const style = { "--project-accent": project.accent } as CSSProperties;

            return (
              <motion.article
                key={project.title}
                className={`project-card${index === 0 ? " project-card-featured" : ""}`}
                style={style}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <div className="project-card-top">
                  <div>
                    <p className="project-category">{project.category}</p>
                    <h3 className="project-title">{project.title}</h3>
                  </div>
                  <span className="project-status">{project.status}</span>
                </div>

                <div className="project-preview" data-project-preview>
                  <div className="project-preview-panel project-preview-panel-lg" />
                  <div className="project-preview-panel project-preview-panel-sm" />
                  <div className="project-preview-line" />
                </div>

                <p className="project-summary">{project.summary}</p>

                <div className="tag-group">
                  {project.stack.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
