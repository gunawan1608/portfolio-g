"use client";

import { type ReactElement, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { scrollToSection } from "@/lib/navigation";
import { profile, projects, skillGroups, achievements, experiences } from "@/lib/site-data";

const ROLE_LABEL = "Software Engineering Student";
const E = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { value: String(projects.length), label: "Projects Built" },
  {
    value: String(skillGroups.reduce((n, g) => n + g.skills.length, 0)) + "+",
    label: "Technologies",
  },
  { value: "2024", label: "Started Coding" },
];

const STACK = ["React", "Next.js", "Laravel", "TypeScript", "PHP", "GSAP", "Framer Motion", "Godot"];

// Portfolio highlights replacing the "Find me on" social card
const HIGHLIGHTS = [
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    label: "Active Projects",
    value: String(projects.length),
    sub: "in portfolio",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    label: "Certifications",
    value: String(achievements.length),
    sub: "earned & verified",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    label: "Journey Stages",
    value: String(experiences.length),
    sub: "education path",
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const heroFocus = profile.focus.slice(0, 3);
  const nameChars = profile.name.split("");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !isInView) return;
    const ctx = gsap.context(() => {
      gsap.to(blobRef.current, { x: 32, y: -24, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(glowRef.current, { scale: 1.15, opacity: 0.65, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });
    }, sectionRef);
    return () => ctx.revert();
  }, [isInView]);

  return (
    <section id="top" ref={sectionRef} className="hero-section">
      <div className="hero-surface" aria-hidden />
      <div ref={blobRef} className="hero-blob" aria-hidden />
      <div ref={glowRef} className="hero-blob-2" aria-hidden />

      <div className="container hero-shell">
        {/* ── Left: copy ── */}
        <motion.div className="hero-copy">
          <motion.p
            className="eyebrow hero-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: E }}
          >
            {ROLE_LABEL}
          </motion.p>

          <h1 className="hero-title" aria-label={profile.name}>
            {nameChars.map((char, i) => (
              <motion.span
                key={i}
                className={char === " " ? "hero-title-space" : "hero-title-char"}
                aria-hidden
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 + i * 0.025, ease: E }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: E }}
          >
            {profile.intro}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.72, ease: E }}
          >
            <motion.button
              type="button"
              className="button button-primary"
              onClick={() => scrollToSection("projects")}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              data-hover
            >
              View Projects
            </motion.button>
            <motion.button
              type="button"
              className="button button-ghost"
              onClick={() => scrollToSection("contact")}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              data-hover
            >
              Contact Me
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.88, ease: E }}
          >
            <span className="hero-badge-dot" />
            Student at SMK Negeri 1 Jakarta
          </motion.div>

          <motion.div
            className="hero-focus-block"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.96, ease: E }}
          >
            <div className="hero-focus-head">
              <p className="hero-focus-label">Current Focus</p>
              <span className="hero-focus-line" aria-hidden />
            </div>
            <div className="hero-focus-grid">
              {heroFocus.map((item, index) => (
                <motion.div
                  key={item}
                  className="hero-focus-card"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.48, delay: 1.02 + index * 0.08, ease: E }}
                  whileHover={{ y: -4 }}
                >
                  <span className="hero-focus-number">{`0${index + 1}`}</span>
                  <p>{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right: visual panel ── */}
        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, x: 36, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.28, ease: E }}
        >
          {/* Stats row */}
          <div className="hero-stats-row">
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
                className="hero-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: E }}
                whileHover={{ y: -4, scale: 1.03 }}
              >
                <strong className="hero-stat-value">{value}</strong>
                <span className="hero-stat-label">{label}</span>
              </motion.div>
            ))}
          </div>

          {/* Tech stack */}
          <motion.div
            className="hero-stack-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.58, ease: E }}
          >
            <div className="hero-stack-head">
              <p className="hero-stack-label">Tech Stack</p>
              <span className="hero-stack-dot" aria-hidden />
            </div>
            <div className="hero-stack-grid">
              {STACK.map((tech, i) => (
                <motion.span
                  key={tech}
                  className="hero-stack-chip"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: 0.65 + i * 0.045, ease: E }}
                  whileHover={{ y: -2, scale: 1.06 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Portfolio Highlights — replaces "Find me on" */}
          <motion.div
            className="hero-highlights-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.72, ease: E }}
          >
            <div className="hero-highlights-head">
              <p className="hero-highlights-label">Portfolio At a Glance</p>
              <span className="hero-highlights-badge">Updated 2026</span>
            </div>
            <div className="hero-highlights-list">
              {HIGHLIGHTS.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="hero-highlight-row"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.78 + i * 0.07, ease: E }}
                >
                  <span className="hero-highlight-icon">{item.icon}</span>
                  <span className="hero-highlight-body">
                    <span className="hero-highlight-label">{item.label}</span>
                    <span className="hero-highlight-sub">{item.sub}</span>
                  </span>
                  <strong className="hero-highlight-value">{item.value}</strong>
                </motion.div>
              ))}
            </div>
            <div className="hero-highlights-footer">
              <span className="hero-highlights-status-dot" />
              <span className="hero-highlights-status-text">Portfolio is actively growing</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
