"use client";

import Image from "next/image";
import { startTransition, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ProjectImageEntry } from "@/lib/site-data";

const EASE = [0.22, 1, 0.36, 1] as const;

type ProjectGalleryProps = {
    images: ProjectImageEntry[];
    projectId: string;
};

export default function ProjectGallery({ images, projectId }: ProjectGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const reducedMotion = useReducedMotion();
    const activeImage = images[activeIndex] ?? images[0];

    return (
        <div className="project-showcase-stage">
            <div className="project-showcase-frame">
                <div className="project-stage-toolbar" aria-hidden>
                    <div className="project-stage-dots">
                        <span className="project-stage-dot" />
                        <span className="project-stage-dot" />
                        <span className="project-stage-dot" />
                    </div>
                </div>

                <div className="project-stage-image-shell">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={`${projectId}-${activeIndex}`}
                            className="project-stage-image-layer"
                            initial={reducedMotion ? false : { opacity: 0, scale: 0.98, y: 12 }}
                            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01, y: -8 }}
                            transition={{ duration: 0.42, ease: EASE }}
                        >
                            <Image
                                src={activeImage.src}
                                alt={activeImage.alt}
                                fill
                                className="project-stage-image"
                                sizes="(max-width: 1100px) 100vw, 56vw"
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="project-stage-caption">
                <div className="project-stage-caption-copy">
                    <span className="project-stage-caption-label">Current screen</span>
                    <strong>{activeImage.label}</strong>
                </div>
                <span className="project-stage-count">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </span>
            </div>

            {images.length > 1 ? (
                <div className="project-thumb-grid" aria-label={`${projectId} screens`}>
                    {images.map((image, imageIndex) => {
                        const isActive = imageIndex === activeIndex;

                        return (
                            <button
                                key={image.label}
                                type="button"
                                className={`project-thumb${isActive ? " is-active" : ""}`}
                                onClick={() => {
                                    if (imageIndex === activeIndex) return;
                                    startTransition(() => setActiveIndex(imageIndex));
                                }}
                                aria-pressed={isActive}
                                data-hover
                            >
                                <span className="project-thumb-frame">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="project-thumb-image"
                                        sizes="(max-width: 640px) 30vw, (max-width: 1100px) 28vw, 16vw"
                                    />
                                </span>
                                <span className="project-thumb-copy">
                                    <span className="project-thumb-index">{String(imageIndex + 1).padStart(2, "0")}</span>
                                    <span className="project-thumb-label">{image.label}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}
