# Plan: Fallout 1 Build Planner Frontend

A single-page Fallout 1 character build planner with a retro Pip-Boy terminal aesthetic, built with React + TypeScript + Tailwind CSS + Vite. All game data is static JSON (already created). Deploys to GitHub Pages + local dev.

## Decisions
- **Framework**: React 18 + TypeScript (Vite bundler)
- **Styling**: Tailwind CSS with custom Pip-Boy theme (CSS variables)
- **Aesthetic**: Retro terminal / Pip-Boy green-on-black, CRT effects, monospace fonts
- **Layout**: Single scrollable page with sticky nav anchors
- **Data**: Static JSON imports (no API, no backend)
- **Storage**: localStorage for saving/loading builds
- **Deployment**: GitHub Pages (via `gh-pages` or Vite static build) + local `npm run dev`
- **Scope V1**: Character creation (SPECIAL, traits, tags) + derived stats + level-by-level skill allocation + perk selection

## Phase 1: Project Scaffolding
1. Initialize Vite + React + TypeScript project
2. Install Tailwind CSS, configure with custom Pip-Boy theme
3. Set up path aliases (`@/data`, `@/components`, `@/hooks`, `@/types`)
4. Create TypeScript types from JSON data schemas (`Special`, `Skill`, `Trait`, `Perk`, `DerivedStat`)
5. Import existing JSON data files into `src/data/`
6. Configure GitHub Pages deployment in `vite.config.ts` (base path)

## Phase 2: Pip-Boy Theme & Layout Shell
7. Define Pip-Boy CSS theme variables:
   - Colors: `--pip-green: #18ff6d`, `--pip-dark: #0a0a0a`, `--pip-amber: #ff9d00` (for warnings), `--pip-grid: #0d2b0d`
   - Fonts: `Share Tech Mono` (primary), `VT323` (display/headers) from Google Fonts
   - CRT scanline overlay (CSS `::after` pseudo-element on body)
   - Subtle screen glow (`box-shadow` with green tint)
8. Build layout shell:
   - Sticky top bar: "VAULT-TEC BUILD PLANNER v1.0" + build name input
   - Left: Sticky vertical nav with section anchors (SPECIAL | Traits | Skills | Leveling | Perks | Summary)
   - Center: Main scrollable content area
   - Right: Sticky derived stats sidebar (always visible, updates live)
9. Add CRT screen border frame (rounded rectangle with faux Pip-Boy bezel)

## Phase 3: SPECIAL Distribution Section
10. Create `SpecialDistributor` component:
    - 7 attribute rows, each with: name, [-] button, value display, [+] button, description tooltip
    - Remaining points counter at top (starts at 5 unallocated from 40 total with 5 per stat default)
    - Visual bar for each attribute (1-10 scale, segmented like a Pip-Boy bar)
    - Keyboard support: click row, use arrow keys
    - Validation: min 1, max 10, total must be ≤ 40
11. Wire SPECIAL changes to derived stats sidebar (live recalculation)

## Phase 4: Trait Selection Section
12. Create `TraitSelector` component:
    - Grid/list of 16 traits, each showing name + benefit (green) + penalty (red/amber)
    - Click to toggle select (max 2), selected traits get highlighted border
    - Counter: "X/2 traits selected"
    - Show computed effects on SPECIAL/skills/derived stats when selected
13. Wire trait effects into derived stats + skill base calculations

## Phase 5: Skill Tagging Section
14. Create `SkillTagger` component:
    - List of 18 skills grouped by category (Combat / Active / Passive)
    - Each row: skill name, base value (computed from SPECIAL + traits), [TAG] toggle button
    - Tagged skills show "+20%" badge and highlighted state
    - Counter: "X/3 tags selected"
    - Base skill values update live as SPECIAL/traits change

