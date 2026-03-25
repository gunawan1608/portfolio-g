"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const PROJECTS = [
    {
        id: "01",
        title: "Portfolio Website",
        category: "Web Development",
        description:
            "Personal portfolio built with Next.js 15, TypeScript, Tailwind CSS, and GSAP. Obsessive attention to motion design and dark aesthetics that don't sacrifice readability.",
        tags: ["Next.js", "TypeScript", "GSAP", "Tailwind"],
        status: "Live",
        year: "2025",
        accent: "#e5a03a",
        accentTag: "tag-amber",
    },
    {
        id: "02",
        title: "Project Dua",
        category: "UI/UX + Frontend",
        description:
            "Deskripsi singkat tentang project ini — apa yang kamu bangun, teknologi yang dipakai, dan apa dampaknya.",
        tags: ["React", "Node.js", "Tailwind"],
        status: "In Progress",
        year: "2025",
        accent: "#5ecfbd",
        accentTag: "tag-teal",
    },
    {
        id: "03",
        title: "Project Tiga",
        category: "Fullstack",
        description:
            "Tempat placeholder untuk project berikutnya. Tambahkan objek baru ke array PROJECTS dan card muncul otomatis.",
        tags: ["TypeScript", "PostgreSQL", "REST API"],
        status: "Concept",
        year: "2025",
        accent: "#a98ae8",
        accentTag: "tag-vi",
    },
    {
        id: "04",
        title: "Project Empat",
        category: "Design + Code",
        description:
            "Another placeholder. Replace with real data — title, description, tags, status, and your accent color.",
        tags: ["Figma", "React", "Animation"],
        status: "Concept",
        year: "2025",
        accent: "#e0706a",
        accentTag: "tag-rose",
    },
];

const STATUS_MAP: Record<string, { color: string; bg: string; border: string }> = {
    Live: { color: "var(--teal)", bg: "rgba(94,207,189,0.09)", border: "rgba(94,207,189,0.2)" },
    "In Progress": { color: "var(--amber)", bg: "rgba(229,160,58,0.11)", border: "rgba(229,160,58,0.2)" },
    Concept: { color: "var(--t4)", bg: "rgba(255,255,255,0.03)", border: "var(--bd)" },
};

