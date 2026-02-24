import Link from "next/link";
import { CausticLight } from "@aurae/components/backgrounds/caustic-light";

export default function Home() {
    return (
        <main className="flex-1 relative">
            {/* Background Glow Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] hero-glow pointer-events-none z-0"></div>

            {/* React Background Effect - subtle integration */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
                <CausticLight className="w-full h-full" />
            </div>

            {/* Navbar (Top level in Landing for now) */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-light/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <span className="font-bold text-xl leading-none">A</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">Aurae</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-sm font-medium text-text-muted hover:text-white transition-colors" href="/docs">Components</Link>
                        <Link className="text-sm font-medium text-text-muted hover:text-white transition-colors" href="https://github.com/keyshout/Aurae">GitHub</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/docs" className="group flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40">
                            <span>Get Started</span>
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary w-fit">
                            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                            v0.1.0 is now available
                        </div>
                        <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
                            Build faster with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#8e72ff]">animated</span> components
                        </h1>
                        <p className="text-lg text-text-muted max-w-lg leading-relaxed">
                            A collection of production-ready animated React components to build stunning UIs. Copy and paste into your project and customize with Tailwind CSS.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link href="/docs" className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-white font-bold text-base shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-primary/40 transition-all">
                                Browse Components
                            </Link>
                            <a href="https://github.com/keyshout/Aurae" target="_blank" rel="noreferrer" className="h-12 px-8 rounded-lg bg-surface hover:bg-surface-highlight border border-white/10 text-white font-bold text-base transition-all flex items-center justify-center gap-2">
                                GitHub Repo
                            </a>
                        </div>
                        <div className="flex items-center gap-4 pt-6 text-sm text-text-muted">
                            <p>95+ meticulously crafted physics-based UI components</p>
                        </div>
                    </div>

                    <div className="relative lg:h-[500px] w-full hidden sm:block">
                        {/* Decorative elements behind the image */}
                        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/20 blur-[100px]"></div>
                        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]"></div>

                        {/* Hero Image / Preview */}
                        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl glass-card">
                            <div className="absolute inset-0 bg-gradient-to-br from-surface to-background-light opacity-90"></div>
                            <div className="relative h-full w-full flex items-center justify-center p-8">
                                {/* Abstract geometric representation of UI components */}
                                <div className="grid grid-cols-2 gap-4 w-full max-w-sm rotate-[-5deg] hover:rotate-0 transition-transform duration-500 ease-out">
                                    <div className="h-32 w-full rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-md"></div>
                                    <div className="h-32 w-full rounded-xl bg-gradient-to-br from-primary/80 to-primary/40 border border-white/10 backdrop-blur-md shadow-lg shadow-primary/20"></div>
                                    <div className="col-span-2 h-24 w-full rounded-xl bg-surface-highlight border border-white/10 flex items-center px-4 gap-3">
                                        <div className="h-8 w-8 rounded-full bg-white/10"></div>
                                        <div className="h-2 w-32 rounded-full bg-white/10"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute bottom-8 right-8 glass-card px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 shadow-xl">
                                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                                <span className="text-xs font-mono text-white">npm install @keyshout/aurae</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 border-t border-white/5 bg-surface/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Why use this library?</h2>
                        <p className="text-text-muted text-lg">Designed for developers who want to add polish without the pain. Copy, paste, ship.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-surface border border-white/5 hover:bg-surface-highlight/50 transition-colors">
                            <h3 className="text-xl font-bold text-white">Physics-Based</h3>
                            <p className="text-text-muted leading-relaxed">
                                Realistic physical spring interactions utilizing Framer Motion for natural fluid behaviors.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-surface border border-white/5 hover:bg-surface-highlight/50 transition-colors">
                            <h3 className="text-xl font-bold text-white">Customizable</h3>
                            <p className="text-text-muted leading-relaxed">
                                Built with Tailwind CSS. Easily override styles with utility classes to match your brand identity perfectly.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-surface border border-white/5 hover:bg-surface-highlight/50 transition-colors">
                            <h3 className="text-xl font-bold text-white">Accessible</h3>
                            <p className="text-text-muted leading-relaxed">
                                Animations respect reduced motion preferences. Screen-reader safe logic backing up visual flair.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="mx-auto max-w-5xl relative overflow-hidden rounded-3xl bg-primary/10 border border-primary/20 px-6 py-16 text-center sm:px-12 lg:px-16">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-[80px] pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl max-w-2xl">
                            Ready to elevate your React apps?
                        </h2>
                        <p className="mx-auto max-w-xl text-lg text-text-muted">
                            Bring your UI to life with physics-based component layouts without reinventing the wheel.
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-4">
                            <Link href="/docs" className="flex items-center justify-center h-12 px-8 rounded-lg bg-white text-background-dark font-bold text-base shadow-lg hover:bg-gray-100 transition-all gap-2">
                                Get Started Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
