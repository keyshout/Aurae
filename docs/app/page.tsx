"use client";

import React, { useState } from "react";
import { DemoCard, CopyButton } from "@/components/demo-card";

// ─── Text Components ────────────────────────────────────────
import { ScrambleText } from "../../components/text/scramble-text";
import { MagneticInkText } from "../../components/text/magnetic-ink-text";
import { NeonFlickerText } from "../../components/text/neon-flicker-text";
import { RefractionText } from "../../components/text/refraction-text";

// ─── Background Components ──────────────────────────────────
import { SilkAurora } from "../../components/backgrounds/silk-aurora";

// ─── Card Components ────────────────────────────────────────
import { MagneticCard } from "../../components/cards/magnetic-card";
import { HologramCard } from "../../components/cards/hologram-card";
import { PressureCard } from "../../components/cards/pressure-card";

// ─── Loader Components ──────────────────────────────────────
import { BlueprintLoader } from "../../components/loaders/blueprint-loader";
import { DNALoader } from "../../components/loaders/dna-loader";
import { FluidFillLoader } from "../../components/loaders/fluid-fill-loader";

// ─── Button Components ──────────────────────────────────────
import { GravitonButton } from "../../components/buttons/graviton-button";
import { TensionStringButton } from "../../components/buttons/tension-string-button";
import { GlitchConfirmButton } from "../../components/buttons/glitch-confirm-button";

// ─── AI/SaaS Components ─────────────────────────────────────
import { ThinkingIndicator } from "../../components/chat/thinking-indicator";
import { StreamText } from "../../components/chat/stream-text";
import { CommandPalette } from "../../components/navigation/command-palette";

const INSTALL_CMD = "npm install @keyshout/aurae framer-motion";

