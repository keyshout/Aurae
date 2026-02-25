"use client";

/**
 * @component EchoTrailHeadline
 * @description On scroll or hover, the headline leaves behind low-opacity ghost copies
 * that trail behind, then merge back into the main text.
 * Based on overlapping layer animations + offset chaining.
 *
 * @example
 * ```tsx
 * import { EchoTrailHeadline } from '@/components/text/echo-trail-headline';
 *
 * <EchoTrailHeadline
 *   text="Echo Chamber"
 *   echoCount={4}
 *   echoColor="#6366f1"
 *   className="text-7xl font-black"
 * />
 * ```
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export interface EchoTrailHeadlineProps {
    /** Text to display */
    text: string;
    /** Number of echo layers. Default: 4 */
    echoCount?: number;
    /** Echo color. Default: "#6366f1" */
    echoColor?: string;
    /** Maximum echo offset in pixels. Default: 12 */
    maxOffset?: number;
    /** Trigger: hover or scroll. Default: "hover" */
    triggerOn?: "hover" | "scroll";
    /** Merge duration in seconds. Default: 0.6 */
    mergeDuration?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const EchoTrailHeadline: React.FC<EchoTrailHeadlineProps> = ({
    text,
    echoCount = 4,
    echoColor = "#6366f1",
    maxOffset = 12,
    triggerOn = "hover",
    mergeDuration = 0.6,
    className = "",
    ariaLabel,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [isMerging, setIsMerging] = useState(false);
    const mergeTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Scroll-based activation
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const scrollActivity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);

    useEffect(() => {
        if (triggerOn !== "scroll") return;

        const unsubscribe = scrollActivity.on("change", (v) => {
            setIsActive(v > 0.3);
        });

        return unsubscribe;
    }, [triggerOn, scrollActivity]);

    const handleMouseEnter = useCallback(() => {
        if (triggerOn === "hover") {
            setIsActive(true);
            setIsMerging(false);
        }
    }, [triggerOn]);

    const handleMouseLeave = useCallback(() => {
        if (triggerOn === "hover") {
            setIsMerging(true);
            if (mergeTimerRef.current) clearTimeout(mergeTimerRef.current);
            mergeTimerRef.current = setTimeout(() => {
                setIsActive(false);
                setIsMerging(false);
            }, mergeDuration * 1000);
        }
    }, [triggerOn, mergeDuration]);

    // Cleanup merge timer on unmount
    useEffect(() => {
        return () => { if (mergeTimerRef.current) clearTimeout(mergeTimerRef.current); };
    }, []);

    const echoes = Array.from({ length: echoCount }, (_, i) => i);

    return (
        <div
            ref={containerRef}
            className={`relative inline-block cursor-default select-none ${className}`}
            role="heading"
            aria-label={ariaLabel || text}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Echo layers */}
            {echoes.map((i) => {
                const layerIndex = i + 1;
                const echoOpacity = 0.15 - (i / echoCount) * 0.1;
                const offsetMultiplier = layerIndex / echoCount;
                const yOffset = maxOffset * offsetMultiplier;
                const xOffset = maxOffset * 0.3 * offsetMultiplier * (i % 2 === 0 ? 1 : -1);

                return (
                    <motion.span
                        key={`echo-${i}`}
                        className="absolute inset-0 pointer-events-none"
                        style={{ color: echoColor }}
                        animate={{
                            y: isActive && !isMerging ? -yOffset : 0,
                            x: isActive && !isMerging ? xOffset : 0,
                            opacity: isActive && !isMerging ? echoOpacity : 0,
                            scale: isActive && !isMerging ? 1 + offsetMultiplier * 0.02 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 200 - layerIndex * 30,
                            damping: 20 + layerIndex * 3,
                            mass: 0.5 + layerIndex * 0.1,
                        }}
                        aria-hidden="true"
                    >
                        {text}
                    </motion.span>
                );
            })}

            {/* Main text */}
            <span className="relative z-10">{text}</span>
        </div>
    );
};

export default EchoTrailHeadline;

