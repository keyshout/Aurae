"use client";

/**
 * @component ElasticBorderButton
 * @description Border has gel-like consistency; near the pointer it bulges outward,
 * on click an elastic wave travels around the border.
 * Based on SVG border path deformation + wave animation.
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

import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
    const [wavePhase, setWavePhase] = useState(0);
    const [isWaving, setIsWaving] = useState(false);

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
            setWavePhase(0);
            onClick?.(e);
        },
        [onClick, disabled]
    );

    // Wave animation
    useEffect(() => {
        if (!isWaving) return;
        let frame: number;
        let phase = 0;
        const animate = () => {
            phase += 0.05;
            setWavePhase(phase);
            if (phase >= Math.PI * 2) {
                setIsWaving(false);
                return;
            }
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [isWaving]);

    // Generate SVG border path with deformation
    const w = 160;
    const h = 48;
    const r = 12;
    const segments = 40;

    // Memoize SVG border path — only recalculate on pointer/wave changes
    const borderPath = useMemo(() => {
        const points: string[] = [];
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            let x: number, y: number;

            // Traverse the rectangle perimeter
            const perim = 2 * (w + h);
            const pos = t * perim;

            if (pos < w) {
                x = pos; y = 0;
            } else if (pos < w + h) {
                x = w; y = pos - w;
            } else if (pos < 2 * w + h) {
                x = w - (pos - w - h); y = h;
            } else {
                x = 0; y = h - (pos - 2 * w - h);
            }

            // Apply bulge toward pointer
            if (isHovered) {
                const dx = (pointer.x / 100) * w - x;
                const dy = (pointer.y / 100) * h - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = w * 0.4;
                if (dist < maxDist) {
                    const force = (1 - dist / maxDist) * bulgeAmount;
                    const angle = Math.atan2(dy, dx);
                    x -= Math.cos(angle) * force;
                    y -= Math.sin(angle) * force;
                }
            }

            // Wave deformation
            if (isWaving) {
                const waveOffset = Math.sin(t * Math.PI * 4 - wavePhase * 4) * bulgeAmount * 0.5;
                const nx = y === 0 || y === h ? 0 : (x === 0 ? -1 : 1);
                const ny = x === 0 || x === w ? 0 : (y === 0 ? -1 : 1);
                x += nx * waveOffset;
                y += ny * waveOffset;
            }

            points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
        }
        return points.join(" ") + " Z";
    }, [pointer.x, pointer.y, isHovered, isWaving, wavePhase, w, h, segments, bulgeAmount]);

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
            {/* SVG elastic border */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`-${bulgeAmount} -${bulgeAmount} ${w + bulgeAmount * 2} ${h + bulgeAmount * 2}`}
                aria-hidden="true"
            >
                <path
                    d={borderPath}
                    fill="none"
                    stroke={borderColor}
                    strokeWidth={2}
                    style={{
                        filter: `drop-shadow(0 0 4px ${borderColor}60)`,
                        transition: "d 0.05s",
                    }}
                />
            </svg>

            <span className="relative z-10 font-semibold text-white px-6 py-3">{children}</span>
        </motion.button>
    );
};

export default ElasticBorderButton;
