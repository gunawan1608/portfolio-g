"use client";

import { type ReactElement, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { scrollToSection } from "@/lib/navigation";
import { profile, skillGroups, achievements, experiences } from "@/lib/site-data";
import GitHubSnakeCard from "@/components/GithubSnakeCard";

const ROLE_LABEL = "Software Engineering Student";
const E = [0.22, 1, 0.36, 1] as const;

type GitHubStats = {
  publicRepos: number;
  followers: number;
  totalStars: number;
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const heroFocus = profile.focus.slice(0, 3);
  const nameChars = profile.name.split("");

  const [ghStats, setGhStats] = useState<GitHubStats | null>(null);
  const [ghLoading, setGhLoading] = useState(true);

  // Fetch GitHub stats
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/github-stats", { signal: controller.signal })
      .then((r) => r.json())
      .then((data: GitHubStats) => {
        if (controller.signal.aborted) return;
        setGhStats(data);
        setGhLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setGhLoading(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileOrTouch = window.matchMedia("(max-width: 768px), (hover: none) and (pointer: coarse)").matches;
    if (reduced || mobileOrTouch || !isInView) return;
    const ctx = gsap.context(() => {
      gsap.to(blobRef.current, { x: 32, y: -24, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(glowRef.current, { scale: 1.15, opacity: 0.65, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });
    }, sectionRef);
    return () => ctx.revert();
  }, [isInView]);

  // Stats row: GitHub live data
  const statsRow = [
    {
      value: ghStats?.publicRepos ?? 0,
      label: "GitHub Repos",
      suffix: "",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
    },
    {
      value: ghStats?.followers ?? 0,
      label: "Followers",
      suffix: "",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      value: ghStats?.totalStars ?? 0,
      label: "Total Stars",
      suffix: "",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  // Portfolio highlights (bottom card)
  const HIGHLIGHTS: {
    icon: ReactElement;
    label: string;
    value: string;
    sub: string;
    isGh?: boolean;
    ghValue?: number;
  }[] = [
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      ),
      label: "GitHub Repos",
      value: ghLoading ? "—" : String(ghStats?.publicRepos ?? 0),
      sub: "public repositories",
      isGh: true,
      ghValue: ghStats?.publicRepos,
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

  const techCount = skillGroups.reduce((n, g) => n + g.skills.length, 0);

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
          {/* GitHub Stats row */}
          <div className="hero-stats-row">
            {statsRow.map(({ value, label, suffix, icon }, i) => (
              <motion.div
                key={label}
                className="hero-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: E }}
                whileHover={{ y: -4, scale: 1.03 }}
              >
                <span className="hero-stat-icon" aria-hidden>{icon}</span>
                {ghLoading ? (
                  <span className="hero-stat-skeleton" aria-hidden />
                ) : (
                  <CountUp target={value} suffix={suffix} />
                )}
                <span className="hero-stat-label">{label}</span>
              </motion.div>
            ))}
          </div>

          {/* GitHub live badge */}
          <motion.div
            className="hero-gh-live-badge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: E }}
          >
            <span className="hero-gh-live-dot" aria-hidden />
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Live from github.com/gunawan1608</span>
          </motion.div>

          {/* Portfolio working style */}
          <motion.div
            className="hero-building-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.58, ease: E }}
          >
            <div className="hero-building-head">
              <p className="hero-building-label">Working Style</p>
              <span className="hero-building-status">
                <span className="hero-building-status-dot" aria-hidden />
                Focused
              </span>
            </div>
            <div className="hero-building-list">
              {[
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="4" width="18" height="14" rx="2" />
                      <path d="M8 20h8" />
                      <path d="M12 18v2" />
                    </svg>
                  ),
                  name: "Responsive first",
                  desc: "layouts checked before polish",
                  tag: "Core",
                  tagClass: "hero-building-tag--active",
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 3v18" />
                      <path d="M3 12h18" />
                      <path d="m5 5 14 14" />
                      <path d="m19 5-14 14" />
                    </svg>
                  ),
                  name: "Motion with care",
                  desc: "small transitions, clear feedback",
                  tag: "Active",
                  tagClass: "hero-building-tag--wip",
                },
                {
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M4 7h16" />
                      <path d="M4 12h16" />
                      <path d="M4 17h10" />
                    </svg>
                  ),
                  name: "Readable systems",
                  desc: "components kept easy to extend",
                  tag: "Habit",
                  tagClass: "hero-building-tag--soon",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  className="hero-building-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.65 + i * 0.06, ease: E }}
                  whileHover={{ y: -2 }}
                >
                  <span className="hero-building-icon">{item.icon}</span>
                  <span className="hero-building-info">
                    <span className="hero-building-name">{item.name}</span>
                    <span className="hero-building-desc">{item.desc}</span>
                  </span>
                  <span className={`hero-building-tag ${item.tagClass}`}>{item.tag}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Portfolio Highlights */}
          <motion.div
            className="hero-highlights-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.72, ease: E }}
          >
            <div className="hero-highlights-head">
              <p className="hero-highlights-label">Portfolio At a Glance</p>
              <span className="hero-highlights-badge">{techCount}+ Skills</span>
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
                  <strong className="hero-highlight-value">
                    {item.isGh && ghLoading ? (
                      <span className="hero-stat-skeleton hero-stat-skeleton--sm" aria-hidden />
                    ) : (
                      item.value
                    )}
                  </strong>
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

      {/* Full-width GitHub Snake Card */}
      <motion.div
        className="hero-snake-fullwidth"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 1.1, ease: E }}
      >
        <GitHubSnakeCard username="gunawan1608" />
      </motion.div>
    </section>
  );
}

// Inline count-up component
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let start: number | null = null;
    let raf = 0;
    const dur = 900;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setVal(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <strong className="hero-stat-value">{val}{suffix}</strong>;
}
