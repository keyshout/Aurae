"use client";

/**
 * @component PrismaticUnderline
 * @description On link hover, the underline expands with a multi-layered diffraction effect
 * and hue shift. On exit, collapses to a thin line.
 * Based on multi-layer pseudo-element + hue shift animation.
 *
 * @example
 * ```tsx
 * import { PrismaticUnderline } from '@/components/decorative/prismatic-underline';
 *
 * <PrismaticUnderline href="#" colors={['#f43f5e', '#8b5cf6', '#06b6d4']}>
 *   Learn More
 * </PrismaticUnderline>
 * ```
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface PrismaticUnderlineProps {
    /** Link content */
    children: React.ReactNode;
    /** Link href. Default: "#" */
    href?: string;
    /** Prismatic colors. Default: rose/violet/cyan */
    colors?: string[];
    /** Underline max height in px. Default: 4 */
    maxHeight?: number;
    /** Animation duration in seconds. Default: 0.3 */
    duration?: number;
    /** Additional class names */
    className?: string;
}

export const PrismaticUnderline: React.FC<PrismaticUnderlineProps> = ({
    children,
    href = "#",
    colors = ["#f43f5e", "#8b5cf6", "#06b6d4"],
    maxHeight = 4,
    duration = 0.3,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href={href}
            className={`relative inline-block text-white no-underline ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="relative z-10">{children}</span>

            {/* Prismatic underline layers */}
            <span className="absolute left-0 right-0 bottom-0 overflow-hidden" style={{ height: maxHeight * 2 }}>
                {colors.map((color, i) => {
                    const offset = (i - (colors.length - 1) / 2) * 1.5;
                    return (
                        <motion.span
                            key={i}
                            className="absolute left-0 right-0 bottom-0"
                            style={{
                                background: color,
                                mixBlendMode: "screen",
                                bottom: offset,
                            }}
                            animate={{
                                height: isHovered ? maxHeight : 1,
                                opacity: isHovered ? 0.7 : i === Math.floor(colors.length / 2) ? 0.4 : 0,
                                scaleX: isHovered ? 1 : 0.3,
                            }}
                            transition={{
                                duration,
                                delay: i * 0.03,
                                ease: "easeOut",
                            }}
                            aria-hidden="true"
                        />
                    );
                })}

                {/* Shimmer sweep */}
                {isHovered && (
                    <motion.span
                        className="absolute bottom-0 h-full"
                        style={{
                            width: "30%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        }}
                        initial={{ left: "-30%" }}
                        animate={{ left: "130%" }}
                        transition={{ duration: duration * 2, ease: "easeInOut" }}
                        aria-hidden="true"
                    />
                )}
            </span>
        </a>
    );
};

export default PrismaticUnderline;
