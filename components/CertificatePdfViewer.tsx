"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type CertificatePdfViewerProps = {
  url: string;
};

// If the iframe hasn't fired onLoad within this window, something went
// wrong silently (blocked embed, slow network, unsupported viewer) — show
// a way out instead of leaving the skeleton spinning forever.
const LOAD_TIMEOUT_MS = 7000;

function PdfSkeleton({ timedOut, url }: { timedOut: boolean; url: string }) {
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

      {timedOut ? (
        <div className="certv3-pdf-fallback" role="status">
          <p>Taking longer than expected to load the preview.</p>
          <a href={url} target="_blank" rel="noreferrer">
            Open the PDF directly instead
          </a>
        </div>
      ) : (
        <p className="certv3-skeleton-label">Loading certificate…</p>
      )}
    </div>
  );
}

export default function CertificatePdfViewer({ url }: CertificatePdfViewerProps) {
  const [loading, setLoading] = useState(true);
  const [shouldMountFrame, setShouldMountFrame] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // #toolbar=0&navpanes=0 hides the browser PDF toolbar for a clean embed
  const iframeSrc = `${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  useEffect(() => {
    setLoading(true);
    setShouldMountFrame(false);
    setTimedOut(false);

    const mountTimer = window.setTimeout(() => {
      setShouldMountFrame(true);
    }, 180);

    const timeoutTimer = window.setTimeout(() => {
      setTimedOut(true);
    }, LOAD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(mountTimer);
      window.clearTimeout(timeoutTimer);
    };
  }, [url]);

  return (
    <div className="certv3-pdf-viewport">
      <AnimatePresence>
        {loading || !shouldMountFrame ? (
          <motion.div
            key="skeleton"
            className="certv3-skeleton-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <PdfSkeleton timedOut={timedOut} url={url} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="certv3-pdf-doc-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        {shouldMountFrame ? (
          <iframe
            className="certv3-pdf-frame"
            src={iframeSrc}
            title="Certificate PDF preview"
            loading="lazy"
            onLoad={() => {
              window.requestAnimationFrame(() => setLoading(false));
            }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
