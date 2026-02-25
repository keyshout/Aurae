"use client";

/**
 * @component MorphLabelButton
 * @description On hover, the text doesn't change characters but morphs its shape
 * through interpolation, giving a sense of intent shift.
 * Based on SVG text morph + opacity transition.
 *
 * @example
 * ```tsx
 * import { MorphLabelButton } from '@/components/buttons/morph-label-button';
 *
 * <MorphLabelButton
 *   label="Submit"
 *   hoverLabel="Send →"
 *   onClick={() => console.log('morphed')}
 * />
 * ```
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface MorphLabelButtonProps {
    /** Default label */
    label: string;
    /** Label shown on hover */
    hoverLabel: string;
    /** Morph duration in seconds. Default: 0.3 */
    morphSpeed?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

export const MorphLabelButton: React.FC<MorphLabelButtonProps> = ({
    label,
    hoverLabel,
    morphSpeed = 0.3,
    onClick,
    disabled = false,
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const currentLabel = isHovered ? hoverLabel : label;
    const maxLen = Math.max(label.length, hoverLabel.length);

    return (
        <motion.button
            className={`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 overflow-hidden ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            aria-label={label}
            aria-disabled={disabled}
        >
            <span className="relative z-10 inline-flex">
                <AnimatePresence mode="popLayout">
                    {currentLabel.padEnd(maxLen).split("").map((char, i) => (
                        <motion.span
                            key={`${isHovered ? "h" : "d"}-${i}`}
                            className="inline-block"
                            initial={{
                                opacity: 0,
                                y: isHovered ? 8 : -8,
                                filter: "blur(4px)",
                                scale: 0.8,
                            }}
                            animate={{
                                opacity: char === " " && i >= currentLabel.trimEnd().length ? 0 : 1,
                                y: 0,
                                filter: "blur(0px)",
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: isHovered ? -8 : 8,
                                filter: "blur(4px)",
                                scale: 0.8,
                            }}
                            transition={{
                                duration: morphSpeed,
                                delay: i * 0.02,
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </span>

            {/* Subtle background shift */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{
                    background: isHovered
                        ? "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, transparent 100%)"
                        : "transparent",
                }}
                transition={{ duration: morphSpeed }}
                aria-hidden="true"
            />
        </motion.button>
    );
};

export default MorphLabelButton;

