"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CertificateModal from "@/components/CertificateModal";
import SectionIntro from "@/components/SectionIntro";
import { achievements, type AchievementEntry } from "@/lib/site-data";

const MONTH_INDEX: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  mei: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  juli: 6,
  aug: 7,
  august: 7,
  agu: 7,
  agustus: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  okt: 9,
  oktober: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
  des: 11,
  desember: 11,
};

function getAchievementOrder(receivedAt: string) {
  const normalized = receivedAt.trim().toLowerCase().replace(",", "");
  const [monthToken = "", yearToken = "0"] = normalized.split(/\s+/);
  const monthIndex = MONTH_INDEX[monthToken] ?? 0;
  const year = Number.parseInt(yearToken, 10) || 0;

  return year * 12 + monthIndex;
}

function CertIcon({ accent }: { accent: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="9" stroke={accent} strokeWidth="1.5" />
      <circle cx="11" cy="11" r="5.5" fill={accent} fillOpacity="0.15" />
      <path d="M8 11l2 2 4-4" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AchievementsSection() {
  const [activeItem, setActiveItem] = useState<AchievementEntry | null>(null);
  const sortedAchievements = [...achievements].sort(
    (left, right) => getAchievementOrder(left.receivedAt) - getAchievementOrder(right.receivedAt),
  );

  return (
    <>
      <section id="achievements" className="section section-muted">
        <div className="container">
          <SectionIntro
            eyebrow="Achievement"
            title="Training & Certifications."
            description="Certifications earned through training programs, reflecting my continuous growth and dedication in learning technology."
          />

          <div className="achievement-grid">
            {sortedAchievements.map((item, index) => {
              const style = { "--achievement-accent": item.accent } as CSSProperties;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  className="achievement-card"
                  style={style}
                  onClick={() => setActiveItem(item)}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5 }}
                  data-hover
                >
                  {/* NO top accent strip — removed */}

                  {/* Header row */}
                  <div className="achievement-card-header">
                    <div className="achievement-icon-wrap">
                      <CertIcon accent={item.accent} />
                    </div>
                    <span className="achievement-type-pill">{item.type}</span>
                  </div>

                  {/* Body */}
                  <div className="achievement-card-body">
                    <p className="achievement-date">{item.receivedAt}</p>
                    <h3 className="achievement-title">{item.title}</h3>
                    <p className="achievement-issuer">{item.issuer}</p>
                  </div>

                  {/* Skills footer */}
                  <div className="achievement-card-footer">
                    <div className="achievement-skill-list">
                      {item.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="achievement-skill-tag">
                          {skill}
                        </span>
                      ))}
                      {item.skills.length > 3 && (
                        <span className="achievement-skill-tag achievement-skill-more">
                          +{item.skills.length - 3}
                        </span>
                      )}
                    </div>
                    <span className="achievement-view-cta">
                      View
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeItem ? (
          <CertificateModal
            certificate={activeItem}
            onClose={() => setActiveItem(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
