"use client";

import { scrollToSection } from "@/lib/navigation";
import { profile } from "@/lib/site-data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-shell">
        <div>
          <p className="site-footer-title">
            {profile.name} / Portfolio / {year}
          </p>
          <p className="site-footer-copy">
            Designed and built with Next.js, GSAP, and Framer Motion.
          </p>
        </div>

        <button
          type="button"
          className="text-link"
          onClick={() => scrollToSection("top")}
          data-hover
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
