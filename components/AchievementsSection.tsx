"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CertificateModal from "@/components/CertificateModal";
import SectionIntro from "@/components/SectionIntro";
import { achievements, type AchievementEntry } from "@/lib/site-data";

// A simple sparkle/cert icon rendered via inline SVG
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

  return (
    <>
      <section id="achievements" className="section section-muted">
        <div className="container">
          <SectionIntro
            eyebrow="Achievement"
            title="Certificates backed by the original PDF documents."
            description="Each card opens the real certificate file with its details, key skills, and a readable PDF preview."
          />

          <div className="achievement-grid">
            {achievements.map((item, index) => {
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
                  {/* Top accent strip */}
                  <div className="achievement-strip" />

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