export default function ProjectsSection() {
    const secRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── Heading items stagger ── */
            gsap.fromTo(
                headRef.current!.querySelectorAll("[data-h]"),
                { opacity: 0, y: 26 },
                {
                    opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
                    scrollTrigger: { trigger: headRef.current, start: "top 84%" },
                }
            );

            /* ── Cards: clip-path wipe + y translate ── */
            const cards = railRef.current!.querySelectorAll<HTMLElement>(".pc");
            gsap.fromTo(cards,
                { opacity: 0, x: 70, clipPath: "inset(0 25% 0 0 round 24px)" },
                {
                    opacity: 1, x: 0, clipPath: "inset(0 0% 0 0 round 24px)",
                    duration: 0.9, ease: "power3.out",
                    stagger: { each: 0.15 },
                    scrollTrigger: { trigger: railRef.current, start: "top 80%" },
                }
            );

            /* ── Inner card elements cascade ── */
            cards.forEach((card, ci) => {
                gsap.fromTo(
                    card.querySelectorAll("[data-ci]"),
                    { opacity: 0, y: 12 },
                    {
                        opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.07,
                        delay: 0.2 + ci * 0.15,
                        scrollTrigger: { trigger: railRef.current, start: "top 80%" },
                    }
                );
            });

            /* ── Drag scroll + active index tracker ── */
            const rail = railRef.current!;
            let isDragging = false, startX = 0, startLeft = 0;

            const updateActive = () => {
                const cardW = rail.querySelector<HTMLElement>(".pc")?.offsetWidth ?? 490;
                const gap = 20;
                const idx = Math.round(rail.scrollLeft / (cardW + gap));
                setActiveIdx(Math.min(idx, PROJECTS.length - 1));
            };

            rail.addEventListener("scroll", updateActive, { passive: true });

            rail.addEventListener("mousedown", (e: MouseEvent) => {
                isDragging = true;
                startX = e.pageX - rail.offsetLeft;
                startLeft = rail.scrollLeft;
                rail.style.scrollSnapType = "none";
            });
            window.addEventListener("mouseup", () => {
                if (!isDragging) return;
                isDragging = false;
                rail.style.scrollSnapType = "x mandatory";
            });
            window.addEventListener("mousemove", (e: MouseEvent) => {
                if (!isDragging) return;
                e.preventDefault();
                rail.scrollLeft = startLeft - (e.pageX - rail.offsetLeft - startX) * 1.3;
            });

        }, secRef);

        return () => ctx.revert();
    }, []);

    const scrollTo = (dir: number) => {
        const rail = railRef.current;
        if (!rail) return;
        const cardW = rail.querySelector<HTMLElement>(".pc")?.offsetWidth ?? 490;
        rail.scrollBy({ left: dir * (cardW + 20), behavior: "smooth" });
    };

    return (
        <section id="projects" ref={secRef}
            style={{ padding: "110px 0 90px", position: "relative", overflow: "hidden" }}>

            {/* Section glow */}
            <div aria-hidden style={{
                position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
                width: 900, height: 450, borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(229,160,58,0.035) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            {/* Heading */}
            <div ref={headRef} style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
                <div className="s-head">
                    <div>
                        <p data-h className="lbl" style={{ marginBottom: 10 }}>Selected work</p>
                        <h2 data-h style={{
                            fontFamily: "var(--fd)", fontSize: "clamp(2.2rem,4vw,3.3rem)",
                            letterSpacing: "-0.03em", lineHeight: 1.05,
                            color: "var(--t1)", margin: 0, fontWeight: 300,
                        }}>Projects</h2>
                    </div>

                    {/* Nav controls — simple arrows + count */}
                    <div data-h style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ fontFamily: "var(--fm)", fontSize: "0.72rem", color: "var(--t4)" }}>
                            {String(activeIdx + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                        </span>
                        <div style={{ display: "flex", gap: 6 }}>
                            {([-1, 1] as const).map((dir, i) => (
                                <button key={i} data-hover onClick={() => scrollTo(dir)}
                                    style={{
                                        width: 34, height: 34, borderRadius: "50%",
                                        border: "1px solid var(--bd-2)", background: "transparent",
                                        color: "var(--t3)", cursor: "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "border-color 0.16s, color 0.16s, background 0.16s",
                                        outline: "none",
                                    }}
                                    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--bd-3)"; el.style.color = "var(--t1)"; el.style.background = "var(--bg-3)"; }}
                                    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--bd-2)"; el.style.color = "var(--t3)"; el.style.background = "transparent"; }}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        {i === 0 ? <><path d="M19 12H5" /><path d="m12 5-7 7 7 7" /></> : <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>}
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rail */}
            <div ref={railRef} className="p-rail"
                style={{ paddingLeft: "max(28px, calc((100vw - 1120px)/2 + 28px))", paddingRight: 28 }}>
                {PROJECTS.map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i} isActive={i === activeIdx} />
                ))}

                {/* Add-more ghost */}
                <div style={{
                    flexShrink: 0, width: "clamp(180px, 20vw, 240px)", height: 570,
                    border: "1px dashed var(--bd-2)", borderRadius: 24,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: 10,
                }}>
                    <span style={{
                        width: 36, height: 36, borderRadius: "50%",
                        border: "1px dashed var(--bd-2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--t5)", fontSize: "1.2rem",
                    }}>+</span>
                    <span style={{
                        fontFamily: "var(--fm)", fontSize: "0.63rem", letterSpacing: "0.1em",
                        color: "var(--t5)", textAlign: "center", padding: "0 20px", lineHeight: 1.6,
                    }}>Add to PROJECTS array</span>
                </div>
            </div>

            {/* Dot indicator — replaces the ugly thin bar */}
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {PROJECTS.map((_, i) => (
                        <button key={i}
                            data-hover
                            onClick={() => {
                                const rail = railRef.current;
                                if (!rail) return;
                                const cardW = rail.querySelector<HTMLElement>(".pc")?.offsetWidth ?? 490;
                                rail.scrollTo({ left: i * (cardW + 20), behavior: "smooth" });
                            }}
                            style={{
                                width: i === activeIdx ? 24 : 6,
                                height: 6, borderRadius: 3,
                                border: "none",
                                background: i === activeIdx ? "var(--amber)" : "var(--bg-5)",
                                cursor: "pointer",
                                outline: "none",
                                transition: "width 0.35s var(--ease-out), background 0.25s",
                                padding: 0,
                            }}
                        />
                    ))}
                    <span style={{
                        marginLeft: 12, fontFamily: "var(--fm)", fontSize: "0.6rem",
                        letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--t5)",
                    }}>drag or click to navigate</span>
                </div>
            </div>
        </section>
    );
}

