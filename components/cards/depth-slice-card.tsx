"use client";

/**
 * @component DepthSliceCard
 * @description On hover the card splits into horizontal slices, each moving at different speeds,
 * then merging back into a flat card.
 * Based on clip-path slicing + staggered translateY.
 *
 * @example
 * ```tsx
 * import { DepthSliceCard } from '@/components/cards/depth-slice-card';
 *
 * <DepthSliceCard sliceCount={5} className="w-80 h-48">
 *   <div className="p-6">
 *     <h3>Sliced View</h3>
 *     <p>Hover to separate</p>
 *   </div>
 * </DepthSliceCard>
 * ```
 */

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

export interface DepthSliceCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Number of slices. Default: 5 */
    sliceCount?: number;
    /** Max displacement per slice in px. Default: 12 */
    maxDisplacement?: number;
    /** Animation stagger delay in seconds. Default: 0.04 */
    stagger?: number;
    /** Additional class names */
    className?: string;
}

export const DepthSliceCard: React.FC<DepthSliceCardProps> = ({
    children,
    sliceCount = 5,
    maxDisplacement = 12,
    stagger = 0.04,
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const slices = useMemo(
        () =>
            Array.from({ length: sliceCount }, (_, i) => {
                const from = (i / sliceCount) * 100;
                const to = ((i + 1) / sliceCount) * 100;
                const mid = Math.abs(i - (sliceCount - 1) / 2);
                const direction = i < sliceCount / 2 ? -1 : 1;
                return {
                    clipPath: `inset(${from}% 0% ${100 - to}% 0%)`,
                    displacement: direction * mid * (maxDisplacement / (sliceCount / 2)),
                    index: i,
                };
            }),
        [sliceCount, maxDisplacement]
    );

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            {slices.map((slice) => (
                <motion.div
                    key={slice.index}
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950"
                    style={{ clipPath: slice.clipPath }}
                    animate={{
                        y: isHovered ? slice.displacement : 0,
                        x: isHovered ? slice.displacement * 0.2 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: slice.index * stagger,
                    }}
                >
                    <div className="h-full">{children}</div>

                    {/* Slice edge highlight */}
                    {isHovered && (
                        <motion.div
                            className="absolute left-0 right-0 h-px pointer-events-none"
                            style={{
                                top: `${(slice.index / sliceCount) * 100}%`,
                                background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            aria-hidden="true"
                        />
                    )}
                </motion.div>
            ))}

            {/* Shadow overlay for depth perception */}
            <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                    boxShadow: isHovered
                        ? "0 25px 50px rgba(0,0,0,0.4)"
                        : "0 4px 12px rgba(0,0,0,0.2)",
                }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />
        </div>
    );
};

export default DepthSliceCard;

