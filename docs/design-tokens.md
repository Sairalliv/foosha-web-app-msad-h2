# Project Foosha — Design Tokens & Component Reference

A style-guide summary of the visual system used across the landing page, donor app, recipient app, admin console, and analytics mockups. Use this as a spec for rebuilding in Figma (native components) or as a checklist when reviewing an html.to.design import.

---

## 1. Color

### Base
| Token | Hex | Use |
|---|---|---|
| `bg` | `#132420` | Primary app background (dark mangrove green) |
| `bg-deep` | `#0D1A17` | Sidebar, recessed surfaces, chart backgrounds |
| `bg-panel` | `#18302A` | Cards, panels, form fields sit one step up from `bg` |
| `paper` | `#F4ECD8` | Ticket stubs, receipt-style cards, light-mode surfaces |
| `paper-dim` | `#E6DCC2` | Secondary text on dark backgrounds |
| `line` | `rgba(244,236,216,0.14)` | Borders, dividers on dark surfaces |

### Ink (text on `paper`)
| Token | Hex | Use |
|---|---|---|
| `ink` | `#1C2A22` | Primary text on paper/light surfaces |
| `ink-soft` | `#4A5750` | Secondary text on paper |

### Accent
| Token | Hex | Use |
|---|---|---|
| `kalamansi` | `#C7D94D` | Primary accent — links, active states, positive deltas, donor-role tint |
| `jeepney` | `#E8542F` | Primary CTA buttons, urgent stats, recipient-role tint |
| `jeepney-dark` | `#C1421F` | CTA hover state |
| `teal` (muted) | `#8FB8A8` | Confirmed/success states, admin-role tint |

### Status colors (derived, used at ~15–18% opacity as chip backgrounds)
| State | Text color | Background |
|---|---|---|
| Pending / awaiting | `#FF8A63` | `rgba(232,84,47,0.18)` |
| Matched / in progress | `kalamansi` | `rgba(199,217,77,0.18)` |
| Confirmed / done | `teal` | `rgba(143,184,168,0.18)` |

**Role color coding** (used consistently across sidebars/badges): Donor = kalamansi, Recipient = jeepney, Admin = teal.

---

## 2. Typography

| Role | Font | Weights used |
|---|---|---|
| Display / headlines | **Fraunces** (serif, optical size 9–144) | 700, 800, 900; italic 500 for emphasis words |
| Body / UI text | **IBM Plex Sans** | 400, 500, 600, 700 |
| Mono / data / codes | **IBM Plex Mono** | 400, 500, 600 |

Google Fonts import used in all files:
```
family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,500
family=IBM+Plex+Sans:wght@400;500;600;700
family=IBM+Plex+Mono:wght@400;500;600
```

### Scale (approximate, as used)
| Element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Hero H1 | Fraunces | 38–64px (clamp) | 900 | letter-spacing -0.01em, line-height 1.04 |
| Section H2 | Fraunces | 28–42px (clamp) | 700 | line-height 1.1 |
| Panel H3 | Fraunces | 17–23px | 700 | |
| Stat number | Fraunces | 28–34px | 800 | color: kalamansi (or jeepney if urgent) |
| Body / paragraph | IBM Plex Sans | 14.5–18px | 400 | color: paper-dim on dark |
| Eyebrow label | IBM Plex Mono | 11–13px | 400–500 | uppercase, letter-spacing 0.12–0.14em |
| Ticket code | IBM Plex Mono | 20px | 600 | letter-spacing 0.28em |
| Status chip | IBM Plex Mono | 10.5–11px | 400 | uppercase, letter-spacing 0.03em |

---

## 3. Spacing & shape

- **Border radius**: 3–4px (buttons), 6–8px (form fields, small cards), 10–14px (panels, main cards), full pill (chips, badges, avatars-square uses 8px)
- **Panel padding**: 24–32px
- **Card gap in grids**: 16–24px
- **Section vertical padding** (landing page): 88–100px
- **Sidebar width**: 240px fixed
- **Content max-width**: 1080–1180px

---

## 4. Core components

### Ticket / Match stub (signature element)
The recurring motif tying the whole trust mechanic together. A `paper`-colored card with:
- Rounded corners (6–14px), drop shadow, slight rotation (±2–2.5°) on marketing contexts
- Two semicircle "notches" cut into the left/right edges (perforated-ticket effect) via pseudo-elements colored to match the page background
- Dashed divider (`2px dashed rgba(28,42,34,0.25)`) separating header from body
- A rubber-stamp-style label (border, rotated -6°, bold, colored jeepney-dark or teal depending on state: "PICKUP READY" / "CONFIRMED")
- Mono-font code block on a dark inset background, letter-spaced

### Buttons
- **Primary**: `jeepney` fill, `paper` text, 6px radius, hover → `jeepney-dark` + translateY(-1px)
- **Ghost**: transparent, 1.5px `line` border, hover → border brightens to `paper`
- All buttons: IBM Plex Sans 600, 14–15px

### Status chip
Pill-shaped, mono font, 10.5px, uppercase-ish casing, colored per status table above.

### Sidebar navigation (app screens)
- Fixed 240px, `bg-deep` background
- Grouped by section with mono uppercase group labels
- Active item: `kalamansi` text on `rgba(199,217,77,0.12)` background, 7px radius
- Mini profile block pinned to bottom with square 8px-radius avatar

### Badges (gamification)
Pill shape, mono font 10.5px; earned = `kalamansi` fill / `bg-deep` text; locked/unearned = low-opacity paper fill, dimmed text.

### Form fields
`bg-deep` fill, 1px `line` border, 7px radius, 12–14px padding, focus state = 2px `kalamansi` outline with border turning transparent.

### Charts (analytics)
Built as raw SVG, no charting library:
- Line chart: 2px stroke, one line per series (jeepney / kalamansi), 3.5px endpoint dot
- Donut: stroke-based circle segments, 18px stroke width, center label in Fraunces 800
- Horizontal bar: 8–10px track on `bg-deep`, gradient fill (kalamansi→#A9C23E for positive, jeepney→jeepney-dark for negative/urgent)

---

## 5. Texture / background detail

Dark backgrounds use a very subtle 45°/-45° crosshatch texture (`repeating-linear-gradient`, ~2.5% opacity paper-colored lines, 14px spacing) — a woven-mat reference, meant to be barely perceptible, not a visible pattern.

---

## 6. Notes for Figma rebuild

- Set up **color styles** for all tokens in section 1 first — everything else references them.
- Set up **text styles** for the ~8 scale entries in section 2 rather than one-off sizes.
- Build the **ticket stub** as a proper component with variants for state (`pending` / `confirmed`) — it's reused on the landing page, trust section, and recipient confirm-pickup screen.
- Build **status chip**, **badge**, **stat card**, and **sidebar nav item** as components with variants — they repeat across every screen.
- Fraunces and IBM Plex (Sans + Mono) are all on Google Fonts, so they're available directly in Figma's font picker — no need to install manually.
