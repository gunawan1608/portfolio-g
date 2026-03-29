"use client";

import { useEffect, useRef } from "react";

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supportsFinePointer || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let nativeCursorHidden = false;
    let visible = false;

    const setPosition = (element: HTMLDivElement, x: number, y: number) => {
      element.style.setProperty("--cursor-x", `${x}px`);
      element.style.setProperty("--cursor-y", `${y}px`);
    };

    const setScale = (element: HTMLDivElement, scale: number) => {
      element.style.setProperty("--cursor-scale", String(scale));
    };

    const hideNativeCursor = () => {
      if (nativeCursorHidden) {
        return;
      }

      document.body.style.cursor = "none";
      nativeCursorHidden = true;
    };

    const restoreNativeCursor = () => {
      if (!nativeCursorHidden) {
        return;
      }

      document.body.style.cursor = "";
      nativeCursorHidden = false;
    };

    setPosition(dot, -200, -200);
    setPosition(ring, -200, -200);
    setScale(dot, 1);
    setScale(ring, 1);
    dot.style.opacity = "0";
    ring.style.opacity = "0";

    const show = () => {
      if (!visible) {
        visible = true;
        hideNativeCursor();
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const hide = () => {
      if (visible) {
        visible = false;
        dot.style.opacity = "0";
        ring.style.opacity = "0";
      }

      restoreNativeCursor();
    };

    const expand = () => {
      setScale(dot, 1.6);
      setScale(ring, 1.3);
    };

    const shrink = () => {
      setScale(dot, 1);
      setScale(ring, 1);
    };

    const onMove = (e: PointerEvent) => {
      setPosition(dot, e.clientX, e.clientY);
      setPosition(ring, e.clientX, e.clientY);
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

    const onDown = () => setScale(ring, 0.85);
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
      restoreNativeCursor();
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