## Phase 6: Level Progression & Skill Allocation
15. Create `LevelProgression` component:
    - Level selector/slider (1→21) or expandable level-by-level accordion
    - At each level: show available skill points = `5 + (IN × 2)` (adjusted by traits like Gifted: -5, Educated perk: +2/rank)
    - Skill point allocation: click skill rows to spend points
    - Running total of all 18 skills with breakdown (base + tagged + allocated)
    - Visual indicator when skill reaches notable breakpoints (50%, 75%, 100%, 150%, 200%)
16. Create `LevelSummary` sub-component showing cumulative skill points spent vs available per level

## Phase 7: Perk Selection
17. Create `PerkSelector` component:
    - Shows perk slots at levels 3, 6, 9, 12, 15, 18, 21 (or 4, 8, 12, 16, 20 with Skilled trait)
    - For each slot: dropdown/modal of eligible perks filtered by:
      - Level requirement ≤ current level
      - SPECIAL requirements met
      - Skill requirements met
    - Ineligible perks shown grayed out with unmet requirements listed
    - Multi-rank perks: show current rank / max rank
    - Selected perks' effects apply to character stats
18. Perk detail panel: on hover/click, show full description, requirements, effects, wiki notes

## Phase 8: Derived Stats Sidebar
19. Create `DerivedStatsPanel` (sticky right sidebar):
    - Always visible, updates in real-time as user changes SPECIAL/traits/perks
    - Stats: HP, AP, AC, Carry Weight, Melee Damage, DR, Poison Res, Rad Res, Sequence, Healing Rate, Critical Chance, Skill Rate, Perk Rate
    - Each stat shows computed value with formula tooltip on hover
    - Color coding: green for above-average, amber for average, red for below-average
    - Trait/perk modifiers shown as "+X" or "-X" annotations

## Phase 9: Build Summary & Export
20. Create `BuildSummary` component (bottom section):
    - Full character overview: SPECIAL, traits, tagged skills, all skills at each level, perks chosen
    - Export as JSON download button
    - Import JSON upload button
    - Copy shareable URL (encode build in URL hash/params)
    - Save to localStorage / Load from localStorage (named builds)
21. Add "New Build" / "Reset" button in top bar

## Phase 10: Polish & Deploy
22. Add page-load animation (staggered terminal boot sequence: "VAULT-TEC INDUSTRIES... LOADING...")
23. Add CRT flicker effect (subtle CSS animation)
24. Sound effects toggle (optional: keyboard clicks, Pip-Boy beeps) — stretch goal
25. Responsive: tablet support (stack sidebar below), mobile basic support
26. Configure Vite for GitHub Pages build (`base: '/fo-builder/'`)
27. Add `gh-pages` npm script or GitHub Actions workflow for deployment

## Architecture

### State Management
- `useCharacterBuild` — Central state hook managing SPECIAL values, selected traits, tagged skills, level-by-level skill allocations, and selected perks
- `useDerivedStats` — Computed derived stats from current build state (reacts to SPECIAL + trait + perk changes)
- `useSkillCalculator` — Skill totals combining base values + tag bonuses + allocated points + perk bonuses

### Data Flow
```
JSON Data (static) ──→ TypeScript Types ──→ React Components
                                              │
User Interactions ──→ useCharacterBuild ──→ useDerivedStats ──→ DerivedStatsPanel
                         │                    useSkillCalculator ──→ Skill displays
                         │
                         └──→ localStorage (save/load)
                         └──→ JSON export / URL encoding (share)
```

### Key Formulas (from data/derived-stats.json)
- **Hit Points**: `15 + (2 × EN) + ST`
- **Action Points**: `floor(AG / 2) + 5`
- **Armor Class**: `AG`
- **Carry Weight**: `(ST + 1) × 25` (or `25 + (15 × ST)` with Small Frame trait)
- **Critical Chance**: `LK %`
- **Healing Rate**: `max(floor(EN / 3), 1)`
- **Melee Damage**: `max(ST - 5, 1)`
- **Poison Resistance**: `EN × 5 %`
- **Radiation Resistance**: `EN × 2 %`
- **Sequence**: `PE × 2`
- **Skill Rate**: `(IN × 2) + 5`
- **Perk Rate**: `3` (or `4` with Skilled trait)

