/**
 * @hook useMorphText
 * @description Manages character-level morph animation between two text strings.
 * Each character transitions independently with configurable timing.
 *
 * @example
 * ```tsx
 * import { useMorphText } from '@/hooks/useMorphText';
 *
 * function MorphingTitle() {
 *   const { characters, start, isComplete } = useMorphText({
 *     from: 'Loading...',
 *     to: 'Complete!',
 *     staggerMs: 40,
 *   });
 *   return (
 *     <div onClick={start}>
 *       {characters.map((char, i) => (
 *         <span key={i} style={{ opacity: char.progress }}>
 *           {char.current}
 *         </span>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { toPositiveInt, toPositiveNumber } from '../lib/utils';

export interface MorphCharacter {
    /** The current displayed character */
    current: string;
    /** The target character */
    target: string;
    /** The source character */
    source: string;
    /** Animation progress for this character (0 to 1) */
    progress: number;
    /** Whether this character has completed morphing */
    isComplete: boolean;
}

export interface MorphTextResult {
    /** Array of character states */
    characters: MorphCharacter[];
    /** Start the morph animation */
    start: () => void;
    /** Reset to the source text */
    reset: () => void;
    /** Whether the entire morph is complete */
    isComplete: boolean;
    /** Overall progress (0 to 1) */
    progress: number;
}

export interface UseMorphTextOptions {
    /** Source text */
    from: string;
    /** Target text */
    to: string;
    /** Delay between each character starting to morph in ms. Default: 30 */
    staggerMs?: number;
    /** Duration of each character's morph in ms. Default: 200 */
    charDuration?: number;
    /** Character set to cycle through during morph. Default: alphanumeric glyphs */
    glyphSet?: string;
    /** Number of intermediate glyph frames per character. Default: 4 */
    glyphFrames?: number;
    /** Whether to auto-start. Default: false */
    autoStart?: boolean;
}

const DEFAULT_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

export function useMorphText(options: UseMorphTextOptions): MorphTextResult {
    const {
        from,
        to,
        staggerMs = 30,
        charDuration = 200,
        glyphSet = DEFAULT_GLYPHS,
        glyphFrames = 4,
        autoStart = false,
    } = options;

    const safeStaggerMs = Math.max(0, staggerMs);
    const safeCharDuration = toPositiveNumber(charDuration, 200, 1);
    const safeGlyphFrames = toPositiveInt(glyphFrames, 4, 1);
    const safeGlyphSet = glyphSet.length > 0 ? glyphSet : DEFAULT_GLYPHS;

    const maxLen = Math.max(from.length, to.length);
    const paddedFrom = from.padEnd(maxLen);
    const paddedTo = to.padEnd(maxLen);

    const [characters, setCharacters] = useState<MorphCharacter[]>(() =>
        Array.from({ length: maxLen }, (_, i) => ({
            current: paddedFrom[i],
            target: paddedTo[i],
            source: paddedFrom[i],
            progress: 0,
            isComplete: false,
        }))
    );

    const [isComplete, setIsComplete] = useState(false);
    const [progress, setProgress] = useState(0);
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef(0);
    const isRunningRef = useRef(false);

    const animate = useCallback(() => {
        const now = performance.now();
        const elapsed = now - startTimeRef.current;
        let allComplete = true;
        let totalProgress = 0;

        const newChars: MorphCharacter[] = Array.from({ length: maxLen }, (_, i) => {
            const charStart = i * safeStaggerMs;
            const charElapsed = elapsed - charStart;

            if (charElapsed < 0) {
                allComplete = false;
                return {
                    current: paddedFrom[i],
                    target: paddedTo[i],
                    source: paddedFrom[i],
                    progress: 0,
                    isComplete: false,
                };
            }

            const charProgress = Math.min(1, charElapsed / safeCharDuration);
            totalProgress += charProgress;

            if (charProgress >= 1) {
                return {
                    current: paddedTo[i],
                    target: paddedTo[i],
                    source: paddedFrom[i],
                    progress: 1,
                    isComplete: true,
                };
            }

            allComplete = false;

            // Determine current glyph based on progress
            const glyphPhase = charProgress * safeGlyphFrames;
            const isInGlyphPhase = charProgress < 0.7;

            let currentChar: string;
            if (isInGlyphPhase) {
                const glyphIdx = Math.floor(glyphPhase) % safeGlyphSet.length;
                currentChar = safeGlyphSet[glyphIdx];
            } else {
                currentChar = paddedTo[i];
            }

            return {
                current: currentChar,
                target: paddedTo[i],
                source: paddedFrom[i],
                progress: charProgress,
                isComplete: false,
            };
        });

        setCharacters(newChars);
        setProgress(maxLen > 0 ? totalProgress / maxLen : 1);

        if (allComplete) {
            setIsComplete(true);
            isRunningRef.current = false;
        } else {
            rafRef.current = requestAnimationFrame(animate);
        }
    }, [maxLen, paddedFrom, paddedTo, safeStaggerMs, safeCharDuration, safeGlyphSet, safeGlyphFrames]);

    const start = useCallback(() => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;
        setIsComplete(false);
        setProgress(0);
        startTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(animate);
    }, [animate]);

    const reset = useCallback(() => {
        isRunningRef.current = false;
        cancelAnimationFrame(rafRef.current);
        setIsComplete(false);
        setProgress(0);
        setCharacters(
            Array.from({ length: maxLen }, (_, i) => ({
                current: paddedFrom[i],
                target: paddedTo[i],
                source: paddedFrom[i],
                progress: 0,
                isComplete: false,
            }))
        );
    }, [maxLen, paddedFrom, paddedTo]);

    useEffect(() => {
        if (autoStart) start();
        return () => cancelAnimationFrame(rafRef.current);
    }, [autoStart, start]);

    return { characters, start, reset, isComplete, progress };
}
