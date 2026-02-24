"use client";

/**
 * @component MagneticSnapButton
 * @description Button is attracted toward the pointer when nearby,
 * snapping back to position on click or pointer exit.
 * Principle: magnetic attraction force + spring return.
 *
 * @example
 * ```tsx
 * import { MagneticSnapButton } from '@/components/buttons/magnetic-snap-button';
 *
 * <MagneticSnapButton magnetStrength={0.3} onClick={() => console.log('snap!')}>
 *   Attract
 * </MagneticSnapButton>
 * ```
 */

import React, { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MagneticSnapButtonProps {
    children: React.ReactNode;
    /** Magnetic pull strength (0-1). Default: 0.3 */
    magnetStrength?: number;
    /** Magnetic radius in px. Default: 100 */
    magnetRadius?: number;
    /** Button click handler */
    onClick?: () => void;
    /** Additional class names */
    className?: string;
}

export const MagneticSnapButton: React.FC<MagneticSnapButtonProps> = ({
    children,
    magnetStrength = 0.3,
    magnetRadius = 100,
    onClick,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const btnRef = useRef<HTMLButtonElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < magnetRadius) {
            const force = (1 - dist / magnetRadius) * magnetStrength;
            setOffset({ x: dx * force, y: dy * force });
        }
    }, [magnetStrength, magnetRadius, prefersReducedMotion]);

    const handlePointerLeave = useCallback(() => {
        setOffset({ x: 0, y: 0 });
    }, []);

    const handleClick = useCallback(() => {
        setOffset({ x: 0, y: 0 });
        onClick?.();
    }, [onClick]);

    return (
        <motion.button
            ref={btnRef}
            className={`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors cursor-pointer ${className}`}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick}
            animate={{
                x: offset.x,
                y: offset.y,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                mass: 0.5,
            }}
        >
            {children}
        </motion.button>
    );
};

export default MagneticSnapButton;
