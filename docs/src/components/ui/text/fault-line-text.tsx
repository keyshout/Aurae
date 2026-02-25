"use client";

/**
 * @component FaultLineText
 * @description Text splits along a horizontal fault line like tectonic plates,
 * the top half shifts one direction, bottom the other, then snaps back.
 * Principle: clip-path split + translateX stagger + spring return.
 *
 * @example
 * ```tsx
 * import { FaultLineText } from '@/components/text/fault-line-text';
 *
 * <FaultLineText
 *   text="Tectonic"
 *   splitOffset={20}
 *   className="text-6xl font-black text-white"
 * />
 * ```
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface FaultLineTextProps {
    /** Text to display */
    text: string;
    /** Horizontal shift amount in px. Default: 20 */
    splitOffset?: number;
    /** Vertical position of fault line (0-100%). Default: 50 */
    faultPosition?: number;
    /** Animation duration in seconds. Default: 0.6 */
    duration?: number;
    /** Trigger on hover or mount. Default: "hover" */
    triggerOn?: "hover" | "mount";
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const FaultLineText: React.FC<FaultLineTextProps> = ({
    text,
    splitOffset = 20,
    faultPosition = 50,
    duration = 0.6,
    triggerOn = "hover",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isActive, setIsActive] = useState(triggerOn === "mount");

    const spring = {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        duration: prefersReducedMotion ? 0 : duration,
    };

    return (
        <span
            className={`relative inline-block cursor-default ${className}`}
            role="text"
            aria-label={ariaLabel || text}
            onMouseEnter={triggerOn === "hover" ? () => setIsActive(true) : undefined}
            onMouseLeave={triggerOn === "hover" ? () => setIsActive(false) : undefined}
        >
            {/* Top half */}
            <motion.span
                className="block"
                style={{
                    clipPath: `inset(0 0 ${100 - faultPosition}% 0)`,
                }}
                animate={{
                    x: isActive && !prefersReducedMotion ? splitOffset : 0,
                }}
                transition={spring}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Bottom half */}
            <motion.span
                className="block absolute inset-0"
                style={{
                    clipPath: `inset(${faultPosition}% 0 0 0)`,
                }}
                animate={{
                    x: isActive && !prefersReducedMotion ? -splitOffset : 0,
                }}
                transition={spring}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Fault line glow */}
            <motion.div
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{
                    top: `${faultPosition}%`,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                }}
                animate={{
                    opacity: isActive && !prefersReducedMotion ? 1 : 0,
                    scaleX: isActive ? 1 : 0.5,
                }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                aria-hidden="true"
            />
        </span>
    );
};

export default FaultLineText;
