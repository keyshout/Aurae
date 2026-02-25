<p align="center">
  <h1 align="center">Aurae</h1>
  <p align="center"><em>95 original React components. Physics-based. MIT licensed. Free forever.</em></p>
  <p align="center"><strong><a href="https://keyshout.github.io/Aurae">🌐 View the Interactive Documentation & Demo</a></strong></p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@keyshout/aurae"><img src="https://img.shields.io/npm/v/@keyshout/aurae?color=22d3ee&label=npm" alt="npm version" /></a>
  <a href="https://github.com/keyshout/Aurae/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/components-95-blueviolet" alt="95 Components" />
  <img src="https://img.shields.io/badge/TypeScript-100%25-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Framer%20Motion-powered-purple" alt="Framer Motion" />
</p>

---

## ✨ Why Aurae?

- **100% Free & MIT** — No premium tiers, no gated components, no "star to unlock". Every component is yours.
- **Original designs only** — No typewriter effects. No meteor showers. No neon borders. Every animation is built from a unique physics, optics, or biology principle.
- **Principle transparency** — Each component documents its underlying animation principle (spring physics, fluid dynamics, optical diffraction, etc.) so you understand *why* it moves that way.
- **Tree-shakeable** — Import only what you need. ESM + CJS, zero bloat.

---

## 📦 Installation

```bash
npm install @keyshout/aurae framer-motion
```

