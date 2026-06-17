"use client";

import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import AboutIdentityCard from "@/components/AboutIdentityCard";
import { profile } from "@/lib/site-data";

export default function AboutSection() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionIntro
          eyebrow="About"
          title="A short note about how I learn and build."
          description="I care about simple structure, readable code, and details that make a page feel easier to use."
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

        <AboutIdentityCard />
      </div>
    </section>
  );
}
