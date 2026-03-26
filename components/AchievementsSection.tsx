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
            title="Certificates and achievements prepared for image-based preview."
            description="Each card can open a larger preview. For now the canvas stays empty until the real certificate files are added."
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
                    <span className="achievement-chip">{item.type}</span>
                  </div>

                  <div className="achievement-body">
                    <p className="achievement-date">{item.receivedAt}</p>
                    <h3>{item.title}</h3>
                    <p>{item.issuer}</p>
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
