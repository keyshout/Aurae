// ─── Text Animations ────────────────────────────────────────────
export { ScrambleText } from "./components/text/scramble-text";
export { SonarPingText } from "./components/text/sonar-ping-text";
export { MagneticInkText } from "./components/text/magnetic-ink-text";
export { GlitchWeaveText } from "./components/text/glitch-weave-text";
export { SemanticDriftText } from "./components/text/semantic-drift-text";
export { ShatterText } from "./components/text/shatter-text";
export { ConstellationLetters } from "./components/text/constellation-letters";
export { NeonFlickerText } from "./components/text/neon-flicker-text";
export { EchoTrailHeadline } from "./components/text/echo-trail-headline";
export { RefractionText } from "./components/text/refraction-text";
// Batch 2
export { VaporTrailText } from "./components/text/vapor-trail-text";
export { LiquidMercuryText } from "./components/text/liquid-mercury-text";
export { PressureWaveText } from "./components/text/pressure-wave-text";
export { ThermalScanText } from "./components/text/thermal-scan-text";
export { FaultLineText } from "./components/text/fault-line-text";
export { DepthOfFieldText } from "./components/text/depth-of-field-text";
export { SignalNoiseText } from "./components/text/signal-noise-text";
export { OrigamiUnfoldText } from "./components/text/origami-unfold-text";

// ─── Background Effects ─────────────────────────────────────────
export { SilkAurora } from "./components/backgrounds/silk-aurora";
export { TopographicalPulse } from "./components/backgrounds/topographical-pulse";
export { CircuitFog } from "./components/backgrounds/circuit-fog";
export { QuantumFoam } from "./components/backgrounds/quantum-foam";
export { BioluminescentWeb } from "./components/backgrounds/bioluminescent-web";
export { LiquidGridMemory } from "./components/backgrounds/liquid-grid-memory";
export { StarWarp } from "./components/backgrounds/star-warp";
export { DataSand } from "./components/backgrounds/data-sand";
// Batch 2
export { ErosionField } from "./components/backgrounds/erosion-field";
export { MagneticFieldLines } from "./components/backgrounds/magnetic-field-lines";
export { CausticLight } from "./components/backgrounds/caustic-light";
export { MyceliumNetwork } from "./components/backgrounds/mycelium-network";
export { GravityLens } from "./components/backgrounds/gravity-lens";
export { FrostCrystal } from "./components/backgrounds/frost-crystal";
export { NavierStokesFluid } from "./components/backgrounds/navier-stokes-fluid";

// ─── Card Components ────────────────────────────────────────────
export { MagneticCard } from "./components/cards/magnetic-card";
export { XRayCard } from "./components/cards/x-ray-card";
export { PressureCard } from "./components/cards/pressure-card";
export { LiquidBorderCard } from "./components/cards/liquid-border-card";
export { HologramCard } from "./components/cards/hologram-card";
export { OrbitMetadataCard } from "./components/cards/orbit-metadata-card";
export { DepthSliceCard } from "./components/cards/depth-slice-card";
export { LensFocusCard } from "./components/cards/lens-focus-card";
export { SignalStrengthCard } from "./components/cards/signal-strength-card";
// Batch 2
export { SeismicCard } from "./components/cards/seismic-card";
export { PeelCard } from "./components/cards/peel-card";
export { ThermalMapCard } from "./components/cards/thermal-map-card";
export { BlueprintExpandCard } from "./components/cards/blueprint-expand-card";
export { DiffractionCard } from "./components/cards/diffraction-card";
export { MemoryFoamCard } from "./components/cards/memory-foam-card";
export { RadarScanCard } from "./components/cards/radar-scan-card";
export { TornEdgeCard } from "./components/cards/torn-edge-card";

// ─── Loaders & Skeletons ────────────────────────────────────────
export { BlueprintLoader } from "./components/loaders/blueprint-loader";
export { DNALoader } from "./components/loaders/dna-loader";
export { ThreadWeaveLoader } from "./components/loaders/thread-weave-loader";
export { SignalAcquisitionLoader } from "./components/loaders/signal-acquisition-loader";
export { ClayMorphSkeleton } from "./components/loaders/clay-morph-skeleton";
export { GhostLayoutLoader } from "./components/loaders/ghost-layout-loader";
export { PulseRelayLoader } from "./components/loaders/pulse-relay-loader";
// Batch 2
export { SonarSkeleton } from "./components/loaders/sonar-skeleton";
export { TypewriterBlueprintLoader } from "./components/loaders/typewriter-blueprint-loader";
export { FluidFillLoader } from "./components/loaders/fluid-fill-loader";
export { ParticleCoalesceLoader } from "./components/loaders/particle-coalesce-loader";