export default function Home() {
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  return (
    <main className="relative min-h-screen">
      {/* ─── Background ─── */}
      <div className="fixed inset-0 z-0">
        <SilkAurora
          intensity={0.3}
          speed={0.6}
          className="w-full h-full opacity-40"
        />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10">
        {/* ═══════ HERO ═══════ */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-cyan-400 font-mono">
              v0.1.0 — 95 components
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-2">
            <ScrambleText
              text="Aurae"
              scrambleChars="▓░▒█│┤╡╢"
              className="text-white"
            />
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-xl mt-4 mb-10 leading-relaxed">
            95 original React components. Physics-based animations.
            <br />
            <span className="text-white font-medium">MIT licensed. Free forever.</span>
          </p>

          {/* Install command */}
          <div className="relative w-full max-w-md">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 font-mono text-sm">
              <span className="text-cyan-400">$</span>
              <span className="text-gray-300 flex-1 text-left">{INSTALL_CMD}</span>
              <CopyButton text={INSTALL_CMD} />
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4 mt-8">
            <a
              href="https://github.com/keyshout/Aurae"
              target="_blank"
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              ★ GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@keyshout/aurae"
              target="_blank"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-sm font-medium text-white hover:from-cyan-500 hover:to-teal-500 transition-colors"
            >
              npm →
            </a>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 text-gray-600 text-xs font-mono animate-pulse">
            ↓ scroll to explore
          </div>
        </section>

        {/* ═══════ TEXT ANIMATIONS ═══════ */}
        <Section title="Text Animations" count={18}>
          <DemoCard title="ScrambleText" category="Text">
            <ScrambleText
              text="Hover to scramble"
              scrambleChars="!@#$%^&*"
              className="text-2xl font-bold text-white"
            />
          </DemoCard>

          <DemoCard title="MagneticInkText" category="Text">
            <MagneticInkText
              text="Move your pointer"
              className="text-2xl font-bold text-white"
            />
          </DemoCard>

          <DemoCard title="NeonFlickerText" category="Text">
            <NeonFlickerText
              text="Neon Vibes"
              color="#06b6d4"
              className="text-3xl font-black"
            />
          </DemoCard>

          <DemoCard title="RefractionText" category="Text">
            <RefractionText
              text="Prismatic"
              className="text-3xl font-black text-white"
            />
          </DemoCard>
        </Section>

        {/* ═══════ CARDS ═══════ */}
        <Section title="Card Components" count={17}>
          <DemoCard title="MagneticCard" category="Card">
            <MagneticCard
              tiltStrength={12}
              glowColor="#06b6d4"
              className="w-full p-6"
            >
              <h3 className="text-lg font-bold text-white">Hover me</h3>
              <p className="text-sm text-gray-400 mt-1">
                3D tilt + pointer glow
              </p>
            </MagneticCard>
          </DemoCard>

          <DemoCard title="HologramCard" category="Card">
            <HologramCard className="w-full p-6">
              <h3 className="text-lg font-bold text-white">Hologram</h3>
              <p className="text-sm text-gray-400 mt-1">
                Scan lines + chromatic shift
              </p>
            </HologramCard>
          </DemoCard>

          <DemoCard title="PressureCard" category="Card">
            <PressureCard className="w-full p-6">
              <h3 className="text-lg font-bold text-white">Press me</h3>
              <p className="text-sm text-gray-400 mt-1">
                Depth displacement on press
              </p>
            </PressureCard>
          </DemoCard>
        </Section>

        {/* ═══════ LOADERS ═══════ */}
        <Section title="Loaders & Skeletons" count={11}>
          <DemoCard title="BlueprintLoader" category="Loader">
            <BlueprintLoader className="w-full h-[120px]" />
          </DemoCard>

          <DemoCard title="DNALoader" category="Loader">
            <DNALoader className="w-full h-[120px]" />
          </DemoCard>

          <DemoCard title="FluidFillLoader" category="Loader">
            <FluidFillLoader progress={65} className="w-32" />
          </DemoCard>
        </Section>

        {/* ═══════ BUTTONS ═══════ */}
        <Section title="Buttons" count={9}>
          <DemoCard title="GravitonButton" category="Button">
            <GravitonButton color="#8b5cf6" particleCount={15}>
              Launch
            </GravitonButton>
          </DemoCard>

          <DemoCard title="TensionStringButton" category="Button">
            <TensionStringButton color="#06b6d4">
              Pull me
            </TensionStringButton>
          </DemoCard>

          <DemoCard title="GlitchConfirmButton" category="Button">
            <GlitchConfirmButton>
              Confirm
            </GlitchConfirmButton>
          </DemoCard>
        </Section>

        {/* ═══════ AI/SaaS BLOCKS ═══════ */}
        <Section title="AI / SaaS Blocks" count={20}>
          <DemoCard title="ThinkingIndicator" category="Chat UI">
            <ThinkingIndicator color="#8b5cf6" />
          </DemoCard>

          <DemoCard title="StreamText" category="Chat UI">
            <StreamText
              text="Aurae makes your interfaces feel alive with physics-based motion."
              speed={80}
              className="text-sm text-gray-300 max-w-[250px]"
            />
          </DemoCard>

          <DemoCard title="CommandPalette" category="Navigation">
            <div className="text-center">
              <button
                onClick={() => setCmdPaletteOpen(true)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors cursor-pointer font-mono"
              >
                ⌘K to open
              </button>
              <CommandPalette
                isOpen={cmdPaletteOpen}
                onOpenChange={setCmdPaletteOpen}
                commands={[
                  { id: "home", label: "Go to Home", icon: "🏠", action: () => setCmdPaletteOpen(false) },
                  { id: "github", label: "Open GitHub", icon: "📦", action: () => window.open("https://github.com/keyshout/Aurae") },
                  { id: "npm", label: "View on npm", icon: "📋", action: () => window.open("https://npmjs.com/package/@keyshout/aurae") },
                  { id: "docs", label: "Read Docs", icon: "📖", action: () => setCmdPaletteOpen(false) },
                ]}
              />
            </div>
          </DemoCard>
        </Section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="py-20 px-6 text-center border-t border-white/5">
          <p className="text-gray-500 text-sm mb-4">
            MIT Licensed. Free forever. Built with ❤️ for the React community.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a
              href="https://github.com/keyshout/Aurae"
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/@keyshout/aurae"
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
            >
              npm
            </a>
          </div>
          <p className="text-gray-700 text-xs mt-6 font-mono">
            @keyshout/aurae v0.1.0 — 95 components
          </p>
        </footer>
      </div>
    </main>
  );
}

/* ─── Section wrapper ─── */
function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <div className="flex items-baseline gap-3 mb-10">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-xs font-mono text-gray-600">({count})</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {children}
      </div>
    </section>
  );
}
