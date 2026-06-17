# Machine Whisperer — Design System

> **Version:** 1.0 · **Theme:** Dark Navy / Bosch Professional · **Stack:** Next.js 16 + Tailwind v4
> **Source of truth:** [`src/app/globals.css`](src/app/globals.css) — all tokens live in the `@theme` block.
> Components: [`src/components/ui/`](src/components/ui/) · [`src/components/shared/`](src/components/shared/) · [`src/components/layout/`](src/components/layout/)

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Token Architecture](#2-token-architecture)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Sizing](#5-spacing--sizing)
6. [Border Radius](#6-border-radius)
7. [Elevation & Shadows](#7-elevation--shadows)
8. [Motion & Animation](#8-motion--animation)
9. [Iconography](#9-iconography)
10. [Components](#10-components)
11. [Layout System](#11-layout-system)
12. [Accessibility](#12-accessibility)
13. [Rules of Use](#13-rules-of-use)
14. [Do / Don't Reference](#14-do--dont-reference)

---

## 1. Design Principles

### 1.1 Industrial Clarity
Every screen is used by a technician on a factory floor — often under time pressure, poor lighting, and with gloved hands. Clarity and legibility beat decoration at every decision point.

### 1.2 One Action per Screen
Each screen has a single primary CTA. Secondary options exist but are visually subordinate. Never compete with yourself.

### 1.3 Token-First, Never Hardcode
All colors, radii, and easing values are CSS custom properties consumed via Tailwind utilities. No raw hex in component JSX — ever.

### 1.4 Earned Motion
Animations explain cause-and-effect. Every transition must justify its existence. If you can't describe what the motion communicates, remove it.

### 1.5 Accessibility is Non-Negotiable
WCAG AA contrast (4.5:1 text, 3:1 UI) is the floor. All interactive elements carry `aria-label` when icon-only, support keyboard navigation, and respect `prefers-reduced-motion`.

---

## 2. Token Architecture

This system uses **three layers**. Never skip a layer in either direction.

```
Primitive  →  Semantic  →  (Component styles in globals.css)
              ↑                      ↑
         colour-bg          glass-card, bosch-tile
         colour-brand       cta-footer, badge-critical
```

| Layer | Where defined | Example | Rule |
|---|---|---|---|
| **Primitive** | `@theme` block | `--color-navy-900: #0D2140` | Never use in JSX directly |
| **Semantic** | `@theme` block | `--color-bg: var(--color-navy-900)` | Use these in all components |
| **Component** | CSS class rules | `.glass-card { background: var(--color-surface) }` | Use class names; extend for variants |

### How Tailwind v4 maps tokens to utilities

In Tailwind v4, every `--color-*` token in `@theme` automatically becomes a utility:

```
--color-brand         →  bg-brand / text-brand / border-brand
--color-surface-2     →  bg-surface-2 / text-surface-2
--color-text-2        →  text-text-2
--color-border-strong →  border-border-strong
```

No `tailwind.config.js` required. The `@theme` block IS the config.

---

## 3. Color System

### 3.1 Primitive Ramps

These are the raw values. **Do not reference in component code** — always go through semantic tokens.

#### Navy (background & surface)

| Token | Hex | Usage |
|---|---|---|
| `--color-navy-950` | `#060F1E` | Bottom nav, deepest surface |
| `--color-navy-900` | `#0D2140` | App background |
| `--color-navy-800` | `#122A52` | Cards, sheets |
| `--color-navy-700` | `#163870` | Tile backgrounds, surface-2 |
| `--color-navy-600` | `#1A4080` | Hover states on tiles |
| `--color-navy-500` | `#1E5FA8` | Info / blue accents, product-card |
| `--color-navy-400` | `#2D7DD2` | Highlighted blue text |
| `--color-navy-300` | `#4A9FE8` | Light blue accent |

#### Bosch Red (brand)

| Token | Hex | Usage |
|---|---|---|
| `--color-bosch-red-700` | `#A80010` | Active / pressed state |
| `--color-bosch-red-600` | `#C2001B` | Hover state |
| `--color-bosch-red-500` | `#E20015` | ★ Primary brand color |
| `--color-bosch-red-400` | `#FF1A2E` | — (reserved, do not use) |

---

### 3.2 Semantic Tokens

These are what you use in components.

#### Backgrounds

| Token | Resolves to | Tailwind utility | Use for |
|---|---|---|---|
| `--color-bg` | `navy-900` `#0D2140` | `bg-bg` | App root background |
| `--color-surface` | `navy-800` `#122A52` | `bg-surface` | Cards, panels, modals |
| `--color-surface-2` | `navy-700` `#163870` | `bg-surface-2` | Tiles, chips, table rows |
| `--color-tile` | `navy-700` `#163870` | `bg-tile` | Icon-grid tiles |
| `--color-nav` | `navy-950` `#060F1E` | `bg-nav` | Bottom navigation bar |
| `--color-header` | `#FFFFFF` | `bg-header` | White top-bar header |

#### Brand

| Token | Resolves to | Tailwind utility | Use for |
|---|---|---|---|
| `--color-brand` | `bosch-red-500` | `bg-brand / text-brand` | Primary buttons, links, selection |
| `--color-brand-hover` | `bosch-red-600` | `hover:bg-brand-hover` | Hover state (handled by Button) |
| `--color-brand-active` | `bosch-red-700` | `active:bg-brand-active` | Press state (handled by Button) |
| `--color-blue` | `navy-500` | `text-blue / bg-blue` | Info accent, secondary highlight |

#### Text

| Token | Value | Tailwind utility | Use for | Contrast on `bg` |
|---|---|---|---|---|
| `--color-text` | `#FFFFFF` | `text-text` | Primary labels, headings | 13.4:1 ✅ AAA |
| `--color-text-2` | `rgba(255,255,255,0.62)` | `text-text-2` | Secondary labels, metadata | 5.8:1 ✅ AA |
| `--color-text-muted` | `rgba(255,255,255,0.38)` | `text-text-muted` | Placeholder, disabled — decorative only | 2.8:1 ⚠️ (non-interactive only) |
| `--color-text-header` | `#0D2140` | `text-text-header` | Text on white header bar | 12.6:1 ✅ AAA |

> **Rule:** Never use `text-muted` for interactive content or content that conveys meaning. It fails AA contrast. Use it only for placeholder ghost text or decorative numerals.

#### Borders

| Token | Value | Tailwind utility | Use for |
|---|---|---|---|
| `--color-border` | `rgba(255,255,255,0.10)` | `border-border` | Default card/panel edge |
| `--color-border-strong` | `rgba(255,255,255,0.22)` | `border-border-strong` | CTA footer top edge, modal edge, active states |

---

### 3.3 Status Colors

Used exclusively for semantic meaning — severity badges, banners, and status indicators. Never repurpose these for decoration.

| Status | Foreground token | Background token | Text token | Severity |
|---|---|---|---|---|
| **Critical** | `--color-critical` `#E20015` | `--color-critical-bg` `rgba(226,0,21,0.15)` | white | Stop machine now |
| **Warning** | `--color-warning` `#F5C842` | `--color-warning-bg` `rgba(245,200,66,0.15)` | `--color-warning-text` `#1A1200` | Monitor / act soon |
| **OK / Resolved** | `--color-ok` `#1DB974` | `--color-ok-bg` `rgba(29,185,116,0.15)` | `--color-ok-text` `#001A0D` | All clear |
| **Info** | `--color-info` `navy-500` | `--color-info-bg` `rgba(30,95,168,0.20)` | white | Neutral notice |

#### Supplementary status ramps (use via Tailwind utilities)

> These are available as Tailwind utilities (`bg-red-100`, `text-amber-400`, etc.) because they are defined in `@theme`.

| Color | Available stops |
|---|---|
| Red | `50 100 200 500 600 700` |
| Amber | `50 100 200 400 600 700 800` |
| Green | `50 100 400 500 600 700` |
| Blue | `50 100 500 700 800` |
| Purple | `50 100 200 600 700` |

---

### 3.4 Legacy Neutral Ramp (back-compat only)

> These tokens exist for backward compatibility. Prefer `--color-text`, `--color-text-2`, `--color-text-muted` in new code.

| Token | Value | Note |
|---|---|---|
| `--color-ink` | `#FFFFFF` | = `--color-text` |
| `--color-ink-2` | `rgba(255,255,255,0.80)` | Between text and text-2 |
| `--color-ink-muted` | `rgba(255,255,255,0.50)` | Between text-2 and text-muted |
| `--color-grey-50 → grey-900` | `rgba(255,255,255,0.06)` → `#FFFFFF` | White opacity ramp |
| `--color-white` | `#FFFFFF` | Explicit white |

⚠️ **Critical gotcha:** Grey tokens are white-opacity ramps on a dark navy base — they are NOT light-theme greys. `grey-50` is nearly invisible dark, not light grey. Never use them expecting light-mode behaviour.

---

### 3.5 Background Gradient (Ambient Mesh)

The app background uses two pseudo-element ambient light blobs defined in `.app-mesh`:

| Blob | Color | Position | Purpose |
|---|---|---|---|
| `::before` | `rgba(30, 95, 168, 0.12)` | Top-left | Subtle blue glow |
| `::after` | `rgba(226, 0, 21, 0.07)` | Bottom-right | Subtle brand-red glow |

Both animate slowly (32s / 40s) and respect `prefers-reduced-motion`.

---

## 4. Typography

### 4.1 Font Stack

| Role | Font | Fallbacks |
|---|---|---|
| Sans (UI) | Inter | Helvetica Neue, system-ui, sans-serif |
| Mono (code, labels) | JetBrains Mono | Fira Code, monospace |

Loaded via Google Fonts / next/font. Anti-aliasing: `-webkit-font-smoothing: antialiased` + `text-rendering: optimizeLegibility`.

### 4.2 Type Scale

| Class | Size | Line-height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `.eyebrow-mono` | 11px | — | 600 | +0.1em | Section labels, overlines |
| `.display-1` | 28px | 1.1 | 700 | −0.02em | Hero headings, splash |
| `.heading-1` | 20px | 1.2 | 700 | −0.01em | Screen titles, issue titles |
| `.heading-2` | 16px | 1.3 | 600 | 0em | Card headings, section headers |
| *(body — implicit)* | 16px | 1.5 | 400 | 0em | All body copy |
| *(body-sm — implicit)* | 14px | 1.4 | 400 | 0em | Metadata, list items |
| *(caption — implicit)* | 12px | 1.3 | 400–500 | 0em | Timestamps, footnotes |

> **Minimum body size is 16px on mobile.** Anything smaller triggers iOS auto-zoom on inputs. Never use < 12px for readable content.

### 4.3 Weight Convention

| Weight | Use |
|---|---|
| 700 (Bold) | Screen headings, critical labels |
| 600 (SemiBold) | Card headings, buttons, badge text |
| 500 (Medium) | Labels, metadata emphasis |
| 400 (Regular) | Body text, instructions, secondary |

### 4.4 Tabular Numbers

For timestamps, counters, cost-per-minute, and step indicators, use `font-variant-numeric: tabular-nums` (Tailwind: `tabular-nums`) to prevent layout shift as digits change.

---

## 5. Spacing & Sizing

The spacing system is a 4pt base grid. All padding, margin, and gap values must be multiples of 4.

### 5.1 Spacing Scale

| Token (Tailwind) | px | Common use |
|---|---|---|
| `p-1` | 4px | Icon inner padding |
| `p-2` | 8px | Chip padding, icon gap |
| `p-3` | 12px | Badge padding, small card inset |
| `p-4` | 16px | Default content padding |
| `p-5` | 20px | Card inset |
| `p-6` | 24px | Section gap |
| `p-8` | 32px | Large section separation |
| `p-12` | 48px | Screen-level vertical gap |

### 5.2 Touch Target Minimums

| Context | Minimum size | Enforcement |
|---|---|---|
| Primary buttons (`lg`) | 48 × 48px | `h-12 min-w-[48px]` |
| Standard buttons (`md`) | 44 × 44px | `h-11 min-w-[44px]` |
| Dense buttons (`sm`) | 36px height | Use only with ≥8px surrounding spacing |
| `IconButton md` | 40 × 40px | `h-10 w-10` — use for standalone icons |
| `IconButton sm` | 36 × 36px | `h-9 w-9` — only in headers with surrounding padding |
| Nav items | 48 × 48px (incl. tap area) | Bottom nav enforces this |

> **Enforce via `hitSlop` or surrounding padding when visual size is smaller than 44px.** Never reduce touch targets to satisfy visual density — add whitespace instead.

### 5.3 Content Width

Max content width: `max-w-lg` (512px) centred. The app is a mobile-first PWA; it never stretches to full desktop width.

---

## 6. Border Radius

| Token | Value | Tailwind class | Use |
|---|---|---|---|
| `--radius-sm` | 6px | `rounded-[6px]` | Input fields, small chips |
| `--radius-md` | 8px | `rounded-[8px]` / `rounded-lg` | Default: tags, tool pills |
| `--radius-lg` | 12px | `rounded-xl` | Cards, glass-card default |
| `--radius-xl` | 16px | `rounded-2xl` | Large cards, bottom sheets |
| `--radius-2xl` | 20px | `rounded-[20px]` | Bottom sheet top corners |
| `--radius-full` | 9999px | `rounded-full` | Buttons, badges, avatars |

> **Rule:** Buttons are always `rounded-full`. Cards use `rounded-xl` (12px). Bottom sheets use `rounded-[20px]` on top corners only. Never mix radius styles within the same component family.

---

## 7. Elevation & Shadows

All shadow values are hard-coded in CSS classes (not Tailwind shadow scale) because they encode the specific dark-theme depth model.

| Surface | Shadow | Class / Component |
|---|---|---|
| Cards | `0 1px 3px rgba(0,0,0,0.3), 0 8px 24px -8px rgba(0,0,0,0.4)` | `.glass-card` |
| Bottom sheets / modals | `0 -4px 32px rgba(0,0,0,0.5)` | `.bosch-sheet` |
| CTA footer | `0 -4px 24px rgba(0,0,0,0.4)` | `.cta-footer` |
| Primary button (brand) | `0 2px 12px -2px rgba(226,0,21,0.35)` (default) → `0 4px 18px -2px rgba(226,0,21,0.5)` (hover) | `Button variant="primary"` |

> **Rule:** Higher elevation = stronger shadow + reduced opacity on surrounding background (not lighter fill). The dark-theme elevation model is luminance + shadow, not fill-lightness like Material Design light.

---

## 8. Motion & Animation

### 8.1 Easing Curves

| Token | Curve | Use |
|---|---|---|
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | State transitions (hover, focus) |
| `--ease-out` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Elements entering the screen |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful spring: press scale, success pop |

Tailwind usage: `transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]`

### 8.2 Duration Scale

| Duration | Use |
|---|---|
| 100–150ms | Button press, icon state change, hover |
| 200–250ms | Screen element entrance (Framer Motion `duration: 0.2`) |
| 300ms | Card reveal, panel slide |
| 400ms | Full-screen transition |
| > 500ms | Never — too slow for industrial UI |

### 8.3 Active Animation Inventory

| Animation | Duration | Trigger | File |
|---|---|---|---|
| `active:scale-[0.97]` | 150ms | Button press | `button.tsx` |
| `active:scale-[0.95]` | 150ms | IconButton press | `button.tsx` |
| `animate-spin` | infinite | Loading spinner in Button | `button.tsx` |
| `.mw-pulse` | 1.8s infinite | Critical badge dot | `globals.css` |
| `.app-mesh::before/after` | 32s / 40s | Ambient background drift | `globals.css` |
| Framer `{ opacity: 0, x: 24 } → { opacity: 1, x: 0 }` | 200ms | Step card entrance | `GuidedFixScreen.tsx` |

### 8.4 Reduced Motion

Both `.app-mesh` animations and `.mw-pulse` are disabled under `prefers-reduced-motion: reduce`. When adding new animations, always add a `@media (prefers-reduced-motion: reduce)` override.

---

## 9. Iconography

**Icon library:** [Lucide React](https://lucide.dev) — consistent 2px stroke, rounded corners.

| Rule | Detail |
|---|---|
| Always use Lucide SVG | Never use emoji as icons |
| Consistent stroke weight | All icons use default 2px Lucide stroke — never mix weights |
| Default icon size | `h-5 w-5` (20px) for inline, `h-6 w-6` (24px) for nav/feature |
| Small icons | `h-4 w-4` (16px) for inline badges and dense contexts |
| Large icons | `h-7 w-7` (28px) for empty state illustrations |
| Color | Inherit from text token — use `text-text-2` for secondary, `text-brand` for primary action |
| Accessibility | All icon-only buttons MUST have `aria-label` — icon alone is never sufficient |

### Semantic icon assignments (do not deviate)

| Icon | Usage |
|---|---|
| `Wrench` | Tools required |
| `CheckCircle2` | Expected condition, success, resolved |
| `XCircle` | Didn't fix, failure |
| `TriangleAlert` | Warning safety notice |
| `OctagonAlert` | Danger safety notice |
| `Lightbulb` | Rare case / tip |
| `ArrowLeft` | Back navigation |
| `Camera` | Scan / capture |
| `ImageIcon` | Photo placeholder |
| `Loader2` | Loading state (spinning) |
| `Check` | Success state in Button |

---

## 10. Components

### 10.1 Button

**File:** [`src/components/ui/button.tsx`](src/components/ui/button.tsx)

#### Variants

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| `primary` | `bg-brand` | white | none | One per screen — the main action |
| `secondary` | `bg-surface-2` | white | `border-border-strong` | Supporting actions |
| `ghost` | transparent | `text-text-2` → white on hover | none | Toolbar actions, low-emphasis |
| `danger` | `bg-surface-2` | `text-red-500` | `border-red-500/30` | Destructive — always requires confirmation |

#### Sizes

| Size | Height | Min-width | Padding | Font | Use |
|---|---|---|---|---|---|
| `sm` | 36px | 36px | px-4 | 14px | Dense UI, inline actions (add ≥8px spacing around) |
| `md` | 44px | 44px | px-5 | 15px | Standard touch target |
| `lg` | 48px | 48px | px-6 | 16px | Primary CTA, full-width footer |

#### States

| State | Visual |
|---|---|
| Default | Base variant styles |
| Hover | `hover:bg-brand-hover` / `brightness-110` / `hover:text-white` |
| Active | `active:scale-[0.97]` + `bg-brand-active` |
| Focused | `focus-visible:ring-2 ring-brand/70 ring-offset-1 ring-offset-bg` |
| Loading | Spinner (`Loader2`) + label at 70% opacity + disabled |
| Success | Green check (`Check`) + label |
| Disabled | `opacity-40 pointer-events-none` |

#### Usage rules

```tsx
// ✅ One primary CTA per screen
<Button size="lg" className="w-full">Continue</Button>

// ✅ Icon + label — use inline-flex on inner span (already done in component)
<Button variant="secondary">
  <CheckCircle2 className="h-4 w-4" />
  Fixed
</Button>

// ✅ Async action — set loading to prevent double submission
<Button loading={isPending} onClick={submit}>Save</Button>

// ❌ Never put two primary buttons side by side
// ❌ Never hardcode colour — use variant prop
// ❌ Never skip size — default md is fine but be intentional
```

---

### 10.2 IconButton

**File:** [`src/components/ui/button.tsx`](src/components/ui/button.tsx) (exported alongside Button)

Square, icon-only interactive control. Use in headers and toolbars.

| Size | Dimensions | Radius | Use |
|---|---|---|---|
| `sm` | 36 × 36px | `rounded-lg` (8px) | Header back/action — surround with ≥4px padding |
| `md` | 40 × 40px | `rounded-xl` (12px) | Standalone icon controls |

```tsx
// ✅ Always provide aria-label
<IconButton aria-label="Back" onClick={goBack}>
  <ArrowLeft className="h-5 w-5" />
</IconButton>

// ❌ Never use without aria-label
<IconButton><ArrowLeft /></IconButton>
```

---

### 10.3 Card (`glass-card`)

**File:** [`src/components/ui/card.tsx`](src/components/ui/card.tsx) + `.glass-card` in globals

```css
background: var(--color-surface);      /* #122A52 */
border: 0.5px solid var(--color-border);
border-radius: 12px;
box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 8px 24px -8px rgba(0,0,0,0.4);
```

Use `<Card>` component or `className="glass-card"` directly. For inner section separation, use `bg-surface-2` tiles, not nested Cards.

---

### 10.4 SeverityBadge

**File:** [`src/components/shared/SeverityBadge.tsx`](src/components/shared/SeverityBadge.tsx)

| Kind | Color | Border | Additional |
|---|---|---|---|
| `critical` | `text-red-500` on `bg-red-100` | `border-red-200` | Animated pulse dot |
| `warning` | `text-amber-400` on `bg-amber-100` | `border-amber-200` | — |
| `in-progress` | `text-amber-400` on `bg-amber-100` | `border-amber-400/30` | — |
| `resolved` | `text-green-400` on `bg-green-100` | `border-green-400/30` | — |
| `info` | `text-text-2` on `bg-surface-2` | `border-border` | — |

```tsx
<SeverityBadge kind="critical" />         // → CRITICAL + pulse dot
<SeverityBadge kind="warning" />          // → WARNING
<SeverityBadge kind="resolved" />         // → RESOLVED
<SeverityBadge kind="in-progress" />      // → IN PROGRESS
<SeverityBadge kind="warning" label="DELAYED" />  // custom label
```

Helper: `statusToBadgeKind(status, severity)` maps Issue data to badge kind automatically.

---

### 10.5 SafetyBanner

**File:** [`src/components/shared/SafetyBanner.tsx`](src/components/shared/SafetyBanner.tsx)

| Level | Icon | Color | Use |
|---|---|---|---|
| `warning` | `TriangleAlert` | Amber | Caution — risk of minor injury or machine damage |
| `danger` | `OctagonAlert` | Red | Stop — risk of serious injury or machine destruction |

```tsx
<SafetyBanner level="warning" text="Power down spindle before proceeding" />
<SafetyBanner level="danger" text="Do not overtighten — damages spindle thread" />
```

Always render SafetyBanner **above** the step card when `step.safetyNote` is present. Never omit it to save space.

---

### 10.6 StepCard

**File:** [`src/components/shared/StepCard.tsx`](src/components/shared/StepCard.tsx)

Anatomy:
1. Background step number (decorative, `aria-hidden`, `text-white/10`)
2. Step title (`text-[17px] font-semibold`)
3. Instruction text (`text-base text-text-2`)
4. Photo area — 192px height (`h-48`), `object-cover`. Falls back to placeholder with `ImageIcon` if no `photoUrl` or if image 404s
5. Expected condition — green-tinted box with `CheckCircle2`

Rules:
- Photo always 16:9 or fills `h-48` container with `object-cover` — never distort
- `alt` must describe the step action, not just the step title
- Expected condition is mandatory — never remove it from the data model

---

### 10.7 SourceChip

**File:** [`src/components/shared/SourceChip.tsx`](src/components/shared/SourceChip.tsx)

Small inline evidence tag. Uses `bg-surface-2 border-border` with `text-text-2`. Non-interactive unless wrapped in a link.

---

### 10.8 AppShell

**File:** [`src/components/layout/AppShell.tsx`](src/components/layout/AppShell.tsx)

The root layout wrapper for every screen.

| Prop | Type | Effect |
|---|---|---|
| `title` | `ReactNode` | Renders white sticky header bar. Omit to hide header entirely |
| `back` | `boolean` | Shows `IconButton` with `ArrowLeft` |
| `backHref` | `string` | If set, pushes to href; otherwise calls `router.back()` |
| `right` | `ReactNode` | Right slot — step counter, language toggle, etc. |
| `hideBottomNav` | `boolean` | Hides `BottomNav` — use for sub-flows (GuidedFix, Scan) |
| `contentClassName` | `string` | Override main content classes. Default: `overflow-y-auto` |

Header uses `.glass-nav` class (darkest surface, `#060F1E`) — not `.bosch-header` (white). Intentional: in-flow screens use dark header; the home dashboard uses white header via dedicated route layout.

---

### 10.9 BottomNav

**File:** [`src/components/layout/BottomNav.tsx`](src/components/layout/BottomNav.tsx)

5-item maximum. Uses `.glass-nav` (`bg-nav`, `#060F1E`). Active state: `text-brand`. Inactive: `text-text-muted`. Bottom safe area handled via `padding-bottom: env(safe-area-inset-bottom)`.

---

### 10.10 Surface Classes

| Class | Background | Border | Shadow | Use |
|---|---|---|---|---|
| `.glass-card` | `var(--color-surface)` | 0.5px `border` | Subtle + lift | Cards, panels |
| `.bosch-tile` | `var(--color-tile)` | 0.5px `border` | none | Icon-grid tiles |
| `.bosch-sheet` | `var(--color-surface)` | Top `border-strong` | Heavy upward | Modals, drawers |
| `.bosch-header` | `var(--color-header)` white | Bottom `rgba(navy,0.12)` | none | White top-bar |
| `.glass-nav` | `var(--color-nav)` | Top `border` | none | Bottom nav, in-flow header |
| `.cta-footer` | `var(--color-surface)` | Top `border-strong` | Heavy upward | Sticky action footer |

---

### 10.11 Badge Typography Classes

Predefined badge shapes available as global CSS classes:

| Class | Background | Text | Use |
|---|---|---|---|
| `.badge-critical` | `var(--color-critical)` | white | Severity label on machine cards |
| `.badge-warning` | `var(--color-warning)` | `var(--color-warning-text)` | Warning label |
| `.badge-ok` | `var(--color-ok)` | `var(--color-ok-text)` | Resolved / healthy |
| `.badge-info` | `var(--color-info)` | white | Informational |

All badges: `font-size: 10px · font-weight: 700 · padding: 3px 8px · border-radius: 999px · text-transform: uppercase · letter-spacing: 0.05em`

> Prefer `<SeverityBadge>` component over raw CSS classes — it handles the pulse animation and maps status logic automatically.

---

## 11. Layout System

### 11.1 Viewport

- Target: mobile-first, 375px minimum width
- Max content width: `max-w-lg` (512px), centred
- Never restrict zoom (`user-scalable=no` is forbidden)
- Use `min-h-dvh` not `min-h-screen` / `100vh` to avoid iOS toolbar overlap

### 11.2 Z-Index Scale

| Layer | Value | What sits here |
|---|---|---|
| Base | 0 | Normal content flow |
| Cards / sticky content | 10 | Sticky elements within scroll |
| Header | 30 | `sticky top-0 z-30` in AppShell |
| Bottom nav | 40 | BottomNav |
| Modals / sheets | 50 | Overlays |
| Toast / alerts | 60 | Notification toasts |
| App mesh (background) | −10 | Ambient gradient blobs |

### 11.3 Safe Area

CTA footer uses `padding-bottom: max(env(safe-area-inset-bottom), 20px)` to avoid home indicator overlap on iPhone. All fixed bottom elements must follow this pattern.

### 11.4 Scroll Architecture

- Each screen's scrollable region is `flex-1 overflow-y-auto`
- Sticky header: `sticky top-0 z-30`
- Sticky footer: `shrink-0` sibling outside the scroll container
- Never nest scroll regions — one scroll axis per screen

---

## 12. Accessibility

### Contrast Requirements

| Pair | Ratio | WCAG |
|---|---|---|
| `#FFFFFF` on `#0D2140` (text on bg) | 13.4:1 | ✅ AAA |
| `rgba(255,255,255,0.62)` on `#0D2140` (text-2 on bg) | 5.8:1 | ✅ AA |
| `#E20015` on `#0D2140` (brand on bg) | 4.6:1 | ✅ AA |
| `#F5C842` on `#0D2140` (warning on bg) | 8.2:1 | ✅ AAA |
| `#1DB974` on `#0D2140` (ok on bg) | 5.7:1 | ✅ AA |
| `rgba(255,255,255,0.38)` on `#0D2140` (text-muted) | 2.8:1 | ⚠️ Fails AA — non-interactive only |

### Required Patterns

| Rule | Implementation |
|---|---|
| Icon-only buttons | Always `aria-label` on `IconButton` |
| Status badges | Include text label alongside color dot |
| Safety banners | Icon + text, never color alone |
| Loading buttons | Button disabled during async, `aria-busy` if needed |
| Step photos | `alt` with descriptive action text |
| Progress bar | `aria-valuenow / aria-valuemin / aria-valuemax` |
| Focus rings | `focus-visible:ring-2 ring-brand/70` on all interactive elements |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` in globals.css |

---

## 13. Rules of Use

### Color

| ✅ Do | ❌ Don't |
|---|---|
| Use semantic tokens (`text-text-2`, `bg-surface`) | Use raw hex in JSX (`text-[#0D2140]`) |
| Use status tokens for severity meaning | Repurpose status colors for decoration |
| Use `text-text-muted` for placeholders only | Use `text-muted` for meaningful labels |
| Test contrast in both header (white) and body (navy) contexts | Assume one theme fits all surfaces |

### Typography

| ✅ Do | ❌ Don't |
|---|---|
| Use `text-text` for headings, `text-text-2` for body | Mix text tokens randomly |
| Use `eyebrow-mono` for section labels | Use all-caps on body text |
| Size body at ≥ 16px on mobile | Go below 12px for any visible content |
| Use `tabular-nums` for data / counters | Use proportional figures in aligned columns |

### Spacing

| ✅ Do | ❌ Don't |
|---|---|
| Use multiples of 4 for all spacing | Use arbitrary pixel values like `7px`, `13px` |
| Maintain ≥ 8px gap between touch targets | Crowd interactive elements together |
| Use `px-4` (16px) as default content padding | Use `px-3` for content edges — too tight for gloves |

### Components

| ✅ Do | ❌ Don't |
|---|---|
| One `primary` Button per screen | Place two primary buttons side by side |
| Use `variant="danger"` for destructive actions | Use red text on a primary button |
| Include `SafetyBanner` above step when `safetyNote` is set | Bury safety information in body text |
| Use `SeverityBadge` component not raw CSS badge classes | Hardcode badge styles per-screen |
| Pass `aria-label` to every `IconButton` | Leave icon buttons without accessible name |

### Motion

| ✅ Do | ❌ Don't |
|---|---|
| Keep transitions under 300ms for micro-interactions | Animate layout-affecting properties (width, height) |
| Use `--ease-out` for entering elements | Use `linear` easing for UI transitions |
| Respect `prefers-reduced-motion` | Add animations without a media query override |
| Animate `transform` and `opacity` only | Animate `top`, `left`, `margin`, `padding` |

---

## 14. Do / Don't Reference

### Surface & Background

```tsx
// ✅
<div className="bg-surface border border-border rounded-xl p-5">

// ❌ Hardcoded hex
<div style={{ background: '#122A52', border: '1px solid rgba(255,255,255,0.1)' }}>
```

### Text Hierarchy

```tsx
// ✅
<h2 className="text-[17px] font-semibold text-white">Step Title</h2>
<p className="text-base text-text-2">Instruction body copy goes here.</p>
<span className="text-xs text-text-muted">Timestamp</span>

// ❌ text-muted for readable content
<p className="text-text-muted">Step instruction that must be read</p>
```

### Buttons

```tsx
// ✅ Full-width primary CTA
<Button size="lg" className="w-full">Continue</Button>

// ✅ Icon + text (inline-flex handled inside Button)
<Button variant="secondary" size="md">
  <CheckCircle2 className="h-4 w-4" />
  Fixed
</Button>

// ❌ Two primary buttons
<Button>Save</Button>
<Button>Submit</Button>

// ❌ Wrong variant for destructive
<Button variant="primary" className="bg-red-500">Delete</Button>
```

### Status Colors

```tsx
// ✅ Use status tokens
<div className="bg-critical-bg border border-red-200 text-red-500">

// ❌ Invent your own severity colours
<div style={{ background: '#ff000020', color: '#cc0000' }}>
```

### Safety Banner Ordering

```tsx
// ✅ Safety first — above the step content
{step.safetyNote && <SafetyBanner level={step.safetyLevel} text={step.safetyNote} />}
<StepCard step={step} />

// ❌ Safety buried after step
<StepCard step={step} />
<p className="text-xs text-red-500">{step.safetyNote}</p>
```

### Animation

```tsx
// ✅ Transform only
<motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>

// ❌ Width/height animation (causes layout reflow)
<motion.div animate={{ width: isOpen ? '100%' : '0%' }}>
```

---

*Last updated: 2026-06-17 · Maintained by design + engineering · Questions → open a GitHub issue*
