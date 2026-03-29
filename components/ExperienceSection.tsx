"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  motionValue,
  animate,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionIntro from "@/components/SectionIntro";
import {
  experiences,
  featuredExperience,
  type ExperienceEntry,
} from "@/lib/site-data";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { stiffness: 300, damping: 30 };

/* ─── Animated counter ─────────────────────────────────────── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [isInView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─── Particle field ─────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; pulse: number }[] = [];
    const count = 28;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 2.2 + 0.8,
        opacity: Math.random() * 0.35 + 0.08,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.018;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const alpha = p.opacity * (0.7 + Math.sin(p.pulse) * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(47, 138, 87, ${alpha})`;
        ctx.fill();
      });

      // Draw subtle connection lines between nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(47, 138, 87, ${0.06 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="exp-particle-canvas"
      aria-hidden
    />
  );
}

/* ─── Orbital ring decoration ────────────────────────────────── */
function OrbitalRing({ accent, index }: { accent: string; index: number }) {
  const reduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <motion.div
      className="exp-orbital"
      style={{
        "--orbital-accent": accent,
        "--orbital-delay": `${index * 0.4}s`,
      } as CSSProperties}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: EASE }}
    />
  );
}

/* ─── Chapter indicator (left spine) ─────────────────────────── */
function SpineNode({
  item,
  index,
  isActive,
  onClick,
}: {
  item: ExperienceEntry;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      className={`exp-spine-node${isActive ? " is-active" : ""}${item.special ? " is-special" : ""}`}
      style={{ "--spine-accent": item.accent } as CSSProperties}
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.94 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      aria-label={item.title}
      data-hover
    >
      <motion.span
        className="exp-spine-dot"
        animate={{
          scale: isActive ? [1, 1.3, 1] : 1,
        }}
        transition={isActive ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : {}}
      />
      {item.special && <span className="exp-spine-star" aria-hidden>★</span>}
    </motion.button>
  );
}