// ─── Buttons ────────────────────────────────────────────────────
export { GravitonButton } from "./components/buttons/graviton-button";
export { TensionStringButton } from "./components/buttons/tension-string-button";
export { SplitIntentButton } from "./components/buttons/split-intent-button";
export { PressureInkButton } from "./components/buttons/pressure-ink-button";
export { ElasticBorderButton } from "./components/buttons/elastic-border-button";
export { MorphLabelButton } from "./components/buttons/morph-label-button";
// Batch 2
export { MagneticSnapButton } from "./components/buttons/magnetic-snap-button";
export { LiquidFillButton } from "./components/buttons/liquid-fill-button";
export { GlitchConfirmButton } from "./components/buttons/glitch-confirm-button";

// ─── Decorative ─────────────────────────────────────────────────
export { LivingDivider } from "./components/decorative/living-divider";
export { ThreadConnector } from "./components/decorative/thread-connector";
export { PrismaticUnderline } from "./components/decorative/prismatic-underline";
export { PhaseChip } from "./components/decorative/phase-chip";
export { BreathingGlowHalo } from "./components/decorative/breathing-glow-halo";

// ─── Hooks ──────────────────────────────────────────────────────
export { usePointerField } from "./hooks/usePointerField";
export { useSpringGrid } from "./hooks/useSpringGrid";
export { useReactiveBorder } from "./hooks/useReactiveBorder";
export { useSignalPulse } from "./hooks/useSignalPulse";
export { useMorphText } from "./hooks/useMorphText";

// ─── Utilities ──────────────────────────────────────────────────
export {
  hexToRgb,
  hexToRgbString,
  clamp,
  lerp,
  mapRange,
  toFiniteNumber,
  toPositiveNumber,
  toPositiveInt,
} from "./lib/utils";

// ─── Types (Batch 1) ────────────────────────────────────────────
export type { ScrambleTextProps } from "./components/text/scramble-text";
export type { SonarPingTextProps } from "./components/text/sonar-ping-text";
export type { MagneticInkTextProps } from "./components/text/magnetic-ink-text";
export type { GlitchWeaveTextProps } from "./components/text/glitch-weave-text";
export type { SemanticDriftTextProps } from "./components/text/semantic-drift-text";
export type { ShatterTextProps } from "./components/text/shatter-text";
export type { ConstellationLettersProps } from "./components/text/constellation-letters";
export type { NeonFlickerTextProps } from "./components/text/neon-flicker-text";
export type { EchoTrailHeadlineProps } from "./components/text/echo-trail-headline";
export type { RefractionTextProps } from "./components/text/refraction-text";
export type { MagneticCardProps } from "./components/cards/magnetic-card";
export type { PressureCardProps } from "./components/cards/pressure-card";
export type { HologramCardProps } from "./components/cards/hologram-card";
export type { SignalStrengthCardProps } from "./components/cards/signal-strength-card";
export type { ElasticBorderButtonProps } from "./components/buttons/elastic-border-button";
export type { GravitonButtonProps } from "./components/buttons/graviton-button";
export type { PressureInkButtonProps } from "./components/buttons/pressure-ink-button";
export type { PhaseChipProps } from "./components/decorative/phase-chip";

