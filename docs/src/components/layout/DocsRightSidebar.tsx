import Link from "next/link";

export function DocsRightSidebar() {
    return (
        <aside className="hidden xl:block w-64 pr-8 pt-12">
            <div className="sticky top-24">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pl-3 border-l-2 border-transparent">
                    On This Page
                </h4>
                <nav className="flex flex-col space-y-1">
                    <Link href="#" className="text-sm text-primary font-medium pl-3 border-l-2 border-primary py-1 transition-colors">
                        Overview
                    </Link>
                    <Link href="#installation" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white pl-3 border-l-2 border-transparent py-1 transition-colors">
                        Installation
                    </Link>
                    <Link href="#usage" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white pl-3 border-l-2 border-transparent py-1 transition-colors">
                        Usage
                    </Link>
                    <Link href="#props" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white pl-3 border-l-2 border-transparent py-1 transition-colors">
                        Props
                    </Link>
                    <Link href="#examples" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white pl-3 border-l-2 border-transparent py-1 transition-colors">
                        Examples
                    </Link>
                </nav>

                {/* Ad / Community Block */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20">
                    <p className="text-xs font-semibold text-primary mb-2">Have questions?</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Join our community of developers on Discord.</p>
                    <button className="w-full py-1.5 px-3 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                        Join Discord
                    </button>
                </div>
            </div>
        </aside>
    );
}
