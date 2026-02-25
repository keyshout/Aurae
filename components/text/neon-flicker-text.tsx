"use client";

/**
 * @component NeonFlickerText
 * @description Broken neon sign effect: characters randomly flicker, dim, and
 * simulate voltage drops with varying brightness and timing.
 * Based on random timing + brightness/opacity manipulation.
 *
 * @example
 * ```tsx
 * import { NeonFlickerText } from '@/components/text/neon-flicker-text';
 *
 * <NeonFlickerText
 *   text="OPEN 24/7"
 *   color="#ff3366"
 *   flickerIntensity={0.8}
 *   className="text-6xl font-black"
 * />
 * ```
 */

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface NeonFlickerTextProps {
    /** Text to display */
    text: string;
    /** Neon glow color. Default: "#ff3366" */
    color?: string;
    /** Secondary neon color (for dual-tone). Default: same as color */
    secondaryColor?: string;
    /** Flicker intensity (0–1). Default: 0.7 */
    flickerIntensity?: number;
    /** Base brightness when not flickering (0–1). Default: 0.9 */
    baseBrightness?: number;
    /** Average flickers per second per character. Default: 0.3 */
    flickerRate?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

interface CharFlicker {
    brightness: number;
    blur: number;
    isOff: boolean;
}

export const NeonFlickerText: React.FC<NeonFlickerTextProps> = ({
    text,
    color = "#ff3366",
    secondaryColor,
    flickerIntensity = 0.7,
    baseBrightness = 0.9,
    flickerRate = 0.3,
    className = "",
    ariaLabel,
}) => {
    const resolvedSecondary = secondaryColor || color;
    const flickersRef = useRef<CharFlicker[]>(
        text.split("").map(() => ({ brightness: baseBrightness, blur: 0, isOff: false }))
    );
    const [flickers, setFlickers] = useState<CharFlicker[]>(() => [...flickersRef.current]);
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef(0);
    const nextFlickerRef = useRef<number[]>([]);

    // Store latest props in refs to avoid stale closures
    const propsRef = useRef({ text, flickerIntensity, flickerRate, baseBrightness });
    propsRef.current = { text, flickerIntensity, flickerRate, baseBrightness };

    // Initialize random flicker timings
    useEffect(() => {
        nextFlickerRef.current = text.split("").map(
            () => performance.now() + Math.random() * (2000 / flickerRate)
        );
        flickersRef.current = text.split("").map(() => ({
            brightness: baseBrightness, blur: 0, isOff: false,
        }));
    }, [text, flickerRate, baseBrightness]);

    // Stable animate function — reads from refs, never causes reattach
    const animate = useCallback((now: number) => {
        const { text: txt, flickerIntensity: fi, flickerRate: fr, baseBrightness: bb } = propsRef.current;

        if (now - lastTimeRef.current < 50) {
            rafRef.current = requestAnimationFrame(animate);
            return;
        }
        lastTimeRef.current = now;

        const prev = flickersRef.current;

        const newFlickers: CharFlicker[] = txt.split("").map((char, i) => {
            if (char === " ") return { brightness: 0, blur: 0, isOff: true };

            const nextFlicker = nextFlickerRef.current[i];

            if (now >= nextFlicker) {
                const flickerType = Math.random();
                nextFlickerRef.current[i] = now + 500 + Math.random() * (3000 / fr);

                if (flickerType < 0.15 * fi) {
                    return { brightness: 0, blur: 0, isOff: true };
                } else if (flickerType < 0.4 * fi) {
                    return {
                        brightness: 0.2 + Math.random() * 0.3,
                        blur: 2 + Math.random() * 3,
                        isOff: false,
                    };
                } else if (flickerType < 0.6 * fi) {
                    return {
                        brightness: Math.random() > 0.5 ? bb : 0.1,
                        blur: Math.random() * 4,
                        isOff: false,
                    };
                }
            }

            // Normal state — lerp back to base brightness
            const p = prev[i] || { brightness: bb, blur: 0, isOff: false };
            return {
                brightness: p.brightness + (bb - p.brightness) * 0.1,
                blur: p.blur * 0.9,
                isOff: false,
            };
        });

        flickersRef.current = newFlickers;
        setFlickers(newFlickers);
        rafRef.current = requestAnimationFrame(animate);
    }, []); // Empty deps — stable forever

    useEffect(() => {
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [animate]);

    return (
        <span
            className={`inline-flex flex-wrap font-bold ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const f = flickers[i] || { brightness: baseBrightness, blur: 0, isOff: false };
                const glowSize = f.brightness * 20;
                const useSecondary = i % 3 === 0;
                const currentColor = useSecondary ? resolvedSecondary : color;

                return (
                    <span
                        key={i}
                        className="inline-block transition-none"
                        style={{
                            color: f.isOff ? "transparent" : currentColor,
                            opacity: f.isOff ? 0.05 : f.brightness,
                            textShadow: f.isOff
                                ? "none"
                                : [
                                    `0 0 ${glowSize * 0.5}px ${currentColor}`,
                                    `0 0 ${glowSize}px ${currentColor}`,
                                    `0 0 ${glowSize * 2}px ${currentColor}40`,
                                ].join(", "),
                            filter: f.blur > 0 ? `blur(${f.blur}px)` : undefined,
                            willChange: "opacity, text-shadow, filter",
                        }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                );
            })}
        </span>
    );
};

export default NeonFlickerText;

