# Contributing to Aurae

Welcome! We're excited you want to contribute to Aurae. We care about **originality over quantity** — every component should bring something new to the React ecosystem.

## 🚀 Getting Started

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/aurae.git
cd aurae

# Install dependencies
npm install

# Start development build (watch mode)
npm run dev
```

## 📐 Component Standards

Every Aurae component must follow these rules:

### Required
- **`"use client"` directive** at the top of every component file
- **Full TypeScript** — zero `any` usage, all props typed with interfaces
- **JSDoc block** at the top with `@component`, `@description`, and a `@example` code snippet
- **Only three deps**: React, Tailwind CSS, Framer Motion — no other libraries
- **Dark mode compatible** — use Tailwind's dark: modifiers, no hardcoded light-only colors
- **Accessible** — include `role`, `aria-label`, `aria-hidden` where appropriate
- **`useReducedMotion()`** — import from `framer-motion`, skip animations when preferred
- **Timer cleanup** — every `setTimeout`, `setInterval`, and `requestAnimationFrame` must be tracked via `useRef` and cleared in `useEffect` return

### Preferred
- Use `ctx.setTransform()` instead of `ctx.scale()` in Canvas components
- Import shared utilities from `lib/utils.ts` instead of defining locally
- Consolidate multiple `setState` calls into a single state object
- Use `useRef` + direct DOM manipulation for high-frequency updates (60fps+)

## 🎨 Originality Rule

**Before contributing, check these libraries:**
- [ReactBits](https://reactbits.dev)
- [MagicUI](https://magicui.design)
- [Aceternity UI](https://ui.aceternity.com)

If your idea already exists there — even loosely — **rethink it**. We want components that can't be found anywhere else.

**Banned effects** (too common):
- Typewriter / character reveal
- Meteor shower / falling particles
- Basic neon/glow border
- Simple fade-in on scroll
- Confetti explosions

## 🧬 Animation Principle Requirement

Every component must document its underlying animation principle. This is what makes Aurae different — we don't just animate, we simulate.

Good examples:
- "Spring physics with overdamped oscillation"
- "Diffusion-limited aggregation growth algorithm"
- "Navier-Stokes simplified fluid dynamics"
- "Optical interference pattern calculation"

Bad examples:
- "Looks cool"
- "CSS animation"
- "Random movement"

## ✅ PR Checklist

Before submitting, verify:

```
- [ ] "use client" directive at top
- [ ] Full TypeScript types (no any)
- [ ] All props are customizable with sensible defaults
- [ ] JSDoc usage example at top of file
- [ ] Dark mode compatible
- [ ] a11y: aria-label / role where needed
- [ ] useReducedMotion() implemented
- [ ] setTimeout/RAF cleanup in useEffect return
- [ ] No external dependencies
- [ ] Originality: not similar to ReactBits / MagicUI / Aceternity
```

## 🔧 Code Style

We use ESLint and Prettier. Run before committing:

```bash
npm run lint
npm run typecheck
```

## 📝 Commit Convention

Follow conventional commits:

```
feat(ComponentName): add new feature
fix(ComponentName): fix specific issue
perf(HookName): optimize render performance
docs: update README
chore: update dependencies
```

Examples:
```
feat(ScrambleText): add onComplete callback
fix(NeonFlickerText): resolve stale closure in RAF loop
perf(useSpringGrid): stop RAF when idle
docs: add Batch 2 components to README
```

## 💬 Questions?

Open a [GitHub Issue](https://github.com/keyshout/Aurae/issues) — we're happy to help!
