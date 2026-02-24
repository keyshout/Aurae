"use client";

/**
 * @component LensFocusCard
 * @description Only the region under the pointer is "in focus",
 * the rest remains in cinematic blur.
 * Based on circular mask + pointer tracking + CSS blur.
 *
 * @example
 * ```tsx
 * import { LensFocusCard } from '@/components/cards/lens-focus-card';
 *
 * <LensFocusCard
 *   focusRadius={80}
 *   blurAmount={8}
 *   className="w-96 h-56"
 * >
 *   <div className="p-6">
 *     <h3>Focused Vision</h3>
 *     <p>Only what you look at is clear</p>
 *   </div>
 * </LensFocusCard>
 * ```
 */

import React, { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface LensFocusCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Focus circle radius in pixels. Default: 80 */
    focusRadius?: number;
    /** Blur amount in pixels. Default: 8 */
    blurAmount?: number;
    /** Focus transition softness in pixels. Default: 20 */
    edgeSoftness?: number;
    /** Additional class names */
    className?: string;
}

export const LensFocusCard: React.FC<LensFocusCardProps> = ({
    children,
    focusRadius = 80,
    blurAmount = 8,
    edgeSoftness = 20,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    return (
        <div
            ref={cardRef}
            className={`relative overflow-hidden rounded-2xl ${className}`}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Blurred layer (always visible, underneath) */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950"
                style={{
                    filter: isHovered ? `blur(${blurAmount}px)` : "none",
                    transition: "filter 0.3s",
                }}
            >
                {children}
            </div>

            {/* Focused (sharp) layer with circular mask */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950"
                style={{
                    clipPath: isHovered
                        ? `circle(${focusRadius}px at ${pointer.x}px ${pointer.y}px)`
                        : "circle(100% at 50% 50%)",
                    transition: isHovered ? "clip-path 0.05s" : "clip-path 0.4s",
                }}
            >
                {children}

                {/* Focus ring */}
                {isHovered && (
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            left: pointer.x - focusRadius,
                            top: pointer.y - focusRadius,
                            width: focusRadius * 2,
                            height: focusRadius * 2,
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.15)",
                            boxShadow: `0 0 ${edgeSoftness}px rgba(255,255,255,0.05)`,
                        }}
                        aria-hidden="true"
                    />
                )}
            </motion.div>

            {/* Vignette overlay */}
            {isHovered && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${pointer.x}px ${pointer.y}px, transparent ${focusRadius - edgeSoftness}px, rgba(0,0,0,0.2) ${focusRadius + edgeSoftness}px)`,
                    }}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default LensFocusCard;
