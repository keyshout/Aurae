"use client";

/**
 * @component ElasticBorderButton
 * @description Border has gel-like consistency; near the pointer it bulges outward,
 * on click an elastic wave travels around the border.
 * Based on reactive border glow deformation + wave animation.
 *
 * @example
 * ```tsx
 * import { ElasticBorderButton } from '@/components/buttons/elastic-border-button';
 *
 * <ElasticBorderButton
 *   borderColor="#06b6d4"
 *   onClick={() => console.log('elastic!')}
 * >
 *   Stretch
 * </ElasticBorderButton>
 * ```
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface ElasticBorderButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Border color. Default: "#06b6d4" */
    borderColor?: string;
    /** Bulge amount in px. Default: 6 */
    bulgeAmount?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

export const ElasticBorderButton: React.FC<ElasticBorderButtonProps> = ({
    children,
    borderColor = "#06b6d4",
    bulgeAmount = 6,
    onClick,
    disabled = false,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const btnRef = useRef<HTMLButtonElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [waveNonce, setWaveNonce] = useState(0);
    const safeBulge = toPositiveNumber(bulgeAmount, 6, 0);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = btnRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (disabled) return;
            setIsWaving(true);
            setWaveNonce((prev) => prev + 1);
            onClick?.(e);
        },
        [onClick, disabled]
    );

    useEffect(() => {
        if (!isWaving) return;
        const t = setTimeout(() => setIsWaving(false), 550);
        return () => clearTimeout(t);
    }, [isWaving]);

    const w = 160;
    const h = 48;
    const baseRadius = 12;
    const pointerForce = isHovered ? Math.sin((pointer.x + pointer.y) * 0.06) * safeBulge * 0.35 : 0;

    return (
        <motion.button
            ref={btnRef}
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width: w, height: h }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onClick={handleClick}
            disabled={disabled}
            whileTap={{ scale: 0.97 }}
            aria-disabled={disabled}
        >
            <motion.div
                className="absolute inset-0 pointer-events-none border-2"
                style={{
                    borderColor,
                    borderRadius: baseRadius + pointerForce,
                    background: isHovered
                        ? `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, ${borderColor}33 0%, transparent 45%)`
                        : "transparent",
                    boxShadow: `0 0 ${4 + safeBulge}px ${borderColor}44`,
                }}
                animate={prefersReducedMotion ? undefined : {
                    borderRadius: [
                        baseRadius + pointerForce,
                        baseRadius + pointerForce + safeBulge * 0.1,
                        baseRadius + pointerForce,
                    ],
                }}
                transition={prefersReducedMotion ? undefined : {
                    duration: 0.45,
                    repeat: Infinity,
                    repeatType: "mirror",
                }}
                aria-hidden="true"
            />

            {isWaving && !prefersReducedMotion && (
                <motion.div
                    key={waveNonce}
                    className="absolute inset-0 pointer-events-none border-2"
                    style={{
                        borderColor,
                        borderRadius: baseRadius,
                        opacity: 0.7,
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.08, opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    aria-hidden="true"
                />
            )}

            <span className="relative z-10 font-semibold text-white px-6 py-3">{children}</span>
        </motion.button>
    );
};

export default ElasticBorderButton;
