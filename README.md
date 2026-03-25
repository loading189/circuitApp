# Virtual Electronics Lab

Virtual Electronics Lab is a **local-first desktop electronics learning workbench** that now combines a premium dark instrument UI, deterministic simulation insight, and an integrated OpenAI-powered tutor through a secure local bridge.

## Product layout (current)

The app is organized as a four-region workstation:

1. **Left visual component library** with category-grouped part tiles and tactile micro-interactions.
2. **Center breadboard workbench** (SVG) with zoom/pan, placement, selection, and simulation-aware visual energy.
3. **Floating circuit postcard** that stays visible as a concise lesson/build anchor.
4. **Right intelligence rail** with tabs for Tutor, Explain, Diagnostics, and Instruments.

This design prioritizes “precision workstation” feel: restrained electric accents, strong contrast hierarchy, and compact desktop ergonomics.

## Design-system overview

A tokenized dark-electric theme lives in CSS variables and Tailwind extensions:

- layered backgrounds (`--bg-base`, `--bg-panel`, `--bg-elevated`)
- semantic text and border scales
- accent/glow/shadow tokens (`--accent-primary`, `--glow-subtle`, `--shadow-elevation`)
- badge semantics for warning/error/info

Key shell styles and reusable classes are defined in `src/styles/index.css`.

## Learning postcard system

The postcard is content-driven and designed to be deterministic and concise.

Data model (`src/features/learning/postcardTypes.ts`) includes:

- identity, title, concept, summary, build notes
- observe points and common mistakes
- progress state and quick actions

The floating UI supports compact, expanded, and minimized states through:

- `CircuitPostcard.tsx`
- `CircuitPostcardCompact.tsx`
- `CircuitPostcardExpanded.tsx`

## Intelligence rail

The right rail (`IntelligenceRail.tsx`) provides four focused tabs:

- **Tutor**: OpenAI-backed contextual tutoring
- **Explain**: deterministic selection explanation engine
- **Diagnostics**: severity-tagged, clickable findings
- **Instruments**: node voltage, supply current, and trend surface

## OpenAI tutor architecture (secure local bridge)

### Security model

- The OpenAI key is **never** read in React/frontend code.
- The frontend sends structured tutor context to a **Tauri command bridge**.
- The bridge reads `OPENAI_API_KEY` from local environment and calls the OpenAI Responses API.

### Frontend tutor stack

- `src/features/tutor/tutorTypes.ts`: payload + message contracts
- `src/features/tutor/tutorContextAdapter.ts`: structured context assembly from app stores
- `src/features/tutor/tutorStore.ts`: conversation state + toggles
- `src/features/tutor/tutorTransport.ts`: Tauri invoke transport (`ask_tutor`)

### Backend bridge

- `src-tauri/src/main.rs` defines `ask_tutor` command.
- Uses `reqwest` to call `https://api.openai.com/v1/responses`.
- Includes structured context and returns tutor text + request ID (when available).

## Structured tutor context

The tutor payload includes app-grounded fields such as:

- mode, active lesson, objectives, current step
- component inventory and selected entity
- wire summary and simulation state
- node voltages and component state summaries
- diagnostics, recent changes, probe actions
- user message and conversation continuity

This prevents free-floating chat behavior and keeps guidance tied to trusted app state.

## Deterministic Explain engine

The Explain tab is intentionally **non-AI** and runs via domain logic:

- `src/features/explanations/explainEngine.ts`

It answers:

- what selected item is
- what it does in the circuit
- current condition based on simulation/selection
- why it matters educationally


## Workbench maturity updates (wire + resistor sprint)

- Added a first-class **tool bar** inside the workbench with Select / Wire / Probe / Pan and **Reset View**.
- Added dedicated **Wire mode**: click-to-start, click-to-complete, live preview path, Escape/right-click cancel, and persistent mode for rapid consecutive wiring.
- Wires are first-class project entities with id, start/end holes, color, style, and routing-ready metadata.
- Added compact wire color picking (red, black, yellow, blue, green, orange, white) in the toolbar and inspector.
- Added wire selection + deletion (click to select, Delete/Backspace to remove).
- Expanded resistor editing with common preset values, custom value parsing (`220`, `2.2k`, `1M`), and quick educational band-code display.
- Improved inspector coverage for both selected components and selected wires.
- Added label-density behavior so labels collapse when zoomed out and remain readable under denser builds.
- Undo/redo was not added in this sprint; state transitions were kept action-centric in stores to support adding history next.

Interaction conventions:

- **Wire mode** remains active after each placed wire.
- **Escape** cancels in-progress wire placement.
- **Right click** cancels only an in-progress wire placement.
- **Pan mode** (or middle mouse drag) pans the viewport.

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+
- Rust toolchain (for Tauri)

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

### Configure OpenAI tutor (local)

Set your key in your shell before launching Tauri:

```bash
export OPENAI_API_KEY="your_key_here"
npm run tauri dev
```

If the key is missing, the tutor gracefully reports bridge configuration failure while Explain/Diagnostics remain available.

### Build and test

```bash
npm run build
npm run test
npm run lint
```

## Component encyclopedia platform architecture

