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
  JOURNEY.find((entry) => entry.status === "Fresh Graduate Student")?.id ??
  featuredExperience.id ??
  JOURNEY[0]?.id ??
  "";

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function StatsStrip({ journey }: { journey: ExperienceEntry[] }) {
  const totalYears = experiences.reduce((sum, entry) => sum + entry.years, 0);
  const stats = [
    { label: "School Years", value: `${totalYears}`, detail: "From elementary to vocational school" },
    { label: "Current Status", value: "Fresh Graduate Student", detail: "SMK Negeri 1 Jakarta" },
    { label: "Outside Class", value: "Internship", detail: "A first look at real work" },
  ];

  return (
    <div className="expv4-stats" aria-label="Experience overview">
      {stats.map((stat, index) => (
        <div
          className="expv4-stat"
          key={stat.label}
          style={{ "--stat-accent": journey[index]?.accent ?? "var(--green)" } as CSSProperties}
        >
          <span className="expv4-stat-head">
            <span className="expv4-stat-label">{stat.label}</span>
            <span className="expv4-stat-mark" aria-hidden />
          </span>
          <strong className="expv4-stat-value">{stat.value}</strong>
          <span className="expv4-stat-detail">{stat.detail}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ item }: { item: ExperienceEntry }) {
  const isHighlighted = item.status === "Fresh Graduate Student" || item.status === "Professional Experience";

  return (
    <span className="expv4-status">
      <span className={`expv4-status-dot${isHighlighted ? " is-live" : ""}`} />
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
      aria-label="Selected experience step"
    >
      <div className="expv4-spotlight-top">
        <div className="expv4-chapter-count" aria-label={`Step ${index + 1} of ${total}`}>
          <strong>{formatIndex(index)}</strong>
          <span>/ {String(total).padStart(2, "0")}</span>
        </div>
        <div className="expv4-spotlight-head">
          <div>
            <span className="expv4-kicker">Selected step</span>
            <p className="expv4-spotlight-theme">{item.theme}</p>
          </div>
          <StatusBadge item={item} />
        </div>
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
          <span>Timeline position</span>
          <strong>{progress}%</strong>
        </div>
        <div className="expv4-progress-track">
          <span className="expv4-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="expv4-skill-list" aria-label="Step highlights">
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
          First direct look at a professional environment through BSN
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
      <span className="expv4-item-accent" aria-hidden />
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

function TimelinePanel({
  activeIndex,
  journey,
  onSelect,
}: {
  activeIndex: number;
  journey: ExperienceEntry[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="expv4-timeline-panel">
      <div className="expv4-timeline-head">
        <div>
          <span className="expv4-kicker">Timeline</span>
          <strong>{journey.length} steps in the journey</strong>
        </div>
        <span className="expv4-timeline-state">
          Step {formatIndex(activeIndex)}
        </span>
      </div>

      <div className="expv4-timeline" aria-label="Experience timeline">
        {journey.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={index}
            isActive={index === activeIndex}
            onActivate={() => onSelect(item.id)}
          />
        ))}
      </div>
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
          title="The school path that brought me here."
          description="My education, projects, and internship experience are the base I am building from now."
        />

        <StatsStrip journey={JOURNEY} />

        <div className="expv4-layout">
          <SpotlightPanel item={activeItem} index={activeIndex} total={JOURNEY.length} />

          <TimelinePanel
            activeIndex={activeIndex}
            journey={JOURNEY}
            onSelect={(id) => {
              setActiveId((current) => (current === id ? current : id));
            }}
          />
        </div>
      </div>
    </section>
  );
}
