"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (coarsePointer || reducedMotion) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) {
      return;
    }

    document.body.style.cursor = "none";

    gsap.set([dot, ring], {
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
    });

    const moveDotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const moveRingX = gsap.quickTo(ring, "x", { duration: 0.22, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.22, ease: "power3.out" });

    const showCursor = () => {
      gsap.to([dot, ring], {
        autoAlpha: 1,
        duration: 0.16,
        overwrite: true,
      });
    };

    const hideCursor = () => {
      gsap.to([dot, ring], {
        autoAlpha: 0,
        duration: 0.18,
        overwrite: true,
      });
    };

    const activateCursor = () => {
      gsap.to(dot, { scale: 1.4, duration: 0.2, overwrite: true });
      gsap.to(ring, { scale: 1.15, duration: 0.25, overwrite: true });
    };

    const resetCursor = () => {
      gsap.to(dot, { scale: 1, duration: 0.2, overwrite: true });
      gsap.to(ring, { scale: 1, duration: 0.25, overwrite: true });
    };

    const handleMove = (event: PointerEvent) => {
      showCursor();
      moveDotX(event.clientX);
      moveDotY(event.clientY);
      moveRingX(event.clientX);
      moveRingY(event.clientY);
    };

    const handlePointerOver = (event: Event) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest("a, button, [data-hover]")) {
        activateCursor();
      }
    };

    const handlePointerOut = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const related = (event as MouseEvent).relatedTarget as HTMLElement | null;

      if (
        target?.closest("a, button, [data-hover]") &&
        !related?.closest("a, button, [data-hover]")
      ) {
        resetCursor();
      }
    };

    const handlePointerDown = () => {
      gsap.to(ring, { scale: 0.92, duration: 0.12, overwrite: true });
    };

    const handlePointerUp = () => {
      resetCursor();
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("blur", hideCursor);
    document.documentElement.addEventListener("pointerleave", hideCursor);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("blur", hideCursor);
      document.documentElement.removeEventListener("pointerleave", hideCursor);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
