"use client";

import { type ReactElement, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { scrollToSection } from "@/lib/navigation";
import { profile, projects, skillGroups } from "@/lib/site-data";

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

const SOCIAL_ICONS: Record<string, ReactElement> = {
  GitHub: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  LinkedIn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
};

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

          {/* Social links */}
          <motion.div
            className="hero-socials-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.72, ease: E }}
          >
            <p className="hero-socials-label">Find me on</p>
            <div className="hero-socials-list">
              {profile.socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  whileHover={{ x: 4 }}
                  data-hover
                  aria-label={s.label}
                >
                  <span className="hero-social-icon">
                    {SOCIAL_ICONS[s.label]}
                  </span>
                  <span className="hero-social-info">
                    <strong>{s.label}</strong>
                    <span>{s.handle}</span>
                  </span>
                  <svg className="hero-social-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
