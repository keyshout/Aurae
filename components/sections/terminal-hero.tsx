"use client";

/**
 * @component TerminalHero
 * @description Hero with terminal that types out value propositions as commands,
 * each line compiles with syntax highlighting and fake output.
 * Principle: typewriter + syntax highlight + progressive output.
 *
 * @example
 * ```tsx
 * import { TerminalHero } from '@/components/sections/terminal-hero';
 *
 * <TerminalHero
 *   title="Ship faster."
 *   commands={[
 *     { input: "npm install @keyshout/aurae", output: "✓ 75 components installed" },
 *     { input: "import { MagneticCard } from 'aurae'", output: "✓ Tree-shaken: 4.2kB" },
 *   ]}
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TerminalCommand {
    /** Command input text */
    input: string;
    /** Command output text */
    output: string;
}

export interface TerminalHeroProps {
    /** Headline text */
    title: string;
    /** Subtitle */
    subtitle?: string;
    /** Terminal commands sequence */
    commands?: TerminalCommand[];
    /** Typing speed in ms. Default: 35 */
    typeSpeed?: number;
    /** Prompt color. Default: "#22d3ee" */
    promptColor?: string;
    /** Additional class names */
    className?: string;
}

export const TerminalHero: React.FC<TerminalHeroProps> = ({
    title,
    subtitle,
    commands = [
        { input: "npm install @keyshout/aurae", output: "✓ 75 components ready" },
        { input: "import { MagneticCard } from 'aurae'", output: "✓ tree-shaken: 4.2kB" },
        { input: "npm run build", output: "✓ compiled in 0.8s" },
    ],
    typeSpeed = 35,
    promptColor = "#22d3ee",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();

    interface Line { type: "input" | "output"; text: string; }
    const [lines, setLines] = useState<Line[]>([]);
    const [currentText, setCurrentText] = useState("");
    const [cmdIndex, setCmdIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [phase, setPhase] = useState<"typing" | "output" | "done">("typing");
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (prefersReducedMotion) {
            const allLines: Line[] = [];
            commands.forEach((cmd) => {
                allLines.push({ type: "input", text: cmd.input });
                allLines.push({ type: "output", text: cmd.output });
            });
            setLines(allLines);
            setPhase("done");
            return;
        }

        if (cmdIndex >= commands.length) {
            setPhase("done");
            return;
        }

        const cmd = commands[cmdIndex];

        if (phase === "typing") {
            if (charIndex < cmd.input.length) {
                timerRef.current = setTimeout(() => {
                    setCurrentText(cmd.input.slice(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                }, typeSpeed);
            } else {
                timerRef.current = setTimeout(() => {
                    setLines((prev) => [...prev, { type: "input", text: cmd.input }]);
                    setCurrentText("");
                    setPhase("output");
                }, 300);
            }
        } else if (phase === "output") {
            timerRef.current = setTimeout(() => {
                setLines((prev) => [...prev, { type: "output", text: cmd.output }]);
                setCharIndex(0);
                setCmdIndex(cmdIndex + 1);
                setPhase("typing");
            }, 400);
        }

        return () => clearTimeout(timerRef.current);
    }, [cmdIndex, charIndex, phase, commands, typeSpeed, prefersReducedMotion]);

    return (
        <section className={`relative min-h-[70vh] flex items-center justify-center ${className}`}>
            <div className="w-full max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Text */}
                <div>
                    <motion.h1
                        className="text-5xl md:text-6xl font-black text-white mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {title}
                    </motion.h1>
                    {subtitle && (
                        <motion.p
                            className="text-lg text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>

                {/* Right: Terminal */}
                <motion.div
                    className="bg-gray-900/90 rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700/50">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-[11px] text-gray-500 font-mono">terminal</span>
                    </div>

                    {/* Terminal body */}
                    <div className="p-4 font-mono text-sm space-y-1 min-h-[180px]">
                        {lines.map((line, i) => (
                            <div key={i} className={line.type === "output" ? "text-green-400/70 pl-2" : ""}>
                                {line.type === "input" && (
                                    <span style={{ color: promptColor }}>❯ </span>
                                )}
                                <span className={line.type === "input" ? "text-gray-300" : ""}>
                                    {line.text}
                                </span>
                            </div>
                        ))}
                        {phase === "typing" && cmdIndex < commands.length && (
                            <div>
                                <span style={{ color: promptColor }}>❯ </span>
                                <span className="text-gray-300">{currentText}</span>
                                <motion.span
                                    className="text-gray-300"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                    █
                                </motion.span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TerminalHero;
