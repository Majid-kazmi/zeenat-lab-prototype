# Zeenat Lab: design system

Calm, clinical and friendly. Lots of white space, short copy, one clear action per screen.

## Rules

1. **One primary button per screen.** Navy `--primary`, 52px tall. Everything else is secondary, ghost or a link.
2. **Short copy.** Headings are at most 5 words and helper text is one line. Don't add labels that only describe the UI ("Clean card", "Smart PDF").
3. **Colour means something.** Green means normal or done. Amber means fasting, waiting or "needs a look". Red is only for errors and destructive actions. Blue is for info and live states. Brand lime is used only in the logo and the confetti.
4. **Same data everywhere.** Names, prices and IDs come from `scripts/app.js` (`TESTS`, `PEOPLE`). Never invent a new value in a screen.
5. **Tokens only.** Colours, radius, spacing and motion come from `tokens.css`. If a value is missing, add a token instead of hard-coding it.

## Tokens (tokens.css)

| Group | Tokens |
|---|---|
| Brand | `--navy-800` (primary), `--navy-900`, `--blue-600` (accent), `--lime-500` |
| Text | `--ink`, `--ink-2`, `--ink-3` |
| Surfaces | `--canvas`, `--surface`, `--surface-2`, `--line`, `--line-2` |
| Status | `--ok`, `--warn`, `--alert`, `--info` (each with a `-bg`) |
| Type | Inter: display 28 / title 22 / h 17 / body 15 / sm 13 / xs 12. Numbers use tabular figures (`.num`) |
| Radius | 10 / 14 (controls) / 20 (cards) / 28 (sheets) |
| Motion | `--ease-out`, `--ease-spring`, 140 / 260 / 520 ms |

## Components (components.css)

| Component | Notes |
|---|---|
| `topbar` | Sticky, blurred. Tab roots use `topbar__heading`; inner screens use back + centred `topbar__title` (+ `small` for step) |
| `tabbar` | Rendered by app.js from `<nav data-tabbar="home">`; 5 tabs, never hand-written |
| `card` | `--flush`, `--lg`, `--tap`, `--hero`, `--soft` |
| `list` / `list-item` | Settings-style rows inside a flush card |
| `btn` | `--primary`, `--secondary`, `--ghost`, `--danger`, `--white`, `--sm`, `--block` |
| `add-btn` | Add / Added toggle bound to the cart with `data-add="id"` |
| `chip`, `segmented`, `option`, `date`, `slot` | Single-select; wrap in `data-choice` |
| `badge` | `--ok`, `--warn`, `--alert`, `--info`, `--glass`; `badge__dot--live` pulses |
| `sheet` | Bottom sheet; open with `data-sheet-open="id"`, close with `data-sheet-close` |
| `cartbar`, `action-bar` | Floating cart above the tab bar; sticky action bar on flow screens |
| `timeline`, `range`, `steps`, `notice`, `toast`, `success-mark` | |

## Motion

- **Page change:** cross-document View Transitions (fade + 10px rise). The top bar and tab bar stay in place.
- **Entrance:** children of `data-stagger` fade up one after another, 55 ms apart.
- **Press:** buttons, cards and chips scale to about 0.97.
- **Feedback:** the cart count bumps, the success tick draws itself, range markers slide in, the rider moves along the map.
- All motion turns off under `prefers-reduced-motion`.
