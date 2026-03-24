"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroSection() {
    const secRef = useRef<HTMLElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const glow2Ref = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const numRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* Gradient line reveal */
            gsap.fromTo(lineRef.current,
                { scaleX: 0, transformOrigin: "left center" },
                { scaleX: 1, duration: 1.8, ease: "power4.out", delay: 0.95 }
            );

            /* Ambient glow drift */
            gsap.to(glowRef.current, {
                x: 50, y: -40,
                duration: 9, ease: "sine.inOut",
                yoyo: true, repeat: -1,
            });
            gsap.to(glow2Ref.current, {
                x: -40, y: 30,
                duration: 11, ease: "sine.inOut",
                yoyo: true, repeat: -1, delay: 1.5,
            });

            /* Large decorative number count up */
            const obj = { val: 0 };
            gsap.to(obj, {
                val: 3,
                duration: 1.8,
                ease: "power2.out",
                delay: 0.8,
                onUpdate: () => {
                    if (numRef.current)
                        numRef.current.textContent = Math.floor(obj.val).toString().padStart(2, "0");
                },
            });

            /* Subtle parallax on scroll */
            gsap.to(secRef.current!.querySelector(".hero-bg-txt"), {
                y: 120,
                ease: "none",
                scrollTrigger: {
                    trigger: secRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.2,
                },
            });
        }, secRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="top" ref={secRef} style={{
            minHeight: "100svh", position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "120px 28px 90px", maxWidth: 1120, margin: "0 auto",
        }}>

            {/* Ambient glows */}
            <div ref={glowRef} aria-hidden style={{
                position: "absolute", top: "5%", right: "-10%",
                width: 680, height: 680, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(229,160,58,0.065) 0%, transparent 68%)",
                pointerEvents: "none",
            }} />
            <div ref={glow2Ref} aria-hidden style={{
                position: "absolute", bottom: "10%", left: "-12%",
                width: 500, height: 500, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(94,207,189,0.04) 0%, transparent 68%)",
                pointerEvents: "none",
            }} />

            {/* Grid overlay */}
            <div aria-hidden style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)",
            }} />

            {/* Large bg word — parallax target */}
            <span className="hero-bg-txt" aria-hidden style={{
                position: "absolute", bottom: "-4%", right: "-2%",
                fontFamily: "var(--fd)", fontWeight: 200,
                fontSize: "clamp(8rem, 22vw, 22rem)",
                lineHeight: 1, letterSpacing: "-0.05em",
                color: "rgba(255,255,255,0.022)",
                userSelect: "none", pointerEvents: "none",
                whiteSpace: "nowrap",
            }}>BUILD</span>

            {/* Status pill */}
            <div className="r1" style={{ marginBottom: 52 }}>
                <span style={{
                    display: "inline-flex", alignItems: "center", gap: 9,
                    padding: "7px 16px 7px 11px", borderRadius: 100,
                    border: "1px solid var(--bd-2)", background: "var(--bg-2)",
                }}>
                    <span className="dot-g" />
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.7rem", letterSpacing: "0.1em", color: "var(--teal)" }}>
                        Open to opportunities
                    </span>
                    <span style={{ width: 1, height: 13, background: "var(--bd-2)", margin: "0 4px" }} />
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.7rem", letterSpacing: "0.07em", color: "var(--t4)" }}>
                        Indonesia
                    </span>
                </span>
            </div>

            {/* Label */}
            <div className="r2">
                <p className="lbl" style={{ marginBottom: 18 }}>Developer &amp; Creator</p>
            </div>

            {/* Headline */}
            <div className="r3" style={{ marginBottom: 0 }}>
                <h1 style={{
                    fontFamily: "var(--fd)",
                    fontSize: "clamp(3.8rem, 9vw, 8.5rem)",
                    lineHeight: 0.92, letterSpacing: "-0.035em",
                    color: "var(--t1)", margin: 0, fontWeight: 300,
                }}>
                    Gunawan<br />
                    <em style={{ fontStyle: "italic", color: "var(--amber)" }}>Madia</em>{" "}
                    <span style={{ color: "var(--t3)", fontWeight: 200 }}>Pratama</span>
                </h1>
            </div>

            {/* Animated rule */}
            <div style={{ margin: "38px 0", height: 1, background: "var(--bd)", overflow: "hidden" }}>
                <div ref={lineRef} style={{
                    height: 1,
                    background: "linear-gradient(90deg, var(--amber) 0%, var(--teal) 60%, transparent 100%)",
                }} />
            </div>

            {/* Bottom row */}
            <div className="r4" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 56, alignItems: "end" }}>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.76, color: "var(--t3)", maxWidth: 520, margin: 0 }}>
                    I build things for the web — focused on clean interfaces,
                    thoughtful interactions, and experiences that actually work well.
                </p>
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                    <a href="#projects" className="btn btn-amber" data-hover>
                        View work
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                    </a>
                    <a href="#contact" className="btn btn-ghost" data-hover>Contact</a>
                </div>
            </div>

            {/* Bottom stats row */}
            <div className="r5" style={{
                marginTop: 68, paddingTop: 32,
                borderTop: "1px solid var(--bd)",
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
                gap: 0,
            }}>
                {[
                    { val: <><span ref={numRef}>00</span>+</>, sub: "Years building for the web" },
                    { val: "10+", sub: "Projects shipped & counting" },
                    { val: "∞", sub: "Curiosity & obsession to craft" },
                ].map((s, i) => (
                    <div key={i} style={{
                        padding: "0 28px",
                        borderRight: i < 2 ? "1px solid var(--bd)" : "none",
                        paddingLeft: i === 0 ? 0 : 28,
                    }}>
                        <p style={{
                            fontFamily: "var(--fd)", fontWeight: 200,
                            fontSize: "2.5rem", lineHeight: 1, letterSpacing: "-0.04em",
                            color: "var(--t1)", margin: "0 0 8px",
                        }}>{s.val}</p>
                        <p className="lbl">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Scroll hint */}
            <div className="r5" style={{
                position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
            }}>
                <span className="lbl" style={{ fontSize: "0.58rem" }}>scroll</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="var(--t4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ animation: "bounce-d 2s ease-in-out infinite" }}>
                    <style>{`@keyframes bounce-d{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}`}</style>
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </section>
    );
}