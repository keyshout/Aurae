"use client";

/**
 * @component TypewriterBlueprintLoader
 * @description Terminal-style commands type out with a progress indicator,
 * simulating a build/fetch process.
 * Principle: character-based typing animation + progress bar fill.
 *
 * @example
 * ```tsx
 * import { TypewriterBlueprintLoader } from '@/components/loaders/typewriter-blueprint-loader';
 *
 * <TypewriterBlueprintLoader
 *   commands={["> fetching data...", "> compiling assets...", "> optimizing..."]}
 *   className="w-96"
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface TypewriterBlueprintLoaderProps {
    /** Terminal commands to display. Default: ["> loading modules...", "> compiling..."] */
    commands?: string[];
    /** Typing speed in ms per character. Default: 40 */
    typeSpeed?: number;
    /** Pause between commands in ms. Default: 600 */
    pauseBetween?: number;
    /** Text color. Default: "#22d3ee" */
    color?: string;
    /** Additional class names */
    className?: string;
}

export const TypewriterBlueprintLoader: React.FC<TypewriterBlueprintLoaderProps> = ({
    commands = ["> loading modules...", "> compiling assets...", "> optimizing bundle..."],
    typeSpeed = 40,
    pauseBetween = 600,
    color = "#22d3ee",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [lines, setLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState("");
    const [cmdIdx, setCmdIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const progress = commands.length > 0 ? ((cmdIdx + charIdx / (commands[cmdIdx]?.length || 1)) / commands.length) * 100 : 0;

    useEffect(() => {
        if (prefersReducedMotion) {
            setLines(commands);
            setCurrentLine("");
            setCmdIdx(commands.length);
            return;
        }

        if (cmdIdx >= commands.length) return;

        const cmd = commands[cmdIdx];

        if (charIdx < cmd.length) {
            timerRef.current = setTimeout(() => {
                setCurrentLine(cmd.slice(0, charIdx + 1));
                setCharIdx(charIdx + 1);
            }, typeSpeed);
        } else {
            timerRef.current = setTimeout(() => {
                setLines((prev) => [...prev, cmd]);
                setCurrentLine("");
                setCharIdx(0);
                setCmdIdx(cmdIdx + 1);
            }, pauseBetween);
        }

        return () => clearTimeout(timerRef.current);
    }, [cmdIdx, charIdx, commands, typeSpeed, pauseBetween, prefersReducedMotion]);

    return (
        <div
            className={`font-mono text-sm p-4 bg-gray-900/80 rounded-lg border border-gray-700/50 ${className}`}
            role="status"
            aria-label="Loading"
        >
            {/* Terminal output */}
            <div className="space-y-1 mb-3 min-h-[60px]" style={{ color }}>
                {lines.map((line, i) => (
                    <div key={i} className="opacity-50">{line}</div>
                ))}
                {currentLine && (
                    <div>
                        {currentLine}
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            █
                        </motion.span>
                    </div>
                )}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ width: `${Math.min(100, progress)}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </div>

            <div className="text-[10px] mt-1 text-gray-500">
                {Math.floor(progress)}%
            </div>
        </div>
    );
};

export default TypewriterBlueprintLoader;
