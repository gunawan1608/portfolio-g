"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { startTransition, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import { projects, type ProjectEntry } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

function ProjectShowcaseCard({ project, index }: { project: ProjectEntry; index: number }) {
  const articleRef = useRef<HTMLElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const activeImage = project.images[activeImageIndex] ?? project.images[0];

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start 90%", "end 12%"],
  });

  const stageOffset = useTransform(
    scrollYProgress,
    [0, 1],
    index % 2 === 0 ? [18, -18] : [-18, 18],
  );

  const stageGlowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1.02, 0.99]);

  const cardNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      ref={articleRef}
      className={`project-showcase-card${index % 2 === 1 ? " is-reversed" : ""}`}
      style={{ "--project-accent": project.accent } as CSSProperties}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      whileHover={reducedMotion ? undefined : { y: -4 }}
    >
      <motion.div
        className="project-showcase-stage"
        style={reducedMotion ? undefined : { y: stageOffset }}
      >
        <div className="project-showcase-frame">
          <div className="project-stage-toolbar" aria-hidden>
            <div className="project-stage-dots">
              <span className="project-stage-dot" />
              <span className="project-stage-dot" />
              <span className="project-stage-dot" />
            </div>
            <span className="project-stage-chip">{project.platform}</span>
          </div>

          <motion.div
            className="project-stage-glow"
            style={reducedMotion ? undefined : { scale: stageGlowScale }}
          />

          <div className="project-stage-image-shell">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${project.id}-${activeImageIndex}`}
                className="project-stage-image-layer"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.98, y: 12 }}
                animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01, y: -8 }}
                transition={{ duration: 0.42, ease: EASE }}
              >
                <Image
                  src={activeImage.src}
                  alt={activeImage.alt}
                  fill
                  className="project-stage-image"
                  sizes="(max-width: 1100px) 100vw, 56vw"
                  priority={index === 0 && activeImageIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="project-stage-caption">
          <div className="project-stage-caption-copy">
            <span className="project-stage-caption-label">Selected Screen</span>
            <strong>{activeImage.label}</strong>
          </div>
          <span className="project-stage-count">
            {String(activeImageIndex + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
          </span>
        </div>

        <div className="project-thumb-grid" aria-label={`${project.title} screens`}>
          {project.images.map((image, imageIndex) => {
            const isActive = imageIndex === activeImageIndex;

            return (
              <button
                key={image.label}
                type="button"
                className={`project-thumb${isActive ? " is-active" : ""}`}
                onClick={() => {
                  if (imageIndex === activeImageIndex) {
                    return;
                  }

                  startTransition(() => {
                    setActiveImageIndex(imageIndex);
                  });
                }}
                aria-pressed={isActive}
                data-hover
              >
                <span className="project-thumb-frame">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="project-thumb-image"
                    sizes="(max-width: 640px) 30vw, (max-width: 1100px) 28vw, 16vw"
                  />
                </span>
                <span className="project-thumb-copy">
                  <span className="project-thumb-index">{String(imageIndex + 1).padStart(2, "0")}</span>
                  <span className="project-thumb-label">{image.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="project-showcase-body">
        <div className="project-heading-row">
          <div className="project-heading-copy">
            <p className="project-kicker">
              <span className="project-kicker-number">{cardNumber}</span>
              <span>{project.category}</span>
            </p>
            <h3 className="project-title">{project.title}</h3>
          </div>
          <span className="project-status-pill">{project.status}</span>
        </div>

        <p className="project-platform">{project.platform}</p>
        <p className="project-summary">{project.summary}</p>

        <div className="project-meta-grid">
          <div className="project-meta-card">
            <span className="project-meta-label">Type</span>
            <strong>{project.category}</strong>
          </div>
          <div className="project-meta-card">
            <span className="project-meta-label">Platform</span>
            <strong>{project.platform}</strong>
          </div>
          <div className="project-meta-card">
            <span className="project-meta-label">Preview</span>
            <strong>{project.images.length} Screens</strong>
          </div>
        </div>

        <div className="tag-group project-stack">
          {project.stack.map((item) => (
            <span key={item} className="tag">
              {item}
            </span>
          ))}
        </div>

        <div className="project-actions">
          <a
            className="button button-primary project-link"
            href={project.href}
            target="_blank"
            rel="noreferrer"
            data-hover
          >
            {project.hrefLabel}
          </a>
          <p className="project-link-note">Real screens included.</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionIntro
          eyebrow="Projects"
          title="Things I've Built Along My Journey."
          description="These projects represent my journey in building real applications, from simple ideas to functional systems."
        />

        <div className="project-showcase-list">
          {projects.map((project, index) => (
            <ProjectShowcaseCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
