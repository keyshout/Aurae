/**
 * @hook useSpringGrid
 * @description Manages a grid of elements that react to pointer proximity with spring physics.
 * Each cell stores a displacement vector that springs back to zero when the pointer moves away.
 *
 * @example
 * ```tsx
 * import { useSpringGrid } from '@/hooks/useSpringGrid';
 *
 * function GridComponent() {
 *   const { ref, getDisplacement } = useSpringGrid({ columns: 10, rows: 10 });
 *   return (
 *     <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)' }}>
 *       {Array.from({ length: 100 }, (_, i) => {
 *         const d = getDisplacement(i % 10, Math.floor(i / 10));
 *         return (
 *           <div key={i} style={{ transform: `translate(${d.x}px, ${d.y}px)` }}>
 *             •
 *           </div>
 *         );
 *       })}
 *     </div>
 *   );
 * }
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp, toFiniteNumber, toPositiveInt, toPositiveNumber } from '../lib/utils';

export interface SpringGridDisplacement {
    /** Horizontal displacement in pixels */
    x: number;
    /** Vertical displacement in pixels */
    y: number;
    /** Normalized force magnitude (0–1) */
    force: number;
}

export interface UseSpringGridOptions {
    /** Number of columns */
    columns: number;
    /** Number of rows */
    rows: number;
    /** Maximum displacement in pixels. Default: 20 */
    maxDisplacement?: number;
    /** Radius of pointer influence in pixels. Default: 120 */
    influenceRadius?: number;
    /** Spring stiffness (higher = snappier return). Default: 0.08 */
    stiffness?: number;
    /** Damping factor (higher = slower return). Default: 0.85 */
    damping?: number;
}

interface CellState {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export interface SpringGridResult<T extends HTMLElement = HTMLElement> {
    /** Ref to attach to the grid container */
    ref: React.RefObject<T>;
    /** Get displacement for a specific cell */
    getDisplacement: (col: number, row: number) => SpringGridDisplacement;
}

export function useSpringGrid<T extends HTMLElement = HTMLDivElement>(
    options: UseSpringGridOptions
): SpringGridResult<T> {
    const {
        columns,
        rows,
        maxDisplacement = 20,
        influenceRadius = 120,
        stiffness = 0.08,
        damping = 0.85,
    } = options;

    const safeColumns = toPositiveInt(columns, 1, 1);
    const safeRows = toPositiveInt(rows, 1, 1);
    const safeMaxDisplacement = toPositiveNumber(maxDisplacement, 20, 0.001);
    const safeInfluenceRadius = toPositiveNumber(influenceRadius, 120, 0.001);
    const safeStiffness = clamp(toFiniteNumber(stiffness, 0.08), 0.0001, 1);
    const safeDamping = clamp(toFiniteNumber(damping, 0.85), 0, 0.9999);

    const ref = useRef<T>(null!);
    const cellsRef = useRef<CellState[]>([]);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);
    const isRunningRef = useRef(false);
    const [, forceUpdate] = useState(0);

    // Initialize cells
    useEffect(() => {
        cellsRef.current = Array.from({ length: safeColumns * safeRows }, () => ({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
        }));
    }, [safeColumns, safeRows]);

    // Physics simulation loop
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handlePointerMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            pointerRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            // Restart simulation if idle
            if (!isRunningRef.current) {
                isRunningRef.current = true;
                rafRef.current = requestAnimationFrame(simulate);
            }
        };

        const handlePointerLeave = () => {
            pointerRef.current = { x: -9999, y: -9999 };
        };

        el.addEventListener('pointermove', handlePointerMove);
        el.addEventListener('pointerleave', handlePointerLeave);

        let active = true;

        const simulate = () => {
            if (!active) return;

            const rect = el.getBoundingClientRect();
            const cellW = rect.width / safeColumns;
            const cellH = rect.height / safeRows;
            const pointer = pointerRef.current;
            let needsUpdate = false;

            cellsRef.current.forEach((cell, i) => {
                const col = i % safeColumns;
                const row = Math.floor(i / safeColumns);
                const cx = (col + 0.5) * cellW;
                const cy = (row + 0.5) * cellH;

                const dx = cx - pointer.x;
                const dy = cy - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < safeInfluenceRadius) {
                    const force = (1 - dist / safeInfluenceRadius) * safeMaxDisplacement;
                    const angle = Math.atan2(dy, dx);
                    const targetX = Math.cos(angle) * force;
                    const targetY = Math.sin(angle) * force;
                    cell.vx += (targetX - cell.x) * safeStiffness;
                    cell.vy += (targetY - cell.y) * safeStiffness;
                }

                // Spring back to origin
                cell.vx += -cell.x * safeStiffness;
                cell.vy += -cell.y * safeStiffness;

                cell.vx *= safeDamping;
                cell.vy *= safeDamping;
                cell.x += cell.vx;
                cell.y += cell.vy;

                if (Math.abs(cell.vx) > 0.01 || Math.abs(cell.vy) > 0.01) {
                    needsUpdate = true;
                }
            });

            forceUpdate(n => n + 1);

            if (needsUpdate) {
                rafRef.current = requestAnimationFrame(simulate);
            } else {
                isRunningRef.current = false;
            }
        };

        // Start initial simulation
        isRunningRef.current = true;
        rafRef.current = requestAnimationFrame(simulate);

        return () => {
            active = false;
            cancelAnimationFrame(rafRef.current);
            el.removeEventListener('pointermove', handlePointerMove);
            el.removeEventListener('pointerleave', handlePointerLeave);
        };
    }, [safeColumns, safeRows, safeMaxDisplacement, safeInfluenceRadius, safeStiffness, safeDamping]);

    const getDisplacement = useCallback(
        (col: number, row: number): SpringGridDisplacement => {
            const idx = row * safeColumns + col;
            const cell = cellsRef.current[idx];
            if (!cell) return { x: 0, y: 0, force: 0 };

            const force = Math.min(1, Math.sqrt(cell.x * cell.x + cell.y * cell.y) / safeMaxDisplacement);
            return { x: cell.x, y: cell.y, force };
        },
        [safeColumns, safeMaxDisplacement]
    );

    return { ref, getDisplacement };
}
