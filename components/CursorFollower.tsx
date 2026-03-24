"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CursorFollower() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(pointer: coarse)").matches) return;

        document.body.style.cursor = "none";
        const dot = dotRef.current!;
        const ring = ringRef.current!;

        const onMove = (e: MouseEvent) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power3.out" });
            gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.36, ease: "power2.out" });
        };

        const addHover = () => {
            document.querySelectorAll<HTMLElement>("a,button,[data-hover]").forEach(el => {
                el.addEventListener("mouseenter", () => { dot.classList.add("on"); ring.classList.add("on"); });
                el.addEventListener("mouseleave", () => { dot.classList.remove("on"); ring.classList.remove("on"); });
            });
        };

        window.addEventListener("mousemove", onMove);
        const t = setTimeout(addHover, 600);

        return () => {
            window.removeEventListener("mousemove", onMove);
            document.body.style.cursor = "";
            clearTimeout(t);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="c-dot" aria-hidden />
            <div ref={ringRef} className="c-ring" aria-hidden />
        </>
    );
}