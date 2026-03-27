"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      className="cert-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        className="cert-panel"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left column: PDF viewer */}
        <div className="cert-viewer">
          <div className="cert-viewer-toolbar">
            <span className="cert-viewer-dot" style={{ background: "#ff5f57" }} />
            <span className="cert-viewer-dot" style={{ background: "#febc2e" }} />
            <span className="cert-viewer-dot" style={{ background: "#28c840" }} />
            <span className="cert-viewer-filename">{certificate.documentSlug}.pdf</span>
          </div>
          <iframe
            className="cert-iframe"
            src={`${documentUrl}#view=FitH&toolbar=0&navpanes=0`}
            title={`PDF preview for ${certificate.title}`}
          />
        </div>

        {/* Right column: metadata sidebar */}
        <div className="cert-sidebar">
          {/* Close button */}
          <button
            type="button"
            className="cert-close"
            onClick={onClose}
            aria-label="Close"
            data-hover
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <div className="cert-sidebar-inner">
            {/* Type badge */}
            <span className="cert-type-badge">{certificate.type}</span>

            {/* Title */}
            <h2 className="cert-title">{certificate.title}</h2>

            {/* Issuer */}
            <div className="cert-meta-row">
              <span className="cert-meta-label">Issued by</span>
              <span className="cert-meta-value">{certificate.issuer}</span>
            </div>

            <div className="cert-meta-row">
              <span className="cert-meta-label">Date</span>
              <span className="cert-meta-value">{certificate.receivedAt}</span>
            </div>

            {certificate.credentialId && (
              <div className="cert-meta-row">
                <span className="cert-meta-label">Credential ID</span>
                <span className="cert-meta-value cert-meta-mono">{certificate.credentialId}</span>
              </div>
            )}

            {/* Divider */}
            <div className="cert-divider" />

            {/* Skills */}
            <div>
              <span className="cert-meta-label">Key Skills</span>
              <div className="cert-skill-chips">
                {certificate.skills.map((skill) => (
                  <span key={skill} className="cert-chip">{skill}</span>
                ))}
              </div>
            </div>

            {/* Note */}
            {certificate.note && (
              <p className="cert-note">{certificate.note}</p>
            )}

            {/* CTA */}
            <a
              href={documentUrl}
              target="_blank"
              rel="noreferrer"
              className="cert-open-btn"
              data-hover
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 13L13 2M13 2H6M13 2V9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Open Full PDF
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}