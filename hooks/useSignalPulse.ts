/**
 * @hook useSignalPulse
 * @description Emits periodic signal pulses at configurable intervals.
 * Useful for creating pulsing, scanning, or relay-style animations.
 *
 * @example
 * ```tsx
 * import { useSignalPulse } from '@/hooks/useSignalPulse';
 *
 * function PulsingElement() {
 *   const { pulse, progress, isPulsing, trigger } = useSignalPulse({
 *     interval: 2000,
 *     duration: 600,
 *   });
 *   return (
 *     <div style={{ opacity: isPulsing ? 1 - progress : 0.3 }}>
 *       Pulse #{pulse}
 *       <button onClick={trigger}>Manual Trigger</button>
 *     </div>
 *   );
 * }
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { toFiniteNumber, toPositiveNumber } from '../lib/utils';

export interface SignalPulseResult {
    /** Current pulse count (increments each cycle) */
    pulse: number;
    /** Progress within current pulse (0 to 1) */
    progress: number;
    /** Whether a pulse is currently active */
    isPulsing: boolean;
    /** Manually trigger a pulse */
    trigger: () => void;
    /** Reset pulse count to 0 */
    reset: () => void;
}

export interface UseSignalPulseOptions {
    /** Interval between pulses in ms. Default: 2000 */
    interval?: number;
    /** Duration of each pulse in ms. Default: 500 */
    duration?: number;
    /** Whether to auto-start pulsing. Default: true */
    autoStart?: boolean;
    /** Maximum number of pulses (0 = infinite). Default: 0 */
    maxPulses?: number;
    /** Easing function for progress. Default: linear */
    easing?: (t: number) => number;
}

export function useSignalPulse(options: UseSignalPulseOptions = {}): SignalPulseResult {
    const {
        interval = 2000,
        duration = 500,
        autoStart = true,
        maxPulses = 0,
        easing = (t: number) => t,
    } = options;

    const safeInterval = toPositiveNumber(interval, 2000, 16);
    const safeDuration = toPositiveNumber(duration, 500, 1);
    const safeMaxPulses = Math.max(0, Math.floor(toFiniteNumber(maxPulses, 0)));

    const [pulse, setPulse] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPulsing, setIsPulsing] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval>>();
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef(0);
    const pulseCountRef = useRef(0);

    const animatePulse = useCallback(() => {
        const elapsed = performance.now() - startTimeRef.current;
        const rawProgress = Math.min(1, elapsed / safeDuration);
        const easedProgress = easing(rawProgress);

        setProgress(easedProgress);

        if (rawProgress < 1) {
            rafRef.current = requestAnimationFrame(animatePulse);
        } else {
            setIsPulsing(false);
            setProgress(1);
        }
    }, [safeDuration, easing]);

    const trigger = useCallback(() => {
        if (safeMaxPulses > 0 && pulseCountRef.current >= safeMaxPulses) return;

        pulseCountRef.current += 1;
        setPulse(pulseCountRef.current);
        setIsPulsing(true);
        startTimeRef.current = performance.now();
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(animatePulse);
    }, [animatePulse, safeMaxPulses]);

    const reset = useCallback(() => {
        pulseCountRef.current = 0;
        setPulse(0);
        setProgress(0);
        setIsPulsing(false);
        cancelAnimationFrame(rafRef.current);
    }, []);

    useEffect(() => {
        if (!autoStart) return;

        // Fire initial pulse
        trigger();

        intervalRef.current = setInterval(trigger, safeInterval);

        return () => {
            clearInterval(intervalRef.current);
            cancelAnimationFrame(rafRef.current);
        };
    }, [autoStart, safeInterval, trigger]);

    return { pulse, progress, isPulsing, trigger, reset };
}
