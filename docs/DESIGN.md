# JobSheets — Design

JobSheets is a ledger for a job search. The design borrows from the two things people already use to track applications: a spreadsheet and an accounting ledger. Everything should feel like a well-made sheet: precise, dense, black and white, with numbers you can scan down a column.

The brief: ledger / spreadsheet feel, black and white only (status marks aside), theme follows the system.

---

## 1. Principles

1. **It's a sheet, not a dashboard.** Data lives in a grid with real gridlines, row numbers and column headers. No cards floating on a background, no shadows, no gradients.
2. **Numbers line up.** Every figure (counts, dates, days, percentages) is set in the mono face, right-aligned in its column. You should be able to compare values by scanning straight down.
3. **Structure is square; things you press are slightly rounded.** Grids, tables, panels and the heatmap have 0 radius. Buttons, inputs, selects and menus have a 3px radius so they read as controls.
4. **Ink, not colour.** The interface is black on white (or white on black). Hierarchy comes from weight, size, rules and grey ink — not colour. The only colour in the app is on the status marks.
5. **Rules carry meaning.** A thin rule separates rows. A strong rule closes a header. A double rule marks a total, as in accounting. No rule is decorative.
6. **One memorable thing: the Sheet.** The applications grid is where the identity lives. Everything else stays quiet so the grid stands out.

---

## 2. Colour

Defined as CSS variables on `:root`, redefined under `@media (prefers-color-scheme: dark)`. Components use tokens only — never hex values.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#FFFFFF` | `#000000` | Page and grid background |
| `--ink` | `#000000` | `#FFFFFF` | Primary text, strong rules, primary button |
| `--ink-2` | `#5C5C5C` | `#A3A3A3` | Secondary text, row numbers, labels (≥ 4.5:1 on paper) |
| `--rule` | `#E3E3E3` | `#2A2A2A` | Gridlines, row separators |
| `--fill` | `#F5F5F5` | `#121212` | Header row, row-number gutter, hovered row |
| `--select` | `#000000` | `#FFFFFF` | 2px cell/row selection outline and focus ring |

Status marks (the only colour; muted, readable in both themes — keep the existing `--status-*` values):

| Status | Mark | Colour token |
|---|---|---|
| Applied | open circle ○ | `--status-applied` |
| Interview | half-filled circle ◐ | `--status-interview` |
| Offer | filled circle ● | `--status-offer` |
| Rejected | cross ✕ | `--status-rejected` |

Marks are 8px inline SVGs (not font glyphs, which render inconsistently), always followed by the status word in `--ink`. Status is never conveyed by colour alone.

---

## 3. Type

Two families, clearly different jobs:

- **Instrument Sans** (variable, via Fontsource) — all words: UI, headings, body. Its width axis is used for headings.
- **Fragment Mono** (via Fontsource) — all figures: counts, dates, days, percentages, row numbers. Not used for labels or words.

Fallbacks: `"Instrument Sans", ui-sans-serif, system-ui, sans-serif` and `"Fragment Mono", ui-monospace, "SF Mono", Menlo, monospace`.

Scale (px / line-height). The app runs a dense base of 14px; the landing page uses the larger end.

| Role | Size / LH | Weight | Notes |
|---|---|---|---|
| Landing headline | 44 / 48 | 600 | `font-stretch: 85%`, tracking -0.02em |
| Page title (h1) | 24 / 30 | 600 | `font-stretch: 85%`, tracking -0.01em |
| Section title (h2) | 15 / 20 | 600 | Sentence case |
| Body / UI | 14 / 20 | 400 | |
| Table cell | 13 / 20 | 400 | Company in 500 |
| Small / secondary | 12 / 16 | 400 | `--ink-2` |
| Figures | same size as context | 400 | Fragment Mono, right-aligned in tables |
| Big figure (Overview) | 32 / 36 | 400 | Fragment Mono |

Rules:
- Sentence case everywhere. No all-caps labels, no tracked-out eyebrows above headings.
- No accented single word in headings (no one word in bold, italic or a different colour).
- Line length under 75 characters for any prose (Privacy, landing paragraphs).

---

## 4. Layout and spacing

- 4px base grid. Common steps: 4, 8, 12, 16, 24, 32, 48.
- App content max width 1200px, left-aligned with the header. Text-heavy pages (Privacy, Settings) max 640px.
- Everything is left-aligned. Numbers right-aligned inside their columns. Nothing centered except empty states.

### App shell

```
┌──────────────────────────────────────────────────────────────┐
│ JobSheets                                   Settings Sign out │  48px, rule below
├──────────────────────────────────────────────────────────────┤
│ Applications                         [Add application][Import]│  page title row
│ ┌───────┬───────┬──────────┐                                  │
│ │ Sheet │ Board │ Overview │  ← sheet tabs, attached to the    │
│ ┴───────┴───────┴──────────┴──────────────────────────────── │    grid's top rule
│ (view content)                                               │
└──────────────────────────────────────────────────────────────┘
```

View tabs look like spreadsheet sheet tabs: square, ruled on three sides, the active tab has `--paper` background and no bottom rule (it opens into the content), inactive tabs have `--fill`. They sit directly on the content's top rule.

---

## 5. The Sheet (signature component)

