"use client";

/**
 * @component RefractionText
 * @description On hover, a refractive layer passes through the text, creating
 * chromatic aberration / color-split at character edges.
 * Based on CSS filter + gradient overlay + chromatic aberration.
 *
 * @example
 * ```tsx
 * import { RefractionText } from '@/components/text/refraction-text';
 *
 * <RefractionText
 *   text="Prismatic"
 *   aberrationOffset={3}
 *   className="text-6xl font-black text-white"
 * />
 * ```
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface RefractionTextProps {
    /** Text to display */
    text: string;
    /** Chromatic aberration offset in pixels. Default: 3 */
    aberrationOffset?: number;
    /** Width of the refractive lens in percentage. Default: 30 */
    lensWidth?: number;
    /** Speed of lens sweep (duration in seconds). Default: 0.8 */
    sweepSpeed?: number;
    /** Left channel color. Default: "#ff0050" */
    leftColor?: string;
    /** Right channel color. Default: "#00d4ff" */
    rightColor?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const RefractionText: React.FC<RefractionTextProps> = ({
    text,
    aberrationOffset = 3,
    lensWidth = 30,
    sweepSpeed = 0.8,
    leftColor = "#ff0050",
    rightColor = "#00d4ff",
    className = "",
    ariaLabel,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [pointerX, setPointerX] = useState(0.5);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        setPointerX(x);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative inline-block cursor-default select-none ${className}`}
            role="text"
            aria-label={ariaLabel || text}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onPointerMove={handlePointerMove}
        >
            {/* Red channel (left shift) */}
            <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                    color: leftColor,
                    mixBlendMode: "screen",
                }}
                animate={{
                    x: isHovered ? -aberrationOffset : 0,
                    opacity: isHovered ? 0.7 : 0,
                }}
                transition={{ duration: 0.15 }}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Blue channel (right shift) */}
            <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                    color: rightColor,
                    mixBlendMode: "screen",
                }}
                animate={{
                    x: isHovered ? aberrationOffset : 0,
                    opacity: isHovered ? 0.7 : 0,
                }}
                transition={{ duration: 0.15 }}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Refractive lens band */}
            <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                aria-hidden="true"
            >
                <motion.div
                    className="absolute top-0 bottom-0"
                    style={{
                        width: `${lensWidth}%`,
                        background: `linear-gradient(90deg, 
              transparent, 
              rgba(255,255,255,0.06) 30%, 
              rgba(255,255,255,0.12) 50%, 
              rgba(255,255,255,0.06) 70%, 
              transparent)`,
                        backdropFilter: isHovered ? "blur(0.5px) saturate(1.5)" : "none",
                    }}
                    animate={{
                        left: isHovered ? `${pointerX * 100 - lensWidth / 2}%` : "-30%",
                    }}
                    transition={{ duration: 0.05 }}
                />
            </motion.div>

            {/* Sweep animation on hover entry */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    aria-hidden="true"
                >
                    <motion.div
                        className="absolute top-0 bottom-0"
                        style={{
                            width: "8%",
                            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)`,
                        }}
                        initial={{ left: "-10%" }}
                        animate={{ left: "110%" }}
                        transition={{ duration: sweepSpeed, ease: "easeInOut" }}
                    />
                </motion.div>
            )}

            {/* Main text */}
            <motion.span
                className="relative z-10"
                animate={{
                    textShadow: isHovered
                        ? `${-aberrationOffset * 0.5}px 0 ${leftColor}30, ${aberrationOffset * 0.5}px 0 ${rightColor}30`
                        : "none",
                }}
                transition={{ duration: 0.2 }}
            >
                {text}
            </motion.span>
        </div>
    );
};

export default RefractionText;

