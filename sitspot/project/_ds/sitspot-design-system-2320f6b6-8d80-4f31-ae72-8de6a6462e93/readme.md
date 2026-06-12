# SitSpot — Design System

> Find a bench near you. See it, rate it, sit there.

SitSpot is a map-first web app that helps young people (≈14–25) discover public
benches around them. The map shows light, Tesla-style cartography; every bench is
marked by a **green + blue ring**. Tap a marker and its photo fills the ring, with
past visitors' ratings and reviews stacked right below. Users rate each spot on
**cleanliness, condition, location and overall experience**, and the app recommends
benches by intent — *pique-nique, paysage, le plus proche, le plus tranquille…*

The product is primarily in **French**. Copy examples below are French; keep that
voice in product surfaces.

---

## Sources

This system was created from a written product brief only — **no codebase, Figma
file, or existing brand assets were provided.** Everything here (logo, palette,
type, components) is an original direction designed to fit the brief. If SitSpot
has real brand assets, share them and this system should be reconciled against them.

- Fonts are loaded from the **Google Fonts CDN** (no licensed brand fonts were
  supplied) — see *Substitutions* below.
- Icons use **Lucide** (CDN) — see ICONOGRAPHY.

---

## CONTENT FUNDAMENTALS

**Language.** Product UI is in **French**; this guide is in English. Bench data,
reviews and recommendation labels are French.

**Voice.** Friendly, light, a little playful — talking to a 17-year-old, not filing
a municipal report. Encouraging and low-pressure. Never corporate, never stiff.

**Person.** Address the user directly as **tu** (informal), not *vous*.
- ✅ « Trouve un banc tranquille près de toi »
- ❌ « Veuillez sélectionner un emplacement »

**Casing.** Sentence case everywhere — buttons, titles, labels. Never Title Case,
never ALL CAPS except tiny eyebrow/overline labels (tracked out).

**Tone of specific copy**
- Search placeholder: « Cherche un banc… pique-nique, vue, au calme »
- Empty state: « Aucun banc par ici 🌱 Sois le premier à en ajouter un »
- CTA: « Voir les avis », « Ajouter un avis », « M'y emmener »
- Rating prompt: « Comment était ce spot ? »
- Confirmation: « Merci ! Ton avis aide les autres à mieux s'asseoir 🙌 »

**Numbers & ratings.** Ratings are out of 5, shown as gold stars + a numeral
(`4,3` — French decimal comma). Distances: `120 m`, `1,4 km`. Counts are plain
(`28 avis`).

**Emoji.** Used **sparingly and warmly** — one per message at most, in empty states,
confirmations and onboarding. Never inside dense UI, never in data rows or buttons
that repeat. They are seasoning, not structure.

**Length.** Short. One idea per line. Reviews can be long (user-generated) but every
piece of *system* copy is trimmed to the fewest words that still feel human.

---

## VISUAL FOUNDATIONS

**Overall vibe.** Bright, airy, uncluttered. The map is the hero; UI floats above it
as soft white cards. Think "a clean modern map app a teenager actually enjoys" —
warm light cartography, rounded shapes, two confident brand colors, lots of breathing
room. Minimalism is a rule, not an aspiration: if an element isn't earning its place,
remove it.

**Color.** Two brand colors do the heavy lifting:
- **Green `#11A269`** — primary. Available benches, primary CTAs, the "sit" energy.
- **Blue `#2477D6`** — secondary. The other half of the marker, links, info.
- The signature **marker ring** is a green→blue gradient (`--marker-ring`).
- Neutrals are **warm grey**, tuned to sit on the cream map without going cold.
- Map palette is deliberately desaturated and pale (`--map-land #F4F2EC`,
  `--map-park #DCEBCF`, `--map-water #CADFEC`) so colored UI and markers pop.
- Gold `#F5A623` is reserved exclusively for rating stars.

**Typography.**
- **Bricolage Grotesque** (700–800) for display & headlines — expressive, a bit
  characterful, tight tracking (`--tracking-tight`).
- **Plus Jakarta Sans** for all UI and body — friendly geometric sans, very legible.
- **DM Mono** only for tiny metadata: coordinates, distances, timestamps.
- Body text never below 14px in UI; tap targets never below 44px.

**Backgrounds.** No photographic page backgrounds and **no decorative gradients on
surfaces**. The only "background" is the light vector map. Cards and sheets are flat
white. Gradients appear in exactly one place: the marker ring (and its CTA glow).

**Cards.** White (`--surface-card`), generously rounded (`--radius-lg` / `--radius-xl`),
soft neutral shadow (`--shadow-md`/`lg`), hairline `--border-subtle` only when a card
sits on white (not needed over the map). No colored left-border accent stripes.

