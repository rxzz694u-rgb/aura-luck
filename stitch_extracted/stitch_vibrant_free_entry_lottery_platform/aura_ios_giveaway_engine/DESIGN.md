---
name: Aura iOS Giveaway Engine
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#3f4850'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#6f7881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006497'
  primary: '#006193'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#92ccff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#b10e6b'
  on-tertiary: '#ffffff'
  tertiary-container: '#d23284'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#92ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffd9e4'
  tertiary-fixed-dim: '#ffb0cd'
  on-tertiary-fixed: '#3e0022'
  on-tertiary-fixed-variant: '#8c0053'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
This design system pairs the structural clarity, restraint, and tactile precision of modern iOS Human Interface Guidelines with the dynamism of social giveaways and Telegram Mini Apps. The platform strips away the seediness, dark neon glows, flashing casino tropes, and predatory patterns typical of lottery interfaces. Instead, it positions draws and giveaways as elevated, transparent, and delight-driven consumer experiences.

The visual style blends soft ambient minimalism with frosted glassmorphism (translucent white planes, subtle ultra-fine hairline dividers, and fluid spring curves). High-chroma accents—led by Telegram's iconic paper plane blue—inject celebration and clarity without clutter. Micro-surfaces feel light, responsive, and tactile, evoking safety, effortless participation, and institutional trustworthiness.

## Colors
The palette relies on pristine structural neutrals supported by vibrant chromatic accents that assign semantic intent across lottery and ticket flows.

### Canvas & Surface Architecture
- **Base Canvas (`bg-canvas`):** `#F7F8FA` transitioning to `#F2F4F7` for inset groups and secondary background wells.
- **Card Surface (`surface-elevated`):** `#FFFFFF` pure white, framing primary interactive cards, modal sheets, and tickets.
- **Translucent Frosted Overlay:** `rgba(255, 255, 255, 0.82)` combined with `backdrop-filter: blur(20px)` for floating navigation bars, header titles, and sticky confirmation bars.
- **Hairline Dividers & Outlines:** `#E5E7EB` on flat surfaces, or `rgba(0, 0, 0, 0.06)` for layered depth over soft tints.

### Text & Hierarchical Contrasts
- **Primary Body/Headings:** `#111827` (Deep Charcoal Black) ensuring high contrast and effortless legibility.
- **Secondary Content:** `#4B5563` for subheaders, counts, and metadata.
- **Tertiary & Placeholder:** `#6B7280` / `#9CA3AF` for micro-captions, timestamps, and input hints.

### Functional & Gamified Accents
- **Telegram Primary (`#0088CC` / `#229ED9`):** Authoritative brand actions, Telegram login hooks, channel join verification, and primary submit states.
- **Electric Violet (`#8B5CF6`):** Jackpot milestones, exclusive VIP pools, and tier progression.
- **Hot Magenta (`#EC4899`):** Expiring giveaways, flash timers, and lucky ticket multipliers.
- **Vibrant Cyan (`#06B6D4`):** Entry pool participation and total participant volumes.
- **Coral Orange (`#FF6B4A`):** Urgent countdowns, remaining slot quotas, and alert banners.
- **Neon Lime (`#10B981`):** Free-entry confirmation, successful ticket validation, and credited payouts.

## Typography
Typographic hierarchy mirrors Apple’s System UI conventions with tight negative tracking on display headers and proportional spacing for legible body copy. Numbers inside lottery tickets, countdown modules, and entry tallies leverage tabular figures (`font-variant-numeric: tabular-nums`) to prevent optical shifting during live countdowns.

Large display styles are reserved for giveaway prize values (e.g., "$10,000 USDT", "iPhone 15 Pro"). Headline and body styles remain strictly humanistic and unobtrusive, preserving an uncluttered app experience inside responsive mobile viewports and desktop dashboards alike.

## Layout & Spacing
The layout strategy follows an iOS Inset Grouped model optimized for single-column mobile web views and Telegram WebApps (TWA), scaling cleanly into centered multi-column layouts on wider screens.

- **Mobile Viewports (< 640px):** Content conforms to a fluid column with a strict `16px` (`margin`) outer safe-area cushion. Components are grouped into distinct rounded cards with vertical gap spacing of `12px` to `16px`.
- **Tablet / Desktop Viewports (≥ 640px):** The main interface locks to a centered structural container (maximum width `680px` for focused participation, or a 12-column grid capped at `1080px` for multi-card giveaway feeds) with `24px` (`gutter-desktop`) and `32px` (`margin-desktop`).
- **Touch Targets:** Any interactive button, segmented control thumb, or checklist trigger maintains a minimum hit area of `44px × 44px` in alignment with iOS ergonomics.

