"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import type { AchievementEntry } from "@/lib/site-data";

const CertificatePdfViewer = dynamic(() => import("@/components/CertificatePdfViewer"), {
  ssr: false,
});

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

  useEffect(() => {
    setMounted(true);

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

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="certv3-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          className="certv3-shell"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* LEFT: clean PDF viewer */}
          <div className="certv3-viewer">
            <CertificatePdfViewer url={documentUrl} />
          </div>

          {/* RIGHT: info sidebar */}
          <div className="certv3-sidebar">
            <button
              type="button"
              className="certv3-close"
              onClick={onClose}
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1l10 10M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="certv3-sidebar-inner">
              <span
                className="certv3-type-badge"
                style={{ borderColor: certificate.accent, color: certificate.accent }}
              >
                {certificate.type}
              </span>

              <h2 className="certv3-title">{certificate.title}</h2>

              <div className="certv3-accent-rule" style={{ background: certificate.accent }} />

              <dl className="certv3-meta">
                <div className="certv3-meta-row">
                  <dt>Issued by</dt>
                  <dd>{certificate.issuer}</dd>
                </div>
                <div className="certv3-meta-row">
                  <dt>Date</dt>
                  <dd>{certificate.receivedAt}</dd>
                </div>
                {certificate.credentialId ? (
                  <div className="certv3-meta-row">
                    <dt>Credential ID</dt>
                    <dd className="certv3-credential">{certificate.credentialId}</dd>
                  </div>
                ) : null}
              </dl>

              <div className="certv3-skills-block">
                <p className="certv3-skills-label">Skills covered</p>
                <div className="certv3-chips">
                  {certificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="certv3-chip"
                      style={{
                        background: `${certificate.accent}12`,
                        borderColor: `${certificate.accent}30`,
                        color: certificate.accent,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {certificate.note ? <p className="certv3-note">{certificate.note}</p> : null}

              {/* Opens PDF in new tab — browser handles it natively, fast */}
              <a
                href={documentUrl}
                target="_blank"
                rel="noreferrer"
                className="certv3-open-btn"
                style={{ background: certificate.accent }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path
                    d="M2 11L11 2M11 2H5.5M11 2v5.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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