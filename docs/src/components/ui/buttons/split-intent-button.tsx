"use client";

/**
 * @component SplitIntentButton
 * @description Detects pointer entry angle and animates an overlay
 * flowing from that direction to fill the button.
 * Based on entry angle detection + directional clip-path animation.
 *
 * @example
 * ```tsx
 * import { SplitIntentButton } from '@/components/buttons/split-intent-button';
 *
 * <SplitIntentButton
 *   fillColor="#8b5cf6"
 *   onClick={() => console.log('clicked')}
 * >
 *   Approach
 * </SplitIntentButton>
 * ```
 */

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

export interface SplitIntentButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Fill overlay color. Default: "#8b5cf6" */
    fillColor?: string;
    /** Fill speed in seconds. Default: 0.3 */
    fillSpeed?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

type Direction = "top" | "right" | "bottom" | "left";

const CLIP_START: Record<Direction, string> = {
    top: "inset(0% 0% 100% 0%)",
    right: "inset(0% 0% 0% 100%)",
    bottom: "inset(100% 0% 0% 0%)",
    left: "inset(0% 100% 0% 0%)",
};

const CLIP_FULL = "inset(0% 0% 0% 0%)";

export const SplitIntentButton: React.FC<SplitIntentButtonProps> = ({
    children,
    fillColor = "#8b5cf6",
    fillSpeed = 0.3,
    onClick,
    disabled = false,
    className = "",
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [direction, setDirection] = useState<Direction>("left");
    const [isHovered, setIsHovered] = useState(false);

    const getDirection = useCallback((e: React.PointerEvent): Direction => {
        const el = btnRef.current;
        if (!el) return "left";
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(y, x) * (180 / Math.PI);

        if (angle >= -45 && angle < 45) return "right";
        if (angle >= 45 && angle < 135) return "bottom";
        if (angle >= -135 && angle < -45) return "top";
        return "left";
    }, []);

    const handleEnter = useCallback(
        (e: React.PointerEvent) => {
            setDirection(getDirection(e));
            setIsHovered(true);
        },
        [getDirection]
    );

    const handleLeave = useCallback(
        (e: React.PointerEvent) => {
            setDirection(getDirection(e));
            setIsHovered(false);
        },
        [getDirection]
    );

    return (
        <motion.button
            ref={btnRef}
            className={`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 overflow-hidden ${className}`}
            onPointerEnter={handleEnter}
            onPointerLeave={handleLeave}
            onClick={onClick}
            disabled={disabled}
            whileTap={{ scale: 0.97 }}
            aria-disabled={disabled}
        >
            {/* Directional fill overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                style={{ background: fillColor }}
                animate={{
                    clipPath: isHovered ? CLIP_FULL : CLIP_START[direction],
                }}
                transition={{ duration: fillSpeed, ease: "easeInOut" }}
                aria-hidden="true"
            />

            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default SplitIntentButton;

