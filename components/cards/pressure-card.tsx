"use client";

/**
 * @component PressureCard
 * @description Pointer position creates a local depression on the card surface,
 * shadow and highlight dynamically shift.
 * Based on radial gradient + local scale deformation.
 *
 * @example
 * ```tsx
 * import { PressureCard } from '@/components/cards/pressure-card';
 *
 * <PressureCard className="w-80">
 *   <h3>Press Me</h3>
 *   <p>Feel the pressure</p>
 * </PressureCard>
 * ```
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface PressureCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Pressure depth effect intensity. Default: 0.06 */
    depthIntensity?: number;
    /** Highlight color. Default: "rgba(255,255,255,0.12)" */
    highlightColor?: string;
    /** Shadow intensity. Default: 0.3 */
    shadowIntensity?: number;
    /** Additional class names */
    className?: string;
}

export const PressureCard: React.FC<PressureCardProps> = ({
    children,
    depthIntensity = 0.06,
    highlightColor = "rgba(255,255,255,0.12)",
    shadowIntensity = 0.3,
    className = "",
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const pressMultiplier = isPressed ? 2 : 1;

    return (
        <motion.div
            ref={cardRef}
            className={`relative overflow-hidden rounded-2xl ${className}`}
            style={{ perspective: 600 }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => { setIsHovered(false); setIsPressed(false); }}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => setIsPressed(false)}
            animate={{
                boxShadow: isHovered
                    ? `${(pointer.x - 50) * -0.3}px ${(pointer.y - 50) * -0.3}px ${20 + shadowIntensity * 20}px rgba(0,0,0,${shadowIntensity})`
                    : `0 4px 12px rgba(0,0,0,${shadowIntensity * 0.5})`,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            role="article"
        >
            {/* Background with depression gradient */}
            <div className="relative z-10 p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950 h-full">
                {children}
            </div>

            {/* Pressure depression visual */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: isHovered
                        ? `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(0,0,0,${depthIntensity * pressMultiplier}) 0%, transparent 40%)`
                        : "none",
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                aria-hidden="true"
            />

            {/* Highlight ring around depression */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: isHovered
                        ? `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, transparent 15%, ${highlightColor} 25%, transparent 40%)`
                        : "none",
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                aria-hidden="true"
            />

            {/* Surface light reflection */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: `linear-gradient(${135 + (pointer.x - 50) * 0.5}deg, rgba(255,255,255,0.04) 0%, transparent 50%)`,
                }}
                animate={{ opacity: isHovered ? 1 : 0.3 }}
                aria-hidden="true"
            />
        </motion.div>
    );
};

export default PressureCard;

