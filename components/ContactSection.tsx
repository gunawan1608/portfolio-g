"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionIntro from "@/components/SectionIntro";
import { contact, profile } from "@/lib/site-data";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="section section-muted">
      <div className="container">
        <SectionIntro
          eyebrow={contact.title}
          title="Get in touch."
          description={contact.description}
        />

        <div className="contact-layout">
          <motion.article
            className="contact-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow">Email</p>
            <a href={`mailto:${profile.email}`} className="contact-email" data-hover>
              {profile.email}
            </a>
            <div className="contact-actions">
              <a href={`mailto:${profile.email}`} className="button button-primary" data-hover>
                Send Email
              </a>
              <button
                type="button"
                className="button button-ghost button-compact"
                onClick={copyEmail}
                data-hover
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </motion.article>

          <div className="contact-links">
            {profile.socials.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="contact-link-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                data-hover
              >
                <span className="contact-link-label">{social.label}</span>
                <strong>{social.handle}</strong>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
