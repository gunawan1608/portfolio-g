"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
    <motion.div
      className="certificate-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        className="certificate-modal-card"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.28 }}
      >
        <div className="certificate-modal-head">
          <div>
            <p className="eyebrow">{certificate.type}</p>
            <h3>{certificate.title}</h3>
          </div>
          <div className="certificate-modal-actions">
            <motion.a
              href={documentUrl}
              target="_blank"
              rel="noreferrer"
              className="button button-primary button-compact"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-hover
            >
              Open PDF
            </motion.a>
            <button
              type="button"
              className="button button-ghost button-compact"
              onClick={onClose}
              data-hover
            >
              Close
            </button>
          </div>
        </div>

        <div className="certificate-modal-preview">
          <iframe
            className="certificate-pdf"
            src={`${documentUrl}#view=FitH`}
            title={`PDF preview for ${certificate.title}`}
          />
        </div>

        <div className="certificate-meta-grid">
          <div>
            <span>Issuer</span>
            <strong>{certificate.issuer}</strong>
          </div>
          <div>
            <span>Received</span>
            <strong>{certificate.receivedAt}</strong>
          </div>
          <div>
            <span>Skills</span>
            <strong>{certificate.skills.join(", ")}</strong>
          </div>
          {certificate.credentialId ? (
            <div>
              <span>Credential ID</span>
              <strong>{certificate.credentialId}</strong>
            </div>
          ) : null}
        </div>

        <p className="certificate-note">{certificate.note}</p>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