## Elevation & Depth
Depth is created through ambient, multi-layered diffuse shadows and material blurs rather than high-contrast structural borders or heavy skeuomorphic bevels.

- **Level 0 (Flat/Base):** Canvas surface `#F7F8FA`. No elevation.
- **Level 1 (Cards & Inset Groups):** `#FFFFFF` surfaces layered with dual ambient shadows:
  - `0 1px 3px rgba(0, 0, 0, 0.03)`
  - `0 8px 24px rgba(0, 0, 0, 0.04)`
  - Border: `1px solid rgba(0, 0, 0, 0.05)`
- **Level 2 (Active Sheets & Modals):** Floating bottom sheets and active selection cards:
  - `0 12px 32px -4px rgba(17, 24, 39, 0.08)`
  - Border: `1px solid rgba(0, 0, 0, 0.06)`
- **Level 3 (Floating Bars & Frosted Headers):** Glassmorphic overlays:
  - Background: `rgba(255, 255, 255, 0.82)`
  - Backdrop Blur: `20px`
  - Subtle Bottom Hairline: `0 1px 0 rgba(0, 0, 0, 0.05)`
- **Level 4 (Pressed/Spring States):** When tapped, interactive cards scale down subtly (`scale(0.985)`) with an immediate transition to `0 2px 8px rgba(0, 0, 0, 0.03)`, replicating physical haptic feedback.

## Shapes
The system relies on continuous-curvature squircles typical of iOS. 

- **Primary Cards & Containers:** Standardized with `rounded-2xl` (16px) to `rounded-3xl` (24px) for expansive hero cards and lottery banners.
- **Pills & Interactive Elements:** Action buttons, segmented track selectors, status indicators, and category filters use pure pill styling (`rounded-full` / 9999px) to communicate touch readiness.
- **Form Controls:** Text inputs and step-flow panels utilize `14px` border-radii for a modern, approachable feel that prevents boxy edges without overshooting into full pills.

## Components

### Buttons
- **Primary CTA:** Telegram Blue (`#0088CC`) solid fill, white `label-lg` typography, height `48px` or `52px`, `rounded-full`. Incorporates an active scale animation (`scale(0.97)`) using iOS spring curves (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Secondary Action:** Light surface (`#F2F4F7` or `rgba(0, 136, 204, 0.08)`), text colored with `#0088CC`, zero outer border, `rounded-full`.
- **Success / Claimed Button:** Solid Neon Lime (`#10B981`) with white text and an integrated checkmark icon.

### Segmented Controls (iOS Style)
- A light-grey capsule base container (`#E5E7EB` / `#EEF0F3`) padded with `3px`.
- Active segment is an elevated white squircle pill (`#FFFFFF`) with a delicate drop shadow (`0 2px 6px rgba(0,0,0,0.08)`).
- Smooth spring slide transition between segment switches.

### Giveaway & Lottery Ticket Cards
- Elevated `#FFFFFF` squircle base (`rounded-3xl`) with an integrated micro-perforation dashed line separating the prize showcase from the entry status.
- Left-hand or top-tier status badge using `label-sm` in a pill container (e.g., "Free Entry" in `#10B981` tint, "2h Left" in `#FF6B4A` tint).
- Bottom section features a prominent countdown indicator, total entries pill, and a clear tap trigger.

### Status Badges & Chips
- Fully rounded pills (`rounded-full`) with a soft `10%` alpha background matching the respective semantic accent (e.g., Telegram Blue text on `rgba(0, 136, 204, 0.1)`).
- Typography: `label-sm` (11px) or `label-md` (13px), uppercase or capitalized tracking.

### Form Inputs & Checkboxes
- **Inputs:** Height `48px`, background `#F2F4F7`, text `#111827`, border `1px solid transparent`. Transitions seamlessly to a white background with a `#0088CC` ring on focus.
- **Checkboxes & Toggles:** Native iOS switch format (51px × 31px green/blue active slide) and circular check triggers with smooth fill animations on completion of social entry tasks (e.g., "Joined @channel").

### Floating Bottom Bar
- Sticky iOS navigation tab bar anchored to the bottom edge with an inset safe-area margin.
- Uses the frosted glass specification (`rgba(255, 255, 255, 0.85)` + blur) with minimal dual-state iconography (outline for default, filled with `#0088CC` for active tab).