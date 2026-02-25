"use client";

/**
 * @component CommandPalette
 * @description ⌘K command palette with fuzzy-matching search, spring confirm animation,
 * and keyboard navigation.
 * Principle: fuzzy string scoring + AnimatePresence + keyboard nav.
 *
 * @example
 * ```tsx
 * import { CommandPalette } from '@/components/navigation/command-palette';
 *
 * <CommandPalette
 *   commands={[
 *     { id: "home", label: "Go to Home", icon: "🏠", action: () => {} },
 *     { id: "settings", label: "Open Settings", icon: "⚙️", action: () => {} },
 *   ]}
 * />
 * ```
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface Command {
    id: string;
    label: string;
    icon?: string;
    description?: string;
    action: () => void;
}

export interface CommandPaletteProps {
    /** Available commands */
    commands: Command[];
    /** Controlled open state */
    isOpen?: boolean;
    defaultOpen?: boolean;
    /** Callback when open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Placeholder text. Default: "Type a command..." */
    placeholder?: string;
    /** Additional class names */
    className?: string;
}

// Simple fuzzy match scoring
function fuzzyScore(query: string, target: string): number {
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    if (!q) return 1;
    if (t.includes(q)) return 2;
    let qi = 0;
    let score = 0;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
        if (t[ti] === q[qi]) {
            score++;
            qi++;
        }
    }
    return qi === q.length ? score / q.length : 0;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    commands,
    isOpen: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    placeholder = "Type a command...",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [query, setQuery] = useState("");
    const [selectedIdx, setSelectedIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const isOpen = controlledOpen ?? internalOpen;

    const setOpen = useCallback((open: boolean) => {
        setInternalOpen(open);
        onOpenChange?.(open);
        if (open) {
            setQuery("");
            setSelectedIdx(0);
        }
    }, [onOpenChange]);

    // ⌘K / Ctrl+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(!isOpen);
            }
            if (e.key === "Escape" && isOpen) {
                setOpen(false);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, setOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    // Filter and sort commands
    const filtered = useMemo(() => {
        const commandList = Array.isArray(commands) ? commands : [];
        return commandList
            .map((cmd) => ({ cmd, score: fuzzyScore(query, cmd.label) }))
            .filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((x) => x.cmd);
    }, [commands, query]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIdx((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && filtered[selectedIdx]) {
            filtered[selectedIdx].action?.();
            setOpen(false);
        }
    }, [filtered, selectedIdx, setOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Palette */}
                    <motion.div
                        className={`fixed top-[20%] left-1/2 w-full max-w-lg z-50 ${className}`}
                        initial={prefersReducedMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, y: -20, scale: 0.95, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                        exit={prefersReducedMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, y: -20, scale: 0.95, x: "-50%" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        role="dialog"
                        aria-label="Command palette"
                    >
                        <div className="bg-gray-900 rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50">
                                <span className="text-gray-500 text-sm">⌘</span>
                                <input
                                    ref={inputRef}
                                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
                                    placeholder={placeholder}
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
                                    onKeyDown={handleKeyDown}
                                />
                                <kbd className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">ESC</kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-64 overflow-y-auto py-2">
                                {filtered.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                                        No results found
                                    </div>
                                ) : (
                                    filtered.map((cmd, i) => (
                                        <motion.button
                                            key={cmd.id}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm cursor-pointer transition-colors ${i === selectedIdx
                                                ? "bg-violet-500/10 text-white"
                                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                                                }`}
                                            onClick={() => { cmd.action?.(); setOpen(false); }}
                                            onMouseEnter={() => setSelectedIdx(i)}
                                            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: prefersReducedMotion ? 0 : i * 0.02 }}
                                        >
                                            {cmd.icon && <span className="text-lg">{cmd.icon}</span>}
                                            <div className="flex-1">
                                                <div className="font-medium">{cmd.label}</div>
                                                {cmd.description && (
                                                    <div className="text-xs text-gray-500">{cmd.description}</div>
                                                )}
                                            </div>
                                            {i === selectedIdx && (
                                                <kbd className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">↵</kbd>
                                            )}
                                        </motion.button>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