The component system is now registry-driven so library browse, inspector editing, previews, tutor context, and explain metadata all share a single contract.

### Core files

- `src/features/components/componentTypes.ts`
  - Defines the typed `ComponentDefinition` contract.
  - Includes simulation support tiers (`full | partial | reference`), categories, placement metadata, learning metadata, and preview preferences.
  - Hosts the expanded component definition list (existing + next-wave additions).
- `src/features/components/componentRegistry.ts`
  - Central lookup/filter APIs by type, category, and support tier.
- `src/features/components/componentSearch.ts`
  - Tokenized encyclopedia search over names, aliases, tags, uses, and tutor vocabulary.
- `src/features/components/componentPreviewRegistry.ts`
  - Family-aware preview resolution with guarded status outcomes:
    - `mapped`
    - `missing`
    - `invalid`
    - `unsupported`

### Taxonomy and support tiers

Categories include:

- Power
- Passive
- Diodes & Light
- Transistors
- Integrated Circuits
- Switches & Controls
- Sensors
- Output Devices
- Timing & Analog
- Digital Logic
- Utility / Protection
- Breadboard Helpers

Support tiers:

- **full**: place/edit/simulate/explain ready
- **partial**: place/edit with simplified behavior support
- **reference**: encyclopedia + preview/learning oriented placeholders

### Preview mapping strategy

Preview resolution is definition-driven. Every component has a preview family and preferred kind. The resolver safely falls back to 2D when a 3D model is unavailable or invalid and never throws UI-breaking errors.

### Encyclopedia browser behavior

The left library now supports:

- search (name/alias/function/tags)
- category filter
- support-tier filter
- beginner-friendly filter
- detail panel showing learning metadata, pins, support tier, and quick add action

### Adding new components consistently

1. Add a new entry to `COMPONENT_DEFINITIONS` with full metadata.
2. Include terminals, defaults, editable property schema, and learning copy.
3. Assign a preview family and preferred kind.
4. The component automatically participates in library search/filter, inspector metadata, explain/tutor context, and preview resolution.

## Lesson-driven workbook architecture (new)

The lab now ships a first-class lesson domain under `src/features/lessons/`.

### Lesson model and registry

- `lessonTypes.ts` defines a strongly typed lesson contract:
  - lesson metadata, difficulty, component requirements, steps, observations, break experiments, checkpoints, tutor hints.
- `lessonRegistry.ts` registers the first six foundation "verses":
  1. Closed loop / complete circuit
  2. LED current limiting
  3. Voltage divider
  4. RC charging
  5. Diode direction / forward bias
  6. Transistor switch
- Lessons are content-driven files in `src/features/lessons/content/foundations/`.

### Lesson state and progress

- `lessonStore.ts` tracks:
  - active lesson
  - active step
  - postcard state (compact/expanded/minimized/completed)
  - postcard drag position + pin state
  - component-library lesson filter mode (`full | lesson | required`)
- `lessonProgress.ts` evaluates lightweight checkpoints from topology/interaction state.
- `lessonContextAdapter.ts` exposes normalized context for Tutor, Explain, Diagnostics, and Instruments.

## Postcard behavior

The lesson postcard is now a movable lesson surface (`CircuitPostcard.tsx`):

- draggable (unless pinned)
- pinnable
- minimizable/expandable
- step-aware navigation
- progress/checkpoint visibility
- quick actions:
  - next/previous step
  - ask tutor
  - show required parts only
  - highlight lesson components
  - reset lesson board state

## Lesson-filtered component workflow

`ComponentLibrary.tsx` now supports lesson-aware filtering:

- full library
- lesson components
- required-only

Each listed component can show lesson status (`required`/`optional`) and placed count during an active lesson.

## Flow visualization design

Flow is implemented as a toggleable overlay domain:

- `src/features/flow/flowVisualizationStore.ts`
- `src/features/flow/flowOverlayEngine.ts`
- `src/components/instruments/FlowOverlay.tsx`
- `src/components/instruments/FlowSettingsPanel.tsx`

Behavior:

- ON/OFF flow control
- active/inactive/blocked path rendering
- direction arrow cues for active paths
- adjustable intensity and broken-path emphasis

This first pass uses simulation voltage differentials where available and gracefully degrades when values are unknown.

## Tool/panel model

The right rail now uses a modular panel controller:

- `src/features/ui/toolPanelStore.ts`
- `src/components/layout/ToolPanelFrame.tsx`

Panels can be selected and then minimized/pinned per tool (Inspector, Tutor, Explain, Diagnostics, Instruments, Flow).

## Lesson integration with deterministic systems

- Tutor context includes active lesson, current step, expected observations, mistakes, and checkpoint progress.
- Explain panel includes lesson concept + step context.
- Diagnostics panel shows lesson-aware focus hints.
- Instruments panel surfaces lesson progress next to probe/supply data.

## Adding a new lesson

1. Create a new lesson file in `src/features/lessons/content/...` exporting a `LessonDefinition`.
2. Register it in `lessonRegistry.ts`.
3. Ensure `requiredComponents` match known component type IDs.
4. Add clear steps, observations, common mistakes, and checkpoints.
5. Optionally include focused tutor prompt hints and recommended professional tools.
