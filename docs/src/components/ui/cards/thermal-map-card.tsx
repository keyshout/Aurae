"use client";

/**
 * @component ThermalMapCard
 * @description Hover point acts as heat source; surface changes color like
 * thermochromic paint based on pointer proximity.
 * Principle: radial distance-based hue shift from cool to hot colors.
 *
 * @example
 * ```tsx
 * import { ThermalMapCard } from '@/components/cards/thermal-map-card';
 *
 * <ThermalMapCard hotColor="#ef4444" coldColor="#3b82f6" className="w-80 p-6">
 *   <h3>Heat Map</h3>
 * </ThermalMapCard>
 * ```
 */

import React, { useState, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ThermalMapCardProps {
    children: React.ReactNode;
    /** Hot color (near pointer). Default: "#ef4444" */
    hotColor?: string;
    /** Cold color (far from pointer). Default: "#1e3a5f" */
    coldColor?: string;
    /** Heat radius in px. Default: 150 */
    heatRadius?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const ThermalMapCard: React.FC<ThermalMapCardProps> = ({
    children,
    hotColor = "#ef4444",
    coldColor = "#1e3a5f",
    heatRadius = 150,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMove = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, [prefersReducedMotion]);

    const gradient = isHovered && !prefersReducedMotion
        ? `radial-gradient(circle ${heatRadius}px at ${pointer.x}px ${pointer.y}px, ${hotColor}, ${coldColor})`
        : `linear-gradient(135deg, ${coldColor}, ${coldColor})`;

    return (
        <motion.div
            ref={cardRef}
            className={`relative overflow-hidden ${className}`}
            style={{ borderRadius, background: gradient }}
            onPointerMove={handleMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            animate={{
                boxShadow: isHovered && !prefersReducedMotion
                    ? `0 0 30px ${hotColor}40`
                    : "none",
            }}
            transition={{ duration: 0.3 }}
            role="article"
        >
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

export default ThermalMapCard;
