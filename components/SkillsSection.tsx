"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import { skillGroups } from "@/lib/site-data";

export default function SkillsSection() {
  return (
    <section id="skills" className="section section-muted">
      <div className="container">
        <SectionIntro
          eyebrow="Skills"
          title="The tools and areas I use most often."
          description="I kept this part focused so it reads quickly and stays useful once the rest of the portfolio is filled with real work."
        />

        <div className="skill-grid">
          {skillGroups.map((group, index) => {
            const style = { "--skill-accent": group.accent } as CSSProperties;

            return (
              <motion.article
                key={group.title}
                className="skill-card"
                style={style}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <span className="skill-accent-line" aria-hidden />
                <p className="eyebrow">{group.title}</p>
                <p className="skill-summary">{group.summary}</p>
                <div className="tag-group">
                  {group.skills.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
