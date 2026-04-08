# Design Brief — Hacker's Pendrive

## Overview
Dark, industrial e-commerce platform for a cybersecurity/hacking tools USB drive. Neon green accents on deep black background. Professional edge for security professionals.

## Visual Direction & Tone
Industrial/utilitarian + cyberpunk edge. Bold geometric typography. High contrast, technically credible aesthetic without cartoonish flair.

## Color Palette (Dark Mode Primary)

| Token | OKLCH | Purpose |
|---|---|---|
| background | 0.10 0 0 | Deep black, primary surface |
| foreground | 0.95 0 0 | Near-white text, high contrast |
| primary/accent | 0.70 0.18 142 | Neon green, calls-to-action, highlights |
| secondary | 0.22 0 0 | Dark slate, subtle card surfaces |
| muted | 0.20 0 0 | Muted backgrounds, less emphasis |
| destructive | 0.65 0.22 22 | Red warnings/errors |
| border | 0.18 0 0 | Subtle dark borders |

## Typography

| Layer | Font | Usage |
|---|---|---|
| Display | Bricolage Grotesque | Headlines, hero text, bold CTAs |
| Body | DM Sans | Product descriptions, UI labels, form text |
| Mono | Geist Mono | Code snippets, technical specs, pricing |

## Shape Language & Elevation
- Primary radii: 0.5rem (8px) — industrial, minimal curves
- Corners: Prefer sharp angles; curves for buttons only
- Shadows: Elevated (0 10px 40px rgba 0.4) for card lift; glow shadows (accent box-shadow) on interactive elements
- Depth: Layered surfaces with explicit borders and background shifts

## Structural Zones

| Zone | Background | Border | Purpose |
|---|---|---|---|
| Header | 0.15 0 0 (dark card) | bottom: 2px solid accent | Logo, nav, sticky |
| Hero | 0.10 0 0 (background) | none | Product title, value prop, image |
| Product Grid | 0.15 0 0 (card surfaces) | 1px border accent (hover) | Category showcase, lift on hover |
| CTA Buttons | 0.70 0.18 142 (accent) | none | Green foreground on black, glow-accent |
| Footer | 0.15 0 0 (dark card) | top: 2px solid muted | Links, contact, legal |

## Component Patterns & Interactions
- Buttons: Neon green on black, text-white, hover glow-accent, cursor pointer
- Cards: Dark surface + subtle border, hover: lift + glow-accent shadow
- Forms: Dark input fields, accent focus ring, placeholder text muted
- Links: Green (accent), underline hover, smooth transition
- CTA emphasis: Text glow effect for hero headlines, pulse-glow animation on primary CTAs

## Motion & Animation
- Default transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1) for all interactive state changes
- pulse-glow: 2s loop on hover for primary CTAs (box-shadow oscillation)
- No bounce/spring animations; smooth, linear easing for professional feel

## Constraints & Signature Detail
- No generic UI defaults; all colors token-driven
- Green accent sparingly — primary CTAs, hover states, borders on premium zones
- Geometric, high-contrast typography for credibility
- Subtle glow effects on interactive elements (not overdone; restraint over flash)

## Spacing & Density
- Base unit: 0.5rem (8px); scale 1x, 2x, 3x, 4x for rhythm
- Content: generous padding (24–32px) for premium feel
- Grid: 2 cols (mobile), 3 cols (tablet), 4 cols (desktop)
