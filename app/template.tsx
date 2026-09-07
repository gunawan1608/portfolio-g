"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

// Next.js re-mounts `template.tsx` on every navigation (unlike layout.tsx,
// which persists), so a plain mount-in animation here gives every route
// change — including going to a project page and back — a consistent,
// deliberate entrance instead of an abrupt cut.
export default function Template({ children }: { children: React.ReactNode }) {
    const reducedMotion = useReducedMotion();

    if (reducedMotion) {
        return <>{children}</>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: EASE }}
        >
            {children}
        </motion.div>
    );
}
