"use client";

/**
 * @component MagneticFieldLines
 * @description Pointer acts as a magnetic dipole, field lines are calculated
 * and rendered in real-time around the cursor position.
 * Principle: magnetic dipole field equations + SVG path rendering.
 *
 * @example
 * ```tsx
 * import { MagneticFieldLines } from '@/components/backgrounds/magnetic-field-lines';
 *
 * <MagneticFieldLines lineColor="#06b6d4" lineCount={20} className="w-full h-96" />
 * ```
 */

import React, { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MagneticFieldLinesProps {
    /** Line color. Default: "#06b6d4" */
    lineColor?: string;
    /** Number of field lines. Default: 16 */
    lineCount?: number;
    /** Line opacity. Default: 0.4 */
    lineOpacity?: number;
    /** Additional class names */
    className?: string;
}

export const MagneticFieldLines: React.FC<MagneticFieldLinesProps> = ({
    lineColor = "#06b6d4",
    lineCount = 16,
    lineOpacity = 0.4,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isActive, setIsActive] = useState(false);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
        setIsActive(true);
    }, [prefersReducedMotion]);

    // Generate field line paths using dipole field approximation
    const generateFieldLines = () => {
        const lines: string[] = [];
        const cx = pointer.x;
        const cy = pointer.y;

        for (let i = 0; i < lineCount; i++) {
            const startAngle = (i / lineCount) * Math.PI * 2;
            const points: string[] = [];
            let x = cx + Math.cos(startAngle) * 3;
            let y = cy + Math.sin(startAngle) * 3;

            for (let step = 0; step < 40; step++) {
                points.push(`${x},${y}`);

                // Dipole field direction
                const dx = x - cx;
                const dy = y - cy;
                const r = Math.sqrt(dx * dx + dy * dy);
                if (r < 1 || r > 80) break;

                // Field line follows B = (2cos θ r̂ + sin θ θ̂) / r³
                const theta = Math.atan2(dy, dx);
                const br = 2 * Math.cos(theta) / (r * r);
                const bt = Math.sin(theta) / (r * r);
                const mag = Math.sqrt(br * br + bt * bt);
                if (mag < 0.0001) break;

                x += (br * Math.cos(theta) - bt * Math.sin(theta)) / mag * 2;
                y += (br * Math.sin(theta) + bt * Math.cos(theta)) / mag * 2;
            }

            if (points.length > 2) {
                lines.push(`M ${points.join(" L ")}`);
            }
        }
        return lines;
    };

    const fieldLines = isActive && !prefersReducedMotion ? generateFieldLines() : [];

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setIsActive(false)}
            role="presentation"
            aria-hidden="true"
        >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {fieldLines.map((d, i) => (
                    <motion.path
                        key={i}
                        d={d}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth={0.3}
                        strokeOpacity={lineOpacity}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                ))}

                {/* Dipole center glow */}
                {isActive && (
                    <circle
                        cx={pointer.x}
                        cy={pointer.y}
                        r={2}
                        fill={lineColor}
                        fillOpacity={0.3}
                    />
                )}
            </svg>
        </div>
    );
};

export default MagneticFieldLines;
