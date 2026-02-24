"use client";

import React, { useState } from "react";
import { DemoCard, CopyButton } from "@/components/demo-card";

// ═══════════════════════════════════════════════════════════
// TEXT ANIMATIONS (18)
// ═══════════════════════════════════════════════════════════
import { ScrambleText } from "../../components/text/scramble-text";
import { SonarPingText } from "../../components/text/sonar-ping-text";
import { MagneticInkText } from "../../components/text/magnetic-ink-text";
import { GlitchWeaveText } from "../../components/text/glitch-weave-text";
import { SemanticDriftText } from "../../components/text/semantic-drift-text";
import { ShatterText } from "../../components/text/shatter-text";
import { ConstellationLetters } from "../../components/text/constellation-letters";
import { NeonFlickerText } from "../../components/text/neon-flicker-text";
import { EchoTrailHeadline } from "../../components/text/echo-trail-headline";
import { RefractionText } from "../../components/text/refraction-text";
import { VaporTrailText } from "../../components/text/vapor-trail-text";
import { LiquidMercuryText } from "../../components/text/liquid-mercury-text";
import { PressureWaveText } from "../../components/text/pressure-wave-text";
import { ThermalScanText } from "../../components/text/thermal-scan-text";
import { FaultLineText } from "../../components/text/fault-line-text";
import { DepthOfFieldText } from "../../components/text/depth-of-field-text";
import { SignalNoiseText } from "../../components/text/signal-noise-text";
import { OrigamiUnfoldText } from "../../components/text/origami-unfold-text";

// ═══════════════════════════════════════════════════════════
// BACKGROUNDS (15)
// ═══════════════════════════════════════════════════════════
import { SilkAurora } from "../../components/backgrounds/silk-aurora";
import { TopographicalPulse } from "../../components/backgrounds/topographical-pulse";
import { CircuitFog } from "../../components/backgrounds/circuit-fog";
import { QuantumFoam } from "../../components/backgrounds/quantum-foam";
import { BioluminescentWeb } from "../../components/backgrounds/bioluminescent-web";
import { LiquidGridMemory } from "../../components/backgrounds/liquid-grid-memory";
import { StarWarp } from "../../components/backgrounds/star-warp";
import { DataSand } from "../../components/backgrounds/data-sand";
import { ErosionField } from "../../components/backgrounds/erosion-field";
import { MagneticFieldLines } from "../../components/backgrounds/magnetic-field-lines";
import { CausticLight } from "../../components/backgrounds/caustic-light";
import { MyceliumNetwork } from "../../components/backgrounds/mycelium-network";
import { GravityLens } from "../../components/backgrounds/gravity-lens";
import { FrostCrystal } from "../../components/backgrounds/frost-crystal";
import { NavierStokesFluid } from "../../components/backgrounds/navier-stokes-fluid";

// ═══════════════════════════════════════════════════════════
// CARDS (17)
// ═══════════════════════════════════════════════════════════
import { MagneticCard } from "../../components/cards/magnetic-card";
import { XRayCard } from "../../components/cards/x-ray-card";
import { PressureCard } from "../../components/cards/pressure-card";
import { LiquidBorderCard } from "../../components/cards/liquid-border-card";
import { HologramCard } from "../../components/cards/hologram-card";
import { OrbitMetadataCard } from "../../components/cards/orbit-metadata-card";
import { DepthSliceCard } from "../../components/cards/depth-slice-card";
import { LensFocusCard } from "../../components/cards/lens-focus-card";
import { SignalStrengthCard } from "../../components/cards/signal-strength-card";
import { SeismicCard } from "../../components/cards/seismic-card";
import { PeelCard } from "../../components/cards/peel-card";
import { ThermalMapCard } from "../../components/cards/thermal-map-card";
import { BlueprintExpandCard } from "../../components/cards/blueprint-expand-card";
import { DiffractionCard } from "../../components/cards/diffraction-card";
import { MemoryFoamCard } from "../../components/cards/memory-foam-card";
import { RadarScanCard } from "../../components/cards/radar-scan-card";
import { TornEdgeCard } from "../../components/cards/torn-edge-card";

