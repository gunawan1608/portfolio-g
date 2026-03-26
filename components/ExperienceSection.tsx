"use client";

import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import { experiences } from "@/lib/site-data";

export default function ExperienceSection() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionIntro
          eyebrow="Experience"
          title="School, internship, and ongoing practice."
          description="This section is separated from achievements so it stays clearer once you start filling it with real details."
        />

        <div className="experience-timeline">
          {experiences.map((item, index) => (
            <motion.article
              key={`${item.title}-${item.period}`}
              className="experience-card"
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <div className="experience-card-top">
                <span className="experience-type">{item.type}</span>
                <span className="experience-period">{item.period}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="experience-organization">{item.organization}</p>
              <p className="experience-summary">{item.summary}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
