"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CertificateModal from "@/components/CertificateModal";
import SectionIntro from "@/components/SectionIntro";
import { achievements, type AchievementEntry } from "@/lib/site-data";

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
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  data-hover
                >
                  <div className="achievement-preview" aria-hidden>
                    <div className="achievement-preview-sheet">
                      <span className="achievement-preview-label">PDF document</span>
                      <strong>{item.skills.join(" / ")}</strong>
                    </div>
                    <span className="achievement-chip">{item.type}</span>
                  </div>

                  <div className="achievement-body">
                    <p className="achievement-date">{item.receivedAt}</p>
                    <h3>{item.title}</h3>
                    <p>{item.issuer}</p>

                    <div className="achievement-skill-list">
                      {item.skills.map((skill) => (
                        <span key={skill} className="achievement-skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {item.credentialId ? (
                      <p className="achievement-credential">
                        Credential ID {item.credentialId}
                      </p>
                    ) : null}
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
