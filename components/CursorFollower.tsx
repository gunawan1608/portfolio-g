"use client";

import { useEffect, useRef } from "react";

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactViewport = window.matchMedia("(max-width: 900px)").matches;
    if (!supportsFinePointer || reduced || compactViewport) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let visible = false;
    let raf = 0;
    let targetX = -120;
    let targetY = -120;
    let ringX = targetX;
    let ringY = targetY;
    let targetScale = 1;
    let ringScale = 1;

    const place = (element: HTMLDivElement, x: number, y: number, scale: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    const animate = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ringScale += (targetScale - ringScale) * 0.2;

      place(dot, targetX, targetY, targetScale);
      place(ring, ringX, ringY, ringScale);

      if (visible) {
        raf = window.requestAnimationFrame(animate);
      }
    };

    place(dot, targetX, targetY, 1);
    place(ring, ringX, ringY, 1);
    dot.style.opacity = "0";
    ring.style.opacity = "0";

    const show = () => {
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        raf = window.requestAnimationFrame(animate);
      }
    };

    const hide = () => {
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }

      if (visible) {
        visible = false;
        dot.style.opacity = "0";
        ring.style.opacity = "0";
      }
    };

    const expand = () => {
      targetScale = 1.35;
    };

    const shrink = () => {
      targetScale = 1;
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
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

    const onDown = () => {
      targetScale = 0.82;
    };
    const onUp = () => shrink();
    const onVisibilityChange = () => {
      if (document.hidden) {
        hide();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.documentElement.addEventListener("pointerleave", hide);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
