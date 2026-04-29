"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { navigationItems, scrollToSection, type SectionId } from "@/lib/navigation";
import { profile } from "@/lib/site-data";
import brandLogo from "@/assets/images/GMP.png";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Entrance animation
  useEffect(() => {
    if (!navRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      gsap.fromTo(
        navRef.current,
        { y: -56, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.05 },
      );
    }
  }, []);

  // Scroll state
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollY = window.scrollY;
        const nextScrolled = scrollY > 24;
        setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const observed = new Map<SectionId, IntersectionObserverEntry>();
    let observer: IntersectionObserver | null = null;
    let resizeFrame = 0;

    const update = () => {
      const visible = navigationItems
        .map((item) => observed.get(item.id))
        .filter((e): e is IntersectionObserverEntry => Boolean(e?.isIntersecting))
        .sort((a, b) =>
          b.intersectionRatio !== a.intersectionRatio
            ? b.intersectionRatio - a.intersectionRatio
            : Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
        );
      const next = (visible[0]?.target.id as SectionId | undefined) ?? null;
      setActiveId((c) => (c === next ? c : next));
    };

    const connect = () => {
      observer?.disconnect();
      observed.clear();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => observed.set(e.target.id as SectionId, e));
          update();
        },
        {
          rootMargin: `-${navEl.offsetHeight + 24}px 0px -55% 0px`,
          threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
        },
      );
      navigationItems.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) observer?.observe(el);
      });
    };

    const onResize = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(connect);
    };

    connect();
    window.addEventListener("resize", onResize);
    return () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Close mobile menu on wide viewport
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const sync = (e?: MediaQueryListEvent) => {
      if (!(e ? e.matches : mq.matches)) setMenuOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
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
        {/* Brand */}
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
              sizes="38px"
              priority
            />
          </span>
          <span className="nav-brand-copy">
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </span>
        </button>

        {/* Desktop nav links */}
        <nav id="primary-navigation" className="nav-links" aria-label="Primary">
          {navigationItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-link${isActive ? " is-active" : ""}`}
                onClick={() => handleNavigate(item.id)}
                data-hover
              >
                {item.label}
                {isActive && <span className="nav-link-pip" aria-hidden />}
              </button>
            );
          })}
        </nav>

        {/* Right: CTA + hamburger */}
        <div className="nav-right">
          <button
            type="button"
            className="nav-cta button button-primary button-compact"
            onClick={() => handleNavigate("contact")}
            data-hover
          >
            Let&apos;s Talk
          </button>

          <button
            type="button"
            className="nav-toggle"
            onClick={() => setMenuOpen((c) => !c)}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="nav-toggle-lines" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="nav-drawer" aria-hidden={!menuOpen}>
        <div className="nav-drawer-inner">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-drawer-link${activeId === item.id ? " is-active" : ""}`}
              onClick={() => handleNavigate(item.id)}
              tabIndex={menuOpen ? 0 : -1}
              data-hover
            >
              <span className="nav-drawer-link-label">{item.label}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}

          <button
            type="button"
            className="nav-drawer-cta button button-primary"
            onClick={() => handleNavigate("contact")}
            tabIndex={menuOpen ? 0 : -1}
            data-hover
          >
            Let&apos;s Talk
          </button>
        </div>
      </div>
    </header>
  );
}
