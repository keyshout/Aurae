"use client";

/**
 * @component TensionStringButton
 * @description The button surface stretches like an invisible string is being pulled;
 * on click it snaps back with a satisfying spring bounce.
 * Based on scaleX tension + spring bounce return.
 *
 * @example
 * ```tsx
 * import { TensionStringButton } from '@/components/buttons/tension-string-button';
 *
 * <TensionStringButton onClick={() => console.log('snap!')}>
 *   Pull Me
 * </TensionStringButton>
 * ```
 */

import React, { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export interface TensionStringButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Max stretch factor. Default: 1.15 */
    maxStretch?: number;
    /** Spring stiffness. Default: 500 */
    stiffness?: number;
    /** Spring damping. Default: 15 */
    damping?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

export const TensionStringButton: React.FC<TensionStringButtonProps> = ({
    children,
    maxStretch = 1.15,
    stiffness = 500,
    damping = 15,
    onClick,
    disabled = false,
    className = "",
}) => {
    const [isPressed, setIsPressed] = useState(false);
    const x = useMotionValue(0);
    const scaleX = useTransform(x, [-50, 0, 50], [1 / maxStretch, 1, maxStretch]);
    const scaleY = useTransform(x, [-50, 0, 50], [maxStretch, 1, 1 / maxStretch]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (disabled) return;
            onClick?.(e);
        },
        [onClick, disabled]
    );

    return (
        <motion.button
            className={`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 overflow-hidden ${className}`}
            style={{ scaleX, scaleY }}
            whileHover={{ x: 0 }}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => setIsPressed(false)}
            animate={{
                scaleX: isPressed ? maxStretch : 1,
                scaleY: isPressed ? 1 / maxStretch : 1,
            }}
            transition={{
                type: "spring",
                stiffness,
                damping,
            }}
            onClick={handleClick}
            disabled={disabled}
            aria-disabled={disabled}
        >
            {/* Tension indicator lines */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: isPressed
                        ? "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%)"
                        : "none",
                }}
                aria-hidden="true"
            />

            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default TensionStringButton;

