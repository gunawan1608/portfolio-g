"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GROUPS = [
    {
        label: "Frontend",
        accent: "#e5a03a",   // amber — single solid color, no gradient
        skills: [
            { name: "React / Next.js", pct: 88 },
            { name: "TypeScript", pct: 82 },
            { name: "Tailwind CSS", pct: 90 },
            { name: "HTML & CSS", pct: 94 },
        ],
    },
    {
        label: "Motion & Design",
        accent: "#f2efe8",   // near-white — clean, not loud
        skills: [
            { name: "GSAP", pct: 72 },
            { name: "Figma", pct: 78 },
            { name: "CSS Animations", pct: 85 },
            { name: "Framer Motion", pct: 66 },
        ],
    },
    {
        label: "Backend & Tools",
        accent: "#8b8880",   // muted warm grey
        skills: [
            { name: "Node.js", pct: 70 },
            { name: "Git & GitHub", pct: 84 },
            { name: "REST APIs", pct: 76 },
            { name: "PostgreSQL", pct: 62 },
        ],
    },
];

const MQ = [
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
    "GSAP", "Figma", "PostgreSQL", "Git", "REST API", "Framer Motion", "CSS",
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
    "GSAP", "Figma", "PostgreSQL", "Git", "REST API", "Framer Motion", "CSS",
];

const MQ2 = [
    "Vercel", "Vite", "ESLint", "Prettier", "pnpm", "VS Code", "GitHub Actions",
    "React Query", "Zustand", "shadcn/ui", "Radix UI", "Lucide", "Zod",
    "Vercel", "Vite", "ESLint", "Prettier", "pnpm", "VS Code", "GitHub Actions",
    "React Query", "Zustand", "shadcn/ui", "Radix UI", "Lucide", "Zod",
];