// ═══════════════════════════════════════════════════════════
// LOADERS (11)
// ═══════════════════════════════════════════════════════════
import { BlueprintLoader } from "../../components/loaders/blueprint-loader";
import { DNALoader } from "../../components/loaders/dna-loader";
import { ThreadWeaveLoader } from "../../components/loaders/thread-weave-loader";
import { SignalAcquisitionLoader } from "../../components/loaders/signal-acquisition-loader";
import { ClayMorphSkeleton } from "../../components/loaders/clay-morph-skeleton";
import { GhostLayoutLoader } from "../../components/loaders/ghost-layout-loader";
import { PulseRelayLoader } from "../../components/loaders/pulse-relay-loader";
import { SonarSkeleton } from "../../components/loaders/sonar-skeleton";
import { TypewriterBlueprintLoader } from "../../components/loaders/typewriter-blueprint-loader";
import { FluidFillLoader } from "../../components/loaders/fluid-fill-loader";
import { ParticleCoalesceLoader } from "../../components/loaders/particle-coalesce-loader";

// ═══════════════════════════════════════════════════════════
// BUTTONS (9)
// ═══════════════════════════════════════════════════════════
import { GravitonButton } from "../../components/buttons/graviton-button";
import { TensionStringButton } from "../../components/buttons/tension-string-button";
import { SplitIntentButton } from "../../components/buttons/split-intent-button";
import { PressureInkButton } from "../../components/buttons/pressure-ink-button";
import { ElasticBorderButton } from "../../components/buttons/elastic-border-button";
import { MorphLabelButton } from "../../components/buttons/morph-label-button";
import { MagneticSnapButton } from "../../components/buttons/magnetic-snap-button";
import { LiquidFillButton } from "../../components/buttons/liquid-fill-button";
import { GlitchConfirmButton } from "../../components/buttons/glitch-confirm-button";

// ═══════════════════════════════════════════════════════════
// DECORATIVE (5)
// ═══════════════════════════════════════════════════════════
import { LivingDivider } from "../../components/decorative/living-divider";
import { ThreadConnector } from "../../components/decorative/thread-connector";
import { PrismaticUnderline } from "../../components/decorative/prismatic-underline";
import { PhaseChip } from "../../components/decorative/phase-chip";
import { BreathingGlowHalo } from "../../components/decorative/breathing-glow-halo";

// ═══════════════════════════════════════════════════════════
// CHAT UI (4)
// ═══════════════════════════════════════════════════════════
import { ThinkingIndicator } from "../../components/chat/thinking-indicator";
import { StreamText } from "../../components/chat/stream-text";
import { MessageBubble } from "../../components/chat/message-bubble";
import { ReactionPicker } from "../../components/chat/reaction-picker";

// ═══════════════════════════════════════════════════════════
// NAVIGATION (3)
// ═══════════════════════════════════════════════════════════
import { MagneticNav } from "../../components/navigation/magnetic-nav";
import { BreadcrumbMorph } from "../../components/navigation/breadcrumb-morph";
import { CommandPalette } from "../../components/navigation/command-palette";

// ═══════════════════════════════════════════════════════════
// SECTIONS (13)
// ═══════════════════════════════════════════════════════════
import { TerminalHero } from "../../components/sections/terminal-hero";
import { ThinkingIndicator as TI2 } from "../../components/chat/thinking-indicator";
import { StatCounter } from "../../components/sections/stat-counter";
import { Timeline } from "../../components/sections/timeline";
import { LogoCarousel } from "../../components/sections/logo-carousel";
import { FeatureSpotlight } from "../../components/sections/feature-spotlight";
import { ComparisonMatrix } from "../../components/sections/comparison-matrix";
import { BentoGrid } from "../../components/sections/bento-grid";

const INSTALL = "npm install @keyshout/aurae framer-motion";

