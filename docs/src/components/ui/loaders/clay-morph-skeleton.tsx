"use client";

/**
 * @component ClayMorphSkeleton
 * @description Skeleton with soft clay-like forms that gently morph,
 * transforming into sharp components when content loads.
 * Based on border-radius morph + subtle scale variation.
 *
 * @example
 * ```tsx
 * import { ClayMorphSkeleton } from '@/components/loaders/clay-morph-skeleton';
 *
 * <ClayMorphSkeleton
 *   layout="card"
 *   isLoading={true}
 *   className="w-80"
 * />
 * ```
 */

import React from "react";
import { motion } from "framer-motion";
import { toPositiveNumber } from "@/lib/utils";

export interface ClayMorphSkeletonProps {
    /** Preset layout: card, text, avatar, list. Default: "card" */
    layout?: "card" | "text" | "avatar" | "list";
    /** Whether loading. Default: true */
    isLoading?: boolean;
    /** Base color. Default: "rgba(255,255,255,0.06)" */
    baseColor?: string;
    /** Highlight color. Default: "rgba(255,255,255,0.1)" */
    highlightColor?: string;
    /** Animation speed. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

interface ClayBlock {
    width: string;
    height: string;
    borderRadius: string[];
    marginBottom?: number;
}

const LAYOUTS: Record<string, ClayBlock[]> = {
    card: [
        { width: "100%", height: "120px", borderRadius: ["24px 32px 20px 28px", "28px 24px 32px 20px", "20px 28px 24px 32px"] },
        { width: "70%", height: "18px", borderRadius: ["12px 16px 10px 14px", "14px 12px 16px 10px"], marginBottom: 8 },
        { width: "100%", height: "14px", borderRadius: ["10px 14px 8px 12px", "12px 10px 14px 8px"], marginBottom: 6 },
        { width: "85%", height: "14px", borderRadius: ["10px 14px 8px 12px", "12px 10px 14px 8px"] },
    ],
    text: [
        { width: "90%", height: "16px", borderRadius: ["10px 14px 8px 12px", "12px 10px 14px 8px"], marginBottom: 8 },
        { width: "100%", height: "16px", borderRadius: ["12px 10px 14px 8px", "8px 12px 10px 14px"], marginBottom: 8 },
        { width: "65%", height: "16px", borderRadius: ["10px 14px 8px 12px", "14px 8px 12px 10px"] },
    ],
    avatar: [
        { width: "56px", height: "56px", borderRadius: ["50% 48% 52% 50%", "48% 52% 50% 48%", "52% 50% 48% 52%"] },
    ],
    list: [
        { width: "100%", height: "40px", borderRadius: ["16px 20px 14px 18px", "18px 16px 20px 14px"], marginBottom: 8 },
        { width: "100%", height: "40px", borderRadius: ["14px 18px 16px 20px", "20px 14px 18px 16px"], marginBottom: 8 },
        { width: "100%", height: "40px", borderRadius: ["18px 14px 20px 16px", "16px 20px 14px 18px"] },
    ],
};

export const ClayMorphSkeleton: React.FC<ClayMorphSkeletonProps> = ({
    layout = "card",
    isLoading = true,
    baseColor = "rgba(255,255,255,0.06)",
    highlightColor = "rgba(255,255,255,0.1)",
    speed = 1,
    className = "",
}) => {
    if (!isLoading) return null;

    const blocks = LAYOUTS[layout] || LAYOUTS.card;
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const dur = 3 / safeSpeed;

    return (
        <div className={`space-y-0 ${className}`} role="progressbar" aria-label="Loading content">
            {blocks.map((block, i) => (
                <motion.div
                    key={i}
                    style={{
                        width: block.width,
                        height: block.height,
                        background: `linear-gradient(110deg, ${baseColor} 30%, ${highlightColor} 50%, ${baseColor} 70%)`,
                        backgroundSize: "200% 100%",
                        marginBottom: block.marginBottom || 0,
                    }}
                    animate={{
                        borderRadius: block.borderRadius,
                        backgroundPosition: ["200% 0%", "-200% 0%"],
                        scale: [1, 1.005, 0.998, 1],
                    }}
                    transition={{
                        borderRadius: { duration: dur, repeat: Infinity, ease: "easeInOut" },
                        backgroundPosition: { duration: dur * 0.8, repeat: Infinity, ease: "linear" },
                        scale: { duration: dur * 1.2, repeat: Infinity, ease: "easeInOut" },
                        delay: i * 0.15,
                    }}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
};

export default ClayMorphSkeleton;

