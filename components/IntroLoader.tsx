"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/site-data";

const DURATION_MS = 1300;
const SESSION_KEY = "gm-portfolio-intro-seen";

export default function IntroLoader() {
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let alreadySeen = false;
        try {
            alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === "1";
        } catch {
            // sessionStorage can throw in some privacy modes — fall back to
            // showing the intro once per hard load, which is harmless.
            alreadySeen = false;
        }

        if (reduced || alreadySeen) {
            return;
        }

        setVisible(true);
        try {
            window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
            // ignore — non-critical
        }

        let raf = 0;
        const start = performance.now();

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / DURATION_MS);
            setProgress(Math.round(t * 100));

            if (t < 1) {
                raf = window.requestAnimationFrame(tick);
            } else {
                window.setTimeout(() => setLeaving(true), 180);
                window.setTimeout(() => setVisible(false), 820);
            }
        };

        raf = window.requestAnimationFrame(tick);
        return () => window.cancelAnimationFrame(raf);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div className={`intro-loader${leaving ? " is-leaving" : ""}`} aria-hidden>
            <div className="intro-loader-inner">
                <span className="intro-loader-kicker">{profile.name}</span>
                <div className="intro-loader-count">{String(progress).padStart(3, "0")}</div>
                <div className="intro-loader-bar">
                    <span style={{ width: `${progress}%` }} />
                </div>
                <span className="intro-loader-label">Loading portfolio</span>
            </div>
        </div>
    );
}
