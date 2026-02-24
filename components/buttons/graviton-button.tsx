"use client";

/**
 * @component GravitonButton
 * @description On hover, decorative particles orbit the button. On click, they gather
 * at center and burst outward.
 * Based on orbital particle movement + click-triggered scatter.
 *
 * @example
 * ```tsx
 * import { GravitonButton } from '@/components/buttons/graviton-button';
 *
 * <GravitonButton
 *   particleCount={8}
 *   particleColor="#f59e0b"
 *   onClick={() => console.log('clicked')}
 * >
 *   Launch
 * </GravitonButton>
 * ```
 */

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export interface GravitonButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Number of orbiting particles. Default: 8 */
    particleCount?: number;
    /** Particle color. Default: "#f59e0b" */
    particleColor?: string;
    /** Orbit radius in px. Default: 50 */
    orbitRadius?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

export const GravitonButton: React.FC<GravitonButtonProps> = ({
    children,
    particleCount = 8,
    particleColor = "#f59e0b",
    orbitRadius = 50,
    onClick,
    disabled = false,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);
    const [bursts, setBursts] = useState<number[]>([]);

    const particles = useMemo(
        () =>
            Array.from({ length: particleCount }, (_, i) => ({
                angle: (360 / particleCount) * i,
                size: 3 + Math.random() * 3,
                speed: 3 + Math.random() * 2,
            })),
        [particleCount]
    );

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (disabled) return;
            setBursts((prev) => [...prev, Date.now()]);
            setTimeout(() => setBursts((prev) => prev.slice(1)), 800);
            onClick?.(e);
        },
        [onClick, disabled]
    );

    return (
        <div className="relative inline-flex items-center justify-center">
            {/* Orbiting particles */}
            {isHovered &&
                particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute pointer-events-none"
                        style={{
                            width: p.size,
                            height: p.size,
                            borderRadius: "50%",
                            background: particleColor,
                            boxShadow: `0 0 ${p.size * 2}px ${particleColor}`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 0.8,
                            scale: 1,
                            rotate: [p.angle, p.angle + 360],
                            x: Math.cos((p.angle * Math.PI) / 180) * orbitRadius,
                            y: Math.sin((p.angle * Math.PI) / 180) * orbitRadius,
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            rotate: { duration: p.speed, repeat: Infinity, ease: "linear" },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.3 },
                        }}
                        aria-hidden="true"
                    />
                ))}

            {/* Burst particles */}
            <AnimatePresence>
                {bursts.map((id) =>
                    Array.from({ length: particleCount }, (_, i) => (
                        <motion.div
                            key={`burst-${id}-${i}`}
                            className="absolute pointer-events-none"
                            style={{
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: particleColor,
                                boxShadow: `0 0 8px ${particleColor}`,
                            }}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: [1, 0],
                                x: Math.cos(((360 / particleCount) * i * Math.PI) / 180) * orbitRadius * 2,
                                y: Math.sin(((360 / particleCount) * i * Math.PI) / 180) * orbitRadius * 2,
                                opacity: [1, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            aria-hidden="true"
                        />
                    ))
                )}
            </AnimatePresence>

            {/* Button */}
            <motion.button
                className={`relative z-10 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 ${className}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                disabled={disabled}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-disabled={disabled}
            >
                {children}
            </motion.button>
        </div>
    );
};

export default GravitonButton;
