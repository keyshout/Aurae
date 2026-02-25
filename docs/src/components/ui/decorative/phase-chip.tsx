"use client";

/**
 * @component PhaseChip
 * @description "Beta / New / AI" chips that transition from matte to glossy surface
 * on hover, like a phase-changing material.
 * Based on CSS backdrop-filter + brightness transition.
 *
 * @example
 * ```tsx
 * import { PhaseChip } from '@/components/decorative/phase-chip';
 *
 * <PhaseChip label="Beta" variant="info" />
 * <PhaseChip label="New" variant="success" />
 * <PhaseChip label="AI" variant="premium" icon="✨" />
 * ```
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface PhaseChipProps {
    /** Chip label */
    label: string;
    /** Visual variant */
    variant?: "info" | "success" | "warning" | "premium" | "neutral";
    /** Optional icon/emoji */
    icon?: string;
    /** Size */
    size?: "sm" | "md" | "lg";
    /** Additional class names */
    className?: string;
}

const VARIANT_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
    info: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", glow: "#3b82f6" },
    success: { bg: "rgba(16, 185, 129, 0.15)", text: "#34d399", glow: "#10b981" },
    warning: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", glow: "#f59e0b" },
    premium: { bg: "rgba(139, 92, 246, 0.15)", text: "#a78bfa", glow: "#8b5cf6" },
    neutral: { bg: "rgba(255, 255, 255, 0.08)", text: "#94a3b8", glow: "#64748b" },
};

const SIZE_MAP: Record<string, string> = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
};

export const PhaseChip: React.FC<PhaseChipProps> = ({
    label,
    variant = "info",
    icon,
    size = "md",
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const colors = VARIANT_COLORS[variant] || VARIANT_COLORS.info;
    const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

    return (
        <motion.span
            className={`relative inline-flex items-center gap-1 rounded-full font-medium cursor-default select-none ${sizeClass} ${className}`}
            style={{
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.text}20`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
                background: isHovered
                    ? `linear-gradient(135deg, ${colors.bg}, rgba(255,255,255,0.12))`
                    : colors.bg,
                boxShadow: isHovered
                    ? `0 0 12px ${colors.glow}30, inset 0 1px 0 rgba(255,255,255,0.15)`
                    : "none",
                filter: isHovered ? "brightness(1.3)" : "brightness(1)",
                borderColor: isHovered ? `${colors.text}50` : `${colors.text}20`,
            }}
            transition={{ duration: 0.25 }}
            role="status"
        >
            {/* Glossy overlay on hover */}
            <motion.span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
            />

            {icon && <span>{icon}</span>}
            <span className="relative z-10">{label}</span>
        </motion.span>
    );
};

export default PhaseChip;

