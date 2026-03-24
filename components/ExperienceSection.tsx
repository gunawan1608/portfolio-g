"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCE = [
    {
        title: "Frontend Developer",
        org: "Freelance / Self-employed",
        period: "2024 — Present",
        desc: "Building websites and web applications for clients. Handling everything from design to deployment — responsive UIs, performance optimization, and clean code.",
        tags: ["Next.js", "React", "Tailwind", "TypeScript"],
        type: "work",
    },
    {
        title: "Web Developer",
        org: "Personal Projects",
        period: "2023 — 2024",
        desc: "Developed multiple personal projects to sharpen skills in React, TypeScript, and modern frontend tooling. Focused on building real, complete products — not just tutorials.",
        tags: ["React", "JavaScript", "CSS", "Node.js"],
        type: "work",
    },
    {
        title: "Self-taught Developer",
        org: "Online resources, documentation, open source",
        period: "2022 — Present",
        desc: "Learned web development independently through documentation, open source projects, and hands-on building. Believe deeply in learning by doing.",
        tags: ["Continuous learning", "Open source"],
        type: "education",
    },
];

const ACHIEVEMENTS = [
    { title: "First live project deployed", desc: "Shipped my first production website that real users visit.", year: "2024" },
    { title: "Portfolio v1 launched", desc: "Built and launched my first personal portfolio — the beginning of taking the dev journey seriously.", year: "2024" },
    { title: "TypeScript adoption", desc: "Committed to TypeScript and started using it in all new projects. No more excuses.", year: "2024" },
    { title: "GSAP animations mastered", desc: "Deep-dived into GSAP & ScrollTrigger for production-quality motion design.", year: "2025" },
];

export default function ExperienceSection() {
    const secRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            /* ── generic [data-r] reveals ── */
            secRef.current!.querySelectorAll<HTMLElement>("[data-r]").forEach(el => {
                gsap.fromTo(el,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 87%" }
                    }
                );
            });

            /* ── timeline line draw ── */
            const line = secRef.current!.querySelector<HTMLElement>(".tl-line");
            if (line) {
                gsap.fromTo(line,
                    { scaleY: 0 },
                    {
                        scaleY: 1, duration: 1.5, ease: "power3.out",
                        scrollTrigger: { trigger: line, start: "top 78%" }
                    }
                );
            }

            /* ── achievements stagger ── */
            gsap.fromTo(".ach-item",
                { opacity: 0, x: 30 },
                {
                    opacity: 1, x: 0, duration: 0.72, ease: "power3.out", stagger: 0.12,
                    scrollTrigger: { trigger: ".ach-list", start: "top 78%" },
                }
            );

            /* ── year badge counter spin ── */
            secRef.current!.querySelectorAll<HTMLElement>(".ach-year").forEach(el => {
                gsap.fromTo(el,
                    { rotateX: -90, opacity: 0 },
                    {
                        rotateX: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)",
                        scrollTrigger: { trigger: el, start: "top 88%" }
                    }
                );
            });

        }, secRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="experience" ref={secRef} className="s-bg"
            style={{ padding: "110px 28px" }}>

            <div style={{ maxWidth: 1120, margin: "0 auto" }}>

                {/* Heading */}
                <div data-r className="s-head">
                    <div>
                        <p className="lbl" style={{ marginBottom: 10 }}>Career &amp; life</p>
                        <h2 style={{
                            fontFamily: "var(--fd)", fontSize: "clamp(2.2rem,4vw,3.3rem)",
                            letterSpacing: "-0.03em", lineHeight: 1.05,
                            color: "var(--t1)", margin: 0, fontWeight: 300,
                        }}>Experience &amp; Achievements</h2>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

                    {/* ── Timeline column ── */}
                    <div>
                        <p className="lbl" style={{ marginBottom: 26 }}>Timeline</p>
                        <div style={{ position: "relative", paddingLeft: 26 }}>
                            <div className="tl-line" />

                            {EXPERIENCE.map((item, i) => (
                                <div key={i} className="tl-item" data-r
                                    style={{ position: "relative", marginBottom: i < EXPERIENCE.length - 1 ? 14 : 0 }}>
                                    <div className="tl-dot" />

                                    <div style={{
                                        background: "var(--bg-2)", border: "1px solid var(--bd)",
                                        borderRadius: 16, padding: 22,
                                        transition: "border-color 0.22s, box-shadow 0.25s, transform 0.25s",
                                    }}
                                        onMouseEnter={e => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.borderColor = "var(--bd-2)";
                                            el.style.boxShadow = "0 10px 36px rgba(0,0,0,0.28)";
                                            el.style.transform = "translateX(4px)";
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.borderColor = "var(--bd)";
                                            el.style.boxShadow = "none";
                                            el.style.transform = "translateX(0)";
                                        }}
                                    >
                                        <div style={{
                                            display: "flex", justifyContent: "space-between",
                                            alignItems: "flex-start", marginBottom: 8,
                                        }}>
                                            <div>
                                                <span style={{
                                                    display: "block", fontWeight: 600,
                                                    fontSize: "0.925rem", color: "var(--t1)", marginBottom: 3,
                                                }}>{item.title}</span>
                                                <span style={{ fontSize: "0.82rem", color: "var(--t3)" }}>{item.org}</span>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                                                <span style={{
                                                    fontFamily: "var(--fm)", fontSize: "0.64rem",
                                                    color: "var(--t4)", whiteSpace: "nowrap",
                                                }}>{item.period}</span>
                                                <span style={{
                                                    padding: "2px 9px", borderRadius: 100,
                                                    fontFamily: "var(--fm)", fontSize: "0.61rem", letterSpacing: "0.04em",
                                                    background: item.type === "education" ? "var(--teal-dim)" : "var(--amber-dim)",
                                                    color: item.type === "education" ? "var(--teal)" : "var(--amber)",
                                                    border: `1px solid ${item.type === "education" ? "rgba(94,207,189,0.22)" : "rgba(229,160,58,0.22)"}`,
                                                }}>{item.type}</span>
                                            </div>
                                        </div>

                                        <p style={{ fontSize: "0.845rem", lineHeight: 1.72, color: "var(--t3)", margin: "12px 0 14px" }}>
                                            {item.desc}
                                        </p>

                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                                            {item.tags.map(t => (
                                                <span key={t} className="tag" style={{ fontSize: "0.63rem" }}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Achievements column ── */}
                    <div>
                        <p className="lbl" style={{ marginBottom: 26 }}>Achievements</p>
                        <div className="ach-list" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {ACHIEVEMENTS.map((a, i) => (
                                <div key={i} className="ach-item" style={{
                                    background: "var(--bg-2)", border: "1px solid var(--bd)",
                                    borderRadius: 16, padding: 22,
                                    display: "flex", gap: 16, alignItems: "flex-start",
                                    transition: "border-color 0.22s, transform 0.25s, box-shadow 0.25s",
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
                                    {/* Year badge */}
                                    <span className="ach-year" style={{
                                        flexShrink: 0, width: 46, height: 46, borderRadius: 11,
                                        background: "var(--amber-dim)", border: "1px solid rgba(229,160,58,0.2)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontFamily: "var(--fm)", fontSize: "0.62rem",
                                        color: "var(--amber)", letterSpacing: "0.04em",
                                        transformStyle: "preserve-3d",
                                    }}>{a.year}</span>

                                    <div>
                                        <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--t1)", marginBottom: 5 }}>
                                            {a.title}
                                        </p>
                                        <p style={{ fontSize: "0.83rem", lineHeight: 1.67, color: "var(--t3)", margin: 0 }}>
                                            {a.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}