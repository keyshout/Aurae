"use client";

/**
 * @component PressureWaveText
 * @description On click, characters are pushed outward by a radial pressure wave
 * like a sound shockwave, then spring back to position.
 * Principle: radial pressure wave + sinusoidal deformation + spring return.
 *
 * @example
 * ```tsx
 * import { PressureWaveText } from '@/components/text/pressure-wave-text';
 *
 * <PressureWaveText
 *   text="Shockwave"
 *   waveForce={30}
 *   className="text-5xl font-black text-white"
 * />
 * ```
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export interface PressureWaveTextProps {
    /** Text to display */
    text: string;
    /** Maximum displacement in px. Default: 25 */
    waveForce?: number;
    /** Wave speed (px per frame). Default: 8 */
    waveSpeed?: number;
    /** Wave width in px. Default: 60 */
    waveWidth?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const PressureWaveText: React.FC<PressureWaveTextProps> = ({
    text,
    waveForce = 25,
    waveSpeed = 8,
    waveWidth = 60,
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLSpanElement>(null);
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const rafRef = useRef<number>(0);
    const [waveOrigin, setWaveOrigin] = useState<number | null>(null);
    const waveRadiusRef = useRef(0);

    const triggerWave = useCallback((e: React.MouseEvent) => {
        if (prefersReducedMotion) return;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        setWaveOrigin(clickX);
        waveRadiusRef.current = 0;
    }, [prefersReducedMotion]);

    useEffect(() => {
        if (waveOrigin === null || prefersReducedMotion) return;

        const animate = () => {
            waveRadiusRef.current += waveSpeed;
            const r = waveRadiusRef.current;
            let active = false;

            spanRefs.current.forEach((span) => {
                if (!span) return;
                const rect = span.getBoundingClientRect();
                const containerRect = containerRef.current?.getBoundingClientRect();
                if (!containerRect) return;

                const charCenterX = rect.left - containerRect.left + rect.width / 2;
                const dist = Math.abs(charCenterX - waveOrigin);
                const inWave = dist > r - waveWidth && dist < r + waveWidth;

                if (inWave) {
                    const wavePos = 1 - Math.abs(dist - r) / waveWidth;
                    const displacement = Math.sin(wavePos * Math.PI) * waveForce;
                    const direction = charCenterX > waveOrigin ? 1 : -1;
                    span.style.transform = `translateX(${direction * displacement * 0.3}px) translateY(${-displacement}px)`;
                    active = true;
                } else if (dist < r - waveWidth) {
                    // Spring back
                    const current = span.style.transform;
                    if (current && current !== "none") {
                        span.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
                        span.style.transform = "translateX(0) translateY(0)";
                    }
                } else {
                    active = true;
                }
            });

            if (active) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setWaveOrigin(null);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [waveOrigin, waveForce, waveSpeed, waveWidth, prefersReducedMotion]);

    return (
        <span
            ref={containerRef}
            className={`inline-flex flex-wrap cursor-pointer select-none ${className}`}
            role="text"
            aria-label={ariaLabel || text}
            onClick={triggerWave}
        >
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    ref={(el) => { spanRefs.current[i] = el; }}
                    className="inline-block will-change-transform"
                    aria-hidden="true"
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
};

export default PressureWaveText;
