"use client";

/**
 * @component MemoryFoamCard
 * @description Press creates a visible depression that slowly springs back,
 * simulating visco-elastic memory foam material.
 * Principle: spring physics + overdamped oscillation on pointer pressure.
 *
 * @example
 * ```tsx
 * import { MemoryFoamCard } from '@/components/cards/memory-foam-card';
 *
 * <MemoryFoamCard depthPx={8} className="w-80 p-6">
 *   <h3>Press Me</h3>
 * </MemoryFoamCard>
 * ```
 */

import React, { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MemoryFoamCardProps {
    children: React.ReactNode;
    /** Depression depth in px. Default: 6 */
    depthPx?: number;
    /** Recovery duration in seconds. Default: 1.2 */
    recoveryDuration?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const MemoryFoamCard: React.FC<MemoryFoamCardProps> = ({
    children,
    depthPx = 6,
    recoveryDuration = 1.2,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isPressed, setIsPressed] = useState(false);
    const [pressPoint, setPressPoint] = useState({ x: 50, y: 50 });

    const handlePress = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPressPoint({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
        setIsPressed(true);
    }, [prefersReducedMotion]);

    return (
        <motion.div
            className={`relative overflow-hidden cursor-pointer bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}
            style={{ borderRadius }}
            onPointerDown={handlePress}
            onPointerUp={() => setIsPressed(false)}
            onPointerLeave={() => setIsPressed(false)}
            animate={
                isPressed && !prefersReducedMotion
                    ? { scale: 0.98 }
                    : { scale: 1 }
            }
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 1,
                duration: isPressed ? 0.1 : recoveryDuration,
            }}
            role="article"
        >
            {/* Depth shadow at press point */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    left: `${pressPoint.x}%`,
                    top: `${pressPoint.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "150%",
                    height: "150%",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 50%)`,
                }}
                animate={{
                    opacity: isPressed && !prefersReducedMotion ? 1 : 0,
                    scale: isPressed ? 1 : 0.5,
                }}
                transition={{
                    opacity: { duration: isPressed ? 0.1 : recoveryDuration },
                    scale: {
                        type: "spring",
                        stiffness: 100,
                        damping: 12,
                    },
                }}
                aria-hidden="true"
            />

            {/* Content depression effect */}
            <motion.div
                animate={{
                    y: isPressed && !prefersReducedMotion ? depthPx * 0.3 : 0,
                    scale: isPressed && !prefersReducedMotion ? 0.995 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: isPressed ? 0.05 : recoveryDuration,
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default MemoryFoamCard;
