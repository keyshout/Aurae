"use client";

/**
 * @component MagneticInkText
 * @description Characters behave like liquid ink. When pointer approaches,
 * characters deform and stretch toward/away from the pointer.
 * Based on per-character physics simulation + ink stretch transforms.
 *
 * @example
 * ```tsx
 * import { MagneticInkText } from '@/components/text/magnetic-ink-text';
 *
 * <MagneticInkText
 *   text="Fluid Ink"
 *   influenceRadius={120}
 *   className="text-5xl font-black text-white"
 * />
 * ```
 */

import React, { useRef, useEffect, useCallback } from "react";

interface CharState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    scaleX: number;
    scaleY: number;
}

export interface MagneticInkTextProps {
    /** Text to display */
    text: string;
    /** Pointer influence radius in pixels. Default: 100 */
    influenceRadius?: number;
    /** Maximum character displacement in pixels. Default: 15 */
    maxStretch?: number;
    /** Spring stiffness. Default: 0.08 */
    stiffness?: number;
    /** Damping factor. Default: 0.85 */
    damping?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const MagneticInkText: React.FC<MagneticInkTextProps> = ({
    text,
    influenceRadius = 100,
    maxStretch = 15,
    stiffness = 0.08,
    damping = 0.85,
    className = "",
    ariaLabel,
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const statesRef = useRef<CharState[]>(
        text.split("").map(() => ({ x: 0, y: 0, vx: 0, vy: 0, scaleX: 1, scaleY: 1 }))
    );
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);

    // Reset states when text changes
    useEffect(() => {
        statesRef.current = text.split("").map(() => ({
            x: 0, y: 0, vx: 0, vy: 0, scaleX: 1, scaleY: 1,
        }));
    }, [text]);

    const simulate = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const pointer = pointerRef.current;
        let hasMotion = false;

        statesRef.current.forEach((state, i) => {
            const span = spanRefs.current[i];
            if (!span) return;

            const rect = span.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = pointer.x - cx;
            const dy = pointer.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < influenceRadius) {
                const force = (1 - dist / influenceRadius) * maxStretch;
                const angle = Math.atan2(dy, dx);
                const targetX = Math.cos(angle) * force;
                const targetY = Math.sin(angle) * force;

                state.vx += (targetX - state.x) * stiffness * 2;
                state.vy += (targetY - state.y) * stiffness * 2;

                // Ink stretch: scale perpendicular to force direction
                const stretchFactor = 1 + (force / maxStretch) * 0.3;
                state.scaleX = 1 + (stretchFactor - 1) * Math.abs(Math.cos(angle));
                state.scaleY = 1 + (stretchFactor - 1) * Math.abs(Math.sin(angle));
            } else {
                state.scaleX += (1 - state.scaleX) * 0.1;
                state.scaleY += (1 - state.scaleY) * 0.1;
            }

            // Spring back
            state.vx += -state.x * stiffness;
            state.vy += -state.y * stiffness;
            state.vx *= damping;
            state.vy *= damping;
            state.x += state.vx;
            state.y += state.vy;

            if (
                Math.abs(state.vx) > 0.01 ||
                Math.abs(state.vy) > 0.01 ||
                Math.abs(state.x) > 0.1 ||
                Math.abs(state.y) > 0.1
            ) {
                hasMotion = true;
            }

            // Direct DOM manipulation — no setState needed
            span.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scaleX}, ${state.scaleY})`;
        });

        if (hasMotion) {
            rafRef.current = requestAnimationFrame(simulate);
        }
    }, [influenceRadius, maxStretch, stiffness, damping]);

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            pointerRef.current = { x: e.clientX, y: e.clientY };
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(simulate);
        };

        window.addEventListener("pointermove", handlePointerMove);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, [simulate]);

    return (
        <span
            ref={containerRef}
            className={`inline-flex flex-wrap ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    ref={(el) => { spanRefs.current[i] = el; }}
                    className="inline-block"
                    style={{ willChange: "transform" }}
                    aria-hidden="true"
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
};

export default MagneticInkText;

