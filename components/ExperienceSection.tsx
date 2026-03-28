"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import {
  experiences,
  featuredExperience,
  type ExperienceEntry,
} from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── Single timeline entry ─────────────────────────────────── */
function CheckpointRow({
  item,
  index,
  isActive,
  onActivate,
  isLast,
}: {
  item: ExperienceEntry;
  index: number;
  isActive: boolean;
  onActivate: (id: string) => void;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 30%"],
  });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={ref}
      className={`exp2-row${isActive ? " is-active" : ""}${item.special ? " is-special" : ""}`}
      style={{ "--exp2-accent": item.accent } as CSSProperties}
    >
      {/* Left: index + connector line */}
      <div className="exp2-rail" aria-hidden>
        <motion.span
          className="exp2-index"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
        {!isLast && (
          <div className="exp2-connector">
            <motion.span className="exp2-connector-fill" style={{ height: lineH }} />
          </div>
        )}
      </div>

      {/* Right: card */}
      <motion.button
        type="button"
        className="exp2-card"
        onClick={() => onActivate(item.id)}
        onMouseEnter={() => onActivate(item.id)}
        onFocus={() => onActivate(item.id)}
        initial={{ opacity: 0, x: 28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, delay: index * 0.07, ease: EASE }}
        data-hover
        aria-pressed={isActive}
      >
        {/* Card inner */}
        <div className="exp2-card-top">
          <div className="exp2-card-labels">
            <span className="exp2-stage-pill">{item.stage}</span>
            {item.special && <span className="exp2-special-badge">★ Special</span>}
          </div>
          <span className="exp2-period">{item.period}</span>
        </div>

        <div className="exp2-card-body">
          <h3 className="exp2-title">{item.title}</h3>
          <p className="exp2-location">{item.location}</p>
        </div>

        <motion.div
          className="exp2-card-expand"
          initial={false}
          animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.38, ease: EASE }}
          style={{ overflow: "hidden" }}
        >
          <p className="exp2-summary">{item.summary}</p>
          <div className="exp2-tags">
            {item.highlights.map((h) => (
              <span key={h} className="exp2-tag">{h}</span>
            ))}
          </div>
          {item.special && (
            <div className="exp2-unlock-note">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M9 5V3.5a3 3 0 0 0-6 0V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <rect x="1.5" y="5" width="9" height="6" rx="1.5" fill="currentColor" fillOpacity=".15" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="6" cy="8" r="1" fill="currentColor"/>
              </svg>
              Unlocked: BSN Internship
            </div>
          )}
        </motion.div>

        <div className="exp2-card-footer">
          <span className="exp2-duration">{item.duration}</span>
          <span className="exp2-status-dot">
            <span className={`exp2-dot${item.status === "Current" ? " is-live" : ""}`} />
            {item.status}
          </span>
        </div>

        {/* Active accent line */}
        <motion.span
          className="exp2-active-bar"
          animate={{ scaleY: isActive ? 1 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
      </motion.button>
    </div>
  );
}

/* ─── Sticky HUD panel ───────────────────────────────────────── */
function HudPanel({ item, index, total }: { item: ExperienceEntry; index: number; total: number }) {
  const pct = Math.round(((index + 1) / total) * 100);

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={item.id}
        className="exp2-hud"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ "--exp2-accent": item.accent } as CSSProperties}
      >
        {/* Top: chapter label */}
        <div className="exp2-hud-chapter">
          <span className="exp2-hud-chapter-num">{String(index + 1).padStart(2, "0")}</span>
          <span className="exp2-hud-chapter-sep">/</span>
          <span className="exp2-hud-chapter-total">{String(total).padStart(2, "0")}</span>
          <span className="exp2-hud-chapter-label">{item.theme ?? item.type}</span>
        </div>

        {/* Big title */}
        <h3 className="exp2-hud-title">{item.title}</h3>
        <p className="exp2-hud-org">{item.location}</p>

        {/* Meta strip */}
        <div className="exp2-hud-meta">
          <div className="exp2-hud-meta-item">
            <span>Period</span>
            <strong>{item.period}</strong>
          </div>
          <div className="exp2-hud-meta-item">
            <span>Duration</span>
            <strong>{item.duration}</strong>
          </div>
          <div className="exp2-hud-meta-item">
            <span>Status</span>
            <strong>{item.status}</strong>
          </div>
        </div>

        {/* Divider */}
        <div className="exp2-hud-rule" />

        {/* Summary */}
        <p className="exp2-hud-summary">{item.summary}</p>

        {/* Progress */}
        <div className="exp2-hud-progress">
          <div className="exp2-hud-progress-row">
            <span>Journey</span>
            <strong>{pct}%</strong>
          </div>
          <div className="exp2-hud-bar">
            <motion.span
              className="exp2-hud-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="exp2-hud-skills">
          {item.highlights.map((h, i) => (
            <motion.span
              key={h}
              className="exp2-hud-skill"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.28, ease: EASE }}
            >
              {h}
            </motion.span>
          ))}
        </div>

        {item.special && (
          <div className="exp2-hud-special">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 1l1.5 4h4l-3.2 2.4 1.2 4L7 9.1l-3.5 2.3 1.2-4L1.5 5H5.5Z" fill="currentColor" fillOpacity=".25" stroke="currentColor" strokeWidth="1.1"/>
            </svg>
            Special chapter — professional real-world experience
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}

/* ─── Overview stats ─────────────────────────────────────────── */
function StatBadge({ label, value, note, index }: { label: string; value: string; note: string; index: number }) {
  return (
    <motion.div
      className="exp2-stat"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.09, ease: EASE }}
    >
      <span className="exp2-stat-label">{label}</span>
      <strong className="exp2-stat-value">{value}</strong>
      <p className="exp2-stat-note">{note}</p>
    </motion.div>
  );
}

/* ─── Main section ───────────────────────────────────────────── */
export default function ExperienceSection() {
  const journey = [...experiences, featuredExperience];
  const defaultId = journey.find((e) => e.status === "Current")?.id ?? journey[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultId);

  const activeItem = journey.find((e) => e.id === activeId) ?? journey[0];
  const activeIndex = journey.findIndex((e) => e.id === activeItem.id);
  const totalYears = experiences.reduce((s, e) => s + e.years, 0);

  return (
    <section id="experience" className="section exp2-section">
      {/* Subtle background texture */}
      <div className="exp2-bg-grain" aria-hidden />

      <div className="container">
        <SectionIntro
          eyebrow="Experience"
          title="From classroom to the real world."
          description="Every chapter shaped how I think about building things — school years, clubs, and a real internship."
        />

        {/* Stats row */}
        <div className="exp2-stats-row">
          <StatBadge index={0} label="School Years" value={`${totalYears}`} note="Years of formal education" />
          <StatBadge index={1} label="Checkpoints" value={`${journey.length}`} note="Key chapters in the journey" />
          <StatBadge index={2} label="Special Chapter" value="01" note="Real-world professional work" />
        </div>

        {/* Main layout: sticky HUD + timeline */}
        <div className="exp2-layout">
          {/* Sticky HUD */}
          <div className="exp2-hud-wrap">
            <HudPanel item={activeItem} index={activeIndex} total={journey.length} />
          </div>

          {/* Timeline */}
          <div className="exp2-timeline">
            {journey.map((item, i) => (
              <CheckpointRow
                key={item.id}
                item={item}
                index={i}
                isActive={item.id === activeId}
                isLast={i === journey.length - 1}
                onActivate={setActiveId}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}