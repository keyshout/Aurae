"use client";

/**
 * @component ReactionPicker
 * @description Emoji reactions fan out on hover with spring physics.
 * Selection snaps emoji to the message with a satisfying pop.
 * Principle: spring fan-out + snap-to-target + scale pop.
 *
 * @example
 * ```tsx
 * import { ReactionPicker } from '@/components/chat/reaction-picker';
 *
 * <ReactionPicker
 *   reactions={["👍", "❤️", "😂", "🎉", "🤔"]}
 *   onSelect={(emoji) => console.log(emoji)}
 * />
 * ```
 */

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export interface ReactionPickerProps {
    /** Emoji reactions to display. Default: common set */
    reactions?: string[];
    /** Callback when reaction is selected */
    onSelect?: (emoji: string) => void;
    /** Selected reaction (controlled) */
    selected?: string | null;
    /** Additional class names */
    className?: string;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
    reactions = ["👍", "❤️", "😂", "🎉", "🤔", "👀"],
    onSelect,
    selected: controlledSelected,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isOpen, setIsOpen] = useState(false);
    const [internalSelected, setInternalSelected] = useState<string | null>(null);
    const selected = controlledSelected ?? internalSelected;

    const handleSelect = (emoji: string) => {
        setInternalSelected(emoji === internalSelected ? null : emoji);
        onSelect?.(emoji);
        setIsOpen(false);
    };

    return (
        <div className={`relative inline-flex items-center ${className}`}>
            {/* Selected reaction badge */}
            <AnimatePresence>
                {selected && (
                    <motion.span
                        className="text-lg mr-1"
                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={prefersReducedMotion ? {} : { scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        {selected}
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Trigger button */}
            <button
                className="w-7 h-7 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-sm cursor-pointer transition-colors"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                aria-label="Add reaction"
            >
                😊
            </button>

            {/* Fan-out picker */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-0.5 bg-gray-800/95 rounded-full px-2 py-1.5 border border-gray-700/50 shadow-xl"
                        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        {reactions.map((emoji, i) => (
                            <motion.button
                                key={emoji}
                                className="w-8 h-8 rounded-full hover:bg-gray-600/50 flex items-center justify-center text-lg cursor-pointer transition-colors"
                                initial={prefersReducedMotion ? {} : { scale: 0, y: 10 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 15,
                                    delay: prefersReducedMotion ? 0 : i * 0.03,
                                }}
                                whileHover={prefersReducedMotion ? {} : { scale: 1.3, y: -4 }}
                                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                                onClick={() => handleSelect(emoji)}
                                aria-label={`React with ${emoji}`}
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReactionPicker;
