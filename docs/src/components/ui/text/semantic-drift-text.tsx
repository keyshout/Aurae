"use client";

/**
 * @component SemanticDriftText
 * @description Words drift through similar-looking alternative glyphs before snapping
 * to their final form. Creates a "semantic search" visual metaphor.
 * Based on glyph interpolation + opacity overlay blending.
 *
 * @example
 * ```tsx
 * import { SemanticDriftText } from '@/components/text/semantic-drift-text';
 *
 * <SemanticDriftText
 *   text="Neural Network"
 *   driftDuration={1.5}
 *   className="text-5xl font-semibold text-white"
 * />
 * ```
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// Similar-looking glyph substitution map
const GLYPH_MAP: Record<string, string[]> = {
    A: ["Λ", "Δ", "Å", "Â"],
    B: ["ß", "Ɓ", "β", "8"],
    C: ["Ç", "©", "¢", "("],
    D: ["Đ", "Ð", "ð", "Ɗ"],
    E: ["Ξ", "€", "Ɛ", "Ə"],
    F: ["Ƒ", "ƒ", "₣", "Ŧ"],
    G: ["Ğ", "Ǥ", "Ɠ", "6"],
    H: ["Ħ", "Ƕ", "#", "Ⱨ"],
    I: ["Ɨ", "Ï", "¡", "1"],
    J: ["Ĵ", "ĵ", "Ɉ", "ʝ"],
    K: ["Ƙ", "Ⱪ", "ĸ", "Ķ"],
    L: ["Ƚ", "Ŀ", "£", "Ĺ"],
    M: ["Ɯ", "Ϻ", "Ⱬ", "Ṁ"],
    N: ["Ñ", "Ŋ", "Ƞ", "Ɲ"],
    O: ["Ø", "Θ", "Ɵ", "0"],
    P: ["Ƥ", "Ᵽ", "Þ", "ρ"],
    Q: ["Ɋ", "Ǭ", "ϙ", "9"],
    R: ["Ʀ", "Ɍ", "Ɽ", "Ŗ"],
    S: ["§", "$", "Ŝ", "Ș"],
    T: ["Ŧ", "Ƭ", "†", "Ⱦ"],
    U: ["Ʉ", "Ü", "Ụ", "Ʊ"],
    V: ["Ʋ", "Ṿ", "√", "Ṽ"],
    W: ["Ⱳ", "Ẅ", "Ẃ", "Ŵ"],
    X: ["Ẍ", "×", "Ẋ", "Ⱶ"],
    Y: ["Ɣ", "Ƴ", "¥", "Ÿ"],
    Z: ["Ƶ", "Ẑ", "Ⱬ", "Ż"],
};

function getAlternateGlyphs(char: string): string[] {
    const upper = char.toUpperCase();
    return GLYPH_MAP[upper] || [char];
}

export interface SemanticDriftTextProps {
    /** Text to display */
    text: string;
    /** Duration of drift animation per character in seconds. Default: 1.5 */
    driftDuration?: number;
    /** Stagger delay between characters in seconds. Default: 0.06 */
    stagger?: number;
    /** Number of glyph transitions. Default: 3 */
    driftSteps?: number;
    /** Trigger: mount or inView. Default: "mount" */
    triggerOn?: "mount" | "inView";
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
    /** Callback when animation completes */
    onComplete?: () => void;
}

export const SemanticDriftText: React.FC<SemanticDriftTextProps> = ({
    text,
    driftDuration = 1.5,
    stagger = 0.06,
    driftSteps = 3,
    triggerOn = "mount",
    className = "",
    ariaLabel,
    onComplete,
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });
    const [charStates, setCharStates] = useState<
        { current: string; final: string; opacity: number; settled: boolean }[]
    >([]);
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef(0);

    const shouldAnimate = triggerOn === "mount" || isInView;

    const initStates = useCallback(() => {
        return text.split("").map((ch) => ({
            current: ch === " " ? " " : getAlternateGlyphs(ch)[0] || ch,
            final: ch,
            opacity: 0,
            settled: ch === " ",
        }));
    }, [text]);

    const animate = useCallback(() => {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        let allDone = true;

        const newStates = text.split("").map((ch, i) => {
            if (ch === " ") return { current: " ", final: ch, opacity: 1, settled: true };

            const charStart = i * stagger;
            const charElapsed = elapsed - charStart;

            if (charElapsed < 0) {
                allDone = false;
                return { current: getAlternateGlyphs(ch)[0] || ch, final: ch, opacity: 0, settled: false };
            }

            const progress = Math.min(1, charElapsed / driftDuration);
            const glyphs = getAlternateGlyphs(ch);

            if (progress >= 1) {
                return { current: ch, final: ch, opacity: 1, settled: true };
            }

            allDone = false;
            const stepIdx = Math.min(
                driftSteps - 1,
                Math.floor(progress * driftSteps)
            );

            const currentGlyph =
                stepIdx < glyphs.length ? glyphs[stepIdx] : ch;
            const opacity = 0.3 + progress * 0.7;

            return { current: progress > 0.85 ? ch : currentGlyph, final: ch, opacity, settled: false };
        });

        setCharStates(newStates);

        if (allDone) {
            onComplete?.();
        } else {
            rafRef.current = requestAnimationFrame(animate);
        }
    }, [text, stagger, driftDuration, driftSteps, onComplete]);

    useEffect(() => {
        if (!shouldAnimate) {
            setCharStates(initStates());
            return;
        }

        setCharStates(initStates());
        startTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(rafRef.current);
    }, [shouldAnimate, animate, initStates]);

    return (
        <span
            ref={containerRef}
            className={`inline-flex flex-wrap ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {charStates.map((state, i) => (
                <motion.span
                    key={i}
                    className="inline-block"
                    animate={{
                        opacity: state.opacity,
                        y: state.settled ? 0 : (1 - state.opacity) * -4,
                    }}
                    transition={{ duration: 0.1 }}
                    aria-hidden="true"
                >
                    {state.current === " " ? "\u00A0" : state.current}
                </motion.span>
            ))}
        </span>
    );
};

export default SemanticDriftText;

