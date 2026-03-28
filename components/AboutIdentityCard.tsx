"use client";

import Image from "next/image";
import type { PointerEvent as ReactPointerEvent } from "react";
import { startTransition, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Map as LeafletMap } from "leaflet";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import cardPortrait from "@/assets/images/image_for_card_about.png";
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
  const [isMapReady, setIsMapReady] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
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
  const coordsLabel = id.cityCoordinates.map((v) => v.toFixed(4)).join(", ");
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

  useEffect(() => {
    if (!isOpen || !mapHostRef.current || mapInstanceRef.current) return;
    let disposed = false;
    setIsMapReady(false);

    const initMap = async () => {
      const L = await import("leaflet");
      if (disposed || !mapHostRef.current) return;

      const map = L.map(mapHostRef.current, {
        attributionControl: false, zoomControl: false,
        boxZoom: false, doubleClickZoom: false,
        dragging: false, keyboard: false,
        scrollWheelZoom: false, touchZoom: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}", {
        minZoom: 3, maxZoom: 8,
      }).addTo(map);

      const bounds = L.latLngBounds(id.bounds.southWest, id.bounds.northEast);
      map.fitBounds(bounds, { padding: [16, 16] });
      map.setMaxBounds(bounds.pad(0.2));

      L.circle(id.cityCoordinates, {
        radius: 80000, color: "#e74c3c", weight: 1.5,
        fillColor: "#e74c3c", fillOpacity: 0.12,
      }).addTo(map);

      L.circleMarker(id.cityCoordinates, {
        radius: 7, color: "#ffffff", weight: 2.5,
        fillColor: "#e74c3c", fillOpacity: 1,
      }).addTo(map);

      map.whenReady(() => { if (!disposed) { map.invalidateSize(); setIsMapReady(true); } });
    };

    initMap().catch(() => setIsMapReady(false));
    return () => {
      disposed = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      setIsMapReady(false);
    };
  }, [id.bounds.northEast, id.bounds.southWest, id.cityCoordinates, isOpen]);

  useEffect(() => {
    if (!isOpen || !mapInstanceRef.current) return;
    const t = window.setTimeout(() => mapInstanceRef.current?.invalidateSize(), reducedMotion ? 0 : 860);
    return () => window.clearTimeout(t);
  }, [isBackVisible, isOpen, reducedMotion]);

  const closeModal = () => startTransition(() => { setIsOpen(false); setIsBackVisible(false); });
  const openModal = () => startTransition(() => setIsOpen(true));
  const toggleFace = () => startTransition(() => setIsBackVisible((c) => !c));

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, ox: rotationRef.current.x, oy: rotationRef.current.y };
    gsap.to(tiltRef.current, { scale: 1.018, duration: 0.18, ease: "power2.out", overwrite: true });
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const rx = clamp(dragRef.current.ox - (e.clientY - dragRef.current.startY) * 0.13, -26, 26);
    const ry = clamp(dragRef.current.oy + (e.clientX - dragRef.current.startX) * 0.15, -36, 36);
    rotationRef.current = { x: rx, y: ry };
    gsap.set(tiltRef.current, { rotateX: rx, rotateY: ry, scale: 1.018 });
  };
  const onPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    if (dragRef.current.pointerId !== null && e.currentTarget.hasPointerCapture(dragRef.current.pointerId))
      e.currentTarget.releasePointerCapture(dragRef.current.pointerId);
    dragRef.current.active = false;
    gsap.to(tiltRef.current, { scale: 1, duration: 0.22, ease: "power2.out", overwrite: true });
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
          <span className="idlauncher-eyebrow">Personal</span>
          <h3 className="idlauncher-heading">Identity<br/>Card</h3>
          <p className="idlauncher-sub">
            Front side shows my profile details.
            Flip to explore the location map.
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
                <span className="idlprev-title">IDENTITY CARD</span>
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
          <div className="idl-tag idl-tag-2">🪪 Digital ID</div>
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
                    <p className="eyebrow">Identity Card</p>
                    <p className="idcard-modal-hint">Drag to rotate · Flip to see map</p>
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
                            <span className="idcf-card-type">Identity Card</span>
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
                                sizes="(max-width: 640px) 92px, 112px"
                                priority
                              />
                            </div>
                            <div className="idcf-photo-caption">
                              <span>Jakarta, Indonesia</span>
                              <span>28 March 2026</span>
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
                            <span className="idcb-card-type">IDENTITY CARD</span>
                          </div>
                          <span className={`idcb-status ${isMapReady ? "is-ready" : ""}`}>
                            {isMapReady ? "● Live" : "● Loading"}
                          </span>
                        </div>

                        <div className="idcb-map-frame">
                          <div ref={mapHostRef} className="idcb-map-host" />
                          {!isMapReady && (
                            <div className="idcb-loading" aria-hidden>
                              <div className="idcb-loading-ring" />
                            </div>
                          )}
                          <div className="idcb-vignette" aria-hidden /> 
                        </div>

                        <div className="idcb-footer">
                        </div>
                      </article>

                    </motion.div>
                  </div>

                  <p className="idcard-drag-hint">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1"/>
                      <path d="M4 6.5h5M6.5 4v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Hold & drag to rotate in 3D
                  </p>
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
