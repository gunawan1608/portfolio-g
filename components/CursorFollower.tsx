"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.style.cursor = "none";

    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let visible = false;
    let raf = 0;

    // Position both off-screen initially via style (avoid GSAP initial state conflict)
    dot.style.opacity = "0";
    ring.style.opacity = "0";
    dot.style.transform = "translate(-200px, -200px) translate(-50%, -50%)";
    ring.style.transform = "translate(-200px, -200px) translate(-50%, -50%)";

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

      raf = requestAnimationFrame(tick);
    };

    const show = () => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.18, overwrite: true });
      }
    };

    const hide = () => {
      if (visible) {
        visible = false;
        gsap.to([dot, ring], { opacity: 0, duration: 0.18, overwrite: true });
      }
    };

    const expand = () => {
      gsap.to(dot, { scale: 1.6, duration: 0.2, overwrite: true });
      gsap.to(ring, { scale: 1.3, duration: 0.25, overwrite: true });
    };

    const shrink = () => {
      gsap.to(dot, { scale: 1, duration: 0.2, overwrite: true });
      gsap.to(ring, { scale: 1, duration: 0.25, overwrite: true });
    };

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      show();
    };

    const onOver = (e: Event) => {
      if ((e.target as HTMLElement)?.closest("a, button, [data-hover]")) expand();
    };

    const onOut = (e: Event) => {
      const t = e.target as HTMLElement;
      const rel = (e as MouseEvent).relatedTarget as HTMLElement;
      if (t?.closest("a, button, [data-hover]") && !rel?.closest("a, button, [data-hover]")) shrink();
    };

    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.1, overwrite: true });
    const onUp = () => shrink();

    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}