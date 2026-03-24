"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LINKS = [
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const navRef = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
        );

        const fn = () => setScrolled(window.scrollY > 52);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <header
            ref={navRef}
            style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                padding: "14px 0",
                background: scrolled ? "rgba(11,11,10,0.85)" : "transparent",
                backdropFilter: scrolled ? "blur(20px) saturate(1.6)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
                transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
            }}
        >
            <div style={{
                maxWidth: 1120, margin: "0 auto", padding: "0 28px",
                display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>

                {/* Logo */}
                <a href="#top" data-hover
                    style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                    <span style={{
                        width: 36, height: 36, borderRadius: 11,
                        background: "var(--amber)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--fd)", fontSize: "1.1rem", color: "#0b0b0a",
                        fontWeight: 400, flexShrink: 0,
                        boxShadow: "0 0 0 0 rgba(229,160,58,0)",
                        transition: "box-shadow 0.3s",
                    }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(229,160,58,0.35)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(229,160,58,0)"; }}
                    >G</span>
                    <span style={{ fontWeight: 500, fontSize: "0.92rem", letterSpacing: "-0.01em", color: "var(--t1)" }}>
                        Gunawan
                    </span>
                </a>

                {/* Nav */}
                <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {LINKS.map(l => (
                        <a key={l.href} href={l.href} className="nv-link">{l.label}</a>
                    ))}
                </nav>

                {/* CTA */}
                <a href="#contact" className="btn btn-amber" style={{ padding: "8px 22px", fontSize: "0.8rem" }} data-hover>
                    Let&apos;s talk
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                </a>
            </div>
        </header>
    );
}