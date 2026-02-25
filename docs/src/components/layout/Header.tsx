import Link from "next/link";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 4L29.3 18.7L44 24L29.3 29.3L24 44L18.7 29.3L4 24L18.7 18.7L24 4Z" fill="currentColor" fillOpacity="0.5"></path>
                            <path d="M24 10L27.5 19.5L37 24L27.5 28.5L24 38L20.5 28.5L11 24L20.5 19.5L24 10Z" fill="white"></path>
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Aurae</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/components" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Components
                    </Link>
                    <Link href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Pro
                    </Link>
                    <Link href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Showcase
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors md:hidden">
                        Menu
                    </button>

                    <button className="relative group p-[1px] rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-70 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative bg-background-dark px-5 py-2 rounded-[7px] flex items-center gap-2 group-hover:bg-opacity-90 transition-all">
                            <span className="text-sm font-bold text-white">Get Access</span>
                            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
