"use client";

import Link from "next/link";
import { Search, Menu, Github } from "lucide-react";
import { siteConfig } from "@/config/site-config";

export function Topbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-light/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Left: Branding & Mobile Menu */}
                <div className="flex items-center gap-2">
                    <button className="md:hidden text-text-muted hover:text-white mr-2">
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <span className="font-bold text-xl leading-none">A</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white hidden sm:block">
                            {siteConfig.name}
                        </span>
                    </Link>
                </div>

                {/* Center: Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text-muted bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                        <Search className="w-4 h-4 opacity-70" />
                        <span className="flex-1 text-left">Search documentation...</span>
                        <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] font-medium opacity-50 px-1.5 py-0.5 rounded bg-black/50 border border-white/10">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <nav className="hidden lg:flex items-center gap-6 mr-2">
                        <Link className="text-sm font-medium text-text-muted hover:text-white transition-colors" href="/docs">Docs</Link>
                        <Link className="text-sm font-medium text-text-muted hover:text-white transition-colors" href={siteConfig.links.github}>GitHub</Link>
                    </nav>

                    <Link
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex h-9 items-center justify-center gap-2 rounded-lg bg-surface px-4 text-sm font-bold text-white transition-all hover:bg-surface-highlight border border-white/10"
                    >
                        <Github className="w-4 h-4" />
                        <span className="hidden sm:inline">Star on GitHub</span>
                    </Link>
                </div>

            </div>
        </header>
    );
}
