"use client";

/**
 * @component GlitchConfirmButton
 * @description Click triggers a brief glitch effect (horizontal shift + chromatic split),
 * then transitions to a confirmed state.
 * Principle: translateX noise + RGB channel separation + state transition.
 *
 * @example
 * ```tsx
 * import { GlitchConfirmButton } from '@/components/buttons/glitch-confirm-button';
 *
 * <GlitchConfirmButton
 *   label="Submit"
 *   confirmedLabel="✓ Done"
 *   onClick={() => console.log('confirmed!')}
 * />
 * ```
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface GlitchConfirmButtonProps {
    /** Default label */
    label?: string;
    /** Label after confirmation */
    confirmedLabel?: string;
    /** Click handler */
    onClick?: () => void;
    /** Glitch duration in ms. Default: 400 */
    glitchDuration?: number;
    /** Auto-reset after ms (0 = no reset). Default: 2000 */
    autoResetMs?: number;
    /** Additional class names */
    className?: string;
}

export const GlitchConfirmButton: React.FC<GlitchConfirmButtonProps> = ({
    label = "Confirm",
    confirmedLabel = "✓ Confirmed",
    onClick,
    glitchDuration = 400,
    autoResetMs = 2000,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [phase, setPhase] = useState<"idle" | "glitching" | "confirmed">("idle");
    const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    const handleClick = () => {
        if (phase !== "idle") return;

        if (prefersReducedMotion) {
            setPhase("confirmed");
            onClick?.();
            if (autoResetMs > 0) {
                const t = setTimeout(() => setPhase("idle"), autoResetMs);
                timerRefs.current.push(t);
            }
            return;
        }

        setPhase("glitching");
        const t1 = setTimeout(() => {
            setPhase("confirmed");
            onClick?.();
        }, glitchDuration);
        timerRefs.current.push(t1);

        if (autoResetMs > 0) {
            const t2 = setTimeout(() => setPhase("idle"), glitchDuration + autoResetMs);
            timerRefs.current.push(t2);
        }
    };

    useEffect(() => {
        return () => timerRefs.current.forEach(clearTimeout);
    }, []);

    return (
        <motion.button
            className={`relative overflow-hidden px-6 py-3 rounded-xl font-semibold cursor-pointer select-none ${className}`}
            style={{
                background: phase === "confirmed"
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "#fff",
            }}
            onClick={handleClick}
            animate={
                phase === "glitching"
                    ? {
                        x: [0, -4, 6, -2, 4, 0],
                        skewX: [0, -2, 3, -1, 0],
                    }
                    : { x: 0, skewX: 0 }
            }
            transition={{ duration: glitchDuration / 1000 }}
            whileTap={phase === "idle" && !prefersReducedMotion ? { scale: 0.97 } : {}}
        >
            {/* Chromatic split layers during glitch */}
            {phase === "glitching" && !prefersReducedMotion && (
                <>
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen"
                        style={{ color: "rgba(255, 0, 0, 0.5)" }}
                        animate={{ x: [-3, 3, -2, 1, 0] }}
                        transition={{ duration: glitchDuration / 1000 }}
                        aria-hidden="true"
                    >
                        {label}
                    </motion.span>
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen"
                        style={{ color: "rgba(0, 255, 255, 0.5)" }}
                        animate={{ x: [3, -3, 2, -1, 0] }}
                        transition={{ duration: glitchDuration / 1000 }}
                        aria-hidden="true"
                    >
                        {label}
                    </motion.span>
                </>
            )}

            {/* Main label */}
            <motion.span
                className="relative z-10"
                animate={{
                    opacity: phase === "glitching" ? [1, 0.5, 1, 0.7, 1] : 1,
                }}
                transition={{ duration: glitchDuration / 1000 }}
            >
                {phase === "confirmed" ? confirmedLabel : label}
            </motion.span>
        </motion.button>
    );
};

export default GlitchConfirmButton;
