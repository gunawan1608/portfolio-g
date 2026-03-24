"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INTERESTS = [
    "Web development", "UI/UX design", "Open source",
    "Photography", "Music", "Football",
];

const FACTS = [
    { k: "Based in", v: "Indonesia" },
    { k: "Focus", v: "Frontend Dev" },
    { k: "Availability", v: "Open now" },
    { k: "Currently", v: "Building & learning" },
];

export default function AboutSection() {
    const secRef = useRef<HTMLElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            /* ── generic [data-r] reveal ── */
            secRef.current!.querySelectorAll<HTMLElement>("[data-r]").forEach(el => {
                gsap.fromTo(el,
                    { opacity: 0, y: 32 },
                    {
                        opacity: 1, y: 0, duration: 0.82, ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 86%" }
                    }
                );
            });

            /* ── quote block clip-path wipe ── */
            gsap.fromTo(quoteRef.current,
                { clipPath: "inset(0 100% 0 0 round 20px)", opacity: 0 },
                {
                    clipPath: "inset(0 0% 0 0 round 20px)", opacity: 1,
                    duration: 1.1, ease: "power3.out",
                    scrollTrigger: { trigger: quoteRef.current, start: "top 84%" },
                }
            );

            /* ── ambient glow float ── */
            gsap.to(glowRef.current, {
                x: 30, y: -20, duration: 7, ease: "sine.inOut",
                yoyo: true, repeat: -1,
            });

        }, secRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="about" ref={secRef}
            style={{ padding: "110px 28px", maxWidth: 1120, margin: "0 auto", position: "relative" }}>

            {/* subtle glow */}
            <div ref={glowRef} aria-hidden style={{
                position: "absolute", top: "0%", right: "-18%",
                width: 500, height: 500, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(229,160,58,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            {/* Heading */}
            <div data-r className="s-head">
                <div>
                    <p className="lbl" style={{ marginBottom: 10 }}>Who I am</p>
                    <h2 style={{
                        fontFamily: "var(--fd)", fontSize: "clamp(2.2rem,4vw,3.3rem)",
                        letterSpacing: "-0.03em", lineHeight: 1.05,
                        color: "var(--t1)", margin: 0, fontWeight: 300,
                    }}>About Me</h2>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>

                {/* ── Main story card — left, spans 2 rows ── */}
                <div data-r style={{
                    gridRow: "span 2",
                    background: "var(--bg-1)", border: "1px solid var(--bd)",
                    borderRadius: 22, padding: "40px 38px",
                    position: "relative", overflow: "hidden",
                }}>
                    {/* inner top accent */}
                    <div aria-hidden style={{
                        position: "absolute", top: 0, left: 0, right: 0, height: 1,
                        background: "linear-gradient(90deg, transparent, var(--amber), transparent)",
                        opacity: 0.3,
                    }} />

                    <p style={{
                        fontFamily: "var(--fd)", fontWeight: 300,
                        fontSize: "1.55rem", lineHeight: 1.42, letterSpacing: "-0.02em",
                        color: "var(--t1)", margin: "0 0 24px",
                    }}>
                        Hi, I&apos;m Gunawan — a developer from Indonesia
                        who cares about the details.
                    </p>

                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: "var(--t3)", margin: "0 0 18px" }}>
                        I started building for the web out of curiosity and it quickly
                        turned into a genuine obsession. There&apos;s something satisfying
                        about turning ideas into interfaces that people actually use and enjoy.
                    </p>

                    <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: "var(--t3)", margin: 0 }}>
                        My focus is on the frontend — writing clean code, crafting
                        interactions that feel right, and paying attention to the small
                        things that make a product feel polished. I&apos;m always learning,
                        always building.
                    </p>

                    {/* Interests */}
                    <div style={{
                        marginTop: 34, paddingTop: 26,
                        borderTop: "1px solid var(--bd)",
                        display: "flex", flexWrap: "wrap", gap: 8,
                    }}>
                        {INTERESTS.map(item => (
                            <span key={item} className="tag" data-hover
                                style={{ transition: "border-color 0.2s, color 0.2s, background 0.2s" }}
                                onMouseEnter={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "var(--bd-3)";
                                    el.style.color = "var(--t1)";
                                }}
                                onMouseLeave={e => {
                                    const el = e.currentTarget as HTMLElement;
                                    el.style.borderColor = "";
                                    el.style.color = "";
                                }}
                            >{item}</span>
                        ))}
                    </div>
                </div>

                {/* ── Quick facts ── */}
                <div data-r style={{
                    background: "var(--bg-2)", border: "1px solid var(--bd)",
                    borderRadius: 20, padding: 28,
                }}>
                    <p className="lbl" style={{ marginBottom: 20 }}>Quick facts</p>
                    {FACTS.map(({ k, v }, i) => (
                        <div key={k} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            paddingBottom: 14, marginBottom: i < FACTS.length - 1 ? 14 : 0,
                            borderBottom: i < FACTS.length - 1 ? "1px solid var(--bd)" : "none",
                        }}>
                            <span style={{ fontFamily: "var(--fm)", fontSize: "0.72rem", color: "var(--t4)" }}>{k}</span>
                            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--t2)" }}>{v}</span>
                        </div>
                    ))}

                    {/* Available indicator */}
                    <div style={{
                        marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--bd)",
                        display: "flex", alignItems: "center", gap: 9,
                    }}>
                        <span className="dot-g" />
                        <span style={{ fontFamily: "var(--fm)", fontSize: "0.68rem", letterSpacing: "0.08em", color: "var(--t4)" }}>
                            Currently available
                        </span>
                    </div>
                </div>

                {/* ── Quote / dark card ── */}
                <div ref={quoteRef} style={{
                    background: "linear-gradient(145deg, var(--bg-4) 0%, var(--bg-3) 100%)",
                    border: "1px solid var(--bd-2)",
                    borderRadius: 20, padding: 28,
                    display: "flex", flexDirection: "column", gap: 20,
                    position: "relative", overflow: "hidden",
                }}>
                    {/* glow corner */}
                    <div aria-hidden style={{
                        position: "absolute", top: -50, right: -50,
                        width: 180, height: 180, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(229,160,58,0.12) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }} />

                    {/* Opening quote mark */}
                    <span style={{
                        fontFamily: "var(--fd)", fontSize: "4rem", lineHeight: 0.8,
                        color: "rgba(229,160,58,0.18)", userSelect: "none",
                    }}>&ldquo;</span>

                    <p style={{
                        fontFamily: "var(--fd)", fontWeight: 300, fontStyle: "italic",
                        fontSize: "1.2rem", lineHeight: 1.48, letterSpacing: "-0.02em",
                        color: "var(--t2)", margin: 0,
                    }}>
                        Good design is invisible. It just works, and it feels right.
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="dot-g" />
                        <span style={{ fontFamily: "var(--fm)", fontSize: "0.66rem", letterSpacing: "0.1em", color: "var(--t4)" }}>
                            Open to collaborate
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
}