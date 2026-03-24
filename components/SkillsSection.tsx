"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GROUPS = [
    {
        label: "Frontend",
        icon: "⬡",
        skills: [
            { name: "React / Next.js", pct: 88 },
            { name: "TypeScript", pct: 82 },
            { name: "Tailwind CSS", pct: 90 },
            { name: "HTML & CSS", pct: 94 },
        ],
    },
    {
        label: "Motion & Design",
        icon: "◈",
        skills: [
            { name: "GSAP", pct: 72 },
            { name: "Figma", pct: 78 },
            { name: "CSS Animations", pct: 85 },
            { name: "Framer Motion", pct: 66 },
        ],
    },
    {
        label: "Backend & Tools",
        icon: "◎",
        skills: [
            { name: "Node.js", pct: 70 },
            { name: "Git & GitHub", pct: 84 },
            { name: "REST APIs", pct: 76 },
            { name: "PostgreSQL", pct: 62 },
        ],
    },
];

const MARQUEE_ITEMS = [
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
    "GSAP", "Figma", "PostgreSQL", "Git", "REST API", "Framer Motion", "CSS",
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
    "GSAP", "Figma", "PostgreSQL", "Git", "REST API", "Framer Motion", "CSS",
];

export default function SkillsSection() {
    const secRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            /* ── parallax bg word ── */
            gsap.to(bgRef.current, {
                y: -100, ease: "none",
                scrollTrigger: {
                    trigger: secRef.current,
                    start: "top bottom", end: "bottom top",
                    scrub: 1.8,
                },
            });

            /* ── ambient glow drift ── */
            gsap.to(glowRef.current, {
                x: -60, y: 40, duration: 10, ease: "sine.inOut",
                yoyo: true, repeat: -1,
            });

            /* ── heading entrance ── */
            gsap.fromTo(".sk-hd",
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
                    stagger: 0.1,
                    scrollTrigger: { trigger: ".sk-head", start: "top 83%" }
                }
            );

            /* ── group cards stagger + slight y clip ── */
            gsap.fromTo(".sk-grp",
                { opacity: 0, y: 44, clipPath: "inset(0 0 30px 0 round 18px)" },
                {
                    opacity: 1, y: 0, clipPath: "inset(0 0 0px 0 round 18px)",
                    duration: 0.85, ease: "power3.out", stagger: 0.14,
                    scrollTrigger: { trigger: ".sk-groups", start: "top 77%" },
                }
            );

            /* ── skill bars animate ── */
            const fills = secRef.current!.querySelectorAll<HTMLElement>(".sk-fill");
            const pcts = secRef.current!.querySelectorAll<HTMLElement>("[data-pct]");
            gsap.fromTo(fills,
                { width: "0%" },
                {
                    width: (_i, el) => {
                        const parent = el.closest("[data-pct]") as HTMLElement | null;
                        return (parent?.dataset.pct ?? "0") + "%";
                    },
                    duration: 1.3, ease: "power3.out", stagger: 0.05,
                    scrollTrigger: { trigger: ".sk-groups", start: "top 72%" },
                }
            );

            /* ── counter numbers ── */
            secRef.current!.querySelectorAll<HTMLElement>("[data-count]").forEach(el => {
                const target = parseInt(el.dataset.count ?? "0", 10);
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target, duration: 1.4, ease: "power2.out",
                    scrollTrigger: { trigger: el, start: "top 80%" },
                    onUpdate: () => { el.textContent = Math.round(obj.val) + "%"; },
                });
            });

        }, secRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="skills" ref={secRef} className="s-bg"
            style={{ padding: "110px 28px", position: "relative", overflow: "hidden" }}>

            {/* Ambient glow */}
            <div ref={glowRef} aria-hidden style={{
                position: "absolute", top: "20%", right: "-15%",
                width: 600, height: 600, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(94,207,189,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            {/* Parallax bg word */}
            <div ref={bgRef} aria-hidden style={{
                position: "absolute", top: "38%", left: "50%",
                transform: "translate(-50%,-50%)",
                fontFamily: "var(--fd)", fontWeight: 200,
                fontSize: "clamp(6rem, 21vw, 20rem)",
                color: "rgba(255,255,255,0.022)",
                letterSpacing: "-0.04em", whiteSpace: "nowrap",
                userSelect: "none", pointerEvents: "none", lineHeight: 1,
            }}>Skills</div>

            <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>

                {/* Heading */}
                <div className="sk-head s-head">
                    <div>
                        <p className="sk-hd lbl" style={{ marginBottom: 10 }}>What I work with</p>
                        <h2 className="sk-hd" style={{
                            fontFamily: "var(--fd)", fontSize: "clamp(2.2rem,4vw,3.3rem)",
                            letterSpacing: "-0.03em", lineHeight: 1.05,
                            color: "var(--t1)", margin: 0, fontWeight: 300,
                        }}>Skills &amp; Tools</h2>
                    </div>
                    {/* Total skills count */}
                    <span className="sk-hd" style={{
                        fontFamily: "var(--fm)", fontSize: "0.76rem", color: "var(--t4)",
                    }}>
                        {GROUPS.reduce((a, g) => a + g.skills.length, 0)} skills
                    </span>
                </div>

                {/* Groups grid */}
                <div className="sk-groups" style={{
                    display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14,
                }}>
                    {GROUPS.map((g) => (
                        <div key={g.label} className="sk-grp" style={{
                            background: "var(--bg-2)", border: "1px solid var(--bd)",
                            borderRadius: 20, padding: 28,
                            transition: "border-color 0.25s, box-shadow 0.25s",
                        }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.borderColor = "var(--bd-2)";
                                el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.28)";
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.borderColor = "var(--bd)";
                                el.style.boxShadow = "none";
                            }}
                        >
                            {/* Group header */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
                                <span style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: "var(--bg-4)", border: "1px solid var(--bd-2)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "0.8rem", color: "var(--t3)",
                                }}>{g.icon}</span>
                                <p className="lbl">{g.label}</p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {g.skills.map(s => (
                                    <div key={s.name} data-pct={s.pct}>
                                        <div style={{
                                            display: "flex", justifyContent: "space-between",
                                            alignItems: "center", marginBottom: 8,
                                        }}>
                                            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--t2)" }}>
                                                {s.name}
                                            </span>
                                            <span
                                                data-count={s.pct}
                                                style={{ fontFamily: "var(--fm)", fontSize: "0.67rem", color: "var(--t4)" }}
                                            >0%</span>
                                        </div>
                                        <div className="sk-track">
                                            <div className="sk-fill" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Marquee strip */}
                <div style={{
                    marginTop: 52, overflow: "hidden",
                    padding: "18px 0",
                    borderTop: "1px solid var(--bd)",
                    borderBottom: "1px solid var(--bd)",
                }}>
                    <div className="mq-inner">
                        {MARQUEE_ITEMS.map((t, i) => (
                            <span key={i} style={{
                                padding: "0 20px",
                                fontFamily: "var(--fm)", fontSize: "0.74rem",
                                letterSpacing: "0.08em", color: "var(--t4)",
                                display: "inline-flex", alignItems: "center", gap: 20,
                                whiteSpace: "nowrap",
                            }}>
                                {t}
                                <span style={{
                                    width: 3, height: 3, borderRadius: "50%",
                                    background: "var(--bg-5)", flexShrink: 0,
                                }} />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Summary stats row */}
                <div style={{
                    marginTop: 52,
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    gap: 0, borderTop: "1px solid var(--bd)",
                }}>
                    {[
                        { val: "12+", label: "Technologies" },
                        { val: "3", label: "Core areas" },
                        { val: "2+", label: "Years practice" },
                        { val: "∞", label: "Always learning" },
                    ].map((s, i) => (
                        <div key={i} style={{
                            padding: "28px 24px",
                            borderRight: i < 3 ? "1px solid var(--bd)" : "none",
                        }}>
                            <p style={{
                                fontFamily: "var(--fd)", fontWeight: 200,
                                fontSize: "2.4rem", letterSpacing: "-0.04em",
                                color: "var(--t1)", margin: "0 0 6px", lineHeight: 1,
                            }}>{s.val}</p>
                            <p className="lbl">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}