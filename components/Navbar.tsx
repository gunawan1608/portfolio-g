"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { navigationItems, scrollToSection, type SectionId } from "@/lib/navigation";
import { profile } from "@/lib/site-data";
import brandLogo from "@/assets/images/GMP.png";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

      const navHeight = navRef.current?.offsetHeight ?? 0;
      const marker = navHeight + 28;
      let current: SectionId | null = null;

      for (const item of navigationItems) {
        const section = document.getElementById(item.id);

        if (!section) {
          continue;
        }

        const rect = section.getBoundingClientRect();
        const start = rect.top;
        const end = rect.bottom;

        if (marker >= start && marker < end) {
          current = item.id;
          break;
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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 860px)");
    const syncMenuState = (event?: MediaQueryListEvent) => {
      const matches = event ? event.matches : mediaQuery.matches;

      if (!matches) {
        setMenuOpen(false);
      }
    };

    syncMenuState();

    mediaQuery.addEventListener("change", syncMenuState);

    return () => {
      mediaQuery.removeEventListener("change", syncMenuState);
    };
  }, []);

  const handleNavigate = (target: SectionId | "top") => {
    setMenuOpen(false);
    scrollToSection(target);
  };

  return (
    <header
      ref={navRef}
      className={`site-nav${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-open" : ""}`}
    >
      <div className="container nav-shell">
        <button
          type="button"
          className="nav-brand"
          onClick={() => handleNavigate("top")}
          data-hover
          aria-label="Back to top"
        >
          <span className="nav-brand-mark" aria-hidden>
            <Image
              src={brandLogo}
              alt=""
              className="nav-brand-logo"
              sizes="44px"
              priority
            />
          </span>
          <span className="nav-brand-copy">
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </span>
        </button>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span className="nav-toggle-lines" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav id="primary-navigation" className="nav-links" aria-label="Primary">
          {navigationItems.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              className={`nav-link${activeId === item.id ? " is-active" : ""}`}
              onClick={() => handleNavigate(item.id)}
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
              data-hover
            >
              {item.label}
            </motion.button>
          ))}
        </nav>
      </div>
    </header>
  );
}
