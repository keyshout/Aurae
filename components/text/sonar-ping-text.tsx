"use client";

/**
 * @component SonarPingText
 * @description Text starts invisible. A periodic wave sweeps left to right,
 * illuminating touched characters with a phosphorescent glow that fades.
 * Based on position-based triggering + wave propagation.
 *
 * @example
 * ```tsx
 * import { SonarPingText } from '@/components/text/sonar-ping-text';
 *
 * <SonarPingText
 *   text="Detect Signal"
 *   interval={3000}
 *   waveSpeed={0.02}
 *   glowColor="#22d3ee"
 *   className="text-5xl font-bold"
 * />
 * ```
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface SonarPingTextProps {
    /** Text to display */
    text: string;
    /** Interval between sonar pings in ms. Default: 3000 */
    interval?: number;
    /** Wave speed (0–1 per frame). Default: 0.02 */
    waveSpeed?: number;
    /** Width of the wave front (0–1). Default: 0.15 */
    waveWidth?: number;
    /** Glow color for illuminated characters. Default: "#22d3ee" */
    glowColor?: string;
    /** Base text color when not illuminated. Default: "rgba(255,255,255,0.08)" */
    baseColor?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const SonarPingText: React.FC<SonarPingTextProps> = ({
    text,
    interval = 3000,
    waveSpeed = 0.02,
    waveWidth = 0.15,
    glowColor = "#22d3ee",
    baseColor = "rgba(255,255,255,0.08)",
    className = "",
    ariaLabel,
}) => {
    const [charIntensities, setCharIntensities] = useState<number[]>(
        () => new Array(text.length).fill(0)
    );
    const wavePositionRef = useRef(-0.2);
    const rafRef = useRef<number>(0);
    const intervalRef = useRef<ReturnType<typeof setInterval>>();

    const animateWave = useCallback(() => {
        wavePositionRef.current += waveSpeed;

        if (wavePositionRef.current > 1.3) {
            cancelAnimationFrame(rafRef.current);
            return;
        }

        const pos = wavePositionRef.current;
        const intensities = Array.from({ length: text.length }, (_, i) => {
            const charPos = text.length > 1 ? i / (text.length - 1) : 0.5;
            const dist = Math.abs(charPos - pos);
            if (dist < waveWidth) {
                return 1 - dist / waveWidth;
            }
            return 0;
        });

        setCharIntensities(intensities);
        rafRef.current = requestAnimationFrame(animateWave);
    }, [text.length, waveSpeed, waveWidth]);

    const startPing = useCallback(() => {
        wavePositionRef.current = -0.2;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(animateWave);
    }, [animateWave]);

    useEffect(() => {
        startPing();
        intervalRef.current = setInterval(startPing, interval);

        return () => {
            clearInterval(intervalRef.current);
            cancelAnimationFrame(rafRef.current);
        };
    }, [interval, startPing]);

    return (
        <span
            className={`inline-flex flex-wrap ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const intensity = charIntensities[i] || 0;
                return (
                    <motion.span
                        key={i}
                        animate={{
                            color:
                                intensity > 0.1
                                    ? glowColor
                                    : baseColor,
                            textShadow:
                                intensity > 0.1
                                    ? `0 0 ${8 + intensity * 20}px ${glowColor}, 0 0 ${intensity * 40}px ${glowColor}`
                                    : "none",
                            scale: 1 + intensity * 0.08,
                        }}
                        transition={{ duration: 0.05 }}
                        aria-hidden="true"
                        style={{ display: "inline-block" }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                );
            })}
        </span>
    );
};

export default SonarPingText;

