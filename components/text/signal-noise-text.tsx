"use client";

/**
 * @component SignalNoiseText
 * @description Text appears like a signal received through a noisy channel —
 * characters jitter in position, opacity, and scramble, then SNR improves until clean.
 * Principle: position/opacity noise amplitude decay (signal-to-noise ratio increase).
 *
 * @example
 * ```tsx
 * import { SignalNoiseText } from '@/components/text/signal-noise-text';
 *
 * <SignalNoiseText
 *   text="Receiving..."
 *   noiseDuration={2000}
 *   className="text-4xl font-mono text-green-400"
 * />
 * ```
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

export interface SignalNoiseTextProps {
    /** Text to display */
    text: string;
    /** Duration of noise-to-clear transition in ms. Default: 2000 */
    noiseDuration?: number;
    /** Maximum position noise in px. Default: 6 */
    maxNoise?: number;
    /** Noise scramble characters. Default: "!@#$%^&*░▒▓" */
    noiseChars?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

interface CharState {
    char: string;
    x: number;
    y: number;
    opacity: number;
}

export const SignalNoiseText: React.FC<SignalNoiseTextProps> = ({
    text,
    noiseDuration = 2000,
    maxNoise = 6,
    noiseChars = "!@#$%^&*░▒▓",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [chars, setChars] = useState<CharState[]>([]);
    const rafRef = useRef<number>(0);
    const startRef = useRef(0);

    const animate = useCallback(() => {
        const elapsed = performance.now() - startRef.current;
        const progress = Math.min(1, elapsed / noiseDuration);
        const snr = progress; // 0 → 1 (noise → clean)

        const newChars: CharState[] = text.split("").map((realChar) => {
            const noiseAmp = (1 - snr) * maxNoise;
            const showReal = Math.random() < snr;

            return {
                char: showReal || realChar === " "
                    ? (realChar === " " ? "\u00A0" : realChar)
                    : noiseChars[Math.floor(Math.random() * noiseChars.length)],
                x: (Math.random() - 0.5) * 2 * noiseAmp,
                y: (Math.random() - 0.5) * 2 * noiseAmp,
                opacity: 0.3 + snr * 0.7,
            };
        });

        setChars(newChars);

        if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
        } else {
            // Final clean state
            setChars(text.split("").map((c) => ({
                char: c === " " ? "\u00A0" : c,
                x: 0, y: 0, opacity: 1,
            })));
        }
    }, [text, noiseDuration, maxNoise, noiseChars]);

    useEffect(() => {
        if (prefersReducedMotion) {
            setChars(text.split("").map((c) => ({
                char: c === " " ? "\u00A0" : c,
                x: 0, y: 0, opacity: 1,
            })));
            return;
        }

        startRef.current = performance.now();
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [text, animate, prefersReducedMotion]);

    return (
        <span
            className={`inline-flex flex-wrap ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {chars.map((state, i) => (
                <span
                    key={i}
                    className="inline-block will-change-transform"
                    style={{
                        transform: `translate(${state.x}px, ${state.y}px)`,
                        opacity: state.opacity,
                        transition: "none",
                    }}
                    aria-hidden="true"
                >
                    {state.char}
                </span>
            ))}
        </span>
    );
};

export default SignalNoiseText;
