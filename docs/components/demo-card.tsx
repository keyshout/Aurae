"use client";

import React, { useState } from "react";

export function DemoCard({
    title,
    category,
    children,
}: {
    title: string;
    category: string;
    children: React.ReactNode;
}) {
    return (
        <div className="group relative rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden transition-all hover:border-white/10 hover:shadow-[0_0_40px_rgba(6,182,212,0.05)]">
            <div className="relative min-h-[200px] flex items-center justify-center p-8 overflow-hidden">
                {children}
            </div>
            <div className="px-5 pb-4 pt-2 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-cyan-500 font-semibold">
                    {category}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{title}</h3>
            </div>
        </div>
    );
}

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute right-3 top-3 text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
            {copied ? "✓ Copied" : "Copy"}
        </button>
    );
}
