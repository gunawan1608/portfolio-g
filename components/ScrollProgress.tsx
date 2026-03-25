"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
    useEffect(() => {
        const bar = document.getElementById("scroll-bar");
        if (!bar) return;
        gsap.to(bar, {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: document.documentElement,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.2,
            },
        });
    }, []);
    return <div id="scroll-bar" aria-hidden />;
}