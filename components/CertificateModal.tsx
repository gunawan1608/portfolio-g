"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { AchievementEntry } from "@/lib/site-data";

type CertificateModalProps = {
  certificate: AchievementEntry;
  onClose: () => void;
};

export default function CertificateModal({
  certificate,
  onClose,
}: CertificateModalProps) {
  const documentUrl = `/documents/${certificate.documentSlug}`;
  const [mounted, setMounted] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="certv2-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="certv2-shell"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── LEFT: PDF viewer ── */}
          <div className="certv2-viewer">
            {!pdfLoaded && (
              <div className="certv2-skeleton">
                <div className="certv2-skeleton-shimmer">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span
                      key={i}
                      className="certv2-skeleton-line"
                      style={{ width: `${60 + (i % 3) * 15}%`, animationDelay: `${i * 0.07}s` }}
                    />
                  ))}
                </div>
                <p className="certv2-skeleton-label">Loading document…</p>
              </div>
            )}
            <iframe
              className="certv2-iframe"
              src={`${documentUrl}#view=FitH`}
              title={`Certificate: ${certificate.title}`}
              onLoad={() => setPdfLoaded(true)}
              style={{ opacity: pdfLoaded ? 1 : 0 }}
            />
          </div>

          {/* ── RIGHT: sidebar ── */}
          <div className="certv2-sidebar">
            {/* close */}
            <button
              type="button"
              className="certv2-close"
              onClick={onClose}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="certv2-sidebar-inner">
              {/* type badge */}
              <span
                className="certv2-type-badge"
                style={{ borderColor: certificate.accent, color: certificate.accent }}
              >
                {certificate.type}
              </span>

              {/* title — large editorial */}
              <h2 className="certv2-title">{certificate.title}</h2>

              {/* accent rule */}
              <div
                className="certv2-accent-rule"
                style={{ background: certificate.accent }}
              />

              {/* meta stack */}
              <dl className="certv2-meta">
                <div className="certv2-meta-row">
                  <dt>Issued by</dt>
                  <dd>{certificate.issuer}</dd>
                </div>
                <div className="certv2-meta-row">
                  <dt>Date</dt>
                  <dd>{certificate.receivedAt}</dd>
                </div>
                {certificate.credentialId && (
                  <div className="certv2-meta-row">
                    <dt>Credential ID</dt>
                    <dd className="certv2-credential">{certificate.credentialId}</dd>
                  </div>
                )}
              </dl>

              {/* skills */}
              <div className="certv2-skills-block">
                <p className="certv2-skills-label">Skills covered</p>
                <div className="certv2-chips">
                  {certificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="certv2-chip"
                      style={{
                        background: `${certificate.accent}10`,
                        borderColor: `${certificate.accent}28`,
                        color: certificate.accent,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* note */}
              {certificate.note && (
                <p className="certv2-note">{certificate.note}</p>
              )}

              {/* CTA */}
              <a
                href={documentUrl}
                target="_blank"
                rel="noreferrer"
                className="certv2-open-btn"
                style={{
                  background: certificate.accent,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 12L12 2M12 2H6M12 2v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Open full PDF
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}