"use client";

import { motion } from "framer-motion";

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="section-top">
      <div>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {eyebrow}
        </motion.p>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
        >
          {title}
        </motion.h2>
      </div>
      <motion.p
        className="section-copy"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.16, ease: EASE }}
      >
        {description}
      </motion.p>
    </div>
  );
}