**Corner radii.** Friendly and round throughout. Pills (`--radius-full`) for buttons,
chips, search bar and avatars. Cards use 20–28px. Nothing sharp-cornered.

**Shadows / elevation.** Soft, cool-neutral, low-opacity — UI literally floats over
the map. Two elevation levels matter: resting cards (`--shadow-md`) and active /
lifted elements like the open marker or bottom sheet (`--shadow-lg`/`xl`). The
primary CTA and active marker add a tinted **green glow** (`--glow-green`).

**Borders.** Hairline `1px` `--border-subtle` for separators and inputs; `2px`
`--border-accent` for selected/focused states. Borders are quiet; elevation and
fill do most of the grouping.

**Blur & transparency.** Frosted glass (`backdrop-filter: blur(--blur-md)`) on chrome
that overlaps the map — the top search bar and floating control clusters use a
translucent white (`rgba(255,255,255,0.8)`). Solid white for content cards and sheets
so text stays crisp.

**Motion.** Quick and gentle. UI transitions `--dur-base` with `--ease-out`.
The marker "pop" (ring expands into a photo) and the bottom sheet use
`--ease-spring` for a tiny bounce. No infinite loops, no parallax. Respect
`prefers-reduced-motion`.

**Hover / press.**
- Hover: primary buttons darken one step (`--accent-hover`); ghost/secondary get a
  faint `--surface-sunken` fill; cards lift (shadow `md → lg`) and rise 1–2px.
- Press: scale down to `0.97` and drop to the darker `--accent-press`. Tactile, fast.

**Imagery.** Real user bench photos, shown inside the circular marker and as rounded
thumbnails in reviews. Warm, natural, daylight outdoor photography — no filters, no
duotone. Where no photo exists, a soft neutral placeholder with a bench icon.

**Layout rules.** The search bar is fixed top-center (max `--search-max-w`). Map
controls float bottom-right. Detail content appears in a floating panel (desktop) or
bottom sheet (mobile), max `--sheet-max-w`. Keep the map ≥60% visible at all times —
never cover the whole map with a panel.

---

## ICONOGRAPHY

No icon assets were provided, so SitSpot uses **[Lucide](https://lucide.dev)** —
clean, rounded, consistent 2px-stroke line icons that match the friendly,
uncluttered tone. Load from CDN:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```

Use `<i data-lucide="map-pin"></i>` etc. **Guidelines:**
- Stroke style only (no filled icon variants), `stroke-width: 2`, `currentColor`.
- Default size 20px in UI, 18px inline with text, 24px for primary nav actions.
- Core glyphs: `map-pin`, `search`, `sliders-horizontal`, `star`, `navigation`,
  `camera`, `image`, `heart`, `share-2`, `trees`, `sun`, `leaf`, `users`,
  `message-circle`, `plus`, `crosshair`, `x`, `chevron-left`.
- The **bench mark** in the logo is a bespoke glyph (`assets/logo-mark.svg`) — that
  is brand, not an icon; don't substitute it with a Lucide icon.

**Emoji** appear only in tone-of-voice copy (empty states, confirmations) — see
CONTENT FUNDAMENTALS. They are not part of the icon system.

> ⚠️ **Substitution flagged:** Lucide stands in for a real SitSpot icon set. If one
> exists, drop the SVGs into `assets/icons/` and update this section.

---

## Substitutions (please confirm)

1. **Fonts** — Bricolage Grotesque + Plus Jakarta Sans + DM Mono from Google Fonts,
   chosen to match the intended voice. Swap in licensed brand fonts if they exist.
2. **Icons** — Lucide (see above).
3. **Logo & color** — designed from scratch for this brief. If SitSpot has a real
   logo/palette, share it.

---

## Index / manifest

**Root**
- `styles.css` — global entry (import-only). Consumers link this.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills-compatible entry point.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`

**`assets/`** — `logo-wordmark.svg`, `logo-mark.svg`

**`guidelines/`** — foundation specimen cards (Type, Colors, Spacing, Brand) shown in
the Design System tab.

**`components/`** — reusable React primitives (see each `.prompt.md`):
- `forms/` — Button, IconButton, SearchBar, FilterChip
- `data/` — Rating, Badge, Tag, Avatar
- `surfaces/` — Card, BenchCard, MarkerBubble, ReviewItem

**`ui_kits/app/`** — high-fidelity SitSpot app recreation (map view, search/filters,
bench detail with photo + reviews, add-a-review). `index.html` is the interactive
click-through.