// ─── Types (Batch 2) ────────────────────────────────────────────
export type { VaporTrailTextProps } from "./components/text/vapor-trail-text";
export type { LiquidMercuryTextProps } from "./components/text/liquid-mercury-text";
export type { PressureWaveTextProps } from "./components/text/pressure-wave-text";
export type { ThermalScanTextProps } from "./components/text/thermal-scan-text";
export type { FaultLineTextProps } from "./components/text/fault-line-text";
export type { DepthOfFieldTextProps } from "./components/text/depth-of-field-text";
export type { SignalNoiseTextProps } from "./components/text/signal-noise-text";
export type { OrigamiUnfoldTextProps } from "./components/text/origami-unfold-text";
export type { ErosionFieldProps } from "./components/backgrounds/erosion-field";
export type { MagneticFieldLinesProps } from "./components/backgrounds/magnetic-field-lines";
export type { CausticLightProps } from "./components/backgrounds/caustic-light";
export type { MyceliumNetworkProps } from "./components/backgrounds/mycelium-network";
export type { GravityLensProps } from "./components/backgrounds/gravity-lens";
export type { FrostCrystalProps } from "./components/backgrounds/frost-crystal";
export type { NavierStokesFluidProps } from "./components/backgrounds/navier-stokes-fluid";
export type { SeismicCardProps } from "./components/cards/seismic-card";
export type { PeelCardProps } from "./components/cards/peel-card";
export type { ThermalMapCardProps } from "./components/cards/thermal-map-card";
export type { BlueprintExpandCardProps } from "./components/cards/blueprint-expand-card";
export type { DiffractionCardProps } from "./components/cards/diffraction-card";
export type { MemoryFoamCardProps } from "./components/cards/memory-foam-card";
export type { RadarScanCardProps } from "./components/cards/radar-scan-card";
export type { TornEdgeCardProps } from "./components/cards/torn-edge-card";
export type { SonarSkeletonProps } from "./components/loaders/sonar-skeleton";
export type { TypewriterBlueprintLoaderProps } from "./components/loaders/typewriter-blueprint-loader";
export type { FluidFillLoaderProps } from "./components/loaders/fluid-fill-loader";
export type { ParticleCoalesceLoaderProps } from "./components/loaders/particle-coalesce-loader";
export type { MagneticSnapButtonProps } from "./components/buttons/magnetic-snap-button";
export type { LiquidFillButtonProps } from "./components/buttons/liquid-fill-button";
export type { GlitchConfirmButtonProps } from "./components/buttons/glitch-confirm-button";

// ─── Sections (Batch 3) ─────────────────────────────────────────
export { ParticleCollapseHero } from "./components/sections/particle-collapse-hero";
export { WaveformHero } from "./components/sections/waveform-hero";
export { MembraneHero } from "./components/sections/membrane-hero";
export { TerminalHero } from "./components/sections/terminal-hero";
export { GravityWellHero } from "./components/sections/gravity-well-hero";
export { LiquidTogglePricing } from "./components/sections/liquid-toggle-pricing";
export { HolographicPricingCard } from "./components/sections/holographic-pricing-card";
export { ComparisonMatrix } from "./components/sections/comparison-matrix";
export { BentoGrid } from "./components/sections/bento-grid";
export { Timeline } from "./components/sections/timeline";
export { StatCounter } from "./components/sections/stat-counter";
export { FeatureSpotlight } from "./components/sections/feature-spotlight";
export { LogoCarousel } from "./components/sections/logo-carousel";

// ─── Chat UI (Batch 3) ──────────────────────────────────────────
export { ThinkingIndicator } from "./components/chat/thinking-indicator";
export { StreamText } from "./components/chat/stream-text";
export { MessageBubble } from "./components/chat/message-bubble";
export { ReactionPicker } from "./components/chat/reaction-picker";

// ─── Navigation (Batch 3) ───────────────────────────────────────
export { MagneticNav } from "./components/navigation/magnetic-nav";
export { BreadcrumbMorph } from "./components/navigation/breadcrumb-morph";
export { CommandPalette } from "./components/navigation/command-palette";

// ─── Types (Batch 3) ────────────────────────────────────────────
export type { ParticleCollapseHeroProps } from "./components/sections/particle-collapse-hero";
export type { WaveformHeroProps } from "./components/sections/waveform-hero";
export type { MembraneHeroProps } from "./components/sections/membrane-hero";
export type { TerminalHeroProps } from "./components/sections/terminal-hero";
export type { GravityWellHeroProps } from "./components/sections/gravity-well-hero";
export type { LiquidTogglePricingProps } from "./components/sections/liquid-toggle-pricing";
export type { HolographicPricingCardProps } from "./components/sections/holographic-pricing-card";
export type { ComparisonMatrixProps } from "./components/sections/comparison-matrix";
export type { BentoGridProps } from "./components/sections/bento-grid";
export type { TimelineProps } from "./components/sections/timeline";
export type { StatCounterProps } from "./components/sections/stat-counter";
export type { FeatureSpotlightProps } from "./components/sections/feature-spotlight";
export type { LogoCarouselProps } from "./components/sections/logo-carousel";
export type { ThinkingIndicatorProps } from "./components/chat/thinking-indicator";
export type { StreamTextProps } from "./components/chat/stream-text";
export type { MessageBubbleProps } from "./components/chat/message-bubble";
export type { ReactionPickerProps } from "./components/chat/reaction-picker";
export type { MagneticNavProps } from "./components/navigation/magnetic-nav";
export type { BreadcrumbMorphProps } from "./components/navigation/breadcrumb-morph";
export type { CommandPaletteProps } from "./components/navigation/command-palette";
