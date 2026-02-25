"use client";

/**
 * @component ShatterText
 * @description Text shatters like glass into 3D space, fragments scatter and then
 * reassemble with a subtle flash at the moment of reunion.
 * Based on SVG path fragmentation + staggered 3D transforms.
 *
 * @example
 * ```tsx
 * import { ShatterText } from '@/components/text/shatter-text';
 *
 * <ShatterText
 *   text="Break Free"
 *   triggerOn="click"
 *   shatterIntensity={1.5}
 *   className="text-6xl font-black text-white"
 * />
 * ```
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";


export interface ShatterTextProps {
    /** Text to display */
    text: string;
    /** Trigger: mount, click, hover, inView. Default: "mount" */
    triggerOn?: "mount" | "click" | "hover" | "inView";
    /** Scatter intensity multiplier. Default: 1 */
    shatterIntensity?: number;
    /** Animation duration in seconds. Default: 1.8 */
    duration?: number;
    /** Flash color on reassembly. Default: "#ffffff" */
    flashColor?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
    /** Callback on animation complete */
    onComplete?: () => void;
}

interface ShardState {
    char: string;
    x: number;
    y: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    scale: number;
    opacity: number;
}

export const ShatterText: React.FC<ShatterTextProps> = ({
    text,
    triggerOn = "mount",
    shatterIntensity = 1,
    duration = 1.8,
    flashColor = "#ffffff",
    className = "",
    ariaLabel,
    onComplete,
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });
    const [phase, setPhase] = useState<"idle" | "shattered" | "assembling" | "done">("idle");
    const [showFlash, setShowFlash] = useState(false);
    const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    const generateShards = useCallback((): ShardState[] => {
        return text.split("").map((char) => ({
            char,
            x: (Math.random() - 0.5) * 200 * shatterIntensity,
            y: (Math.random() - 0.5) * 200 * shatterIntensity,
            rotateX: (Math.random() - 0.5) * 360 * shatterIntensity,
            rotateY: (Math.random() - 0.5) * 360 * shatterIntensity,
            rotateZ: (Math.random() - 0.5) * 180 * shatterIntensity,
            scale: 0.3 + Math.random() * 0.7,
            opacity: 0.2 + Math.random() * 0.5,
        }));
    }, [text, shatterIntensity]);

    const [shards] = useState<ShardState[]>(generateShards);

    const triggerAnimation = useCallback(() => {
        // Clear previous timers
        timerRefs.current.forEach(clearTimeout);
        timerRefs.current = [];

        setPhase("shattered");
        timerRefs.current.push(setTimeout(() => setPhase("assembling"), duration * 400));
        timerRefs.current.push(setTimeout(() => {
            setShowFlash(true);
            setPhase("done");
            timerRefs.current.push(setTimeout(() => setShowFlash(false), 200));
            onComplete?.();
        }, duration * 900));
    }, [duration, onComplete]);

    useEffect(() => {
        if (triggerOn === "mount") triggerAnimation();
        return () => { timerRefs.current.forEach(clearTimeout); };
    }, [triggerOn, triggerAnimation]);

    useEffect(() => {
        if (triggerOn === "inView" && isInView) triggerAnimation();
    }, [triggerOn, isInView, triggerAnimation]);

    const handlers =
        triggerOn === "hover"
            ? { onMouseEnter: triggerAnimation }
            : triggerOn === "click"
                ? { onClick: triggerAnimation }
                : {};

    return (
        <span
            ref={containerRef}
            className={`relative inline-flex ${className}`}
            role="text"
            aria-label={ariaLabel || text}
            style={{ perspective: "800px" }}
            {...handlers}
        >
            {text.split("").map((char, i) => {
                const shard = shards[i];
                const isShattered = phase === "shattered";

                return (
                    <motion.span
                        key={i}
                        className="inline-block"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{
                            x: isShattered ? shard.x : 0,
                            y: isShattered ? shard.y : 0,
                            rotateX: isShattered ? shard.rotateX : 0,
                            rotateY: isShattered ? shard.rotateY : 0,
                            rotateZ: isShattered ? shard.rotateZ : 0,
                            scale: isShattered ? shard.scale : 1,
                            opacity: isShattered ? shard.opacity : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 12,
                            delay: isShattered ? i * 0.02 : (text.length - i) * 0.02,
                        }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                );
            })}

            {/* Reassembly flash */}
            {showFlash && (
                <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse, ${flashColor}40 0%, transparent 70%)`,
                    }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                />
            )}
        </span>
    );
};

export default ShatterText;

