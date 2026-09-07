"use client";

import Image from "next/image";
import Link from "next/link";
import {
    type CSSProperties,
    type KeyboardEvent as ReactKeyboardEvent,
    type PointerEvent as ReactPointerEvent,
    useCallback,
    useRef,
    useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;
const SWIPE_THRESHOLD = 48;
const STATIC_FLICKER_MS = 190;

export default function RetroTvProjects() {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const [switching, setSwitching] = useState(false);
    const reducedMotion = useReducedMotion();

    const dragState = useRef({ active: false, startX: 0 });
    const flickerTimer = useRef<number | null>(null);

    const active = projects[index];
    const cover = active.images[0];
    const total = projects.length;

    const flicker = useCallback(() => {
        if (reducedMotion) return;
        setSwitching(true);
        if (flickerTimer.current) window.clearTimeout(flickerTimer.current);
        flickerTimer.current = window.setTimeout(() => setSwitching(false), STATIC_FLICKER_MS);
    }, [reducedMotion]);

    const changeChannel = useCallback(
        (nextIndex: number, dir: 1 | -1) => {
            setDirection(dir);
            setIndex((nextIndex + total) % total);
            flicker();
        },
        [flicker, total],
    );

    const goNext = useCallback(() => changeChannel(index + 1, 1), [changeChannel, index]);
    const goPrev = useCallback(() => changeChannel(index - 1, -1), [changeChannel, index]);

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        dragState.current = { active: true, startX: event.clientX };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragState.current.active) return;
        const delta = event.clientX - dragState.current.startX;
        dragState.current.active = false;

        if (Math.abs(delta) > SWIPE_THRESHOLD) {
            if (delta < 0) {
                goNext();
            } else {
                goPrev();
            }
        }
    };

    const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            goNext();
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            goPrev();
        }
    };

    const slideVariants = {
        enter: (dir: 1 | -1) => ({ opacity: 0, x: dir * 26, scale: 1.02 }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (dir: 1 | -1) => ({ opacity: 0, x: dir * -26, scale: 0.98 }),
    };

    return (
        <div className="retrotv-layout">
            {/* ── The set ── */}
            <div className="retrotv-stage">
                <div className="retrotv-antenna" aria-hidden>
                    <span className="retrotv-antenna-arm retrotv-antenna-arm--left" />
                    <span className="retrotv-antenna-arm retrotv-antenna-arm--right" />
                    <span className="retrotv-antenna-hub" />
                </div>

                <div className="retrotv-chassis">
                    <div className="retrotv-chassis-vents" aria-hidden>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} />
                        ))}
                    </div>

                    <div className="retrotv-screen-bezel">
                        <div
                            className="retrotv-screen"
                            role="group"
                            tabIndex={0}
                            aria-label={`Project channel ${index + 1} of ${total}: ${active.title}. Use arrow keys or swipe to change.`}
                            onPointerDown={onPointerDown}
                            onPointerUp={onPointerUp}
                            onKeyDown={onKeyDown}
                        >
                            <AnimatePresence custom={direction} initial={false}>
                                <motion.div
                                    key={active.id}
                                    className="retrotv-screen-frame"
                                    custom={direction}
                                    variants={reducedMotion ? undefined : slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.32, ease: EASE }}
                                >
                                    <Image
                                        src={cover.src}
                                        alt={cover.alt}
                                        fill
                                        className="retrotv-image"
                                        sizes="(max-width: 720px) 90vw, 420px"
                                        priority={index === 0}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            <div className="retrotv-scanlines" aria-hidden />
                            <div className="retrotv-vignette" aria-hidden />
                            <div className={`retrotv-static${switching ? " is-active" : ""}`} aria-hidden />

                            <div className="retrotv-channel-badge">
                                <span className="retrotv-channel-no">CH {String(index + 1).padStart(2, "0")}</span>
                                <span className="retrotv-channel-name">{active.title}</span>
                            </div>
                        </div>
                    </div>

                    <div className="retrotv-control-panel">
                        <div className="retrotv-speaker" aria-hidden>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <span key={i} />
                            ))}
                        </div>

                        <div className="retrotv-controls">
                            <button type="button" className="retrotv-btn" onClick={goPrev} aria-label="Previous channel" data-hover>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                                    <path d="M9 2L3 7l6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            <div className="retrotv-dial" aria-hidden style={{ "--dial-angle": `${(index / Math.max(total - 1, 1)) * 210 - 105}deg` } as CSSProperties}>
                                <span className="retrotv-dial-knob" />
                            </div>

                            <button type="button" className="retrotv-btn" onClick={goNext} aria-label="Next channel" data-hover>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                                    <path d="M5 2l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <span className="retrotv-brand">GM&middot;TV</span>
                    </div>
                </div>

                <div className="retrotv-stage-shadow" aria-hidden />
            </div>

            {/* ── Info + channel picker ── */}
            <div className="retrotv-info">
                <p className="retrotv-info-kicker">
                    {active.category} &middot; {active.platform}
                </p>
                <h3 className="retrotv-info-title">{active.title}</h3>
                <p className="retrotv-info-summary">{active.summary}</p>

                <div className="tag-group retrotv-info-stack">
                    {active.stack.map((item) => (
                        <span key={item} className="tag">
                            {item}
                        </span>
                    ))}
                </div>

                <div className="retrotv-info-actions">
                    <Link href={`/projects/${active.id}`} className="button button-primary" data-hover>
                        View full project
                    </Link>
                    <p className="retrotv-info-hint">Drag the screen or use the ‹ › buttons to change channel</p>
                </div>

                <div className="retrotv-channel-list" aria-label="All project channels">
                    {projects.map((project, i) => (
                        <button
                            key={project.id}
                            type="button"
                            className={`retrotv-channel-chip${i === index ? " is-active" : ""}`}
                            onClick={() => changeChannel(i, i > index ? 1 : -1)}
                            data-hover
                        >
                            <span className="retrotv-channel-chip-no">{String(i + 1).padStart(2, "0")}</span>
                            <span className="retrotv-channel-chip-name">{project.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
