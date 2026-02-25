/**
 * @hook usePointerField
 * @description Returns normalized pointer coordinates, angle, and distance relative to a target element.
 * Components use this hook to create pointer-reactive effects.
 *
 * @example
 * ```tsx
 * import { usePointerField } from '@/hooks/usePointerField';
 *
 * function MyComponent() {
 *   const { ref, position, angle, distance, isInside } = usePointerField();
 *   return (
 *     <div ref={ref} style={{ transform: `rotate(${angle}deg)` }}>
 *       Pointer at ({position.x.toFixed(2)}, {position.y.toFixed(2)})
 *     </div>
 *   );
 * }
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp } from '../lib/utils';

export interface PointerFieldPosition {
    /** Normalized X coordinate (0 to 1, left to right) */
    x: number;
    /** Normalized Y coordinate (0 to 1, top to bottom) */
    y: number;
    /** Raw client X coordinate in pixels */
    clientX: number;
    /** Raw client Y coordinate in pixels */
    clientY: number;
}

export interface PointerFieldResult<T extends HTMLElement = HTMLElement> {
    /** Ref to attach to the target element */
    ref: React.RefObject<T>;
    /** Normalized position relative to the element */
    position: PointerFieldPosition;
    /** Angle in degrees from the center of the element to the pointer (0–360) */
    angle: number;
    /** Normalized distance from center (0 = center, 1 = edge, >1 = outside) */
    distance: number;
    /** Whether the pointer is currently inside the element bounds */
    isInside: boolean;
}

export interface UsePointerFieldOptions {
    /** Whether to track pointer globally or only within the element. Default: false */
    global?: boolean;
    /** Smoothing factor (0 = no smoothing, 1 = max smoothing). Default: 0 */
    smoothing?: number;
}

export function usePointerField<T extends HTMLElement = HTMLDivElement>(
    options: UsePointerFieldOptions = {}
): PointerFieldResult<T> {
    const { global = false, smoothing = 0 } = options;
    const safeSmoothing = clamp(smoothing, 0, 0.999);
    const ref = useRef<T>(null!);

    const [state, setState] = useState<{
        position: PointerFieldPosition;
        angle: number;
        distance: number;
        isInside: boolean;
    }>({
        position: { x: 0.5, y: 0.5, clientX: 0, clientY: 0 },
        angle: 0,
        distance: 0,
        isInside: false,
    });

    const smoothedRef = useRef({ x: 0.5, y: 0.5 });
    const rafRef = useRef<number>(0);

    const update = useCallback(
        (clientX: number, clientY: number, inside: boolean) => {
            const el = ref.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            const rawX = (clientX - rect.left) / rect.width;
            const rawY = (clientY - rect.top) / rect.height;

            const s = safeSmoothing;
            const x = s > 0 ? smoothedRef.current.x + (rawX - smoothedRef.current.x) * (1 - s) : rawX;
            const y = s > 0 ? smoothedRef.current.y + (rawY - smoothedRef.current.y) * (1 - s) : rawY;

            smoothedRef.current = { x, y };

            const dx = x - 0.5;
            const dy = y - 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy) * 2;
            const ang = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;

            setState({
                position: { x, y, clientX, clientY },
                angle: ang,
                distance: dist,
                isInside: inside,
            });
        },
        [safeSmoothing]
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleMove = (e: PointerEvent) => {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                const rect = el.getBoundingClientRect();
                const inside =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom;

                if (global || inside) {
                    update(e.clientX, e.clientY, inside);
                } else {
                    setState(prev => ({ ...prev, isInside: false }));
                }
            });
        };

        const target = global ? window : el;
        target.addEventListener('pointermove', handleMove as EventListener);

        return () => {
            target.removeEventListener('pointermove', handleMove as EventListener);
            cancelAnimationFrame(rafRef.current);
        };
    }, [global, update]);

    return { ref, position: state.position, angle: state.angle, distance: state.distance, isInside: state.isInside };
}
