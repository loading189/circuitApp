# Virtual Electronics Lab

Virtual Electronics Lab is a **local-first desktop electronics workbench** built with Tauri + React + TypeScript. It provides a tactile, breadboard-centric learning environment focused on understandable diagnostics and educational simulation rather than full SPICE complexity.

## Current Implementation Status

This repository currently delivers **Phases 1–3**:

- ✅ Phase 1: project scaffold, strict TypeScript, Tauri shell, Tailwind, Zustand, base app shell.
- ✅ Phase 2: realistic SVG breadboard geometry model, deterministic hole IDs, hover strip highlighting, zoom + pan.
- ✅ Phase 3: component library, typed component models, snap-to-hole placement, selection, rotation, and delete.

Later phases (wiring UX, complete simulation, diagnostics engine, persistence UX polish, instruments) are architected but intentionally not fully implemented yet.

## Tech Stack

- **Desktop shell:** Tauri (Rust)
- **Frontend:** React + TypeScript + Vite
- **State management:** Zustand (domain-specific stores)
- **Styling:** Tailwind CSS
- **Rendering:** SVG-first board and components
- **Testing:** Vitest

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Rust toolchain (for Tauri desktop runtime)

### Install

```bash
npm install
```

### Run web dev mode

```bash
npm run dev
```

### Run desktop app (Tauri)

```bash
npm run tauri dev
```

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

## Architecture Overview

The app is organized into domain layers to keep logic composable and testable:

- `features/board`: physical breadboard geometry, hole identity, viewport and selection interaction state.
- `features/components`: typed component inventory, creation defaults, placement operations, rendering metadata.
- `features/wiring`: wire types and future wire placement/routing seams.
- `features/circuit`: connectivity normalization via net resolution and graph formation.
- `features/simulation`: simulation store and time-step seams for future model-specific solvers.
- `features/projects`: project serialization contracts and built-in example metadata.
- `components/*`: UI shell and editor workbench presentation.

This split intentionally mirrors the required long-term architecture: visual model, connectivity model, circuit graph, simulation engine, diagnostics engine, and persistence.

## Breadboard Model Notes

The breadboard uses deterministic hole IDs such as:

- `rail-top-positive-1`
- `left-a-15`
- `right-j-15`

Connectivity assumptions in current model:

- left and right strips are separated by the center trench;
- each row of 5 holes per side is connected (`left-strip-row-N`, `right-strip-row-N`);
- each power rail is split at midpoint (common physical behavior) into left/right segments.

## Included vs Excluded (Current)

### Included now

- Polished dark shell UI with sidebars + controls.
- Interactive breadboard rendering with zoom/pan.
- Strip hover highlighting and node selection.
- MVP component palette and placement.
- Rotation + deletion interactions.
- Foundational net resolution logic with unit tests.

### Excluded for now (future phases)

- Full wire tool UX
- Circuit simulation engine for all benchmark circuits
- Diagnostics reasoning engine and board-linked errors
- Save/load dialogs + native file integration
- Full instrument readings/waveform plotting

## Simulation Simplification Plan

The final MVP will use an educational, intentional simplified solver with these goals:

- consistent behavior for beginner circuits;
- explainable diagnostics;
- discrete-time capacitor updates;
- heuristic LED/NPN state modeling;
- no full nonlinear analog convergence.

This preserves clarity and usability while remaining extensible for future SPICE-backed modes.
