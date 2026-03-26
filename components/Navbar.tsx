"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { navigationItems, scrollToSection, type SectionId } from "@/lib/navigation";
import { profile } from "@/lib/site-data";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!navRef.current) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reducedMotion) {
      gsap.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", delay: 0.1 },
      );
    }

    let frame = 0;

    const readState = () => {
      setScrolled(window.scrollY > 18);

      if (window.scrollY < 100) {
        setActiveId(null);
        return;
      }

      const marker = window.scrollY + window.innerHeight * 0.3;
      let current: SectionId | null = null;

      for (const item of navigationItems) {
        const section = document.getElementById(item.id);

        if (!section) {
          continue;
        }

        const start = section.offsetTop - 120;
        const end = start + section.offsetHeight;

        if (marker >= start && marker < end) {
          current = item.id;
        }
      }

      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        readState();
      });
    };

    readState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", readState);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", readState);
    };
  }, []);

  return (
    <header ref={navRef} className={`site-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="container nav-shell">
        <button
          type="button"
          className="nav-brand"
          onClick={() => scrollToSection("top")}
          data-hover
          aria-label="Back to top"
        >
          <span className="nav-brand-mark">{profile.initials}</span>
          <span className="nav-brand-copy">
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </span>
        </button>

        <nav className="nav-links" aria-label="Primary">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              className={`nav-link${activeId === item.id ? " is-active" : ""}`}
              onClick={() => scrollToSection(item.id)}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
              data-hover
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        <motion.button
          type="button"
          className="button button-primary nav-cta"
          onClick={() => scrollToSection("contact")}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          data-hover
        >
          Contact Me
        </motion.button>
      </div>
    </header>
  );
}