### Skill Base Formulas (from data/skills.json)
- Single-stat skills: `base + (multiplier × STAT)` — e.g., Small Guns = `35 + AG`
- Dual-stat skills: `base + floor((STAT1 + STAT2) / 2)` — e.g., Unarmed = `65 + floor((AG + ST) / 2)`
- Higher-multiplier skills: `base + (multiplier × STAT)` — e.g., Science = `25 + (2 × IN)`

## Existing Data Files
- `data/special.json` — 7 SPECIAL attributes with keys, descriptions, derived stat & skill links
- `data/skills.json` — 18 skills with base formulas, governing attributes, categories
- `data/traits.json` — 16 traits with structured bonus/penalty effects
- `data/perks.json` — 53 perks with level/SPECIAL/skill requirements, ranks, effects
- `data/derived-stats.json` — 13 derived stats with formulas

## Files To Create
```
src/
├── types/
│   └── index.ts                    — TypeScript interfaces for all game entities
├── data/
│   └── index.ts                    — Re-export JSON data with type assertions
├── hooks/
│   ├── useCharacterBuild.ts        — Central state (SPECIAL, traits, tags, levels, perks)
│   ├── useDerivedStats.ts          — Computed derived stats from build state
│   └── useSkillCalculator.ts       — Skill totals from all sources
├── components/
│   ├── Layout.tsx                  — Shell: top bar, left nav, center content, right sidebar
│   ├── SpecialDistributor.tsx      — SPECIAL point allocation (7 rows, bars, +/- buttons)
│   ├── TraitSelector.tsx           — Trait selection grid (max 2, green/amber effects)
│   ├── SkillTagger.tsx             — Tag 3 skills (grouped list, +20% badge)
│   ├── LevelProgression.tsx        — Level-by-level skill point spending (accordion)
│   ├── PerkSelector.tsx            — Perk selection at milestone levels (filtered eligibility)
│   ├── DerivedStatsPanel.tsx       — Sticky sidebar (live stats, formula tooltips)
│   └── BuildSummary.tsx            — Export/import/save/load/share
├── App.tsx                         — Root component, assembles all sections
├── main.tsx                        — Entry point
└── index.css                       — Tailwind directives + CRT/Pip-Boy global styles

tailwind.config.ts                  — Custom Pip-Boy theme (colors, fonts, animations)
vite.config.ts                      — Path aliases, GitHub Pages base path
index.html                          — Google Fonts links, meta tags
```

## Verification Checklist
1. `npm run dev` — app starts, loads without errors
2. SPECIAL: distribute points, verify total stays at 40, derived stats update live
3. Traits: select 2, verify stat effects apply correctly (e.g., Gifted adds +1 all SPECIAL)
4. Skills: tag 3 skills, verify +20% bonus and base values match JSON formulas
5. Leveling: allocate skill points at each level, verify totals and remaining points
6. Perks: at level 3+, verify eligible perks filter correctly based on current stats
7. Export build as JSON, re-import, verify all state restores correctly
8. `npm run build` — static build succeeds, deploy to GitHub Pages
9. Cross-check 3-5 complete builds against a known Fallout 1 calculator/wiki to verify formula accuracy

## V2 Considerations (Out of Scope for V1)
- **Undo/redo** — Undo stack for SPECIAL/skill changes
- **Build templates** — Pre-made builds (Sniper, Diplomat, Melee Tank) — design data structure in v1
- **Mobile** — Pip-Boy aesthetic works best on desktop/tablet; mobile gets simplified vertical layout
- **Karma & reputation** — Not tracked in v1
- **Companions** — Companion compatibility tracking
- **Equipment/weapon planning** — Gear loadout planner
- **Skill breakpoints** — Highlight dialogue/quest thresholds
- **Perk recommendations** — AI/heuristic perk suggestions
- **PDF export** — Printable character sheet
- **Sound effects** — Pip-Boy beeps, keyboard clicks (stretch goal)
