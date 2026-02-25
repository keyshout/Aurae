"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";

export function ComponentPreview({
    children,
    code
}: {
    children: React.ReactNode,
    code: string
}) {
    const [key, setKey] = useState(0);

    return (
        <div className="mb-12">
            <div className="relative w-full rounded-xl border border-gray-200 dark:border-border-dark bg-white dark:bg-surface-dark shadow-lg overflow-hidden flex flex-col group min-h-[400px]">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-border-dark/50 bg-gray-50/50 dark:bg-background-dark/30">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-red-400/80"></div>
                        <div className="size-3 rounded-full bg-yellow-400/80"></div>
                        <div className="size-3 rounded-full bg-green-400/80"></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setKey(k => k + 1)}
                            className="text-xs font-medium text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Replay
                        </button>
                    </div>
                </div>
                {/* Actual Preview Content */}
                <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-white dark:from-surface-dark dark:via-background-dark dark:to-black overflow-hidden relative">
                    <div key={key} className="w-full h-full flex items-center justify-center">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