Aurae uses [Tailwind CSS](https://tailwindcss.com) utility classes. Make sure Tailwind is configured in your project.

---

## 🚀 Quick Start

```tsx
import { ScrambleText, MagneticCard, GravitonButton } from "@keyshout/aurae";

export default function Hero() {
  return (
    <div className="space-y-8">
      <ScrambleText
        text="Welcome to Aurae"
        scrambleChars="!@#$%"
        className="text-5xl font-black text-white"
      />

      <MagneticCard tiltStrength={12} glowColor="#06b6d4" className="w-80 p-6">
        <h3 className="text-xl font-bold text-white">Hover me</h3>
        <p className="text-gray-400">3D tilt + pointer-tracking glow</p>
      </MagneticCard>

      <GravitonButton
        particleCount={20}
        particleColor="#8b5cf6"
        onClick={() => console.log("clicked!")}
      >
        Launch
      </GravitonButton>
    </div>
  );
}
```

---

## 📋 Components

### Text Animations (18)

| Component | Principle |
|-----------|-----------|
| ScrambleText | Character entropy cycling |
| SonarPingText | Radial wave brightness propagation |
| MagneticInkText | Per-character spring physics + ink stretch |
| GlitchWeaveText | Frequency band distortion layers |
| SemanticDriftText | Brownian float per word |
| ShatterText | Shard physics + reassembly flash |
| ConstellationLetters | Character distance lines + proximity glow |
| NeonFlickerText | Voltage simulation per character |
| EchoTrailHeadline | Layered echo offset + merge animation |
| RefractionText | Prismatic color split via clip-path |
| VaporTrailText | Gaussian blur trail decay during reveal |
| LiquidMercuryText | SVG feMerge metaball filter |
| PressureWaveText | Radial click shockwave + spring return |
| ThermalScanText | Thermal camera color gradient |
| FaultLineText | Clip-path tectonic split + hover trigger |
| DepthOfFieldText | Pointer-tracked cinematic blur focal plane |
| SignalNoiseText | SNR-increasing noise→clean transition |
| OrigamiUnfoldText | 3D CSS perspective per-character unfold |

### Background Effects (15)

| Component | Principle |
|-----------|-----------|
| SilkAurora | SVG filter turbulence + animated gradients |
| TopographicalPulse | Elevation contour lines + pulse waves |
| CircuitFog | SVG trace paths + fog blob animation |
| QuantumFoam | Canvas bubble lifecycle simulation |
| BioluminescentWeb | Pointer-tracking glow trails + branching |
| LiquidGridMemory | Canvas grid deformation + spring return |
| StarWarp | Canvas star parallax + trail rendering |
| DataSand | Particle flow field + pointer push |
| ErosionField | Hash noise geological erosion blocks |
| MagneticFieldLines | Dipole field equation SVG paths |
| CausticLight | SVG feTurbulence + feDisplacementMap |
| MyceliumNetwork | L-system recursive branching growth |
| GravityLens | Radial grid deformation around pointer |
| FrostCrystal | DLA growth on idle, melt on movement |
| NavierStokesFluid | Simplified Navier-Stokes velocity advection |

### Card Components (17)

| Component | Principle |
|-----------|-----------|
| MagneticCard | 3D CSS perspective tilt + glow tracking |
| XRayCard | Pointer-revealed hidden layer |
| PressureCard | Depth displacement per pointer force |
| LiquidBorderCard | SVG border deformation + surface tension |
| HologramCard | Scan line + chromatic shift overlay |
| OrbitMetadataCard | Orbital element rotation on hover |
| DepthSliceCard | Parallax layer separation |
| LensFocusCard | Blur-to-sharp radial focus |
| SignalStrengthCard | Distance-based border segment glow |
| SeismicCard | Sinusoidal shake attenuation on hover |
| PeelCard | CSS 3D perspective corner peel |
| ThermalMapCard | Radial distance hue shift (cold→hot) |
| BlueprintExpandCard | SVG dimension lines + annotation fade |
| DiffractionCard | Conic gradient angle-dependent interference |
| MemoryFoamCard | Overdamped spring press depression |
| RadarScanCard | Conic gradient rotation sweep + ping |
| TornEdgeCard | SVG clip-path torn paper edge |

### Loaders & Skeletons (11)

| Component | Principle |
|-----------|-----------|
| BlueprintLoader | SVG stroke drawing |
| DNALoader | Double helix rotation |
| ThreadWeaveLoader | Interlacing thread paths |
| SignalAcquisitionLoader | Sweep scanner + segment lock |
| ClayMorphSkeleton | Organic morphing shapes |
| GhostLayoutLoader | Fade pulse skeleton blocks |
| PulseRelayLoader | Sequential pulse relay dots |
| SonarSkeleton | Radial ping wave skeleton rows |
| TypewriterBlueprintLoader | Terminal typing + progress bar |
| FluidFillLoader | SVG wave surface liquid fill |
| ParticleCoalesceLoader | Particle-to-target smoothstep interpolation |

### Buttons (9)

| Component | Principle |
|-----------|-----------|
| GravitonButton | Particle orbit + gravitational pull |
| TensionStringButton | SVG string deformation + snap |
| SplitIntentButton | Dual-action slide reveal |
| PressureInkButton | Ink blot spread on click |
| ElasticBorderButton | SVG border bulge + wave |
| MorphLabelButton | Label text morphing transition |
| MagneticSnapButton | Magnetic attraction force + spring return |
| LiquidFillButton | ScaleY liquid fill toggle |
| GlitchConfirmButton | RGB chromatic split + state transition |

### Decorative (5)

| Component | Principle |
|-----------|-----------|
| LivingDivider | Organic undulation animation |
| ThreadConnector | Dynamic SVG connection paths |
| PrismaticUnderline | Spectral color shift underline |
| PhaseChip | Matte-to-glossy phase transition |
| BreathingGlowHalo | Rhythmic glow pulse |

### AI / SaaS Blocks (20)

| Component | Category |
|-----------|----------|
| ParticleCollapseHero | Hero |
| WaveformHero | Hero |
| MembraneHero | Hero |
| TerminalHero | Hero |
| GravityWellHero | Hero |
| LiquidTogglePricing | Pricing |
| HolographicPricingCard | Pricing |
| ComparisonMatrix | Pricing |
| ThinkingIndicator | Chat UI |
| StreamText | Chat UI |
| MessageBubble | Chat UI |
| ReactionPicker | Chat UI |
| BentoGrid | Features |
| Timeline | Features |
| StatCounter | Features |
| FeatureSpotlight | Features |
| LogoCarousel | Features |
| MagneticNav | Navigation |
| BreadcrumbMorph | Navigation |
| CommandPalette | Navigation |

---

## 🪝 Hooks

| Hook | Description |
|------|-------------|
| `usePointerField` | Tracks pointer position relative to an element with optional smoothing |
| `useSpringGrid` | Spring-based grid cell displacement on pointer interaction |
| `useReactiveBorder` | Distance-based border segment intensity |
| `useSignalPulse` | Generates rhythmic signal pulse values |
| `useMorphText` | Smooth text morphing between strings |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a PR.

**Key rule:** Every component must be original. Before contributing, check [ReactBits](https://reactbits.dev), [MagicUI](https://magicui.design), and [Aceternity](https://ui.aceternity.com). If your idea exists there, rethink it.

---

## 📄 License

[MIT](LICENSE) — Use it however you want.

---

## 🗺️ Roadmap

- ~~**Batch 1** — 45 components + 5 hooks~~ ✅
- ~~**Batch 2** — 30 new components~~ ✅
- ~~**Batch 3** — 20 AI/SaaS blocks~~ ✅
- **Documentation site** — Interactive component playground
- **Figma kit** — Design tokens and component library
- **CLI** — `npx aurae add <component>` for selective installs

---

<p align="center">Built with ❤️ for the React community.</p>
