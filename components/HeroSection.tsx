"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import portraitImage from "@/assets/images/portofolio_img.png";
import { scrollToSection } from "@/lib/navigation";
import { profile } from "@/lib/site-data";

gsap.registerPlugin(ScrollTrigger);

const ROLE_LABEL = "Software Developer";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const heroFocus = profile.focus.slice(0, 3);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const photoY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.to(blobRef.current, {
        x: 32,
        y: -24,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.65,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split name into chars for stagger animation, space included
  const nameChars = profile.name.split("");

  return (
    <section id="top" ref={sectionRef} className="hero-section">
      <div className="hero-surface" aria-hidden />
      <div ref={blobRef} className="hero-blob" aria-hidden />
      <div ref={glowRef} className="hero-blob-2" aria-hidden />

      <div className="container hero-shell">
        {/* Left: copy */}
        <motion.div className="hero-copy" style={{ y: copyY, opacity }}>
          <motion.p
            className="eyebrow hero-eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {ROLE_LABEL}
          </motion.p>

          {/* Name rendered as single horizontal line */}
          <h1 className="hero-title" aria-label={profile.name}>
            {nameChars.map((char, i) => (
              <motion.span
                key={i}
                className={char === " " ? "hero-title-space" : "hero-title-char"}
                aria-hidden
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.18 + i * 0.025,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {profile.intro}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0.5, delay: 0.88, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hero-badge-dot" />
            Student at SMK Negeri 1 Jakarta
          </motion.div>

          <motion.div
            className="hero-focus-block"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.96, ease: [0.22, 1, 0.36, 1] }}
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
                  transition={{
                    duration: 0.48,
                    delay: 1.02 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -4 }}
                >
                  <span className="hero-focus-number">{`0${index + 1}`}</span>
                  <p>{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: photo — no text overlay at all */}
        <motion.div
          ref={photoRef}
          className="hero-photo-wrap"
          style={{ y: photoY }}
          initial={{ opacity: 0, x: 36, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-photo-glow" aria-hidden />
          <motion.figure
            className="hero-photo-card"
            whileHover={{ y: -8, rotate: -0.6, scale: 1.02 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={portraitImage}
              alt={`Portrait of ${profile.name}`}
              priority
              className="hero-photo-image"
            />
          </motion.figure>
        </motion.div>
      </div>
    </section>
  );
}
