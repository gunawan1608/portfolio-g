"use client";

import { type ReactElement, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { contact, profile } from "@/lib/site-data";

const E = [0.22, 1, 0.36, 1] as const;

const SOCIAL_ICONS: Record<string, ReactElement> = {
  GitHub: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  LinkedIn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
};

const SOCIAL_GRADIENTS: Record<string, string> = {
  GitHub: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  LinkedIn: "linear-gradient(135deg, #0a66c2 0%, #0077b5 100%)",
  Instagram: "linear-gradient(135deg, #833ab4 0%, #e1306c 55%, #fd1d1d 100%)",
};

const SOCIAL_COLORS: Record<string, string> = {
  GitHub: "#ffffff",
  LinkedIn: "#ffffff",
  Instagram: "#ffffff",
};

const CONTACT_FEATURES = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58A16 16 0 0 0 15.42 16.09l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: "Quick reply",
    desc: "I usually answer within a day",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Open to talk",
    desc: "Projects, learning, and early opportunities",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Based in Indonesia",
    desc: "Open to remote conversations",
  },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" ref={sectionRef} className="contact-section section">
      {/* Background decorations */}
      <div className="contact-bg-blob contact-bg-blob--1" aria-hidden />
      <div className="contact-bg-blob contact-bg-blob--2" aria-hidden />

      <div className="container">
        {/* ── Section header ── */}
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: E }}
        >
          <p className="eyebrow contact-eyebrow">{contact.title}</p>
          <h2 className="contact-title">Let&apos;s talk about the next build.</h2>
          <p className="contact-subtitle">{contact.description}</p>
        </motion.div>

        {/* ── Main grid ── */}
        <div className="contact-grid">

          {/* ── Left: Email hero card ── */}
          <motion.div
            className="contact-email-card"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.12, ease: E }}
          >
            {/* Glow accent */}
            <div className="contact-email-glow" aria-hidden />

            <div className="contact-email-top">
              <span className="contact-email-chip">
                <span className="contact-email-chip-dot" />
                Open for opportunities
              </span>
            </div>

            <div className="contact-email-body">
              <p className="contact-email-eyebrow">Reach me directly</p>
              <a
                href={`mailto:${profile.email}`}
                className="contact-email-address"
                data-hover
                aria-label={`Send email to ${profile.email}`}
              >
                {profile.email}
              </a>
            </div>

            <div className="contact-email-actions">
              <motion.a
                href={`mailto:${profile.email}`}
                className="contact-btn-primary"
                data-hover
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Send email
              </motion.a>
              <motion.button
                type="button"
                className={`contact-btn-ghost${copied ? " is-copied" : ""}`}
                onClick={copyEmail}
                data-hover
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </motion.button>
            </div>

            {/* Feature pills */}
            <div className="contact-features">
              {CONTACT_FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="contact-feature"
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.08, ease: E }}
                >
                  <span className="contact-feature-icon">{f.icon}</span>
                  <span className="contact-feature-body">
                    <strong>{f.title}</strong>
                    <span>{f.desc}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Social platform cards ── */}
          <div className="contact-socials-col">
            <motion.p
              className="contact-socials-eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2, ease: E }}
            >
              You can also find me on
            </motion.p>

            <div className="contact-socials-list">
              {profile.socials.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-card"
                  style={{
                    "--social-gradient": SOCIAL_GRADIENTS[social.label] ?? "linear-gradient(135deg, #da291c, #8f1018)",
                    "--social-color": SOCIAL_COLORS[social.label] ?? "#fff",
                  } as React.CSSProperties}
                  initial={{ opacity: 0, x: 24 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.28 + index * 0.1, ease: E }}
                  whileHover={{ x: 4, scale: 1.012 }}
                  whileTap={{ scale: 0.98 }}
                  data-hover
                  aria-label={`${social.label} — ${social.handle}`}
                >
                  <span className="contact-social-icon-wrap">
                    {SOCIAL_ICONS[social.label]}
                  </span>
                  <span className="contact-social-info">
                    <strong className="contact-social-name">{social.label}</strong>
                    <span className="contact-social-handle">{social.handle}</span>
                  </span>
                  <span className="contact-social-arrow" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Bottom CTA nudge */}
            <motion.div
              className="contact-nudge"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.58, ease: E }}
            >
              <div className="contact-nudge-avatar">
                <span>GM</span>
                <span className="contact-nudge-avatar-dot" />
              </div>
              <p className="contact-nudge-text">
                <strong>Gunawan Madia</strong> is open to projects, collaborations, and helpful conversations.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