export default function SkillsSection() {
    const secRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            /* ── Parallax bg word ── */
            gsap.to(bgRef.current, {
                y: -110, ease: "none",
                scrollTrigger: { trigger: secRef.current, start: "top bottom", end: "bottom top", scrub: 1.8 },
            });

            /* ── Glow drift ── */
            gsap.to(glowRef.current, {
                x: -65, y: 45, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1,
            });

            /* ── Section heading ── */
            gsap.fromTo(".sk-hd",
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.1,
                    scrollTrigger: { trigger: ".sk-head", start: "top 83%" },
                }
            );

            /* ── Cards: stagger with slight rotation for organic feel ── */
            gsap.fromTo(".sk-grp",
                { opacity: 0, y: 50, rotate: (i) => (i % 2 === 0 ? -0.6 : 0.6) },
                {
                    opacity: 1, y: 0, rotate: 0,
                    duration: 0.88, ease: "power3.out", stagger: 0.13,
                    scrollTrigger: { trigger: ".sk-groups", start: "top 78%" },
                }
            );

            /* ── Skill bars: stagger fill ── */
            const fills = secRef.current!.querySelectorAll<HTMLElement>(".sk-fill");
            const pctEls = secRef.current!.querySelectorAll<HTMLElement>("[data-pct]");
            gsap.fromTo(fills,
                { width: "0%" },
                {
                    width: (_i, el) => {
                        const p = el.closest("[data-pct]") as HTMLElement | null;
                        return (p?.dataset.pct ?? "0") + "%";
                    },
                    duration: 1.25, ease: "power3.out", stagger: 0.045,
                    scrollTrigger: { trigger: ".sk-groups", start: "top 72%" },
                }
            );

            /* ── Counter numbers animate ── */
            secRef.current!.querySelectorAll<HTMLElement>("[data-count]").forEach(el => {
                const target = parseInt(el.dataset.count ?? "0", 10);
                const obj = { v: 0 };
                gsap.to(obj, {
                    v: target, duration: 1.35, ease: "power2.out",
                    scrollTrigger: { trigger: el, start: "top 80%" },
                    onUpdate: () => { el.textContent = Math.round(obj.v) + "%"; },
                });
            });

            /* ── Stats row numbers ── */
            secRef.current!.querySelectorAll<HTMLElement>("[data-stat]").forEach(el => {
                const val = el.dataset.stat ?? "";
                if (!/^\d+$/.test(val)) return;
                const target = parseInt(val, 10);
                const obj = { v: 0 };
                gsap.to(obj, {
                    v: target, duration: 1.6, ease: "power2.out",
                    scrollTrigger: { trigger: el, start: "top 84%" },
                    onUpdate: () => { el.textContent = Math.round(obj.v) + "+"; },
                });
            });

        }, secRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="skills" ref={secRef} className="s-bg"
            style={{ padding: "110px 28px", position: "relative", overflow: "hidden" }}>

            {/* Glow */}
            <div ref={glowRef} aria-hidden style={{
                position: "absolute", top: "18%", right: "-16%",
                width: 620, height: 620, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(94,207,189,0.034) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            {/* Parallax bg word */}
            <div ref={bgRef} aria-hidden style={{
                position: "absolute", top: "40%", left: "50%",
                transform: "translate(-50%,-50%)",
                fontFamily: "var(--fd)", fontWeight: 200,
                fontSize: "clamp(6rem, 21vw, 20rem)",
                color: "rgba(255,255,255,0.018)",
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
                    <span className="sk-hd" style={{ fontFamily: "var(--fm)", fontSize: "0.74rem", color: "var(--t4)" }}>
                        {GROUPS.reduce((a, g) => a + g.skills.length, 0)} skills
                    </span>
                </div>

                {/* Groups */}
                <div className="sk-groups" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                    {GROUPS.map((g) => (
                        <div key={g.label} className="sk-grp" style={{
                            background: "var(--bg-2)", border: "1px solid var(--bd)",
                            borderRadius: 20, padding: 28,
                            transition: "border-color 0.22s, box-shadow 0.25s",
                        }}
                            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--bd-2)"; el.style.boxShadow = "0 14px 42px rgba(0,0,0,0.26)"; }}
                            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--bd)"; el.style.boxShadow = "none"; }}
                        >
                            {/* Group header — accent color dot + label */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                                <span style={{
                                    width: 8, height: 8, borderRadius: "50%",
                                    background: g.accent, flexShrink: 0,
                                    boxShadow: `0 0 10px ${g.accent}50`,
                                }} />
                                <p className="lbl">{g.label}</p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                                {g.skills.map(s => (
                                    <div key={s.name} data-pct={s.pct}>
                                        <div style={{
                                            display: "flex", justifyContent: "space-between",
                                            alignItems: "baseline", marginBottom: 9,
                                        }}>
                                            <span style={{ fontSize: "0.875rem", fontWeight: 400, color: "var(--t2)", letterSpacing: "-0.01em" }}>
                                                {s.name}
                                            </span>
                                            <span
                                                data-count={s.pct}
                                                style={{ fontFamily: "var(--fm)", fontSize: "0.66rem", color: "var(--t4)" }}
                                            >0%</span>
                                        </div>
                                        {/* Bar: single solid color, NO gradient */}
                                        <div className="sk-track">
                                            <div className="sk-fill" style={{ background: g.accent }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dual marquee strips */}
                <div style={{ marginTop: 56, overflow: "hidden", padding: "16px 0", borderTop: "1px solid var(--bd)" }}>
                    <div className="mq-inner">
                        {MQ.map((t, i) => (
                            <span key={i} style={{
                                padding: "0 18px",
                                fontFamily: "var(--fm)", fontSize: "0.72rem", letterSpacing: "0.08em",
                                color: "var(--t4)", display: "inline-flex", alignItems: "center", gap: 18, whiteSpace: "nowrap",
                            }}>
                                {t}
                                <span style={{ width: 2, height: 2, borderRadius: "50%", background: "var(--t5)", flexShrink: 0 }} />
                            </span>
                        ))}
                    </div>
                </div>
                <div style={{ overflow: "hidden", padding: "16px 0", borderBottom: "1px solid var(--bd)" }}>
                    <div className="mq-inner-rev">
                        {MQ2.map((t, i) => (
                            <span key={i} style={{
                                padding: "0 18px",
                                fontFamily: "var(--fm)", fontSize: "0.72rem", letterSpacing: "0.08em",
                                color: "var(--t5)", display: "inline-flex", alignItems: "center", gap: 18, whiteSpace: "nowrap",
                            }}>
                                {t}
                                <span style={{ width: 2, height: 2, borderRadius: "50%", background: "var(--bg-5)", flexShrink: 0 }} />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    marginTop: 52,
                    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                    borderTop: "1px solid var(--bd)",
                }}>
                    {[
                        { val: "12", suffix: "+", label: "Technologies", stat: "12" },
                        { val: "3", suffix: "", label: "Core areas", stat: "" },
                        { val: "2", suffix: "+", label: "Years practice", stat: "2" },
                        { val: "∞", suffix: "", label: "Always learning", stat: "" },
                    ].map((s, i) => (
                        <div key={i} style={{
                            padding: "28px 24px",
                            borderRight: i < 3 ? "1px solid var(--bd)" : "none",
                        }}>
                            <p style={{
                                fontFamily: "var(--fd)", fontWeight: 200,
                                fontSize: "2.4rem", letterSpacing: "-0.04em",
                                color: "var(--t1)", margin: "0 0 6px", lineHeight: 1,
                            }}>
                                {s.stat ? (
                                    <span data-stat={s.stat}>{s.val}{s.suffix}</span>
                                ) : (
                                    <span>{s.val}{s.suffix}</span>
                                )}
                            </p>
                            <p className="lbl">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}