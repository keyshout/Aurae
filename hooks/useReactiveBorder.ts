/**
 * @hook useReactiveBorder
 * @description Makes border segments reactive to pointer position.
 * Calculates which segments of a rectangular border are closest to the pointer
 * and returns per-segment intensity values.
 *
 * @example
 * ```tsx
 * import { useReactiveBorder } from '@/hooks/useReactiveBorder';
 *
 * function ReactiveBox() {
 *   const { ref, segments } = useReactiveBorder({ segmentCount: 20 });
 *   return (
 *     <div ref={ref} className="relative w-64 h-40">
 *       <svg className="absolute inset-0 w-full h-full">
 *         {segments.map((seg, i) => (
 *           <line
 *             key={i}
 *             x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
 *             stroke={`rgba(139, 92, 246, ${seg.intensity})`}
 *             strokeWidth={2}
 *           />
 *         ))}
 *       </svg>
 *       <div className="p-4">Content</div>
 *     </div>
 *   );
 * }
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from "framer-motion";

export interface BorderSegment {
    /** Start X coordinate (percentage, 0–100) */
    x1: string;
    /** Start Y coordinate (percentage, 0–100) */
    y1: string;
    /** End X coordinate (percentage, 0–100) */
    x2: string;
    /** End Y coordinate (percentage, 0–100) */
    y2: string;
    /** Intensity based on pointer proximity (0–1) */
    intensity: number;
    /** Side of the border: top, right, bottom, left */
    side: 'top' | 'right' | 'bottom' | 'left';
    /** Midpoint X in pixels relative to element */
    midX: number;
    /** Midpoint Y in pixels relative to element */
    midY: number;
}

export interface UseReactiveBorderOptions {
    /** Number of segments per side. Default: 8 */
    segmentCount?: number;
    /** Radius of pointer influence in pixels. Default: 150 */
    influenceRadius?: number;
    /** Minimum intensity when out of range. Default: 0.1 */
    minIntensity?: number;
    /** Maximum intensity when pointer is closest. Default: 1 */
    maxIntensity?: number;
    /** Damping for smooth transitions. Default: 0.12 */
    damping?: number;
}

export interface ReactiveBorderResult<T extends HTMLElement = HTMLElement> {
    /** Ref to attach to the container element */
    ref: React.RefObject<T>;
    /** Array of border segments with current intensities */
    segments: BorderSegment[];
}

interface SegmentMeta {
    side: 'top' | 'right' | 'bottom' | 'left';
    /** Fractional start position along the side (0–1) */
    startFrac: number;
    /** Fractional end position along the side (0–1) */
    endFrac: number;
    /** Current smoothed intensity */
    currentIntensity: number;
}

export function useReactiveBorder<T extends HTMLElement = HTMLDivElement>(
    options: UseReactiveBorderOptions = {}
): ReactiveBorderResult<T> {
    const {
        segmentCount = 8,
        influenceRadius = 150,
        minIntensity = 0.1,
        maxIntensity = 1,
        damping = 0.12,
    } = options;

    const ref = useRef<T>(null!);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const segmentMetaRef = useRef<SegmentMeta[]>([]);
    const rafRef = useRef<number>(0);
    const segmentsRef = useRef<BorderSegment[]>([]);
    const [segments, setSegments] = useState<BorderSegment[]>([]);

    // Initialize segment metadata
    useEffect(() => {
        const sides: Array<'top' | 'right' | 'bottom' | 'left'> = ['top', 'right', 'bottom', 'left'];
        const meta: SegmentMeta[] = [];

        sides.forEach((side) => {
            for (let i = 0; i < segmentCount; i++) {
                meta.push({
                    side,
                    startFrac: i / segmentCount,
                    endFrac: (i + 1) / segmentCount,
                    currentIntensity: minIntensity,
                });
            }
        });

        segmentMetaRef.current = meta;
    }, [segmentCount, minIntensity]);

    const getMidpoint = useCallback(
        (meta: SegmentMeta, width: number, height: number) => {
            const frac = (meta.startFrac + meta.endFrac) / 2;
            switch (meta.side) {
                case 'top':
                    return { x: frac * width, y: 0 };
                case 'right':
                    return { x: width, y: frac * height };
                case 'bottom':
                    return { x: (1 - frac) * width, y: height };
                case 'left':
                    return { x: 0, y: (1 - frac) * height };
            }
        },
        []
    );

    const getEndpoints = useCallback(
        (meta: SegmentMeta): { x1: string; y1: string; x2: string; y2: string } => {
            const s = (meta.startFrac * 100).toFixed(1) + '%';
            const e = (meta.endFrac * 100).toFixed(1) + '%';
            switch (meta.side) {
                case 'top':
                    return { x1: s, y1: '0%', x2: e, y2: '0%' };
                case 'right':
                    return { x1: '100%', y1: s, x2: '100%', y2: e };
                case 'bottom':
                    return { x1: e, y1: '100%', x2: s, y2: '100%' };
                case 'left':
                    return { x1: '0%', y1: e, x2: '0%', y2: s };
            }
        },
        []
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handlePointerMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            pointerRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handlePointerLeave = () => {
            pointerRef.current = { x: -9999, y: -9999 };
        };

        el.addEventListener('pointermove', handlePointerMove);
        el.addEventListener('pointerleave', handlePointerLeave);

        let active = true;

        const update = () => {
            if (!active) return;

            const rect = el.getBoundingClientRect();
            const pointer = pointerRef.current;
            const metas = segmentMetaRef.current;

            const newSegments: BorderSegment[] = metas.map((meta) => {
                const mid = getMidpoint(meta, rect.width, rect.height);
                const dx = pointer.x - mid.x;
                const dy = pointer.y - mid.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const targetIntensity =
                    dist < influenceRadius
                        ? minIntensity + (maxIntensity - minIntensity) * (1 - dist / influenceRadius)
                        : minIntensity;

                meta.currentIntensity += (targetIntensity - meta.currentIntensity) * damping;

                const endpoints = getEndpoints(meta);

                return {
                    ...endpoints,
                    intensity: meta.currentIntensity,
                    side: meta.side,
                    midX: mid.x,
                    midY: mid.y,
                };
            });

            // Only update state if intensities actually changed (threshold: 0.005)
            const hasChanged = newSegments.some((seg, idx) => {
                const prev = segmentsRef.current[idx];
                return !prev || Math.abs(seg.intensity - prev.intensity) > 0.005;
            });

            if (hasChanged) {
                segmentsRef.current = newSegments;
                setSegments(newSegments);
            }
            rafRef.current = requestAnimationFrame(update);
        };

        rafRef.current = requestAnimationFrame(update);

        return () => {
            active = false;
            cancelAnimationFrame(rafRef.current);
            el.removeEventListener('pointermove', handlePointerMove);
            el.removeEventListener('pointerleave', handlePointerLeave);
        };
    }, [influenceRadius, minIntensity, maxIntensity, damping, getMidpoint, getEndpoints]);

    return { ref, segments };
}