```
     │ Company        │ Role                    │ Status       │ Location   │      Added │    │   │
─────┼────────────────┼─────────────────────────┼──────────────┼────────────┼────────────┼────┼───┤  strong rule
   1 │ Shopify        │ Software Developer Int… │ ◐ Interview  │ Toronto    │ 2026-11-03 │ ↗  │ ⋯ │
   2 │ Wealthsimple   │ Backend Co-op           │ ○ Applied    │ Remote     │ 2026-10-28 │ ↗  │ ⋯ │
   3 │ Cohere         │ SWE Intern (Summer 27)  │ ✕ Rejected   │ —          │ 2026-10-21 │    │ ⋯ │
═════╪════════════════╧═════════════════════════╧══════════════╧════════════╧════════════╧════╧═══╡  double rule
     │ 3 applications                                                                              │  totals row
```

- **Row-number gutter** on the left: 40px wide, `--fill` background, Fragment Mono, `--ink-2`, right-aligned. Numbers follow the current sort.
- **Gridlines**: 1px `--rule` between rows and between columns. The header row has `--fill` background and a 1px `--ink` rule beneath it.
- **Header row is sticky** when the page scrolls. Column labels in sentence case, 12px, weight 500. The sorted column shows a small ▲/▼ next to its label, and clicking a header sorts by it.
- **Row height** 36px. Text truncates with an ellipsis; the full value shows in a `title` tooltip.
- **Dates** in the grid use ISO format (`2026-11-03`) in Fragment Mono: sortable-looking and scannable. Elsewhere (Overview, dialogs) use readable dates ("Nov 3, 2026").
- **Hover** a row: `--fill` background. **Selected / focused** row: 2px `--select` outline inset, like a selected range in a spreadsheet.
- **Keyboard**: ↑/↓ move the selected row, Enter opens Edit, `s` opens the status menu, Delete opens the delete confirmation. Tab still works normally.
- **Totals row** at the bottom: double 3px rule (two 1px lines with 1px gap) above it, then "{n} applications" plus counts per status, each count as its own cell with its mark — not a joined string.
- Status cell: mark + word, opens a menu on click. No pill, no background.

---

## 6. Other components

- **Buttons**: 32px tall, 3px radius, 13px weight 500. Primary = `--ink` background, `--paper` text. Secondary = 1px `--ink` border, transparent. Ghost = no border, `--ink-2` text, `--ink` on hover. No arrows appended to labels.
- **Inputs / selects / textareas**: 32px tall (textarea grows), 1px `--rule` border that becomes `--ink` on hover and a 2px `--select` ring on focus. 3px radius. Labels above, 12px weight 500.
- **Dialogs**: square (0 radius), 1px `--ink` border, no shadow, `--paper` background, a 40% `--paper`-tinted backdrop. Title 15px 600 with a rule below.
- **Menus**: 1px `--ink` border, 0 radius, items 32px tall, highlighted item is `--ink` background with `--paper` text (inverted, like a spreadsheet menu).
- **Toasts**: 1px `--ink` border, 0 radius, no shadow, bottom-right. Text says exactly what happened ("Status changed to Interview", "Application deleted").
- **Board**: columns are ruled panels (0 radius) with a `--fill` header showing the mark, status and count (Fragment Mono). Cards are white cells with a 1px `--rule` border, no shadow; the dragged card gets a 2px `--select` outline.
- **Overview**:
  - Summary is a single ledger row of four cells (Total, Active, Offers, This week) with vertical rules between them, figures in 32px Fragment Mono, label underneath in `--ink-2`, and a double rule below the row.
  - Funnel bars are solid `--ink` at 100% / 60% / 30% opacity, square ends, figures right-aligned in a column next to them.
  - Heatmap cells are square, `--ink` at five opacity steps; today's cell has a 1px `--select` outline.
  - Weekly bars are square-topped `--ink` columns; the current week is full `--ink`, earlier weeks 35%.
  - Ghosted list is a small sheet: columns Company, Role, Days (right-aligned figure), and actions. No "Company — role" strings.
- **Empty states**: centered within the grid area, one line saying what's missing and one button to fix it.

---

## 7. Motion

- None on page load. No fade-ins, no scroll reveals, no animated counters.
- Allowed, and only in response to an action: dialog/menu open (100ms opacity), the Board drop animation, the optimistic row update.
- Everything respects `prefers-reduced-motion` (no motion at all).

---

## 8. Copy

- Sentence case, plain verbs. Buttons say exactly what happens: "Add application", "Save changes", "Delete application", "Mark rejected".
- An action keeps its name through the flow: "Import 18 applications" → toast "Imported 18 applications".
- Errors say what happened and what to do: "That link has expired or was already used. Request a new one."
- No middle-dot-joined meta strings ("A · B · C"). If several facts sit together, they get their own cells or lines.
- No em-dash labels ("Company — Role"). Use separate columns or a line break.

---

## 9. Don't

- No gradients, glows, blurs, glassmorphism, animated backgrounds, cursor spotlights or text-reveal effects.
- No shadows. Depth comes from rules and inversion, never from shadows.
- No rounded cards in grids, no pill badges.
- No tinted near-black standing in for black (`#0B0B0B`, `#111`): ink is `#000` / `#FFF`.
- No colour outside the status marks. No accent colour.
- No all-caps labels, no eyebrows, no numbered section markers.
- No hard-coded colours or font sizes in components; use tokens and the scale.
- No copy-paste effect components or new UI libraries.

---

## 10. Quality floor

- Visible 2px focus ring on every interactive element.
- Contrast: text ≥ 4.5:1, rules ≥ 1.5:1 against paper (they're structure, not text).
- Works at 360px wide: the Sheet scrolls horizontally inside its container with the row-number gutter and Company column frozen; nothing else scrolls sideways.
- Dark mode is a first-class theme, not an afterthought: check every screen in both.
