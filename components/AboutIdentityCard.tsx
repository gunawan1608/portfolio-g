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
const INITIAL_ROTATION = { x: -10, y: 14 };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

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
    originRotateX: INITIAL_ROTATION.x,
    originRotateY: INITIAL_ROTATION.y,
  });
  const identityCard = profile.identityCard;
  const coordinatesLabel = identityCard.cityCoordinates.map((value) => value.toFixed(4)).join(", ");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsBackVisible(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    rotationRef.current = INITIAL_ROTATION;
    gsap.set(tiltRef.current, {
      rotateX: INITIAL_ROTATION.x,
      rotateY: INITIAL_ROTATION.y,
      scale: 1,
    });
  }, [isOpen]);

  useEffect(() => {
    if (reducedMotion || !isOpen || !stageRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        glowRef.current,
        { scale: 0.96, opacity: 0.62 },
        {
          scale: 1.08,
          opacity: 0.88,
          duration: 5.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
    }, stageRef);

    return () => ctx.revert();
  }, [isOpen, reducedMotion]);

  useEffect(() => {
    if (!isOpen || !mapHostRef.current || mapInstanceRef.current) {
      return;
    }

    let disposed = false;
    setIsMapReady(false);

    const initializeMap = async () => {
      const L = await import("leaflet");

      if (disposed || !mapHostRef.current) {
        return;
      }

      const map = L.map(mapHostRef.current, {
        attributionControl: false,
        zoomControl: false,
        boxZoom: false,
        doubleClickZoom: false,
        dragging: false,
        keyboard: false,
        scrollWheelZoom: false,
        touchZoom: false,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        minZoom: 3,
        maxZoom: 7,
        noWrap: true,
      }).addTo(map);

      const bounds = L.latLngBounds(identityCard.bounds.southWest, identityCard.bounds.northEast);
      map.fitBounds(bounds, { padding: [28, 28] });
      map.setMaxBounds(bounds.pad(0.14));

      L.circle(identityCard.cityCoordinates, {
        radius: 120000,
        color: "#0f4e86",
        weight: 1.3,
        fillColor: "#0f4e86",
        fillOpacity: 0.14,
      }).addTo(map);

      L.circleMarker(identityCard.cityCoordinates, {
        radius: 7,
        color: "#ffffff",
        weight: 3,
        fillColor: "#0f4e86",
        fillOpacity: 1,
      }).addTo(map);

      map.whenReady(() => {
        if (!disposed) {
          map.invalidateSize();
          setIsMapReady(true);
        }
      });
    };

    initializeMap().catch(() => {
      setIsMapReady(false);
    });

    return () => {
      disposed = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      setIsMapReady(false);
    };
  }, [identityCard.bounds.northEast, identityCard.bounds.southWest, identityCard.cityCoordinates, isOpen]);

  useEffect(() => {
    if (!isOpen || !mapInstanceRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, reducedMotion ? 0 : isBackVisible ? 420 : 260);

    return () => window.clearTimeout(timer);
  }, [isBackVisible, isOpen, reducedMotion]);

  const closeModal = () => {
    startTransition(() => {
      setIsOpen(false);
      setIsBackVisible(false);
    });
  };

  const openModal = () => {
    startTransition(() => {
      setIsOpen(true);
    });
  };

  const toggleFace = () => {
    startTransition(() => {
      setIsBackVisible((current) => !current);
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originRotateX: rotationRef.current.x,
      originRotateY: rotationRef.current.y,
    };

    gsap.to(tiltRef.current, {
      scale: 1.015,
      duration: 0.18,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) {
      return;
    }

    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    const nextRotateX = clamp(dragRef.current.originRotateX - deltaY * 0.12, -24, 24);
    const nextRotateY = clamp(dragRef.current.originRotateY + deltaX * 0.14, -34, 34);

    rotationRef.current = { x: nextRotateX, y: nextRotateY };

    gsap.set(tiltRef.current, {
      rotateX: nextRotateX,
      rotateY: nextRotateY,
      scale: 1.015,
    });
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) {
      return;
    }

    if (dragRef.current.pointerId !== null && event.currentTarget.hasPointerCapture(dragRef.current.pointerId)) {
      event.currentTarget.releasePointerCapture(dragRef.current.pointerId);
    }

    dragRef.current.active = false;
    dragRef.current.pointerId = null;

    gsap.to(tiltRef.current, {
      scale: 1,
      duration: 0.18,
      ease: "power2.out",
      overwrite: true,
    });
  };

  return (
    <div className="about-identity-block">
      <motion.article
        className="about-card about-identity-launcher"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="about-identity-launcher-copy">
          <p className="eyebrow">Identity Card</p>
          <h3 className="about-identity-launcher-title">Open my identity card.</h3>
          <p className="about-identity-launcher-description">
            Front side for my profile, back side for the map.
          </p>

          <motion.button
            type="button"
            className="button button-primary"
            onClick={openModal}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            data-hover
          >
            Open Identity Card
          </motion.button>
        </div>

        <div className="about-identity-launcher-preview" aria-hidden>
          <div className="about-identity-launcher-card">
            <div className="about-identity-launcher-strip" />
            <div className="about-identity-launcher-grid">
              <div className="about-identity-launcher-lines">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="about-identity-launcher-photo" />
            </div>
          </div>
        </div>
      </motion.article>

      {isMounted
        ? createPortal(
            <AnimatePresence>
              {isOpen ? (
                <motion.div
                  className="idcard-modal-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                      closeModal();
                    }
                  }}
                >
                  <motion.div
                    className="idcard-modal-shell"
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.98 }}
                    transition={{ duration: 0.34, ease: EASE }}
                  >
                    <div className="idcard-modal-toolbar">
                      <div className="idcard-modal-copy">
                        <p className="eyebrow">Identity Card</p>
                        <p className="idcard-modal-hint">
                          Hold and drag the card to rotate it. Use flip to switch sides.
                        </p>
                      </div>

                      <div className="idcard-modal-actions">
                        <button
                          type="button"
                          className="button button-primary button-compact"
                          onClick={toggleFace}
                          data-hover
                        >
                          {isBackVisible ? "Show Front" : "Flip Card"}
                        </button>
                        <button
                          type="button"
                          className="idcard-modal-close"
                          onClick={closeModal}
                          aria-label="Close identity card"
                          data-hover
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                            <path
                              d="M2 2l10 10M12 2L2 12"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div ref={stageRef} className="idcard-modal-stage">
                      <div ref={glowRef} className="idcard-modal-glow" aria-hidden />

                      <div
                        ref={tiltRef}
                        className="idcard-canvas"
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerEnd}
                        onPointerCancel={handlePointerEnd}
                      >
                        <motion.div
                          className="idcard-rotation-layer"
                          animate={{ rotateY: isBackVisible ? 180 : 0 }}
                          transition={{
                            duration: reducedMotion ? 0.01 : 0.78,
                            ease: EASE,
                          }}
                        >
                          <article className="idcard-face idcard-face-front">
                            <div className="idcard-topbar" aria-hidden />

                            <div className="idcard-front-layout">
                              <div className="idcard-front-copy">
                                <div className="idcard-front-header">
                                  <p className="idcard-label">{identityCard.label}</p>
                                  <h4 className="idcard-owner">{profile.name}</h4>
                                </div>

                                <dl className="idcard-field-list">
                                  {identityCard.fields.map((field) => (
                                    <div
                                      key={field.label}
                                      className={`idcard-field-row${field.fullWidth ? " is-wide" : ""}`}
                                    >
                                      <dt>{field.label}</dt>
                                      <dd>{field.value}</dd>
                                    </div>
                                  ))}
                                </dl>
                              </div>

                              <div className="idcard-photo-frame">
                                <Image
                                  src={cardPortrait}
                                  alt={`Portrait of ${profile.name} for identity card`}
                                  fill
                                  className="idcard-photo"
                                  sizes="(max-width: 860px) 36vw, 260px"
                                  priority
                                />
                              </div>
                            </div>

                            <div className="idcard-footer">
                              <span>{identityCard.serial}</span>
                              <span>{identityCard.cityLabel}</span>
                            </div>
                          </article>

                          <article className="idcard-face idcard-face-back">
                            <div className="idcard-topbar" aria-hidden />

                            <div className="idcard-back-header">
                              <div>
                                <p className="idcard-label">Map Side</p>
                                <h4 className="idcard-owner">Indonesia</h4>
                              </div>
                              <span className="idcard-map-state">
                                {isMapReady ? "Ready" : "Loading"}
                              </span>
                            </div>

                            <div className="idcard-map-frame">
                              <div ref={mapHostRef} className="idcard-map" />
                              <div className="idcard-map-overlay" aria-hidden />
                              <div className="idcard-map-badge">
                                <span>Location</span>
                                <strong>{identityCard.cityLabel}</strong>
                              </div>
                            </div>

                            <div className="idcard-footer">
                              <span>{coordinatesLabel}</span>
                              <span>{profile.name}</span>
                            </div>
                          </article>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
