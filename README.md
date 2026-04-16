# Fallout 1 Build Planner

**[Live Demo → https://t1742.github.io/fo-builder/](https://t1742.github.io/fo-builder/)**

A retro Pip-Boy-themed character build planner for Fallout 1. Plan your SPECIAL stats, traits, skills, and perks with live derived stat calculations.

## Features

- **S.P.E.C.I.A.L.** — Distribute 40 points across 7 attributes with segmented Pip-Boy bars
- **Traits** — Select up to 2 traits with green/amber benefit/penalty display
- **Tag Skills** — Tag 3 of 18 skills for a +20% bonus, grouped by category
- **Level Progression** — Allocate skill points level-by-level (1–21)
- **Perks** — Choose perks at milestone levels, filtered by eligibility requirements
- **Derived Stats** — Live-updating sidebar with all 13 derived statistics
- **Export/Import** — Save builds as JSON, load from file, or persist to localStorage

## Tech Stack

React + TypeScript, Vite, Tailwind CSS. All game data is static JSON — no backend required.

## Development

```bash
npm install
npm run dev
```
