"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
    children: React.ReactNode;
    delay?: number;
};

export default function ScrollAnimWrapper({ children, delay = 0 }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) return;

        const el = wrapRef.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { y: 48, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    delay,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 88%",
                        toggleActions: "play none none none",
                    },
                },
            );
        });

        return () => ctx.revert();
    }, [delay]);

    return (
        <div ref={wrapRef} style={{ opacity: 0 }}>
            {children}
        </div>
    );
}