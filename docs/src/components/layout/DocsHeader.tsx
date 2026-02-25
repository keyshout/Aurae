import Link from "next/link";

export function DocsHeader() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-gray-200 dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-3">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity">
                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">Aurae</h2>
                </Link>
            </div>
        </header>
    );
}
