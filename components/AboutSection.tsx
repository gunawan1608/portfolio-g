"use client";

import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import { profile } from "@/lib/site-data";

export default function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionIntro
          eyebrow="About Me"
          title="A short introduction about the way I work."
          description="I prefer clean presentation, clear structure, and small details that make a page feel more complete."
        />

        <div className="about-grid">
          <motion.article
            className="about-card about-card-main"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <p className="about-lead">{profile.about}</p>
          </motion.article>

          <motion.article
            className="about-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <p className="eyebrow">Current Focus</p>
            <ul className="about-list">
              {profile.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
