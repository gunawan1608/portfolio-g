"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";

type Skill = {
  name: string;
  icon: string;
  color: string;
  logoSrc?: string;
};

type SkillCategory = {
  title: string;
  accent: string;
  skills: Skill[];
};

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Web Development",
    accent: "#2f8a57",
    skills: [
      { name: "PHP", icon: "php", color: "#777bb3" },
      { name: "JavaScript", icon: "javascript", color: "#f7df1e" },
      { name: "Laravel", icon: "laravel", color: "#ff2d20" },
      { name: "React", icon: "react", color: "#61dafb" },
      { name: "Python", icon: "python", color: "#3776ab" },
    ],
  },
  {
    title: "Mobile & Game Dev",
    accent: "#0ea5e9",
    skills: [
      { name: "Dart", icon: "dart", color: "#00b4ab" },
      { name: "Flutter", icon: "flutter", color: "#02569b" },
      { name: "Godot", icon: "godot", color: "#478cbf" },
    ],
  },
  {
    title: "Desktop Development",
    accent: "#8b5cf6",
    skills: [
      { name: "C#", icon: "csharp", color: "#512bd4" },
    ],
  },
  {
    title: "Tools & Infrastructure",
    accent: "#f59e0b",
    skills: [
      { name: "MySQL", icon: "mysql", color: "#4479a1" },
      { name: "SQL Server", icon: "microsoftsqlserver", color: "#cc2927" },
      { name: "Git", icon: "git", color: "#f05032" },
      { name: "GitHub", icon: "github", color: "#181717" },
      { name: "Vercel", icon: "vercel", color: "#000000" },
      { name: "Cisco", icon: "cisco", color: "#1ba0d7", logoSrc: "/brands/cisco.svg" },
    ],
  },
];

function SkillIcon({ skill, delay }: { skill: Skill; delay: number }) {
  const iconSrc =
    skill.logoSrc ??
    `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.icon}/${skill.icon}-original.svg`;

  return (
    <motion.div
      className="skill-item"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.06 }}
      data-hover
    >
      <div
        className="skill-item-icon"
        style={{ "--skill-icon-color": skill.color } as CSSProperties}
      >
        <img
          src={iconSrc}
          alt={skill.name}
          width={30}
          height={30}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = "none";
            const parent = img.parentElement;
            if (parent && !parent.querySelector(".skill-icon-fallback")) {
              const span = document.createElement("span");
              span.className = "skill-icon-fallback";
              span.textContent = skill.name.slice(0, 2).toUpperCase();
              parent.appendChild(span);
            }
          }}
        />
      </div>
      <span className="skill-item-name">{skill.name}</span>
    </motion.div>
  );
}

function CategoryCard({ category, index }: { category: SkillCategory; index: number }) {
  return (
    <motion.article
      className="skill-category-card"
      style={{ "--skill-accent": category.accent } as CSSProperties}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="skill-category-header">
        <span className="skill-accent-bar" aria-hidden />
        <p className="eyebrow">{category.title}</p>
      </div>

      <div className="skill-items-grid">
        {category.skills.map((skill, si) => (
          <SkillIcon
            key={skill.name}
            skill={skill}
            delay={index * 0.08 + si * 0.055}
          />
        ))}
      </div>
    </motion.article>
  );
}

export default function SkillsSection() {
  return (
    <section id="skills" className="section section-muted">
      <div className="container">
        <SectionIntro
          eyebrow="Skills"
          title="Technologies I work with."
          description="From frontend to backend, mobile to desktop — tools I use to build meaningful products."
        />

        <div className="skill-categories-grid">
          {SKILL_CATEGORIES.map((category, index) => (
            <CategoryCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
