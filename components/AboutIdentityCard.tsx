"use client";

import Image from "next/image";
import type { PointerEvent as ReactPointerEvent } from "react";
import { startTransition, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
// Use the hero portrait image for the ID card photo
import cardPortrait from "@/assets/images/portofolio_img.png";
import { profile } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;
const INITIAL_ROTATION = { x: -6, y: 10 };

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export default function AboutIdentityCard() {
  const reducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isBackVisible, setIsBackVisible] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const holoRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(INITIAL_ROTATION);
  const dragRef = useRef({
    active: false,
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    ox: INITIAL_ROTATION.x,
    oy: INITIAL_ROTATION.y,
  });

  const id = profile.identityCard;
  const fields = id.fields ?? [];

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setIsOpen(false); setIsBackVisible(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    rotationRef.current = INITIAL_ROTATION;
    gsap.set(tiltRef.current, { rotateX: INITIAL_ROTATION.x, rotateY: INITIAL_ROTATION.y, scale: 1 });
  }, [isOpen]);

  useEffect(() => {
    if (reducedMotion || !isOpen || !stageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(glowRef.current,
        { scale: 0.94, opacity: 0.5 },
        { scale: 1.12, opacity: 0.82, duration: 5.5, ease: "sine.inOut", repeat: -1, yoyo: true }
      );
    }, stageRef);
    return () => ctx.revert();
  }, [isOpen, reducedMotion]);

  // Mouse-move holographic shimmer — tracks pointer over the stage
  useEffect(() => {
    if (reducedMotion || !isOpen || !stageRef.current || !holoRef.current) return;
    const stage = stageRef.current;

    const onMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;   // 0..1
      if (holoRef.current) {
        // Shift the holo gradient position based on pointer
        const dx = px * 100;
        const dy = py * 100;
        holoRef.current.style.background = `radial-gradient(ellipse at ${dx}% ${dy}%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
      }
    };

    stage.addEventListener("mousemove", onMove);
    return () => stage.removeEventListener("mousemove", onMove);
  }, [isOpen, reducedMotion]);

  const closeModal = () => startTransition(() => { setIsOpen(false); setIsBackVisible(false); });
  const openModal = () => startTransition(() => setIsOpen(true));
  const toggleFace = () => startTransition(() => setIsBackVisible((c) => !c));

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, ox: rotationRef.current.x, oy: rotationRef.current.y };
    gsap.to(tiltRef.current, { scale: 1.022, duration: 0.18, ease: "power2.out", overwrite: true });
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const rx = clamp(dragRef.current.ox - (e.clientY - dragRef.current.startY) * 0.13, -28, 28);
    const ry = clamp(dragRef.current.oy + (e.clientX - dragRef.current.startX) * 0.15, -38, 38);
    rotationRef.current = { x: rx, y: ry };
    gsap.set(tiltRef.current, { rotateX: rx, rotateY: ry, scale: 1.022 });
  };
  const onPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    if (dragRef.current.pointerId !== null && e.currentTarget.hasPointerCapture(dragRef.current.pointerId))
      e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
    dragRef.current.active = false;
    gsap.to(tiltRef.current, { scale: 1, duration: 0.28, ease: "power2.out", overwrite: true });
  };

  return (
    <div className="idlauncher-root">
      <motion.div
        className="idlauncher-wrap"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="idlauncher-text">
          <span className="idlauncher-eyebrow">Student</span>
          <h3 className="idlauncher-heading">Identity<br/>Card</h3>
          <p className="idlauncher-sub">
            A small digital card with the basics.
            Flip it for a plain Indonesia map.
          </p>
          <motion.button
            type="button"
            className="idlauncher-btn"
            onClick={openModal}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            data-hover
          >
            <span>View Card</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>

        <div className="idlauncher-preview-area" aria-hidden>
          <div className="idlauncher-card-stack">
            <div className="idlauncher-card-back-deco" />
            <div className="idlauncher-card-preview">
              <div className="idlprev-header">
                <div className="idlprev-flag"><span /><span /></div>
                <span className="idlprev-title">STUDENT ID</span>
                <div className="idlprev-emblem">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(30,90,180,0.3)" strokeWidth="1.2"/>
                    <path d="M12 5L13.5 9.5H18L14.5 12L16 16.5L12 14L8 16.5L9.5 12L6 9.5H10.5Z" fill="rgba(30,90,180,0.22)"/>
                  </svg>
                </div>
              </div>
              <div className="idlprev-body">
                <div className="idlprev-photo-box" />
                <div className="idlprev-lines">
                  {[70,52,80,60,44].map((w,i)=>(
                    <span key={i} style={{width:`${w}%`}}/>
                  ))}
                </div>
              </div>
              <div className="idlprev-footer">
                {[2,1,3,1,2,1,1,2,3,1,2,1,1,3,2,1,2,1].map((w,i)=>(
                  <span key={i} style={{width:`${w}px`}}/>
                ))}
              </div>
            </div>
          </div>
          <div className="idl-tag idl-tag-2">Personal ID</div>
        </div>
      </motion.div>

      {isMounted ? createPortal(
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              className="idcard-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}
            >
              <motion.div
                className="idcard-modal-shell"
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.98 }}
                transition={{ duration: 0.36, ease: EASE }}
              >
                <div className="idcard-modal-toolbar">
                  <div className="idcard-modal-copy">
                    <p className="eyebrow">Student ID</p>
                  </div>
                  <div className="idcard-modal-actions">
                    <button type="button" className="button button-primary button-compact" onClick={toggleFace} data-hover>
                      {isBackVisible ? "Show Front" : "Flip Card"}
                    </button>
                    <button type="button" className="idcard-modal-close" onClick={closeModal} aria-label="Close" data-hover>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                        <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div ref={stageRef} className="idcard-modal-stage">
                  <div ref={glowRef} className="idcard-modal-glow" aria-hidden />

                  {/* Mouse-tracking holographic glint */}
                  <div ref={holoRef} className="idcard-holo-glint" aria-hidden />

                  <div
                    ref={tiltRef}
                    className="idcard-canvas"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerEnd}
                    onPointerCancel={onPointerEnd}
                  >
                    <motion.div
                      className="idcard-rotation-layer"
                      animate={{ rotateY: isBackVisible ? 180 : 0 }}
                      transition={{ duration: reducedMotion ? 0.01 : 0.82, ease: EASE }}
                    >
                      <span className="idcard-edge idcard-edge-top" aria-hidden />
                      <span className="idcard-edge idcard-edge-right" aria-hidden />
                      <span className="idcard-edge idcard-edge-bottom" aria-hidden />
                      <span className="idcard-edge idcard-edge-left" aria-hidden />

                      {/* ══ FRONT ══ */}
                      <article className="idcard-face idcard-face-front">
                        <div className="idcf-bg-pattern" aria-hidden />
                        <div className="idcf-map-wm" aria-hidden>
                          <svg viewBox="0 0 300 100" fill="none">
                            <path d="M8 42 Q18 34 34 37 Q44 32 56 36 Q68 31 82 35 Q96 30 112 34 Q126 29 142 33 Q156 28 172 33 Q184 30 196 35 Q208 32 222 37 Q234 34 248 40 Q258 44 252 50 Q240 46 226 50 Q212 46 198 50 Q184 46 170 50 Q156 46 142 50 Q128 46 114 50 Q100 46 86 50 Q72 46 58 50 Q44 46 34 52 Q22 49 12 54 Q4 50 8 42Z" fill="currentColor" fillOpacity="0.055"/>
                            <path d="M258 48 Q270 44 284 48 Q292 52 287 57 Q275 54 264 57 Q255 54 258 48Z" fill="currentColor" fillOpacity="0.045"/>
                          </svg>
                        </div>

                        <div className="idcf-header">
                          <div className="idcf-flag"><span /><span /></div>
                          <div className="idcf-header-copy">
                            <span className="idcf-card-type">{id.label}</span>
                          </div>
                          <div className="idcf-emblem" aria-hidden>
                            <svg viewBox="0 0 40 40" fill="none">
                              <circle cx="20" cy="20" r="18" stroke="rgba(30,100,200,0.25)" strokeWidth="1.4"/>
                              <circle cx="20" cy="20" r="11" stroke="rgba(30,100,200,0.15)" strokeWidth="1"/>
                              <path d="M20 9L22 16H29.5L23.5 20.5L25.5 27.5L20 23.5L14.5 27.5L16.5 20.5L10.5 16H18Z" fill="rgba(30,100,200,0.18)"/>
                            </svg>
                          </div>
                        </div>

                        {/* KTP body: fields left + photo right */}
                        <div className="idcf-body">
                          <div className="idcf-fields-col">
                            <div className="idcf-field-row idcf-nik-row">
                              <span className="idcf-fl">Identity Number</span>
                              <span className="idcf-sep">:</span>
                              <span className="idcf-nik-val">{id.serial}</span>
                            </div>
                            <div className="idcf-rule" />
                            {fields.map((f) => (
                              <div key={f.label} className="idcf-field-row">
                                <span className="idcf-fl">{f.label}</span>
                                <span className="idcf-sep">:</span>
                                <span className="idcf-fv">{f.value}</span>
                              </div>
                            ))}
                          </div>

                          <div className="idcf-photo-col">
                            <div className="idcf-photo-frame">
                              <Image
                                src={cardPortrait}
                                alt={`Portrait of ${profile.name}`}
                                fill
                                className="idcf-photo-img"
                                sizes="(max-width: 640px) 100px, 112px"
                                priority
                              />
                            </div>
                            <div className="idcf-photo-caption">
                              <span>Indonesia</span>
                              <span>Issued 2026</span>
                            </div>
                          </div>
                        </div>

                        <div className="idcf-footer">
                          <div className="idcf-barcode" aria-hidden>
                            {[2,1,3,1,2,1,1,2,3,1,2,1,1,3,2,1,2,1,3,1,1,2,1,3,2,1].map((w,i)=>(
                              <span key={i} style={{width:`${w}px`}}/>
                            ))}
                          </div>
                          <div className="idcf-chip" aria-hidden><span/><span/><span/></div>
                        </div>
                      </article>

                      {/* ══ BACK ══ */}
                      <article className="idcard-face idcard-face-back">
                        <div className="idcb-bg-pattern" aria-hidden />

                        <div className="idcb-header">
                          <div className="idcf-flag"><span /><span /></div>
                          <div className="idcb-header-copy">
                            <span className="idcb-card-type">INDONESIA</span>
                          </div>
                          <span className="idcb-status is-ready">Plain map</span>
                        </div>

                        <div className="idcb-map-frame">
                          <div className="idcb-map-host">
                            <span className="idcb-map-grid" aria-hidden />
                            <svg className="idcb-indonesia-map" viewBox="0 0 640 320" fill="none" aria-hidden>
                              <path className="island island-sumatra" d="M78 143C61 127 58 104 70 86C85 64 113 67 129 86C148 108 177 120 186 143C194 164 177 185 153 182C126 178 103 167 78 143Z" />
                              <path className="island island-java" d="M176 221C218 211 270 210 315 220C326 223 329 235 318 241C270 252 216 249 173 237C162 233 164 224 176 221Z" />
                              <path className="island island-kalimantan" d="M250 88C287 58 351 61 386 94C417 123 405 177 364 197C322 216 263 198 241 158C228 134 229 106 250 88Z" />
                              <path className="island island-sulawesi" d="M420 125C443 98 475 99 486 123C493 139 479 153 463 161C485 166 506 184 500 203C494 223 465 214 449 193C436 214 410 228 395 214C380 200 397 177 418 168C398 155 403 139 420 125Z" />
                              <path className="island island-papua" d="M520 137C555 112 602 117 623 147C643 175 623 215 586 219C550 223 516 199 503 171C496 156 504 145 520 137Z" />
                              <path className="island island-bali" d="M334 239C348 235 363 237 373 244C361 253 343 253 334 239Z" />
                              <path className="island island-ntt" d="M382 248C404 239 439 241 463 252C439 263 402 263 382 248Z" />
                              <path className="island island-maluku" d="M493 234C509 225 529 229 539 243C522 252 504 249 493 234Z" />
                              <path className="island island-maluku" d="M512 92C524 84 541 89 547 103C532 109 517 106 512 92Z" />
                            </svg>
                          </div>
                          <div className="idcb-vignette" aria-hidden /> 
                        </div>

                        <div className="idcb-footer">
                          <span className="idcb-coords">Nusantara</span>
                          <span className="idcb-owner">{id.issuedBy}</span>
                        </div>
                      </article>

                    </motion.div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body
      ) : null}
    </div>
  );
}
