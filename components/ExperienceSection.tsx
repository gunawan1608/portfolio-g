"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import SectionIntro from "@/components/SectionIntro";
import {
  experiences,
  featuredExperience,
  type ExperienceEntry,
} from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

function getAccentStyle(accent: string) {
  return { "--experience-accent": accent } as CSSProperties;
}

function OverviewCard({
  label,
  value,
  copy,
  index,
}: {
  label: string;
  value: string;
  copy: string;
  index: number;
}) {
  return (
    <motion.article
      className="experience-overview-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
    >
      <span className="experience-overview-label">{label}</span>
      <strong className="experience-overview-value">{value}</strong>
      <p className="experience-overview-copy">{copy}</p>
    </motion.article>
  );
}

function JourneyCheckpoint({
  item,
  index,
  isActive,
  isLast,
  onActivate,
}: {
  item: ExperienceEntry;
  index: number;
  isActive: boolean;
  isLast: boolean;
  onActivate: (id: string) => void;
}) {
  return (
    <motion.button
      type="button"
      className={[
        "experience-checkpoint",
        isActive ? "is-active" : "",
        item.special ? "is-special" : "",
        isLast ? "is-last" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={getAccentStyle(item.accent)}
      onMouseEnter={() => onActivate(item.id)}
      onFocus={() => onActivate(item.id)}
      onClick={() => onActivate(item.id)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.58, delay: index * 0.08, ease: EASE }}
      whileTap={{ scale: 0.995 }}
      aria-pressed={isActive}
      data-hover
    >
      <div className="experience-checkpoint-rail" aria-hidden>
        <span className="experience-checkpoint-stage">{item.stage}</span>
        <span className="experience-checkpoint-dot">
          <span className="experience-checkpoint-dot-core" />
        </span>
      </div>

      <div className="experience-checkpoint-card">
        <div className="experience-checkpoint-top">
          <span className="experience-checkpoint-type">
            {item.special ? "Special Unlock" : item.type}
          </span>
          <span className="experience-checkpoint-period">{item.period}</span>
        </div>

        <div className="experience-checkpoint-head">
          <div>
            <h3>{item.title}</h3>
            <p className="experience-checkpoint-location">{item.location}</p>
          </div>

          <div className="experience-checkpoint-meta">
            <span className="experience-checkpoint-status">{item.status}</span>
            <span className="experience-checkpoint-duration">{item.duration}</span>
          </div>
        </div>

        <p className="experience-checkpoint-summary">{item.summary}</p>

        <div className="experience-checkpoint-tags">
          {item.highlights.map((highlight) => (
            <span key={highlight} className="experience-checkpoint-tag">
              {highlight}
            </span>
          ))}
        </div>

        {item.special ? (
          <div className="experience-checkpoint-special-row">
            <span>Unlocked Chapter</span>
            <strong>BSN Internship</strong>
          </div>
        ) : null}
      </div>
    </motion.button>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const journey = useMemo(() => [...experiences, featuredExperience], []);
  const defaultActiveId =
    journey.find((item) => item.status === "Current")?.id ?? journey[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultActiveId);

  const activeItem = journey.find((item) => item.id === activeId) ?? journey[0];
  const activeIndex = Math.max(
    0,
    journey.findIndex((item) => item.id === activeItem.id),
  );
  const totalYears = experiences.reduce((sum, item) => sum + item.years, 0);
  const checkpointCount = journey.length;
  const journeyCompletion = Math.round(((activeIndex + 1) / checkpointCount) * 100);
  const activeStep = String(activeIndex + 1).padStart(2, "0");
  const totalSteps = String(checkpointCount).padStart(2, "0");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(".experience-section-aura.is-one", {
        x: 34,
        y: -26,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".experience-section-aura.is-two", {
        x: -28,
        y: 18,
        scale: 1.08,
        duration: 11,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="section experience-section">
      <div className="experience-section-aura is-one" aria-hidden />
      <div className="experience-section-aura is-two" aria-hidden />

      <div className="container">
        <SectionIntro
          eyebrow="Experience"
          title="A progress journey from school to real-world work."
          description="Built like a live route map, this section turns each chapter into a checkpoint and highlights the BSN internship as a special unlock."
        />

        <div className="experience-journey-overview">
          <OverviewCard
            index={0}
            label="School Years"
            value={String(totalYears).padStart(2, "0")}
            copy="Years of formal learning mapped into one clear route."
          />
          <OverviewCard
            index={1}
            label="Journey Nodes"
            value={String(checkpointCount).padStart(2, "0")}
            copy="Main checkpoints from elementary school to internship."
          />
          <OverviewCard
            index={2}
            label="Special Unlock"
            value="01"
            copy="A featured professional chapter that stands apart."
          />
        </div>

        <div className="experience-journey-layout">
          <motion.aside
            className="experience-hud"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <div className="experience-hud-frame" style={getAccentStyle(activeItem.accent)}>
              <div className="experience-hud-head">
                <div>
                  <p className="experience-hud-kicker">Mission Control</p>
                  <h3>Progress Journey</h3>
                </div>
                <span className="experience-hud-status">{activeItem.status}</span>
              </div>

              <div className="experience-hud-radar-shell">
                <div className="experience-hud-radar" aria-hidden>
                  <span className="experience-hud-radar-ring is-outer" />
                  <span className="experience-hud-radar-ring is-middle" />
                  <span className="experience-hud-radar-ring is-inner" />
                  <motion.span
                    className="experience-hud-radar-ping"
                    animate={{ scale: [1, 1.18, 1], opacity: [0.48, 0.18, 0.48] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <div className="experience-hud-radar-center">
                    <span>Checkpoint</span>
                    <strong>{activeStep}</strong>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.id}
                    className="experience-hud-copy"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.34, ease: EASE }}
                  >
                    <p className="experience-hud-type">
                      {activeItem.type} / {activeItem.theme}
                    </p>
                    <h4>{activeItem.title}</h4>
                    <p className="experience-hud-location">{activeItem.location}</p>
                    <p className="experience-hud-summary">{activeItem.summary}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="experience-hud-stats">
                <div className="experience-hud-stat">
                  <span>Position</span>
                  <strong>{`${activeStep} / ${totalSteps}`}</strong>
                </div>
                <div className="experience-hud-stat">
                  <span>Timeline</span>
                  <strong>{activeItem.period}</strong>
                </div>
                <div className="experience-hud-stat">
                  <span>Duration</span>
                  <strong>{activeItem.duration}</strong>
                </div>
              </div>

              <div className="experience-hud-progress">
                <div className="experience-hud-progress-row">
                  <span>Journey Completion</span>
                  <strong>{journeyCompletion}%</strong>
                </div>
                <div className="experience-hud-progress-track" aria-hidden>
                  <motion.span
                    key={activeItem.id}
                    initial={{ width: 0 }}
                    animate={{ width: `${journeyCompletion}%` }}
                    transition={{ duration: 0.48, ease: EASE }}
                  />
                </div>
              </div>

              <div className="experience-hud-highlights">
                {activeItem.highlights.map((highlight) => (
                  <span key={highlight} className="experience-hud-highlight">
                    {highlight}
                  </span>
                ))}
              </div>

              <p className="experience-hud-tip">
                Hover or tap each checkpoint to move through the journey.
              </p>
            </div>
          </motion.aside>

          <div className="experience-journey-rail">
            {journey.map((item, index) => (
              <JourneyCheckpoint
                key={item.id}
                item={item}
                index={index}
                isActive={item.id === activeItem.id}
                isLast={index === journey.length - 1}
                onActivate={setActiveId}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
