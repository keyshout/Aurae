"use client";

/**
 * @component StreamText
 * @description Token-by-token text stream with blur-to-clear reveal per word,
 * simulating real-time AI response generation.
 * Principle: per-token opacity + translateY + blur animation.
 *
 * @example
 * ```tsx
 * import { StreamText } from '@/components/chat/stream-text';
 *
 * <StreamText
 *   text="This is a streaming response from an AI assistant."
 *   speed={80}
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface StreamTextProps {
    /** Full text to stream */
    text: string;
    /** Speed per token in ms. Default: 60 */
    speed?: number;
    /** Blur amount for incoming tokens. Default: 3 */
    blurAmount?: number;
    /** onComplete callback */
    onComplete?: () => void;
    /** Additional class names */
    className?: string;
}

export const StreamText: React.FC<StreamTextProps> = ({
    text,
    speed = 60,
    blurAmount = 3,
    onComplete,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const words = text.split(" ");
    const [visibleCount, setVisibleCount] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (prefersReducedMotion) {
            setVisibleCount(words.length);
            onComplete?.();
            return;
        }

        setVisibleCount(0);
        let i = 0;
        const tick = () => {
            i++;
            setVisibleCount(i);
            if (i < words.length) {
                timerRef.current = setTimeout(tick, speed + Math.random() * speed * 0.5);
            } else {
                onComplete?.();
            }
        };
        timerRef.current = setTimeout(tick, speed);
        return () => clearTimeout(timerRef.current);
    }, [text, speed, prefersReducedMotion]);

    return (
        <p className={`leading-relaxed ${className}`}>
            {words.map((word, i) => {
                const isVisible = i < visibleCount;
                const isRecent = i === visibleCount - 1 || i === visibleCount - 2;

                return (
                    <motion.span
                        key={`${word}-${i}`}
                        className="inline-block mr-[0.3em]"
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 4, filter: `blur(${blurAmount}px)` }}
                        animate={
                            isVisible
                                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                                : { opacity: 0, y: 4, filter: `blur(${blurAmount}px)` }
                        }
                        transition={{
                            duration: prefersReducedMotion ? 0 : 0.2,
                            ease: "easeOut",
                        }}
                    >
                        {word}
                    </motion.span>
                );
            })}
            {visibleCount < words.length && !prefersReducedMotion && (
                <motion.span
                    className="inline-block w-2 h-4 bg-current ml-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    aria-hidden="true"
                />
            )}
        </p>
    );
};

export default StreamText;
