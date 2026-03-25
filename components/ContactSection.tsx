"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "tamagunawan08@gmail.com"; 
const SOCIALS = [
    { label: "GitHub", handle: "github.com/gunawan1608", href: "https://github.com/gunawan1608" },
    { label: "LinkedIn", handle: "linkedin.com/in/Gunawan Madia Pratama", href: "https://www.linkedin.com/in/gunawan-madia-pratama-3172753a5/" },
    { label: "Instagram", handle: "@gm_pratama16", href: "https://instagram.com/gm_pratama16" },
];

export default function ContactSection() {
    const secRef = useRef<HTMLElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const glow2Ref = useRef<HTMLDivElement>(null);
    const bigRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(EMAIL).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2400);
        });
    };

    useEffect(() => {
        const ctx = gsap.context(() => {

            /* ── reveal elements ── */
            secRef.current!.querySelectorAll<HTMLElement>("[data-r]").forEach(el => {
                gsap.fromTo(el,
                    { opacity: 0, y: 28 },
                    {
                        opacity: 1, y: 0, duration: 0.82, ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 86%" }
                    }
                );
            });

            /* ── big heading letter stagger ── */
            gsap.fromTo(".ctah-letter",
                { opacity: 0, y: 40, rotateX: -60 },
                {
                    opacity: 1, y: 0, rotateX: 0,
                    duration: 0.7, ease: "back.out(1.4)", stagger: 0.04,
                    scrollTrigger: { trigger: bigRef.current, start: "top 82%" },
                }
            );

            /* ── ambient glow pulse ── */
            gsap.to(glowRef.current, {
                scale: 1.2, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1,
            });
            gsap.to(glow2Ref.current, {
                scale: 1.15, x: -30, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2,
            });

        }, secRef);

        return () => ctx.revert();
    }, []);

    /* Split "Let's talk" for letter animation */
    const PHRASE = "Let's build it.";

    return (
        <section id="contact" ref={secRef}
            style={{ padding: "110px 28px", maxWidth: 1120, margin: "0 auto", position: "relative" }}>

            {/* Heading */}
            <div data-r className="s-head">
                <div>
                    <p className="lbl" style={{ marginBottom: 10 }}>Get in touch</p>
                    <h2 style={{
                        fontFamily: "var(--fd)", fontSize: "clamp(2.2rem,4vw,3.3rem)",
                        letterSpacing: "-0.03em", lineHeight: 1.05,
                        color: "var(--t1)", margin: 0, fontWeight: 300,
                    }}>Contact</h2>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>

                {/* ── CTA card ── */}
                <div className="cta-card" style={{
                    padding: "44px 40px",
                    display: "flex", flexDirection: "column",
                    justifyContent: "space-between", minHeight: 340,
                    position: "relative",
                }}>
                    {/* Glow blobs */}
                    <div ref={glowRef} aria-hidden style={{
                        position: "absolute", top: -70, right: -70,
                        width: 300, height: 300, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(229,160,58,0.1) 0%, transparent 68%)",
                        pointerEvents: "none",
                    }} />
                    <div ref={glow2Ref} aria-hidden style={{
                        position: "absolute", bottom: -50, left: -50,
                        width: 240, height: 240, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(94,207,189,0.06) 0%, transparent 68%)",
                        pointerEvents: "none",
                    }} />

                    <div ref={bigRef} style={{ position: "relative" }}>
                        <p style={{
                            fontFamily: "var(--fd)", fontWeight: 300,
                            fontSize: "2rem", lineHeight: 1.22, letterSpacing: "-0.03em",
                            color: "var(--t1)", margin: "0 0 18px",
                        }}>
                            Have a project idea?<br />
                            <em style={{ fontStyle: "italic" }}>
                                {PHRASE.split("").map((ch, i) => (
                                    <span key={i} className="ctah-letter" style={{
                                        display: "inline-block",
                                        color: ch === " " ? "transparent" : "var(--amber)",
                                        minWidth: ch === " " ? "0.3em" : undefined,
                                    }}>{ch}</span>
                                ))}
                            </em>
                        </p>
                        <p style={{ fontSize: "0.9rem", lineHeight: 1.76, color: "var(--t3)", margin: 0 }}>
                            I&apos;m always interested in interesting problems,
                            collaborations, and opportunities to create something good together.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 34, alignItems: "center", position: "relative" }}>
                        <a href={`mailto:${EMAIL}`} className="btn btn-amber" data-hover>
                            Send email
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </a>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="dot-g" />
                            <span style={{ fontFamily: "var(--fm)", fontSize: "0.67rem", letterSpacing: "0.09em", color: "var(--t4)" }}>
                                Available now
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Right: email + socials ── */}
                <div data-r style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                    {/* Email row */}
                    <div style={{
                        background: "var(--bg-1)", border: "1px solid var(--bd)",
                        borderRadius: 20, padding: "22px 24px",
                    }}>
                        <p className="lbl" style={{ marginBottom: 9 }}>Primary email</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <a href={`mailto:${EMAIL}`} className="ul" data-hover style={{
                                fontFamily: "var(--fd)", fontWeight: 300,
                                fontSize: "1.05rem", letterSpacing: "-0.01em",
                                color: "var(--t1)", wordBreak: "break-all",
                            }}>{EMAIL}</a>
                            <button onClick={copy} data-hover style={{
                                flexShrink: 0, padding: "5px 14px", borderRadius: 100,
                                border: `1px solid ${copied ? "rgba(94,207,189,0.28)" : "var(--bd-2)"}`,
                                background: copied ? "var(--teal-dim)" : "var(--bg-3)",
                                color: copied ? "var(--teal)" : "var(--t3)",
                                fontFamily: "var(--fm)", fontSize: "0.67rem",
                                cursor: "pointer", letterSpacing: "0.04em",
                                transition: "all 0.2s", outline: "none",
                            }}>{copied ? "Copied ✓" : "Copy"}</button>
                        </div>
                    </div>

                    {/* Social links */}
                    {SOCIALS.map(s => (
                        <a key={s.label} href={s.href} target="_blank" rel="noreferrer" data-hover
                            style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "18px 22px",
                                background: "var(--bg-1)", border: "1px solid var(--bd)",
                                borderRadius: 16,
                                transition: "border-color 0.2s, transform 0.24s var(--ease-out), box-shadow 0.24s",
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.borderColor = "var(--bd-2)";
                                el.style.transform = "translateY(-3px)";
                                el.style.boxShadow = "0 12px 36px rgba(0,0,0,0.28)";
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.borderColor = "var(--bd)";
                                el.style.transform = "translateY(0)";
                                el.style.boxShadow = "none";
                            }}
                        >
                            <span>
                                <span style={{
                                    display: "block", fontFamily: "var(--fm)", fontSize: "0.64rem",
                                    letterSpacing: "0.12em", textTransform: "uppercase",
                                    color: "var(--t4)", marginBottom: 3,
                                }}>{s.label}</span>
                                <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--t2)" }}>
                                    {s.handle}
                                </span>
                            </span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="var(--t4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 17 17 7" /><path d="M8 7h9v9" />
                            </svg>
                        </a>
                    ))}
                </div>

            </div>
        </section>
    );
}