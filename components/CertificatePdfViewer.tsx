"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type CertificatePdfViewerProps = {
  url: string;
};

function PdfSkeleton() {
  return (
    <div className="certv3-skeleton">
      <div className="certv3-skeleton-doc" aria-hidden>
        <div className="certv3-skeleton-doc-inner">
          <div className="certv3-sk-header" />
          <div className="certv3-sk-seal" />
          <div className="certv3-sk-lines">
            {[80, 60, 72, 50, 66, 44, 58].map((width, index) => (
              <span
                key={index}
                className="certv3-sk-line"
                style={{ width: `${width}%`, animationDelay: `${index * 0.09}s` }}
              />
            ))}
          </div>
          <div className="certv3-sk-sig-row">
            <div className="certv3-sk-sig" />
            <div className="certv3-sk-sig certv3-sk-sig-alt" />
          </div>
        </div>
      </div>
      <p className="certv3-skeleton-label">Loading certificate…</p>
    </div>
  );
}

export default function CertificatePdfViewer({ url }: CertificatePdfViewerProps) {
  const [loading, setLoading] = useState(true);

  // #toolbar=0&navpanes=0 hides the browser PDF toolbar for a clean embed
  const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <div className="certv3-pdf-viewport">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="skeleton"
            className="certv3-skeleton-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <PdfSkeleton />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="certv3-pdf-doc-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <iframe
          className="certv3-pdf-frame"
          src={iframeSrc}
          title="Certificate PDF preview"
          loading="eager"
          onLoad={() => setLoading(false)}
        />
      </motion.div>
    </div>
  );
}