"use client";

/**
 * @component OrigamiUnfoldText
 * @description Characters unfold from a folded paper state, each with a different
 * fold axis. Uses CSS perspective + rotateX/Y for a 3D origami effect.
 * Principle: perspective rotateX/Y with staggered unfold per character.
 *
 * @example
 * ```tsx
 * import { OrigamiUnfoldText } from '@/components/text/origami-unfold-text';
 *
 * <OrigamiUnfoldText
 *   text="Unfold"
 *   foldAngle={90}
 *   className="text-6xl font-black text-white"
 * />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface OrigamiUnfoldTextProps {
    /** Text to display */
    text: string;
    /** Maximum fold angle in degrees. Default: 90 */
    foldAngle?: number;
    /** Stagger delay per character in seconds. Default: 0.08 */
    stagger?: number;
    /** Unfold duration per character in seconds. Default: 0.6 */
    duration?: number;
    /** Perspective distance in px. Default: 600 */
    perspective?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const OrigamiUnfoldText: React.FC<OrigamiUnfoldTextProps> = ({
    text,
    foldAngle = 90,
    stagger = 0.08,
    duration = 0.6,
    perspective = 600,
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();

    const getFoldAxis = (i: number) => {
        const axes = [
            { rotateX: foldAngle, rotateY: 0 },       // fold from top
            { rotateX: -foldAngle, rotateY: 0 },      // fold from bottom
            { rotateX: 0, rotateY: foldAngle },        // fold from right
            { rotateX: 0, rotateY: -foldAngle },       // fold from left
            { rotateX: foldAngle / 2, rotateY: foldAngle / 2 }, // diagonal
        ];
        return axes[i % axes.length];
    };

    return (
        <span
            className={`inline-flex flex-wrap ${className}`}
            style={{ perspective }}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const fold = getFoldAxis(i);

                return (
                    <motion.span
                        key={i}
                        className="inline-block origin-center"
                        style={{ transformStyle: "preserve-3d" }}
                        initial={
                            prefersReducedMotion
                                ? { opacity: 1 }
                                : {
                                    rotateX: fold.rotateX,
                                    rotateY: fold.rotateY,
                                    opacity: 0,
                                    scale: 0.6,
                                }
                        }
                        animate={{
                            rotateX: 0,
                            rotateY: 0,
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: prefersReducedMotion ? 0 : duration,
                            delay: prefersReducedMotion ? 0 : i * stagger,
                            ease: [0.34, 1.56, 0.64, 1], // bounce easing
                        }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                );
            })}
        </span>
    );
};

export default OrigamiUnfoldText;
