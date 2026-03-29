"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import SectionIntro from "@/components/SectionIntro";
import {
  experiences,
  featuredExperience,
  type ExperienceEntry,
} from "@/lib/site-data";

const JOURNEY = [...experiences, featuredExperience];
const DEFAULT_ACTIVE_ID =
  JOURNEY.find((entry) => entry.status === "Current")?.id ?? JOURNEY[0]?.id ?? "";

function StatsStrip({ journey }: { journey: ExperienceEntry[] }) {
  const totalYears = experiences.reduce((sum, entry) => sum + entry.years, 0);
  const stats = [
    { label: "Years of Learning", value: totalYears },
    { label: "Key Chapters", value: journey.length },
    { label: "Milestones Unlocked", value: 1 },
  ];

  return (
    <div className="exp-stats-strip">
      {stats.map((stat) => (
        <div key={stat.label} className="exp-stat">
          <span className="exp-stat-label">{stat.label}</span>
          <strong className="exp-stat-value">{stat.value}</strong>
          <div className="exp-stat-bar" aria-hidden>
            <div
              className="exp-stat-bar-fill"
              style={{ width: `${Math.min((stat.value / 6) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SpineNode({
  item,
  isActive,
  onClick,
}: {
  item: ExperienceEntry;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`exp-spine-node${isActive ? " is-active" : ""}${item.special ? " is-special" : ""}`}
      style={{ "--spine-accent": item.accent } as CSSProperties}
      onClick={onClick}
      aria-label={item.title}
      aria-pressed={isActive}
      data-hover
    >
      <span className="exp-spine-dot" />
      {item.special ? <span className="exp-spine-star" aria-hidden>★</span> : null}
    </button>
  );
}

function ExperienceCard({
  item,
  isActive,
  onActivate,
}: {
  item: ExperienceEntry;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <div
      className={`exp-card-row${isActive ? " is-active" : ""}${item.special ? " is-special" : ""}`}
      style={{ "--exp-accent": item.accent } as CSSProperties}
    >
      <button
        type="button"
        className="exp-card"
        onClick={onActivate}
        onFocus={onActivate}
        data-hover
        aria-expanded={isActive}
      >
        <div
          className="exp-card-glow"
          style={{
            background: `radial-gradient(ellipse at 0% 50%, ${item.accent}18, transparent 60%)`,
            opacity: isActive ? 1 : 0,
          }}
        />

        <div
          className="exp-card-bar"
          style={{
            background: item.accent,
            transform: `scaleY(${isActive ? 1 : 0})`,
          }}
        />

        <div className="exp-card-inner">
          <div className="exp-card-top">
            <div className="exp-card-meta">
              <span className="exp-stage-pill">{item.stage}</span>
              {item.special ? <span className="exp-special-pill">★ Milestone</span> : null}
            </div>
            <div className="exp-period">
              <span className="exp-period-text">{item.period}</span>
            </div>
          </div>

          <div className="exp-card-body">
            <h3 className="exp-card-title">{item.title}</h3>
            <p className="exp-card-location">{item.location}</p>
          </div>

          {isActive ? (
            <div className="exp-card-details">
              <div className="exp-card-details-inner">
                <p className="exp-card-summary">{item.summary}</p>
                <div className="exp-highlights">
                  {item.highlights.map((highlight) => (
                    <span key={highlight} className="exp-highlight-tag">
                      {highlight}
                    </span>
                  ))}
                </div>
                {item.special ? (
                  <div className="exp-unlock">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                      <path
                        d="M9.5 5.5V4A3.5 3.5 0 0 0 2.5 4v1.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <rect
                        x="1.5"
                        y="5.5"
                        width="10"
                        height="6"
                        rx="1.5"
                        fill="currentColor"
                        fillOpacity=".15"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <circle cx="6.5" cy="8.5" r="1" fill="currentColor" />
                    </svg>
                    Internship at Bank Syariah Indonesia (BSN)
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="exp-card-footer">
            <span className="exp-duration">{item.duration}</span>
            <span className="exp-status">
              <span className={`exp-status-dot${item.status === "Current" ? " is-live" : ""}`} />
              {item.status}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}

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

  return (
    <div
      className="exp-master"
      style={{ "--master-accent": item.accent } as CSSProperties}
    >
      <div className="exp-master-chapter">
        <span className="exp-chapter-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="exp-chapter-sep">/</span>
        <span className="exp-chapter-total">{String(total).padStart(2, "0")}</span>
        <span className="exp-chapter-label">{item.theme ?? item.type}</span>
      </div>

      <div className="exp-master-info">
        <h3 className="exp-master-title">{item.title}</h3>
        <p className="exp-master-org">{item.location}</p>
      </div>

      <div className="exp-master-divider" style={{ background: item.accent }} />

      <div className="exp-master-meta">
        {[
          { label: "Period", value: item.period },
          { label: "Duration", value: item.duration },
          { label: "Status", value: item.status },
        ].map(({ label, value }) => (
          <div key={`${item.id}-${label}`} className="exp-meta-cell">
            <span className="exp-meta-label">{label}</span>
            <strong className="exp-meta-value">{value}</strong>
          </div>
        ))}
      </div>

      <p className="exp-master-summary">{item.summary}</p>

      <div className="exp-journey-progress">
        <div className="exp-progress-header">
          <span className="exp-progress-label">Journey progress</span>
          <span className="exp-progress-pct">{pct}%</span>
        </div>
        <div className="exp-progress-track">
          <div
            className="exp-progress-fill"
            style={{ background: item.accent, width: `${pct}%` }}
          />
          <div
            className="exp-progress-shimmer"
            style={{ left: `${pct}%`, background: item.accent }}
          />
        </div>
        <div className="exp-chapter-dots">
          {Array.from({ length: total }).map((_, dotIndex) => (
            <div
              key={dotIndex}
              className={`exp-chapter-dot${dotIndex <= index ? " is-passed" : ""}${dotIndex === index ? " is-current" : ""}`}
              style={dotIndex === index ? { background: item.accent } : {}}
            />
          ))}
        </div>
      </div>

      <div className="exp-master-skills">
        {item.highlights.map((highlight) => (
          <span key={highlight} className="exp-skill-chip">
            {highlight}
          </span>
        ))}
      </div>

      {item.special ? (
        <div className="exp-master-special">
          <span>★</span>
          Real-world professional experience
        </div>
      ) : null}
    </div>
  );
}

export default function ExperienceSection() {
  const [activeId, setActiveId] = useState(DEFAULT_ACTIVE_ID);

  const activeItem = JOURNEY.find((entry) => entry.id === activeId) ?? JOURNEY[0];
  const activeIndex = JOURNEY.findIndex((entry) => entry.id === activeItem.id);

  return (
    <section id="experience" className="exp-section">
      <div className="exp-bg-strip" aria-hidden />

      <div className="container">
        <SectionIntro
          eyebrow="Experience"
          title="From classroom to the real world."
          description="Every chapter shaped how I think about building things - school years, clubs, and a real internship."
        />

        <StatsStrip journey={JOURNEY} />

        <div className="exp-layout">
          <div className="exp-master-wrap">
            <MasterPanel
              item={activeItem}
              index={activeIndex}
              total={JOURNEY.length}
            />
          </div>

          <div className="exp-timeline-area">
            <div className="exp-spine" aria-label="Chapter navigation">
              {JOURNEY.map((item) => (
                <SpineNode
                  key={item.id}
                  item={item}
                  isActive={item.id === activeId}
                  onClick={() => {
                    setActiveId((current) => (current === item.id ? current : item.id));
                  }}
                />
              ))}
              <div className="exp-spine-track" aria-hidden />
            </div>

            <div className="exp-cards">
              {JOURNEY.map((item) => (
                <ExperienceCard
                  key={item.id}
                  item={item}
                  isActive={item.id === activeId}
                  onActivate={() => {
                    setActiveId((current) => (current === item.id ? current : item.id));
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