/* ── Individual card ─────────────────────────────── */
function ProjectCard({
    project, index, isActive,
}: {
    project: typeof PROJECTS[0];
    index: number;
    isActive: boolean;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const hlRef = useRef<HTMLDivElement>(null);
    const ss = STATUS_MAP[project.status] ?? STATUS_MAP["Concept"];

    /* Magnetic 3D tilt */
    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);

        gsap.to(card, { rotateY: dx * 5.5, rotateX: -dy * 4.5, x: dx * 4, y: dy * 3, duration: 0.4, ease: "power2.out", transformStyle: "preserve-3d" });

        if (hlRef.current) {
            const lx = ((e.clientX - r.left) / r.width) * 100;
            const ly = ((e.clientY - r.top) / r.height) * 100;
            hlRef.current.style.background =
                `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,255,255,0.04) 0%, transparent 60%)`;
        }
    };

    const onMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        gsap.to(card, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 0.7, ease: "power3.out" });
        if (hlRef.current) hlRef.current.style.background = "transparent";
    };

    return (
        <div className="pc" ref={cardRef} data-hover
            onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
            style={{
                perspective: 900,
                outline: isActive ? `1px solid var(--bd-2)` : "none",
                transition: "box-shadow 0.35s, border-color 0.3s, outline 0.3s",
            }}
        >
            <div ref={hlRef} className="pc-hl" />

            {/* Visual area */}
            <div style={{
                flex: "0 0 230px",
                background: `linear-gradient(150deg, ${project.accent}10 0%, ${project.accent}04 50%, transparent 100%)`,
                borderBottom: "1px solid var(--bd)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
            }}>
                {/* Ghost number */}
                <span data-ci style={{
                    fontFamily: "var(--fd)", fontWeight: 200,
                    fontSize: "clamp(6rem, 14vw, 11rem)",
                    lineHeight: 1, letterSpacing: "-0.06em",
                    color: `${project.accent}16`,
                    userSelect: "none",
                }}>{project.id}</span>

                {/* Category */}
                <span data-ci style={{
                    position: "absolute", top: 18, left: 20,
                    fontFamily: "var(--fm)", fontSize: "0.61rem",
                    letterSpacing: "0.14em", color: "var(--t4)", textTransform: "uppercase",
                }}>{project.category}</span>

                {/* Status */}
                <span data-ci style={{
                    position: "absolute", top: 14, right: 16,
                    padding: "3px 10px", borderRadius: 100,
                    background: ss.bg, color: ss.color,
                    border: `1px solid ${ss.border}`,
                    fontFamily: "var(--fm)", fontSize: "0.61rem", letterSpacing: "0.04em",
                }}>{project.status}</span>

                {/* Year + dot */}
                <span data-ci style={{
                    position: "absolute", bottom: 16, left: 20,
                    display: "flex", alignItems: "center", gap: 7,
                }}>
                    <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: project.accent,
                        boxShadow: `0 0 8px ${project.accent}55`,
                    }} />
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.61rem", color: "var(--t4)", letterSpacing: "0.06em" }}>
                        {project.year}
                    </span>
                </span>
            </div>

            {/* Content */}
            <div style={{
                flex: 1, padding: "24px 26px 26px",
                display: "flex", flexDirection: "column", gap: 13,
                position: "relative", zIndex: 2,
            }}>
                <h3 data-ci style={{
                    fontFamily: "var(--fd)", fontWeight: 300,
                    fontSize: "1.5rem", letterSpacing: "-0.03em", lineHeight: 1.15,
                    color: "var(--t1)", margin: 0,
                }}>{project.title}</h3>

                <p data-ci style={{ fontSize: "0.875rem", lineHeight: 1.74, color: "var(--t3)", margin: 0, flexGrow: 1 }}>
                    {project.description}
                </p>

                <div data-ci style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {project.tags.map(t => (
                        <span key={t} className={`tag ${project.accentTag}`}>{t}</span>
                    ))}
                </div>

                <div data-ci style={{
                    paddingTop: 14, borderTop: "1px solid var(--bd)",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", letterSpacing: "0.08em", color: "var(--t5)" }}>
                        {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                    </span>
                    <a href="#" className="ul" data-hover style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontFamily: "var(--fm)", fontSize: "0.7rem", letterSpacing: "0.05em",
                    }}>
                        View project
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17 17 7" /><path d="M8 7h9v9" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Bottom accent fill on hover */}
            <div className="pc-bar">
                <div className="pc-bar-fill" style={{ background: project.accent }} />
            </div>
        </div>
    );
}