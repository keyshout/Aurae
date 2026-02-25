"use client";

/**
 * @component SeismicCard
 * @description On hover, a seismic wave propagates across the card surface,
 * content trembles and settles. Based on sinusoidal wave attenuation.
 * Principle: sinusoidal wave propagation + distance-based amplitude decay.
 *
 * @example
 * ```tsx
 * import { SeismicCard } from '@/components/cards/seismic-card';
 *
 * <SeismicCard waveIntensity={4} className="w-80 p-6">
 *   <h3>Earthquake</h3>
 * </SeismicCard>
 * ```
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface SeismicCardProps {
    children: React.ReactNode;
    /** Wave intensity in px. Default: 3 */
    waveIntensity?: number;
    /** Wave duration in seconds. Default: 0.8 */
    waveDuration?: number;
    /** Card border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const SeismicCard: React.FC<SeismicCardProps> = ({
    children,
    waveIntensity = 3,
    waveDuration = 0.8,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isShaking, setIsShaking] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const triggerQuake = useCallback(() => {
        if (prefersReducedMotion || isShaking) return;
        setIsShaking(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsShaking(false), waveDuration * 1000);
    }, [prefersReducedMotion, isShaking, waveDuration]);

    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    return (
        <motion.div
            className={`relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}
            style={{ borderRadius }}
            onMouseEnter={triggerQuake}
            animate={
                isShaking && !prefersReducedMotion
                    ? {
                        x: [0, -waveIntensity, waveIntensity, -waveIntensity * 0.5, waveIntensity * 0.5, 0],
                        y: [0, waveIntensity * 0.3, -waveIntensity * 0.3, waveIntensity * 0.15, 0],
                    }
                    : { x: 0, y: 0 }
            }
            transition={{
                duration: waveDuration,
                ease: "easeOut",
            }}
            role="article"
        >
            {/* Seismic wave ring */}
            {isShaking && !prefersReducedMotion && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ boxShadow: "inset 0 0 0 0 rgba(239,68,68,0.3)" }}
                    animate={{ boxShadow: "inset 0 0 30px 5px rgba(239,68,68,0)" }}
                    transition={{ duration: waveDuration }}
                    style={{ borderRadius }}
                    aria-hidden="true"
                />
            )}

            {/* Content */}
            <motion.div
                animate={
                    isShaking && !prefersReducedMotion
                        ? { scale: [1, 0.99, 1.01, 0.995, 1] }
                        : { scale: 1 }
                }
                transition={{ duration: waveDuration }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default SeismicCard;
