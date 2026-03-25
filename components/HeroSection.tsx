"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SplitChars({ text, className }: { text: string; className?: string }) {
    return (
        <span className={className} aria-label={text}>
            {text.split("").map((ch, i) => (
                <span key={i} className="char" aria-hidden style={{ display: "inline-block" }}>
                    {ch === " " ? "\u00a0" : ch}
                </span>
            ))}
        </span>
    );
}

export default function HeroSection() {
    const secRef = useRef<HTMLElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const glow2Ref = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const numRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const sec = secRef.current!;

            /* 1. Character stagger for "Gunawan" */
            const chars = sec.querySelectorAll<HTMLElement>(".hs-split .char");
            gsap.fromTo(chars,
                { yPercent: 120, opacity: 0, rotateZ: 3 },
                {
                    yPercent: 0, opacity: 1, rotateZ: 0,
                    duration: 0.85, ease: "power4.out",
                    stagger: { each: 0.022 },
                    delay: 0.3,
                }
            );

            /* 2. "Madia" clip wipe */
            gsap.fromTo(".hs-italic",
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "power4.out", delay: 0.52 }
            );

            /* 3. "Pratama" slide up */
            gsap.fromTo(".hs-last",
                { y: 24, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.62 }
            );

            /* 4. Rule line */
            gsap.fromTo(lineRef.current,
                { scaleX: 0, transformOrigin: "left center" },
                { scaleX: 1, duration: 1.7, ease: "power4.out", delay: 0.88 }
            );

            /* 5. Glow drift */
            gsap.to(glowRef.current, { x: 65, y: -55, duration: 10, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to(glow2Ref.current, { x: -50, y: 40, duration: 13, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 });

            /* 6. Year counter */
            const obj = { v: 0 };
            gsap.to(obj, {
                v: 3, duration: 2.0, ease: "power2.out", delay: 0.9,
                onUpdate: () => {
                    if (numRef.current) numRef.current.textContent = Math.floor(obj.v).toString().padStart(2, "0");
                },
            });

            /* 7. BG word parallax */
            gsap.to(".hs-bgword", {
                y: 140, ease: "none",
                scrollTrigger: { trigger: sec, start: "top top", end: "bottom top", scrub: 1.3 },
            });

            /* 8. Content fades out on deep scroll */
            gsap.to(".hs-content", {
                opacity: 0, y: -28, ease: "none",
                scrollTrigger: { trigger: sec, start: "55% top", end: "bottom top", scrub: 0.7 },
            });

        }, secRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="top" ref={secRef}
            style={{
                minHeight: "100svh", position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column", justifyContent: "center"
            }}>

            {/* Ambient glows */}
            <div ref={glowRef} aria-hidden style={{
                position: "absolute", top: "4%", right: "-12%",
                width: 720, height: 720, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(229,160,58,0.056) 0%, transparent 68%)",
                pointerEvents: "none",
            }} />
            <div ref={glow2Ref} aria-hidden style={{
                position: "absolute", bottom: "6%", left: "-14%",
                width: 560, height: 560, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(94,207,189,0.034) 0%, transparent 68%)",
                pointerEvents: "none",
            }} />

            {/* Grid lines */}
            <div aria-hidden style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: "linear-gradient(rgba(255,255,255,0.019) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.019) 1px, transparent 1px)",
                backgroundSize: "64px 64px",
                maskImage: "radial-gradient(ellipse 88% 88% at 50% 50%, black 18%, transparent 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 88% 88% at 50% 50%, black 18%, transparent 100%)",
            }} />

            {/* BG word */}
            <span className="hs-bgword" aria-hidden style={{
                position: "absolute", bottom: "-10%", right: "-5%",
                fontFamily: "var(--fd)", fontWeight: 200,
                fontSize: "clamp(9rem, 24vw, 24rem)",
                lineHeight: 1, letterSpacing: "-0.055em",
                color: "rgba(255,255,255,0.017)",
                userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
            }}>CRAFT</span>

            {/* Main content */}
            <div className="hs-content" style={{ maxWidth: 1120, margin: "0 auto", padding: "120px 28px 90px", width: "100%" }}>

                {/* Status — plain inline, no pill */}
                <div className="r1 status-row" style={{ marginBottom: 58 }}>
                    <div className="status-avail">
                        <span className="dot-g" />
                        <span style={{ fontFamily: "var(--fm)", fontSize: "0.7rem", letterSpacing: "0.14em", color: "var(--t3)" }}>
                            Available for work
                        </span>
                    </div>
                    <span style={{ width: 1, height: 11, background: "var(--bd-2)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.7rem", letterSpacing: "0.14em", color: "var(--t4)" }}>
                        Jakarta, Indonesia
                    </span>
                    <span style={{ width: 1, height: 11, background: "var(--bd-2)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.7rem", letterSpacing: "0.14em", color: "var(--t4)" }}>
                        Frontend Developer
                    </span>
                </div>

                <p className="lbl r2" style={{ marginBottom: 18 }}>Developer &amp; Creator</p>

                {/* Headline */}
                <h1 style={{
                    fontFamily: "var(--fd)",
                    fontSize: "clamp(4rem, 9.5vw, 9.2rem)",
                    lineHeight: 0.91, letterSpacing: "-0.038em",
                    color: "var(--t1)", margin: "0 0 0", fontWeight: 300,
                    overflow: "hidden",
                }}>
                    {/* Line 1: split chars */}
                    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.06em" }}>
                        <SplitChars text="Gunawan" className="hs-split" />
                    </span>
                    {/* Line 2 */}
                    <span style={{ display: "block" }}>
                        <em className="hs-italic" style={{
                            fontStyle: "italic", color: "var(--amber)",
                            display: "inline-block",
                        }}>Madia</em>{" "}
                        <span className="hs-last" style={{ color: "var(--t3)", fontWeight: 200, display: "inline-block" }}>
                            Pratama
                        </span>
                    </span>
                </h1>

                {/* Rule */}
                <div style={{ margin: "42px 0", height: 1, background: "var(--bd)", overflow: "hidden" }}>
                    <div ref={lineRef} style={{
                        height: 1,
                        background: "linear-gradient(90deg, var(--amber) 0%, rgba(94,207,189,0.55) 55%, transparent 100%)",
                    }} />
                </div>

                {/* Bottom grid */}
                <div className="r4" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 60, alignItems: "end" }}>
                    <p style={{ fontSize: "1.1rem", lineHeight: 1.77, color: "var(--t3)", maxWidth: 520, margin: 0 }}>
                        I build things for the web — focused on clean interfaces,
                        thoughtful interactions, and experiences that actually work well.
                    </p>
                    <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                        <a href="#projects" className="btn btn-amber" data-hover>
                            View work
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                        </a>
                        <a href="#contact" className="btn btn-ghost" data-hover>Contact</a>
                    </div>
                </div>

                {/* Stats */}
                <div className="r5" style={{
                    marginTop: 74, paddingTop: 32, borderTop: "1px solid var(--bd)",
                    display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                }}>
                    {[
                        { val: <><span ref={numRef}>00</span>+</>, sub: "Years building" },
                        { val: "10+", sub: "Projects shipped" },
                        { val: "∞", sub: "Always learning" },
                    ].map((s, i) => (
                        <div key={i} style={{
                            padding: "0 32px",
                            borderRight: i < 2 ? "1px solid var(--bd)" : "none",
                            paddingLeft: i === 0 ? 0 : 32,
                        }}>
                            <p style={{
                                fontFamily: "var(--fd)", fontWeight: 200,
                                fontSize: "2.6rem", lineHeight: 1, letterSpacing: "-0.045em",
                                color: "var(--t1)", margin: "0 0 8px",
                            }}>{s.val}</p>
                            <p className="lbl">{s.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll hint */}
            <div style={{
                position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                animation: "rise 0.7s var(--ease-out) 1.5s both",
                opacity: 0,
            }}>
                <span style={{ fontFamily: "var(--fm)", fontSize: "0.56rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--t5)" }}>
                    scroll
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ animation: "bd 2.2s ease-in-out infinite" }}>
                    <style>{`@keyframes bd{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}`}</style>
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </section>
    );
}