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
      <p className="certv3-skeleton-label">Loading certificate...</p>
    </div>
  );
}

export default function CertificatePdfViewer({ url }: CertificatePdfViewerProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="certv3-pdf-viewport">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="skeleton"
            className="certv3-skeleton-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <PdfSkeleton />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="certv3-pdf-doc-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <iframe
          className="certv3-pdf-frame"
          src={`${url}#view=FitH`}
          title="Certificate PDF preview"
          onLoad={() => setLoading(false)}
        />
      </motion.div>
    </div>
  );
}
