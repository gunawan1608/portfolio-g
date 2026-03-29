"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
};

export default function ScrollAnimWrapper({ children, delay = 0 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setIsVisible(true);
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`scroll-anim-wrap${isVisible ? " is-visible" : ""}`}
      style={{ "--scroll-anim-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