/* ─── Floating orb background element ─────────────────────────── */
function FloatingOrb({ x, y, size, delay, accent }: { x: string; y: string; size: number; delay: number; accent: string }) {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !orbRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(orbRef.current, {
        y: "+=22",
        x: "+=12",
        duration: 5.5 + delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay,
      });
    });
    return () => ctx.revert();
  }, [delay]);

  return (
    <div
      ref={orbRef}
      className="exp-floating-orb"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${accent}28, ${accent}06)`,
      }}
      aria-hidden
    />
  );
}

/* ─── Main card — each experience ────────────────────────────── */
function ExperienceCard({
  item,
  index,
  isActive,
  onActivate,
}: {
  item: ExperienceEntry;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 90%", "start 25%"],
  });
  const lineProgress = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), SPRING);

  return (
    <div
      ref={cardRef}
      className={`exp-card-row${isActive ? " is-active" : ""}${item.special ? " is-special" : ""}`}
      style={{ "--exp-accent": item.accent } as CSSProperties}
    >
      {/* Animated connector line */}
      <div className="exp-connector-wrap" aria-hidden>
        <motion.div
          className="exp-connector-line"
          style={{ scaleY: lineProgress, transformOrigin: "top center" }}
        />
        <motion.div
          className="exp-connector-glow"
          style={{
            scaleY: lineProgress,
            transformOrigin: "top center",
            background: `linear-gradient(180deg, ${item.accent}80, transparent)`,
          }}
        />
      </div>

      <motion.button
        type="button"
        className="exp-card"
        onClick={onActivate}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, delay: index * 0.06, ease: EASE }}
        whileHover={{ y: -4 }}
        data-hover
        aria-pressed={isActive}
      >
        {/* Gradient accent overlay (visible when active) */}
        <motion.div
          className="exp-card-glow"
          style={{ background: `radial-gradient(ellipse at 0% 50%, ${item.accent}18, transparent 60%)` }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Left accent bar */}
        <motion.div
          className="exp-card-bar"
          style={{ background: item.accent }}
          animate={{ scaleY: isActive ? 1 : 0 }}
          transition={{ duration: 0.38, ease: EASE }}
        />

        <div className="exp-card-inner">
          {/* Top row */}
          <div className="exp-card-top">
            <div className="exp-card-meta">
              <span className="exp-stage-pill">{item.stage}</span>
              {item.special && (
                <motion.span
                  className="exp-special-pill"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  ★ Milestone
                </motion.span>
              )}
            </div>
            <div className="exp-period">
              <span className="exp-period-text">{item.period}</span>
            </div>
          </div>

          {/* Main content */}
          <div className="exp-card-body">
            <h3 className="exp-card-title">{item.title}</h3>
            <p className="exp-card-location">{item.location}</p>
          </div>

          {/* Expandable details */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="exp-card-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{ overflow: "hidden" }}
              >
                <div className="exp-card-details-inner">
                  <p className="exp-card-summary">{item.summary}</p>
                  <div className="exp-highlights">
                    {item.highlights.map((h, hi) => (
                      <motion.span
                        key={h}
                        className="exp-highlight-tag"
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: hi * 0.04 + 0.1, duration: 0.28, ease: EASE }}
                      >
                        {h}
                      </motion.span>
                    ))}
                  </div>
                  {item.special && (
                    <motion.div
                      className="exp-unlock"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.35 }}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                        <path d="M9.5 5.5V4A3.5 3.5 0 0 0 2.5 4v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                        <rect x="1.5" y="5.5" width="10" height="6" rx="1.5" fill="currentColor" fillOpacity=".15" stroke="currentColor" strokeWidth="1.2"/>
                        <circle cx="6.5" cy="8.5" r="1" fill="currentColor"/>
                      </svg>
                      Internship at Bank Syariah Indonesia (BSN)
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="exp-card-footer">
            <span className="exp-duration">{item.duration}</span>
            <span className="exp-status">
              <motion.span
                className={`exp-status-dot${item.status === "Current" ? " is-live" : ""}`}
                animate={item.status === "Current"
                  ? { scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }
                  : {}}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              {item.status}
            </span>
          </div>
        </div>
      </motion.button>
    </div>
  );
}

/* ─── Master panel (left sticky) ─────────────────────────────── */
function MasterPanel({
  item,
  index,
  total,
}: {
  item: ExperienceEntry;
  index: number;
  total: number;
}) {
  const pct = Math.round(((index + 1) / total) * 100);
  const prevPct = useRef(pct);
  const barWidth = useSpring(pct, { stiffness: 120, damping: 18 });

  useEffect(() => {
    barWidth.set(pct);
    prevPct.current = pct;
  }, [pct, barWidth]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.id}
        className="exp-master"
        style={{ "--master-accent": item.accent } as CSSProperties}
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
        transition={{ duration: 0.38, ease: EASE }}
      >
        {/* Orbital decoration */}
        <OrbitalRing accent={item.accent} index={0} />

        {/* Chapter counter */}
        <div className="exp-master-chapter">
          <motion.span
            className="exp-chapter-num"
            key={`num-${item.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>
          <span className="exp-chapter-sep">/</span>
          <span className="exp-chapter-total">{String(total).padStart(2, "0")}</span>
          <span className="exp-chapter-label">{item.theme ?? item.type}</span>
        </div>

        {/* Title & org */}
        <div className="exp-master-info">
          <motion.h3
            className="exp-master-title"
            key={`title-${item.id}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.04 }}
          >
            {item.title}
          </motion.h3>
          <motion.p
            className="exp-master-org"
            key={`org-${item.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.08 }}
          >
            {item.location}
          </motion.p>
        </div>

        {/* Accent divider */}
        <motion.div
          className="exp-master-divider"
          style={{ background: item.accent }}
          key={`div-${item.id}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.45, ease: EASE }}
        />

        {/* Meta grid */}
        <div className="exp-master-meta">
          {[
            { label: "Period", value: item.period },
            { label: "Duration", value: item.duration },
            { label: "Status", value: item.status },
          ].map(({ label, value }) => (
            <motion.div
              key={`${item.id}-${label}`}
              className="exp-meta-cell"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="exp-meta-label">{label}</span>
              <strong className="exp-meta-value">{value}</strong>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.p
          className="exp-master-summary"
          key={`sum-${item.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.14 }}
        >
          {item.summary}
        </motion.p>

        {/* Journey progress */}
        <div className="exp-journey-progress">
          <div className="exp-progress-header">
            <span className="exp-progress-label">Journey progress</span>
            <span className="exp-progress-pct">{pct}%</span>
          </div>
          <div className="exp-progress-track">
            <motion.div
              className="exp-progress-fill"
              style={{ background: item.accent, width: `${pct}%` }}
              layout
              transition={{ duration: 0.5, ease: EASE }}
            />
            <motion.div
              className="exp-progress-shimmer"
              style={{ left: `${pct}%`, background: item.accent }}
              layout
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
          {/* Chapter dots */}
          <div className="exp-chapter-dots">
            {Array.from({ length: total }).map((_, i) => (
              <motion.div
                key={i}
                className={`exp-chapter-dot${i <= index ? " is-passed" : ""}${i === index ? " is-current" : ""}`}
                style={i === index ? { background: item.accent } : {}}
                animate={i === index ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={i === index ? { duration: 1.8, repeat: Infinity } : {}}
              />
            ))}
          </div>
        </div>

        {/* Skills cloud */}
        <div className="exp-master-skills">
          {item.highlights.map((h, i) => (
            <motion.span
              key={h}
              className="exp-skill-chip"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.045 + 0.18, duration: 0.3, ease: EASE }}
            >
              {h}
            </motion.span>
          ))}
        </div>

        {/* Special badge */}
        {item.special && (
          <motion.div
            className="exp-master-special"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.35 }}
          >
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ★
            </motion.span>
            Real-world professional experience
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Stats strip ──────────────────────────────────────────────── */
function StatsStrip({ journey }: { journey: ExperienceEntry[] }) {
  const totalYears = experiences.reduce((s, e) => s + e.years, 0);
  const stats = [
    { label: "Years of Learning", value: totalYears, suffix: "" },
    { label: "Key Chapters", value: journey.length, suffix: "" },
    { label: "Milestones Unlocked", value: 1, suffix: "" },
  ];

  return (
    <div className="exp-stats-strip">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="exp-stat"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
        >
          <span className="exp-stat-label">{s.label}</span>
          <strong className="exp-stat-value">
            <AnimatedNumber value={s.value} suffix={s.suffix} />
          </strong>
          <div className="exp-stat-bar" aria-hidden>
            <motion.div
              className="exp-stat-bar-fill"
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min((s.value / 6) * 100, 100)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: i * 0.1 + 0.3, ease: EASE }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Main section ──────────────────────────────────────────── */
export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const journey = [...experiences, featuredExperience];
  const defaultId =
    journey.find((e) => e.status === "Current")?.id ?? journey[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultId);

  const activeItem = journey.find((e) => e.id === activeId) ?? journey[0];
  const activeIndex = journey.findIndex((e) => e.id === activeItem.id);

  // Parallax for section heading
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section id="experience" ref={sectionRef} className="exp-section">
      {/* Particle constellation background */}
      <ParticleField />

      {/* Floating orbs */}
      <FloatingOrb x="8%" y="15%" size={280} delay={0} accent={activeItem.accent} />
      <FloatingOrb x="72%" y="60%" size={200} delay={1.2} accent="#2f8a57" />
      <FloatingOrb x="45%" y="80%" size={160} delay={0.6} accent="#0ea5e9" />

      <motion.div className="exp-bg-strip" style={{ y: bgY }} aria-hidden />

      <div className="container">
        <SectionIntro
          eyebrow="Experience"
          title="From classroom to the real world."
          description="Every chapter shaped how I think about building things — school years, clubs, and a real internship."
        />

        {/* Stats */}
        <StatsStrip journey={journey} />

        {/* Main layout */}
        <div className="exp-layout">

          {/* ── Left: sticky master panel ── */}
          <div className="exp-master-wrap">
            <MasterPanel item={activeItem} index={activeIndex} total={journey.length} />
          </div>

          {/* ── Right: spine + cards ── */}
          <div className="exp-timeline-area">
            {/* Spine navigation */}
            <div className="exp-spine" aria-label="Chapter navigation">
              {journey.map((item, i) => (
                <SpineNode
                  key={item.id}
                  item={item}
                  index={i}
                  isActive={item.id === activeId}
                  onClick={() => setActiveId(item.id)}
                />
              ))}
              {/* Spine track line */}
              <div className="exp-spine-track" aria-hidden />
            </div>

            {/* Cards */}
            <div className="exp-cards">
              {journey.map((item, i) => (
                <ExperienceCard
                  key={item.id}
                  item={item}
                  index={i}
                  isActive={item.id === activeId}
                  onActivate={() => setActiveId(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}