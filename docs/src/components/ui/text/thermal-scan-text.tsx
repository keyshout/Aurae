"use client";

/**
 * @component ThermalScanText
 * @description Characters emerge with thermal camera color mapping —
 * starting hot (white/yellow), cooling through red/blue to final color.
 * Principle: position-staggered temperature color gradient + decay curve.
 *
 * @example
 * ```tsx
 * import { ThermalScanText } from '@/components/text/thermal-scan-text';
 *
 * <ThermalScanText
 *   text="Scanning..."
 *   scanSpeed={0.08}
 *   className="text-5xl font-black"
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ThermalScanTextProps {
    /** Text to display */
    text: string;
    /** Time between character scans in seconds. Default: 0.08 */
    scanSpeed?: number;
    /** Cooling duration per character in seconds. Default: 1.2 */
    coolDuration?: number;
    /** Final text color after cooling. Default: "#e2e8f0" */
    finalColor?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

const THERMAL_GRADIENT = [
    "#ffffff",  // hottest
    "#fef08a",  // yellow
    "#fb923c",  // orange
    "#ef4444",  // red
    "#7c3aed",  // violet
    "#3b82f6",  // blue
    "#06b6d4",  // cyan
];

export const ThermalScanText: React.FC<ThermalScanTextProps> = ({
    text,
    scanSpeed = 0.08,
    coolDuration = 1.2,
    finalColor = "#e2e8f0",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [scanIndex, setScanIndex] = useState(-1);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (prefersReducedMotion) {
            setScanIndex(text.length);
            return;
        }
        setScanIndex(-1);
        let i = -1;
        const tick = () => {
            i++;
            setScanIndex(i);
            if (i < text.length) {
                timerRef.current = setTimeout(tick, scanSpeed * 1000);
            }
        };
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(tick, 300);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [text, scanSpeed, prefersReducedMotion]);

    return (
        <span
            className={`inline-block ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const isScanned = i <= scanIndex;
                const thermalAge = scanIndex - i; // How many ticks since scanned

                return (
                    <motion.span
                        key={i}
                        className="inline-block"
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={
                            isScanned
                                ? {
                                    opacity: 1,
                                    color: finalColor,
                                    textShadow: thermalAge < 3 && !prefersReducedMotion
                                        ? `0 0 12px ${THERMAL_GRADIENT[Math.min(thermalAge, THERMAL_GRADIENT.length - 1)]}`
                                        : "none",
                                }
                                : { opacity: 0.1 }
                        }
                        transition={{
                            duration: prefersReducedMotion ? 0 : coolDuration,
                            color: { duration: prefersReducedMotion ? 0 : coolDuration, ease: "easeOut" },
                            textShadow: { duration: prefersReducedMotion ? 0 : coolDuration * 0.6 },
                        }}
                        style={{
                            color: isScanned && thermalAge < THERMAL_GRADIENT.length && !prefersReducedMotion
                                ? THERMAL_GRADIENT[thermalAge]
                                : undefined,
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

export default ThermalScanText;
