"use client";

/**
 * @component ScrambleText
 * @description Characters appear scrambled with random glyphs, then resolve to
 * the correct sequence one by one. Based on random character substitution + sequential resolve.
 *
 * @example
 * ```tsx
 * import { ScrambleText } from '@/components/text/scramble-text';
 *
 * <ScrambleText
 *   text="Hello World"
 *   triggerOn="mount"
 *   speed={50}
 *   className="text-4xl font-bold text-white"
 * />
 * ```
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const DEFAULT_CHARSET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export interface ScrambleTextProps {
    /** The final text to display */
    text: string;
    /** Trigger mode: mount, hover, click, or inView */
    triggerOn?: "mount" | "hover" | "click" | "inView";
    /** Ms between each character lock. Default: 50 */
    speed?: number;
    /** Number of scramble cycles per character before lock. Default: 6 */
    scrambleCycles?: number;
    /** Custom character set for scrambling */
    charset?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
    /** Callback when animation completes */
    onComplete?: () => void;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
    text,
    triggerOn = "mount",
    speed = 50,
    scrambleCycles = 6,
    charset = DEFAULT_CHARSET,
    className = "",
    ariaLabel,
    onComplete,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [displayed, setDisplayed] = useState<string[]>(() =>
        Array.from({ length: text.length }, () =>
            charset[Math.floor(Math.random() * charset.length)]
        )
    );
    const [lockedCount, setLockedCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval>>();
    const cycleRef = useRef(0);
    const containerRef = useRef<HTMLSpanElement>(null);

    const startScramble = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setLockedCount(0);
        cycleRef.current = 0;

        let locked = 0;
        let cycle = 0;

        intervalRef.current = setInterval(() => {
            cycle++;

            setDisplayed((prev) =>
                prev.map((ch, i) => {
                    if (i < locked) return text[i];
                    return charset[Math.floor(Math.random() * charset.length)];
                })
            );

            if (cycle % scrambleCycles === 0 && locked < text.length) {
                locked++;
                setLockedCount(locked);
            }

            if (locked >= text.length) {
                clearInterval(intervalRef.current);
                setDisplayed(text.split(""));
                setIsAnimating(false);
                onComplete?.();
            }
        }, speed);
    }, [text, speed, scrambleCycles, charset, isAnimating, onComplete]);

    // Mount trigger
    useEffect(() => {
        if (triggerOn === "mount") startScramble();
        return () => clearInterval(intervalRef.current);
    }, [triggerOn, startScramble]);

    // InView trigger
    useEffect(() => {
        if (triggerOn !== "inView" || !containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) startScramble();
            },
            { threshold: 0.5 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [triggerOn, startScramble]);

    const handlers =
        triggerOn === "hover"
            ? { onMouseEnter: startScramble }
            : triggerOn === "click"
                ? { onClick: startScramble }
                : {};

    return (
        <span
            ref={containerRef}
            className={`inline-flex font-mono ${className}`}
            role="text"
            aria-label={ariaLabel || text}
            {...handlers}
        >
            <AnimatePresence mode="popLayout">
                {displayed.map((char, i) => (
                    <motion.span
                        key={`${i}-${lockedCount > i ? "locked" : "scramble"}`}
                        initial={{ opacity: 0.4 }}
                        animate={{
                            opacity: i < lockedCount ? 1 : 0.6,
                            color: i < lockedCount ? undefined : "inherit",
                        }}
                        transition={{ duration: 0.1 }}
                        className={i < lockedCount ? "text-current" : "text-current/60"}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </AnimatePresence>
        </span>
    );
};

export default ScrambleText;
