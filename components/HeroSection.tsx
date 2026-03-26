"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import portraitImage from "@/assets/images/portofolio_img.png";
import { scrollToSection } from "@/lib/navigation";
import { profile } from "@/lib/site-data";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(photoWrapRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(blobRef.current, {
        x: 26,
        y: -18,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={sectionRef} className="hero-section">
      <div className="hero-surface" aria-hidden />
      <div ref={blobRef} className="hero-blob" aria-hidden />

      <div className="container hero-shell">
        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05, ease: "easeOut" }}
          >
            {profile.role}
          </motion.p>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14, ease: "easeOut" }}
          >
            {profile.name}
          </motion.h1>

          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22, ease: "easeOut" }}
          >
            {profile.intro}
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: "easeOut" }}
          >
            <motion.button
              type="button"
              className="button button-primary"
              onClick={() => scrollToSection("projects")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-hover
            >
              View Projects
            </motion.button>
            <motion.button
              type="button"
              className="button button-ghost"
              onClick={() => scrollToSection("contact")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-hover
            >
              Contact
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          ref={photoWrapRef}
          className="hero-photo-wrap"
          initial={{ opacity: 0, x: 28, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-photo-glow" aria-hidden />
          <motion.figure
            className="hero-photo-card"
            whileHover={{ y: -6, rotate: -1, scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="hero-photo-meta">
              <span>Available for internship & projects</span>
              <span>{profile.location}</span>
            </div>
            <Image
              src={portraitImage}
              alt="Portrait of Gunawan Madia Pratama"
              priority
              className="hero-photo-image"
            />
          </motion.figure>
        </motion.div>
      </div>
    </section>
  );
}
