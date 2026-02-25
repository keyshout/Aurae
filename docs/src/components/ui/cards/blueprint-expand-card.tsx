"use client";

/**
 * @component BlueprintExpandCard
 * @description On hover, card adds technical blueprint-style dimension lines,
 * annotations, and measurement indicators that fade in/out.
 * Principle: staged line draw animation + annotation fade.
 *
 * @example
 * ```tsx
 * import { BlueprintExpandCard } from '@/components/cards/blueprint-expand-card';
 *
 * <BlueprintExpandCard annotationColor="#06b6d4" className="w-80 p-6">
 *   <h3>Dimensions</h3>
 * </BlueprintExpandCard>
 * ```
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface BlueprintExpandCardProps {
    children: React.ReactNode;
    /** Annotation color. Default: "#06b6d4" */
    annotationColor?: string;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const BlueprintExpandCard: React.FC<BlueprintExpandCardProps> = ({
    children,
    annotationColor = "#06b6d4",
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ w: 300, h: 200 });

    useEffect(() => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setDims({ w: rect.width + 48, h: rect.height + 48 });
        }
    }, []);

    const show = isHovered && !prefersReducedMotion;

    return (
        <div
            ref={cardRef}
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            <div
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden"
                style={{ borderRadius }}
            >
                {children}
            </div>

            <div
                className="absolute -inset-6 pointer-events-none"
                aria-hidden="true"
            >
                <motion.div
                    className="absolute left-6 right-6 top-3 h-px origin-left"
                    style={{
                        backgroundImage: `repeating-linear-gradient(90deg, ${annotationColor} 0 4px, transparent 4px 8px)`,
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: show ? 1 : 0, opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.4 }}
                />
                <motion.div
                    className="absolute top-2 w-px h-2"
                    style={{ left: 24, background: annotationColor }}
                    animate={{ opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.3 }}
                />
                <motion.div
                    className="absolute top-2 w-px h-2"
                    style={{ left: dims.w - 24, background: annotationColor }}
                    animate={{ opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.3 }}
                />

                <motion.div
                    className="absolute top-6 bottom-6 right-3 w-px origin-top"
                    style={{
                        backgroundImage: `repeating-linear-gradient(180deg, ${annotationColor} 0 4px, transparent 4px 8px)`,
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: show ? 1 : 0, opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                />

                <motion.div
                    className="absolute"
                    style={{
                        left: 24,
                        top: 24,
                        width: 4,
                        height: 4,
                        borderTop: `1px solid ${annotationColor}`,
                        borderLeft: `1px solid ${annotationColor}`,
                    }}
                    animate={{ opacity: show ? 0.4 : 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                />
                <motion.div
                    className="absolute"
                    style={{
                        left: dims.w - 28,
                        top: 24,
                        width: 4,
                        height: 4,
                        borderTop: `1px solid ${annotationColor}`,
                        borderRight: `1px solid ${annotationColor}`,
                    }}
                    animate={{ opacity: show ? 0.4 : 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                />
            </div>

            {/* Dimension labels */}
            <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono pointer-events-none"
                style={{ color: annotationColor }}
                animate={{ opacity: show ? 0.7 : 0, y: show ? 0 : 4 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                aria-hidden="true"
            >
                W: 320px
            </motion.div>
            <motion.div
                className="absolute top-1/2 -right-6 -translate-y-1/2 text-[10px] font-mono pointer-events-none"
                style={{ color: annotationColor, writingMode: "vertical-rl" }}
                animate={{ opacity: show ? 0.7 : 0, x: show ? 0 : -4 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                aria-hidden="true"
            >
                H: 200px
            </motion.div>
        </div>
    );
};

export default BlueprintExpandCard;
