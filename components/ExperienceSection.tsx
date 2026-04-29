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

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function StatsStrip({ journey }: { journey: ExperienceEntry[] }) {
  const totalYears = experiences.reduce((sum, entry) => sum + entry.years, 0);
  const currentChapter = journey.find((entry) => entry.status === "Current");
  const stats = [
    { label: "Learning Years", value: `${totalYears}`, detail: "Education path" },
    { label: "Chapters", value: `${journey.length}`, detail: "School to internship" },
    { label: "Current Focus", value: currentChapter?.theme ?? "RPL", detail: "Active track" },
  ];

  return (
    <div className="expv4-stats" aria-label="Experience overview">
      {stats.map((stat) => (
        <div className="expv4-stat" key={stat.label}>
          <span className="expv4-stat-label">{stat.label}</span>
          <strong className="expv4-stat-value">{stat.value}</strong>
          <span className="expv4-stat-detail">{stat.detail}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ item }: { item: ExperienceEntry }) {
  return (
    <span className="expv4-status">
      <span className={`expv4-status-dot${item.status === "Current" ? " is-live" : ""}`} />
      {item.status}
    </span>
  );
}

function SpotlightPanel({
  item,
  index,
  total,
}: {
  item: ExperienceEntry;
  index: number;
  total: number;
}) {
  const progress = Math.round(((index + 1) / total) * 100);

  return (
    <aside
      className="expv4-spotlight"
      style={{ "--exp-accent": item.accent } as CSSProperties}
      aria-label="Selected experience chapter"
    >
      <div className="expv4-spotlight-head">
        <div>
          <span className="expv4-kicker">Selected Chapter</span>
          <div className="expv4-chapter-count">
            <strong>{formatIndex(index)}</strong>
            <span>/ {String(total).padStart(2, "0")}</span>
          </div>
        </div>
        <StatusBadge item={item} />
      </div>

      <div className="expv4-spotlight-titleblock">
        <span className="expv4-type">{item.type}</span>
        <h3 className="expv4-spotlight-title">{item.title}</h3>
        <p className="expv4-spotlight-location">{item.location}</p>
      </div>

      <div className="expv4-meta-grid">
        <div>
          <span>Period</span>
          <strong>{item.period}</strong>
        </div>
        <div>
          <span>Duration</span>
          <strong>{item.duration}</strong>
        </div>
      </div>

      <p className="expv4-summary">{item.summary}</p>

      <div className="expv4-progress" aria-label={`Journey progress ${progress}%`}>
        <div className="expv4-progress-row">
          <span>Journey progress</span>
          <strong>{progress}%</strong>
        </div>
        <div className="expv4-progress-track">
          <span className="expv4-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="expv4-skill-list" aria-label="Chapter highlights">
        {item.highlights.map((highlight) => (
          <span className="expv4-skill" key={highlight}>
            {highlight}
          </span>
        ))}
      </div>

      {item.special ? (
        <div className="expv4-special-note">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
            <path
              d="M7.5 1.4l1.85 3.75 4.14.6-3 2.92.71 4.12-3.7-1.95-3.7 1.95.71-4.12-3-2.92 4.14-.6L7.5 1.4z"
              fill="currentColor"
            />
          </svg>
          Real professional environment through BSN internship
        </div>
      ) : null}
    </aside>
  );
}

function TimelineItem({
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
  return (
    <button
      type="button"
      className={`expv4-item${isActive ? " is-active" : ""}${item.special ? " is-special" : ""}`}
      style={{ "--exp-accent": item.accent } as CSSProperties}
      onClick={onActivate}
      onFocus={onActivate}
      aria-current={isActive ? "step" : undefined}
      data-hover
    >
      <span className="expv4-item-marker" aria-hidden>
        <span>{formatIndex(index)}</span>
      </span>

      <span className="expv4-item-body">
        <span className="expv4-item-top">
          <span className="expv4-stage">{item.stage}</span>
          <span className="expv4-period">{item.period}</span>
        </span>

        <strong className="expv4-item-title">{item.title}</strong>
        <span className="expv4-item-location">{item.location}</span>

        <span className="expv4-item-tags" aria-label="Highlights">
          {item.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </span>

        <span className="expv4-item-footer">
          <span>{item.duration}</span>
          <StatusBadge item={item} />
        </span>
      </span>
    </button>
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

        <div className="expv4-layout">
          <SpotlightPanel item={activeItem} index={activeIndex} total={JOURNEY.length} />

          <div className="expv4-timeline" aria-label="Experience timeline">
            {JOURNEY.map((item, index) => (
              <TimelineItem
                key={item.id}
                item={item}
                index={index}
                isActive={item.id === activeId}
                onActivate={() => {
                  setActiveId((current) => (current === item.id ? current : item.id));
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
