"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Add projects here — list grows automatically ── */
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
            "Deskripsi singkat tentang project ini — apa yang kamu bangun, teknologi yang dipakai, dan apa dampaknya. Bisa 2-3 kalimat.",
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
            "Tempat placeholder untuk project berikutnya. Setiap objek baru yang ditambahkan ke PROJECTS akan otomatis muncul sebagai card baru di rail ini.",
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
            "Another placeholder. Replace with real data — title, description, tags, status, and your accent color. The card layout and animation handle the rest.",
        tags: ["Figma", "React", "Animation"],
        status: "Concept",
        year: "2025",
        accent: "#e0706a",
        accentTag: "tag-rose",
    },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
    Live: { bg: "rgba(94,207,189,0.1)", color: "var(--teal)", border: "rgba(94,207,189,0.22)" },
    "In Progress": { bg: "rgba(229,160,58,0.12)", color: "var(--amber)", border: "rgba(229,160,58,0.2)" },
    Concept: { bg: "rgba(255,255,255,0.04)", color: "var(--t3)", border: "var(--bd)" },
};

export default function ProjectsSection() {
    const secRef = useRef<HTMLElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const numRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── Heading stagger ── */
            gsap.fromTo(
                headRef.current!.querySelectorAll("[data-h]"),
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
                    stagger: 0.12,
                    scrollTrigger: { trigger: headRef.current, start: "top 83%" },
                }
            );

            /* ── Cards: clip-path + translate entrance ── */
            const cards = railRef.current!.querySelectorAll<HTMLElement>(".pc");
            gsap.fromTo(
                cards,
                {
                    opacity: 0,
                    x: 60,
                    clipPath: "inset(0 30% 0 0 round 24px)",
                },
                {
                    opacity: 1,
                    x: 0,
                    clipPath: "inset(0 0% 0 0 round 24px)",
                    duration: 0.95,
                    ease: "power3.out",
                    stagger: { each: 0.16, from: "start" },
                    scrollTrigger: { trigger: railRef.current, start: "top 80%" },
                }
            );

            /* ── Inner elements cascade after card enters ── */
            cards.forEach((card, ci) => {
                const innerEls = card.querySelectorAll("[data-ci]");
                gsap.fromTo(
                    innerEls,
                    { opacity: 0, y: 14 },
                    {
                        opacity: 1, y: 0,
                        duration: 0.6, ease: "power2.out",
                        stagger: 0.08,
                        delay: 0.22 + ci * 0.16,
                        scrollTrigger: { trigger: railRef.current, start: "top 80%" },
                    }
                );
            });

            /* ── Drag scroll indicator bar ── */
            const rail = railRef.current!;
            const updateBar = () => {
                if (!barRef.current) return;
                const maxScroll = rail.scrollWidth - rail.clientWidth;
                const pct = maxScroll > 0 ? rail.scrollLeft / maxScroll : 0;
                gsap.to(barRef.current, { scaleX: pct, duration: 0.1, ease: "none", transformOrigin: "left" });
            };
            rail.addEventListener("scroll", updateBar, { passive: true });

            /* ── Drag to scroll ── */
            let isDragging = false, startX = 0, startScrollLeft = 0;

            rail.addEventListener("mousedown", (e: MouseEvent) => {
                isDragging = true;
                startX = e.pageX - rail.offsetLeft;
                startScrollLeft = rail.scrollLeft;
                rail.style.scrollSnapType = "none"; // disable snap while dragging
            });
            window.addEventListener("mouseup", () => {
                if (!isDragging) return;
                isDragging = false;
                rail.style.scrollSnapType = "x mandatory";
            });
            window.addEventListener("mousemove", (e: MouseEvent) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.pageX - rail.offsetLeft;
                const walk = (x - startX) * 1.4;
                rail.scrollLeft = startScrollLeft - walk;
            });

        }, secRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="projects" ref={secRef}
            style={{ padding: "110px 0 80px", position: "relative", overflow: "hidden" }}>

            {/* Section bg subtle glow */}
            <div aria-hidden style={{
                position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
                width: 800, height: 400, borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(229,160,58,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
                {/* Heading */}
                <div ref={headRef} style={{
                    display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                    paddingBottom: 28, borderBottom: "1px solid var(--bd)", marginBottom: 52,
                }}>
                    <div>
                        <p data-h className="lbl" style={{ marginBottom: 10 }}>Selected work</p>
                        <h2 data-h style={{
                            fontFamily: "var(--fd)", fontSize: "clamp(2.2rem,4vw,3.3rem)",
                            letterSpacing: "-0.03em", lineHeight: 1.05,
                            color: "var(--t1)", margin: 0, fontWeight: 300,
                        }}>Projects</h2>
                    </div>
                    <div data-h style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <span style={{ fontFamily: "var(--fm)", fontSize: "0.76rem", color: "var(--t4)" }}>
                            {PROJECTS.length} total
                        </span>
                        {/* Scroll hint arrows */}
                        <div style={{ display: "flex", gap: 6 }}>
                            {["←", "→"].map((a, i) => (
                                <button key={i} data-hover
                                    onClick={() => {
                                        const rail = document.querySelector<HTMLElement>(".p-rail");
                                        if (!rail) return;
                                        const dir = i === 0 ? -1 : 1;
                                        rail.scrollBy({ left: dir * 520, behavior: "smooth" });
                                    }}
                                    style={{
                                        width: 36, height: 36, borderRadius: "50%",
                                        border: "1px solid var(--bd-2)", background: "var(--bg-2)",
                                        color: "var(--t3)", fontSize: "0.85rem", cursor: "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        transition: "border-color 0.18s, color 0.18s, background 0.18s",
                                    }}
                                    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--bd-3)"; el.style.color = "var(--t1)"; el.style.background = "var(--bg-3)"; }}
                                    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--bd-2)"; el.style.color = "var(--t3)"; el.style.background = "var(--bg-2)"; }}
                                >{a}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Rail — full width with left padding */}
            <div ref={railRef} className="p-rail"
                style={{ paddingLeft: "max(28px, calc((100vw - 1120px)/2 + 28px))", paddingRight: 28 }}>
                {PROJECTS.map((p, i) => (
                    <ProjectCard key={p.id} project={p} index={i} />
                ))}

                {/* Ghost "add more" card */}
                <div style={{
                    flexShrink: 0, width: "clamp(200px, 22vw, 280px)", height: 570,
                    border: "1px dashed var(--bd-2)", borderRadius: 24,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 12,
                }}>
                    <span style={{ fontSize: "2rem", color: "var(--t5)" }}>+</span>
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.68rem", letterSpacing: "0.1em", color: "var(--t5)", textAlign: "center", padding: "0 24px" }}>
                        Add next project to PROJECTS array
                    </span>
                </div>
            </div>

            {/* Drag indicator bar */}
            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 28px" }}>
                <div style={{ height: 2, background: "var(--bg-4)", borderRadius: 1, overflow: "hidden" }}>
                    <div ref={barRef} style={{
                        height: "100%", background: "linear-gradient(90deg, var(--amber), var(--teal))",
                        transformOrigin: "left", transform: "scaleX(0)",
                    }} />
                </div>
                <p style={{
                    fontFamily: "var(--fm)", fontSize: "0.62rem", letterSpacing: "0.12em",
                    color: "var(--t5)", marginTop: 10
                }}>DRAG OR SCROLL TO EXPLORE</p>
            </div>
        </section>
    );
}

/* ── Individual Project Card ─────────────────────── */
function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const hlRef = useRef<HTMLDivElement>(null);

    /* Magnetic + perspective tilt */
    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / (r.width / 2);
        const dy = (e.clientY - cy) / (r.height / 2);

        gsap.to(card, {
            rotateY: dx * 6, rotateX: -dy * 5,
            x: dx * 5, y: dy * 3,
            duration: 0.4, ease: "power2.out",
            transformStyle: "preserve-3d",
        });

        /* Moving highlight */
        if (hlRef.current) {
            const lx = ((e.clientX - r.left) / r.width) * 100;
            const ly = ((e.clientY - r.top) / r.height) * 100;
            hlRef.current.style.background =
                `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,255,255,0.045) 0%, transparent 58%)`;
        }
    };

    const onMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        gsap.to(card, {
            rotateY: 0, rotateX: 0, x: 0, y: 0,
            duration: 0.7, ease: "power3.out",
        });
        if (hlRef.current) hlRef.current.style.background = "transparent";
    };

    const ss = STATUS_STYLE[project.status] ?? STATUS_STYLE["Concept"];

    return (
        <div
            className="pc"
            ref={cardRef}
            data-hover
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ perspective: 900 }}
        >
            {/* Moving highlight layer */}
            <div ref={hlRef} className="pc-hl" />

            {/* Visual top section */}
            <div style={{
                flex: "0 0 240px",
                background: `linear-gradient(145deg, ${project.accent}0f 0%, ${project.accent}05 50%, transparent 100%)`,
                borderBottom: "1px solid var(--bd)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
            }}>
                {/* Large ghost number */}
                <span data-ci style={{
                    fontFamily: "var(--fd)", fontWeight: 200,
                    fontSize: "clamp(6rem, 14vw, 11rem)",
                    lineHeight: 1, letterSpacing: "-0.06em",
                    color: `${project.accent}18`,
                    userSelect: "none",
                }}>{project.id}</span>

                {/* Category top-left */}
                <span data-ci style={{
                    position: "absolute", top: 18, left: 20,
                    fontFamily: "var(--fm)", fontSize: "0.63rem",
                    letterSpacing: "0.12em", color: "var(--t4)",
                    textTransform: "uppercase",
                }}>{project.category}</span>

                {/* Status top-right */}
                <span data-ci style={{
                    position: "absolute", top: 14, right: 16,
                    padding: "3px 10px", borderRadius: 100,
                    background: ss.bg, color: ss.color,
                    border: `1px solid ${ss.border}`,
                    fontFamily: "var(--fm)", fontSize: "0.63rem", letterSpacing: "0.04em",
                }}>{project.status}</span>

                {/* Accent dot */}
                <span data-ci style={{
                    position: "absolute", bottom: 18, left: 20,
                    display: "flex", alignItems: "center", gap: 7,
                }}>
                    <span style={{
                        width: 7, height: 7, borderRadius: "50%", background: project.accent,
                        boxShadow: `0 0 10px ${project.accent}60`
                    }} />
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.63rem", color: "var(--t4)", letterSpacing: "0.06em" }}>
                        {project.year}
                    </span>
                </span>
            </div>

            {/* Content section */}
            <div style={{
                flex: 1, padding: "26px 28px 28px",
                display: "flex", flexDirection: "column", gap: 14,
                position: "relative", zIndex: 2,
            }}>
                <h3 data-ci style={{
                    fontFamily: "var(--fd)", fontWeight: 300,
                    fontSize: "1.55rem", letterSpacing: "-0.03em", lineHeight: 1.15,
                    color: "var(--t1)", margin: 0,
                }}>{project.title}</h3>

                <p data-ci style={{
                    fontSize: "0.875rem", lineHeight: 1.74,
                    color: "var(--t3)", margin: 0, flexGrow: 1,
                }}>{project.description}</p>

                {/* Tags */}
                <div data-ci style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {project.tags.map(t => (
                        <span key={t} className={`tag ${project.accentTag}`}>{t}</span>
                    ))}
                </div>

                {/* Footer link */}
                <div data-ci style={{
                    paddingTop: 14, borderTop: "1px solid var(--bd)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <span style={{ fontFamily: "var(--fm)", fontSize: "0.64rem", letterSpacing: "0.08em", color: "var(--t5)" }}>
                        {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                    </span>
                    <a href="#" className="ul" data-hover style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontFamily: "var(--fm)", fontSize: "0.7rem", letterSpacing: "0.06em",
                    }}>
                        View project
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17 17 7" /><path d="M8 7h9v9" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Bottom accent bar */}
            <div className="pc-bar">
                <div className="pc-bar-fill" style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }} />
            </div>
        </div>
    );
}