/* ─── Placeholder content for cards ─── */
const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

export default function Home() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "hero", label: "Top" },
    { id: "text", label: "Text Animations" },
    { id: "backgrounds", label: "Backgrounds" },
    { id: "cards", label: "Card Components" },
    { id: "loaders", label: "Loaders & Skeletons" },
    { id: "buttons", label: "Buttons" },
    { id: "decorative", label: "Decorative" },
    { id: "chat", label: "Chat UI" },
    { id: "nav", label: "Navigation" },
    { id: "blocks", label: "AI / SaaS Blocks" },
  ];

  return (
    <div className="flex min-h-screen bg-[#000000]">
      {/* ═══════════════════ SIDEBAR (Desktop) ═══════════════════ */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-[#050505] border-r border-white/10 hidden lg:flex flex-col z-50">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <span className="font-black text-xl text-white tracking-widest"><ScrambleText text="Aurae" charset="▓░▒█│┤" /></span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-mono">v0.1.0</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-3">Components</div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setCmdOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 transition-colors"
          >
            <span>Search</span>
            <span className="font-mono text-[10px] bg-black px-1.5 py-0.5 rounded border border-white/10">⌘K</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════ MOBILE HEADER ═══════════════════ */}
      <div className="lg:hidden fixed top-0 w-full bg-[#050505]/90 backdrop-blur-lg border-b border-white/10 z-50 px-4 py-3 flex justify-between items-center">
        <span className="font-black text-lg text-white"><ScrambleText text="Aurae" charset="─│┌┐└┘" /></span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[53px] bg-[#050505] z-40 overflow-y-auto p-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-base text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* ═══════════════════ MAIN CONTENT ═══════════════════ */}
      <main className="flex-1 lg:pl-64 w-full">
        <CommandPalette
          isOpen={cmdOpen}
          onOpenChange={setCmdOpen}
          commands={[
            { id: "github", label: "Open GitHub", icon: "📦", action: () => window.open("https://github.com/keyshout/Aurae") },
            { id: "npm", label: "View on npm", icon: "📋", action: () => window.open("https://npmjs.com/package/@keyshout/aurae") },
          ]}
        />

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section id="hero" className="relative min-h-[90svh] lg:min-h-[100svh] flex flex-col items-center justify-center px-4 pt-20 lg:pt-0 text-center overflow-hidden">
          {/* BG */}
          <div className="absolute inset-0 z-0 opacity-40">
            <SilkAurora opacity={0.3} speed={0.5} className="w-full h-full" />
          </div>

          <div className="relative z-10 w-full max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs text-cyan-400 font-mono mb-6">
              v0.1.0 — 95 components
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight">
              <ScrambleText text="Aurae" charset="▓░▒█│┤" className="text-white" />
            </h1>

            <p className="text-sm sm:text-lg text-gray-400 mt-4 mb-8 leading-relaxed max-w-md mx-auto">
              95 original React components. Physics-based.
              <br />
              <span className="text-white font-medium">MIT licensed. Free forever.</span>
            </p>

            {/* Install */}
            <div className="relative w-full max-w-md mx-auto">
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs sm:text-sm">
                <span className="text-cyan-400">$</span>
                <span className="text-gray-300 flex-1 text-left truncate">{INSTALL}</span>
                <CopyButton text={INSTALL} />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <a href="https://github.com/keyshout/Aurae" target="_blank" className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-white hover:bg-white/10 transition-colors">
                ★ GitHub
              </a>
              <a href="https://www.npmjs.com/package/@keyshout/aurae" target="_blank" className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-xs sm:text-sm font-medium text-white hover:from-cyan-500 hover:to-teal-500 transition-colors">
                npm →
              </a>
            </div>
          </div>

          <div className="absolute bottom-8 text-gray-600 text-[10px] font-mono animate-pulse">↓ scroll to explore</div>
        </section>

        {/* ═══════════════════ TEXT (18) ═══════════════════ */}
        <Section title="Text Animations" count={18} id="text">
          <DemoCard title="ScrambleText" category="Text">
            <ScrambleText text="Hover me" charset="!@#$%^" triggerOn="hover" className="text-xl sm:text-2xl font-bold text-white" />
          </DemoCard>
          <DemoCard title="SonarPingText" category="Text">
            <SonarPingText text="Ping Pulse" className="text-xl sm:text-2xl font-bold text-white" />
          </DemoCard>
          <DemoCard title="MagneticInkText" category="Text">
            <MagneticInkText text="Move pointer" className="text-xl sm:text-2xl font-bold text-white" />
          </DemoCard>
          <DemoCard title="GlitchWeaveText" category="Text">
            <GlitchWeaveText text="Glitch" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
          <DemoCard title="SemanticDriftText" category="Text">
            <SemanticDriftText text="Drifting words here" className="text-xl font-bold text-white" />
          </DemoCard>
          <DemoCard title="ShatterText" category="Text">
            <ShatterText text="Click me" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
          <DemoCard title="ConstellationLetters" category="Text">
            <ConstellationLetters text="Stars" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
          <DemoCard title="NeonFlickerText" category="Text">
            <NeonFlickerText text="Neon" color="#06b6d4" className="text-2xl sm:text-3xl font-black" />
          </DemoCard>
          <DemoCard title="EchoTrailHeadline" category="Text">
            <EchoTrailHeadline text="Echo" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
          <DemoCard title="RefractionText" category="Text">
            <RefractionText text="Prism" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
          <DemoCard title="VaporTrailText" category="Text">
            <VaporTrailText text="Vapor" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
          <DemoCard title="LiquidMercuryText" category="Text">
            <LiquidMercuryText text="Mercury" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
          <DemoCard title="PressureWaveText" category="Text">
            <PressureWaveText text="Click me" className="text-xl sm:text-2xl font-bold text-white" />
          </DemoCard>
          <DemoCard title="ThermalScanText" category="Text">
            <ThermalScanText text="Thermal" className="text-2xl font-black text-white" />
          </DemoCard>
          <DemoCard title="FaultLineText" category="Text">
            <FaultLineText text="Fault" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
          <DemoCard title="DepthOfFieldText" category="Text">
            <DepthOfFieldText text="Focus here" className="text-xl sm:text-2xl font-bold text-white" />
          </DemoCard>
          <DemoCard title="SignalNoiseText" category="Text">
            <SignalNoiseText text="Signal" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
          <DemoCard title="OrigamiUnfoldText" category="Text">
            <OrigamiUnfoldText text="Unfold" className="text-2xl sm:text-3xl font-black text-white" />
          </DemoCard>
        </Section>

        {/* ═══════════════════ BACKGROUNDS (15) ═══════════════════ */}
        <Section title="Background Effects" count={15} id="backgrounds">
          <BgCard title="SilkAurora"><SilkAurora className="w-full h-full" /></BgCard>
          <BgCard title="TopographicalPulse"><TopographicalPulse className="w-full h-full" /></BgCard>
          <BgCard title="CircuitFog"><CircuitFog className="w-full h-full" /></BgCard>
          <BgCard title="QuantumFoam"><QuantumFoam className="w-full h-full" /></BgCard>
          <BgCard title="BioluminescentWeb"><BioluminescentWeb className="w-full h-full" /></BgCard>
          <BgCard title="LiquidGridMemory"><LiquidGridMemory className="w-full h-full" /></BgCard>
          <BgCard title="StarWarp"><StarWarp className="w-full h-full" /></BgCard>
          <BgCard title="DataSand"><DataSand className="w-full h-full" /></BgCard>
          <BgCard title="ErosionField"><ErosionField className="w-full h-full" /></BgCard>
          <BgCard title="MagneticFieldLines"><MagneticFieldLines className="w-full h-full" /></BgCard>
          <BgCard title="CausticLight"><CausticLight className="w-full h-full" /></BgCard>
          <BgCard title="MyceliumNetwork"><MyceliumNetwork className="w-full h-full" /></BgCard>
          <BgCard title="GravityLens"><GravityLens className="w-full h-full" /></BgCard>
          <BgCard title="FrostCrystal"><FrostCrystal className="w-full h-full" /></BgCard>
          <BgCard title="NavierStokesFluid"><NavierStokesFluid className="w-full h-full" /></BgCard>
        </Section>

        {/* ═══════════════════ CARDS (17) ═══════════════════ */}
        <Section title="Card Components" count={17} id="cards">
          <DemoCard title="MagneticCard" category="Card">
            <MagneticCard tiltIntensity={10} className="w-full"><CardContent title="Hover me" desc="3D tilt + glow" /></MagneticCard>
          </DemoCard>
          <DemoCard title="XRayCard" category="Card">
            <XRayCard className="w-full" frontContent={<CardContent title="X-Ray" desc="Pointer-revealed layer" />} backContent={<CardContent title="Hidden" desc="Secret content!" />} />
          </DemoCard>
          <DemoCard title="PressureCard" category="Card">
            <PressureCard className="w-full"><CardContent title="Press me" desc="Depth displacement" /></PressureCard>
          </DemoCard>
          <DemoCard title="LiquidBorderCard" category="Card">
            <LiquidBorderCard className="w-full"><CardContent title="Liquid" desc="Border deformation" /></LiquidBorderCard>
          </DemoCard>
          <DemoCard title="HologramCard" category="Card">
            <HologramCard className="w-full"><CardContent title="Hologram" desc="Scan + chromatic" /></HologramCard>
          </DemoCard>
          <DemoCard title="OrbitMetadataCard" category="Card">
            <OrbitMetadataCard className="w-full" metadata={[{ label: "v1.0" }, { label: "MIT" }, { label: "TS" }]}><CardContent title="Orbit" desc="Hovering elements" /></OrbitMetadataCard>
          </DemoCard>
          <DemoCard title="DepthSliceCard" category="Card">
            <DepthSliceCard className="w-full"><CardContent title="Depth" desc="Parallax layers" /></DepthSliceCard>
          </DemoCard>
          <DemoCard title="LensFocusCard" category="Card">
            <LensFocusCard className="w-full"><CardContent title="Lens Focus" desc="Blur-to-sharp" /></LensFocusCard>
          </DemoCard>
          <DemoCard title="SignalStrengthCard" category="Card">
            <SignalStrengthCard className="w-full"><CardContent title="Signal" desc="Border glow" /></SignalStrengthCard>
          </DemoCard>
          <DemoCard title="SeismicCard" category="Card">
            <SeismicCard className="w-full"><CardContent title="Seismic" desc="Shake on hover" /></SeismicCard>
          </DemoCard>
          <DemoCard title="PeelCard" category="Card">
            <PeelCard className="w-full" front={<CardContent title="Peel" desc="Corner peel" />} back={<CardContent title="Back" desc="Behind the peel" />} />
          </DemoCard>
          <DemoCard title="ThermalMapCard" category="Card">
            <ThermalMapCard className="w-full"><CardContent title="Thermal" desc="Hue shift" /></ThermalMapCard>
          </DemoCard>
          <DemoCard title="BlueprintExpandCard" category="Card">
            <BlueprintExpandCard className="w-full"><CardContent title="Blueprint" desc="Dimension lines" /></BlueprintExpandCard>
          </DemoCard>
          <DemoCard title="DiffractionCard" category="Card">
            <DiffractionCard className="w-full"><CardContent title="Diffraction" desc="Rainbow interference" /></DiffractionCard>
          </DemoCard>
          <DemoCard title="MemoryFoamCard" category="Card">
            <MemoryFoamCard className="w-full"><CardContent title="Memory Foam" desc="Press & spring back" /></MemoryFoamCard>
          </DemoCard>
          <DemoCard title="RadarScanCard" category="Card">
            <RadarScanCard className="w-full"><CardContent title="Radar" desc="Rotating sweep" /></RadarScanCard>
          </DemoCard>
          <DemoCard title="TornEdgeCard" category="Card">
            <TornEdgeCard className="w-full"><CardContent title="Torn Edge" desc="Paper tear effect" /></TornEdgeCard>
          </DemoCard>
        </Section>

        {/* ═══════════════════ LOADERS (11) ═══════════════════ */}
        <Section title="Loaders & Skeletons" count={11} id="loaders">
          <DemoCard title="BlueprintLoader" category="Loader"><BlueprintLoader className="w-full h-[100px]" /></DemoCard>
          <DemoCard title="DNALoader" category="Loader"><DNALoader className="w-full h-[100px]" /></DemoCard>
          <DemoCard title="ThreadWeaveLoader" category="Loader"><ThreadWeaveLoader className="w-full h-[100px]" /></DemoCard>
          <DemoCard title="SignalAcquisitionLoader" category="Loader"><SignalAcquisitionLoader className="w-full h-[100px]" /></DemoCard>
          <DemoCard title="ClayMorphSkeleton" category="Loader"><ClayMorphSkeleton className="w-full h-[100px]" /></DemoCard>
          <DemoCard title="GhostLayoutLoader" category="Loader"><GhostLayoutLoader className="w-full h-[100px]" /></DemoCard>
          <DemoCard title="PulseRelayLoader" category="Loader"><PulseRelayLoader className="w-full" /></DemoCard>
          <DemoCard title="SonarSkeleton" category="Loader"><SonarSkeleton className="w-full h-[100px]" /></DemoCard>
          <DemoCard title="TypewriterBlueprintLoader" category="Loader"><TypewriterBlueprintLoader className="w-full" /></DemoCard>
          <DemoCard title="FluidFillLoader" category="Loader"><FluidFillLoader progress={65} className="w-28 sm:w-32 mx-auto" /></DemoCard>
          <DemoCard title="ParticleCoalesceLoader" category="Loader"><ParticleCoalesceLoader className="w-full h-[100px]" /></DemoCard>
        </Section>

        {/* ═══════════════════ BUTTONS (9) ═══════════════════ */}
        <Section title="Buttons" count={9} id="buttons">
          <DemoCard title="GravitonButton" category="Button"><GravitonButton particleColor="#8b5cf6" particleCount={12}>Launch</GravitonButton></DemoCard>
          <DemoCard title="TensionStringButton" category="Button"><TensionStringButton>Pull me</TensionStringButton></DemoCard>
          <DemoCard title="SplitIntentButton" category="Button"><SplitIntentButton>Split</SplitIntentButton></DemoCard>
          <DemoCard title="PressureInkButton" category="Button"><PressureInkButton>Ink Press</PressureInkButton></DemoCard>
          <DemoCard title="ElasticBorderButton" category="Button"><ElasticBorderButton>Elastic</ElasticBorderButton></DemoCard>
          <DemoCard title="MorphLabelButton" category="Button"><MorphLabelButton label="Submit" hoverLabel="Send →" /></DemoCard>
          <DemoCard title="MagneticSnapButton" category="Button"><MagneticSnapButton>Magnetic</MagneticSnapButton></DemoCard>
          <DemoCard title="LiquidFillButton" category="Button"><LiquidFillButton>Fill me</LiquidFillButton></DemoCard>
          <DemoCard title="GlitchConfirmButton" category="Button"><GlitchConfirmButton label="Confirm" /></DemoCard>
        </Section>

        {/* ═══════════════════ DECORATIVE (5) ═══════════════════ */}
        <Section title="Decorative" count={5} id="decorative">
          <DemoCard title="LivingDivider" category="Decorative">
            <div className="w-full"><LivingDivider className="w-full" /></div>
          </DemoCard>
          <DemoCard title="ThreadConnector" category="Decorative">
            <div className="w-full h-[80px]"><ThreadConnector from={{ x: 20, y: 40 }} to={{ x: 220, y: 40 }} className="w-full h-full" /></div>
          </DemoCard>
          <DemoCard title="PrismaticUnderline" category="Decorative">
            <PrismaticUnderline className="w-full"><span className="text-lg font-bold text-white">Underlined</span></PrismaticUnderline>
          </DemoCard>
          <DemoCard title="PhaseChip" category="Decorative">
            <div className="flex gap-2 flex-wrap"><PhaseChip label="Beta" variant="info" /><PhaseChip label="New" variant="success" /><PhaseChip label="Pro" variant="premium" /></div>
          </DemoCard>
          <DemoCard title="BreathingGlowHalo" category="Decorative">
            <BreathingGlowHalo color="#8b5cf6"><div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-xl">✦</div></BreathingGlowHalo>
          </DemoCard>
        </Section>

        {/* ═══════════════════ CHAT UI (4) ═══════════════════ */}
        <Section title="Chat UI" count={4} id="chat">
          <DemoCard title="ThinkingIndicator" category="Chat">
            <ThinkingIndicator color="#8b5cf6" />
          </DemoCard>
          <DemoCard title="StreamText" category="Chat">
            <StreamText text="Components feel alive with physics-based motion and spring dynamics." speed={90} className="text-xs sm:text-sm text-gray-300 max-w-[240px]" />
          </DemoCard>
          <DemoCard title="MessageBubble" category="Chat">
            <div className="w-full space-y-3 px-2">
              <MessageBubble role="user" text="How does it work?" />
              <MessageBubble role="assistant" text="Physics-based spring animations!" />
            </div>
          </DemoCard>
          <DemoCard title="ReactionPicker" category="Chat">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">React:</span>
              <ReactionPicker />
            </div>
          </DemoCard>
        </Section>

        {/* ═══════════════════ NAVIGATION (3) ═══════════════════ */}
        <Section title="Navigation" count={3} id="nav">
          <DemoCard title="MagneticNav" category="Nav">
            <MagneticNav links={[{ label: "Home", href: "#" }, { label: "Docs", href: "#" }, { label: "API", href: "#" }]} />
          </DemoCard>
          <DemoCard title="BreadcrumbMorph" category="Nav">
            <BreadcrumbMorph items={[{ label: "Home" }, { label: "Components" }, { label: "Cards" }]} />
          </DemoCard>
          <DemoCard title="CommandPalette" category="Nav">
            <div className="text-center">
              <button onClick={() => setCmdOpen(true)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-300 hover:bg-white/10 transition-colors cursor-pointer font-mono">
                ⌘K to open
              </button>
              <CommandPalette
                isOpen={cmdOpen}
                onOpenChange={setCmdOpen}
                commands={[
                  { id: "home", label: "Go to Home", icon: "🏠", action: () => setCmdOpen(false) },
                  { id: "gh", label: "Open GitHub", icon: "📦", action: () => window.open("https://github.com/keyshout/Aurae") },
                  { id: "npm", label: "View on npm", icon: "📋", action: () => window.open("https://npmjs.com/package/@keyshout/aurae") },
                ]}
              />
            </div>
          </DemoCard>
        </Section>

        {/* ═══════════════════ AI/SAAS BLOCKS (13) ═══════════════════ */}
        <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/5" id="blocks">
          <div className="flex items-baseline gap-3 mb-10 mt-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI / SaaS Blocks</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">13 Sections</span>
          </div>

          {/* TerminalHero preview */}
          <div className="mb-6 rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden">
            <div className="px-4 pt-3"><span className="text-[10px] uppercase tracking-widest text-cyan-500 font-semibold">SECTION</span><h3 className="text-sm font-bold text-white mt-0.5">TerminalHero</h3></div>
            <div className="max-h-[350px] overflow-hidden">
              <TerminalHero title="Ship faster." subtitle="95 physics-based components." commands={[
                { input: "npm install @keyshout/aurae", output: "✓ 95 components ready" },
                { input: 'import { MagneticCard } from "aurae"', output: "✓ tree-shaken: 4.2kB" },
              ]} />
            </div>
          </div>

          {/* StatCounter */}
          <div className="mb-6 rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden">
            <div className="px-4 pt-3"><span className="text-[10px] uppercase tracking-widest text-cyan-500 font-semibold">SECTION</span><h3 className="text-sm font-bold text-white mt-0.5">StatCounter</h3></div>
            <StatCounter stats={[
              { value: 95, label: "Components", suffix: "+" },
              { value: 5, label: "Hooks" },
              { value: 100, label: "MIT Free", suffix: "%" },
            ]} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Timeline */}
            <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden">
              <div className="px-4 pt-3"><span className="text-[10px] uppercase tracking-widest text-cyan-500 font-semibold">SECTION</span><h3 className="text-sm font-bold text-white mt-0.5">Timeline</h3></div>
              <Timeline items={[
                { title: "Batch 1", description: "45 components", date: "v0.1" },
                { title: "Batch 2", description: "30 components", date: "v0.1" },
                { title: "Batch 3", description: "20 AI/SaaS blocks", date: "v0.1" },
              ]} className="!py-8" />
            </div>

            {/* FeatureSpotlight */}
            <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden">
              <div className="px-4 pt-3"><span className="text-[10px] uppercase tracking-widest text-cyan-500 font-semibold">SECTION</span><h3 className="text-sm font-bold text-white mt-0.5">FeatureSpotlight</h3></div>
              <FeatureSpotlight features={[
                { title: "Physics-Based", description: "Every animation uses real principles", icon: "⚡" },
                { title: "Tree-Shakeable", description: "Import only what you need", icon: "🌳" },
                { title: "Accessible", description: "prefers-reduced-motion support", icon: "♿" },
              ]} className="!py-6" />
            </div>
          </div>

          {/* ComparisonMatrix */}
          <div className="mt-6 rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden">
            <div className="px-4 pt-3"><span className="text-[10px] uppercase tracking-widest text-cyan-500 font-semibold">SECTION</span><h3 className="text-sm font-bold text-white mt-0.5">ComparisonMatrix</h3></div>
            <ComparisonMatrix
              plans={["Aurae", "Others"]}
              features={[
                { name: "Original designs", values: [true, false] },
                { name: "MIT licensed", values: [true, true] },
                { name: "Physics docs", values: [true, false] },
                { name: "95+ components", values: [true, false] },
              ]}
              className="!py-8"
            />
          </div>
        </section>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer className="py-16 sm:py-20 px-4 sm:px-6 text-center border-t border-white/5">
          <p className="text-gray-500 text-xs sm:text-sm mb-4">MIT Licensed. Free forever. Built with ❤️ for the React community.</p>
          <div className="flex justify-center gap-6 text-xs sm:text-sm">
            <a href="https://github.com/keyshout/Aurae" className="text-gray-400 hover:text-white transition-colors" target="_blank">GitHub</a>
            <a href="https://www.npmjs.com/package/@keyshout/aurae" className="text-gray-400 hover:text-white transition-colors" target="_blank">npm</a>
          </div>
          <p className="text-gray-700 text-[10px] sm:text-xs mt-6 font-mono">@keyshout/aurae v0.1.0 — 95 components · 5 hooks</p>
        </footer>
      </main>
    </div>
  );
}

/* ═══════════════════ HELPERS ═══════════════════ */

function Section({ title, count, id, children }: { title: string; count: number; id: string; children: React.ReactNode }) {
  return (
    <section className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-t border-white/5" id={id}>
      <div className="flex items-baseline gap-3 mb-10 mt-10">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{title}</h2>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">{count} Components</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {children}
      </div>
    </section>
  );
}

function BgCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden">
      <div className="relative h-[160px] sm:h-[200px] overflow-hidden">{children}</div>
      <div className="px-4 sm:px-5 py-3 border-t border-white/5">
        <span className="text-[10px] uppercase tracking-widest text-cyan-500 font-semibold">Background</span>
        <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">{title}</h3>
      </div>
    </div>
  );
}
