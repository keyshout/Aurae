"use client";

/**
 * @component LiquidFillButton
 * @description Click fills the button from bottom with liquid animation,
 * changing color when full, then drains on reset.
 * Principle: clip-path fill + wave surface on the fill edge.
 *
 * @example
 * ```tsx
 * import { LiquidFillButton } from '@/components/buttons/liquid-fill-button';
 *
 * <LiquidFillButton
 *   fillColor="#10b981"
 *   onClick={() => console.log('filled!')}
 * >
 *   Confirm
 * </LiquidFillButton>
 * ```
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface LiquidFillButtonProps {
    children: React.ReactNode;
    /** Liquid fill color. Default: "#10b981" */
    fillColor?: string;
    /** Fill duration in seconds. Default: 0.8 */
    fillDuration?: number;
    /** Button click handler */
    onClick?: () => void;
    /** Additional class names */
    className?: string;
}

export const LiquidFillButton: React.FC<LiquidFillButtonProps> = ({
    children,
    fillColor = "#10b981",
    fillDuration = 0.8,
    onClick,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isFilled, setIsFilled] = useState(false);

    const handleClick = () => {
        setIsFilled(!isFilled);
        onClick?.();
    };

    return (
        <motion.button
            className={`relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-white border border-gray-600 cursor-pointer ${className}`}
            style={{ background: "transparent" }}
            onClick={handleClick}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
        >
            {/* Liquid fill */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: fillColor, transformOrigin: "bottom" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isFilled ? 1 : 0 }}
                transition={{
                    duration: prefersReducedMotion ? 0 : fillDuration,
                    ease: [0.22, 1, 0.36, 1],
                }}
                aria-hidden="true"
            />

            {/* Wave surface on fill edge */}
            {!prefersReducedMotion && (
                <motion.div
                    className="absolute left-0 right-0 h-2 pointer-events-none"
                    style={{
                        background: `linear-gradient(to bottom, ${fillColor}, transparent)`,
                    }}
                    animate={{
                        bottom: isFilled ? "100%" : "0%",
                        opacity: isFilled ? [0.6, 0] : [0, 0.6],
                    }}
                    transition={{
                        duration: fillDuration,
                        ease: "easeOut",
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Label */}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default LiquidFillButton;
