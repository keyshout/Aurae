"use client";

/**
 * @component PressureInkButton
 * @description At the click point, an ink blot forms and spreads across the button surface,
 * then retracts.
 * Based on click coordinate-based radial spread.
 *
 * @example
 * ```tsx
 * import { PressureInkButton } from '@/components/buttons/pressure-ink-button';
 *
 * <PressureInkButton inkColor="#ec4899" onClick={() => console.log('inked')}>
 *   Press Here
 * </PressureInkButton>
 * ```
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PressureInkButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Ink color. Default: "#ec4899" */
    inkColor?: string;
    /** Spread speed seconds. Default: 0.5 */
    spreadSpeed?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

interface InkBlot {
    id: number;
    x: number;
    y: number;
}

export const PressureInkButton: React.FC<PressureInkButtonProps> = ({
    children,
    inkColor = "#ec4899",
    spreadSpeed = 0.5,
    onClick,
    disabled = false,
    className = "",
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [blots, setBlots] = useState<InkBlot[]>([]);
    const idRef = useRef(0);
    const blotTimerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    // Cleanup blot timers on unmount
    useEffect(() => {
        return () => { blotTimerRefs.current.forEach(clearTimeout); };
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled) return;
            const rect = btnRef.current?.getBoundingClientRect();
            if (!rect) return;

            const blot: InkBlot = {
                id: idRef.current++,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };

            setBlots((prev) => [...prev, blot]);
            const timerId = setTimeout(() => {
                setBlots((prev) => prev.filter((b) => b.id !== blot.id));
            }, spreadSpeed * 2000);
            blotTimerRefs.current.push(timerId);

            onClick?.(e);
        },
        [onClick, disabled, spreadSpeed]
    );

    return (
        <motion.button
            ref={btnRef}
            className={`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 overflow-hidden ${className}`}
            onClick={handleClick}
            disabled={disabled}
            whileTap={{ scale: 0.97 }}
            aria-disabled={disabled}
        >
            {/* Ink blots */}
            <AnimatePresence>
                {blots.map((blot) => (
                    <motion.div
                        key={blot.id}
                        className="absolute pointer-events-none z-0 rounded-full"
                        style={{
                            left: blot.x,
                            top: blot.y,
                            background: `radial-gradient(circle, ${inkColor} 0%, ${inkColor}80 40%, transparent 70%)`,
                            transformOrigin: "center",
                        }}
                        initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.9 }}
                        animate={{
                            width: 400,
                            height: 400,
                            x: -200,
                            y: -200,
                            opacity: [0.9, 0.7, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: spreadSpeed * 2, ease: "easeOut" }}
                        aria-hidden="true"
                    />
                ))}
            </AnimatePresence>

            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default PressureInkButton;

