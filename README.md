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

Toolchain notes:

- The app expects strict TypeScript (`tsconfig.app.json`) with React JSX typings explicitly enabled (`vite/client`, `react`, `react-dom`).
- ESLint config uses flat config with `typescript-eslint` + `@eslint/js`.
- Vitest runs in `jsdom` and uses `src/test/setup.ts`.
- If your install is stale, run `npm install` again before build/lint/test.

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

## Lesson mode UX simplification standard

Lesson mode now follows a strict UI rule: **only show what advances the current step**.

### Lesson mode vs Sandbox mode

- **Lesson mode**: step-first UI, lesson parts tray, compact postcard, contextual overlays, AI-first right rail, tools hidden until needed.
- **Sandbox mode**: open exploration with full library and broad instrument access.

### Lesson-parts-first behavior

- Left rail defaults to **Lesson Parts** during lesson support modes.
- Required components are grouped and clearly marked as `Next`, `Placed`, or `Required`.
- Optional components are deferred under a collapsed section.
- A de-emphasized **Show full library** action keeps encyclopedia browsing available without dominating the flow.

### Minimal postcard default

The default postcard is now compact and step-driven:

1. current step action
2. one-sentence “why”
3. a single contextual hint (when support mode warrants it)
4. progress indicator

Expanded details (observations, break-it prompts, step map, mistakes) are now intentionally behind the expanded postcard state.

### Micro-teaching moments

- One-sentence teaching nudges can appear after step completion.
- Moments are subtle, dismissible, and auto-hide.
- This keeps teaching contextual instead of front-loading dense explanation.

### Hidden-until-needed tools

- Right rail keeps **Tutor** as the primary always-available intelligence surface.
- Secondary tools (Inspector, Explain, Diagnostics, Instruments, Flow) are on-demand and easy to hide.
- Step metadata can suggest a tool contextually without forcing persistent UI clutter.

## Lesson-driven workbook architecture

The lab now ships a first-class lesson domain under `src/features/lessons/`.

### Lesson model and registry

- `lessonTypes.ts` defines a strongly typed lesson contract:
  - lesson metadata, track hierarchy, component requirements, step schema, observations, break experiments, checkpoints, tutor hints.
  - step schema supports: action title, success condition, primary highlight target, optional secondary hint target, teaching notes, after-step tidbits, optional tool suggestion, and support-specific guidance.
- `lessonRegistry.ts` registers the first six foundation "verses" and exposes a scalable track hierarchy:
  1. Closed loop / complete circuit
  2. LED current limiting
  3. Voltage divider
  4. RC charging
  5. Diode direction / forward bias
  6. Transistor switch
- Registry includes future-ready tracks:
  - Foundations
  - Current & resistance
  - Voltage & division
  - Time & capacitance
  - Diodes & polarity
  - Transistors & switching
  - Analog building blocks
  - Digital logic
  - Measurement & debugging
  - Power & regulation
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

### LED current limiting golden-path standard (benchmark lesson)

The LED current limiting lesson (`lesson-led-current-limiter`) is now the benchmark guided experience.

Golden-path design standard implemented:

- launch modal clearly sets expectations (time, parts, outcomes, support-level behavior)
- guided steps are granular and explicit (place resistor, place LED, wire in sequence, run flow, break-it, compare)
- guided overlay targets are precise for exact holes/wire endpoints in Guided mode
- postcard emphasizes current step, success intent, observation prompts, and break-it prompts
- diagnostics/explain/tutor wording aligns around one concept: closed loop + polarity + resistor-in-series
- replay/restart resets board + flow + postcard placement/pin/step cleanly for repeated practice

How to apply this to future lessons:

1. Make lesson content step-by-step and explicit in the lesson definition file.
2. Add overlay targets only for the *next* user action (minimal simultaneous highlights).
3. Keep postcard copy structured: current step, what to observe, common mistake, break-it experiment.
4. Align diagnostics/explain/tutor language to reinforce the same concept from different angles.
5. Ensure restart returns the learner to a clean, calm default with no stale highlight/flow state.

This pattern keeps underlying logic complete while presenting a simple, confidence-building guided interface.

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

## Lesson authoring standard (for future content)

Each lesson should define, at minimum:

- concept + one clear takeaway
- build goal
- required and optional parts
- step sequence with support-aware guidance
- **one primary highlight target per step**
- optional secondary hint target
- success condition per step
- one-sentence teaching note per step
- optional after-step micro-teaching note
- optional tool suggestion
- observation moment(s)
- break-it moment(s)

This ensures future lessons stay calm, consistent, and scalable while preserving the step-driven UX model.

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

## Adaptive lesson runs (support-level sprint)

Lessons now run through a **runtime session model** that is separate from static lesson content, so one lesson definition can support multiple scaffolding levels.

### Support levels

The lesson launch flow supports:

- **Guided (Easy):** exact next step, exact placement/wiring overlays, directive postcard/tutor support.
- **Coached (Medium):** objective-driven hints with region/topology cues and less direct answers.
- **Independent (Hard):** minimal scaffolding, concept + goal + observations, learner-led diagnostics/instruments.
- **Sandbox (Free Lab):** no active lesson scaffolding; open build environment.

### Runtime session model

`src/features/lessons/lessonRunStore.ts` + `lessonRunTypes.ts` maintain per-run state:

- lesson id + support level
- current step index
- completed checkpoints
- revealed hints
- active highlighted overlay targets
- run status + start timestamp
- progress summary + retry count

This keeps runtime progress/scaffolding out of static lesson files.

### Lesson launch and replay flow

`LessonLaunchModal.tsx` lets learners choose support level before starting a lesson, with clear per-level descriptions.

Replay support includes:

- restart current lesson run
- restart as Guided / Coached / Independent
- board reset behavior coordinated with run restart

### Guided overlay system

`GuidedOverlay.tsx` renders premium on-bench support cues from typed lesson targets (`lessonTypes.ts`):

- breadboard hole highlights
- zone highlights
- wire start/end cues
- probe/node cues
- component-library next-component cues

Overlay behavior is support-aware via `lessonGuidanceEngine.ts`:

- Guided: full exact targets
- Coached: reduced exactness (focus on zone/node level cues)
- Independent/Sandbox: no intrusive exact placement overlays

### Support-aware postcard and tutor

- Postcard copy and interaction now adapts to selected support level (directive vs coaching vs challenge framing).
- Tutor context includes support-level instruction through `lessonTutorAdapter.ts` + lesson context adapter, enabling directive/coaching/Socratic behavior without hardcoding tone in random UI components.

### Authoring adaptive lessons

Lesson steps can now include:

- `supportGuidance` (`guided | coached | independent` copy variants)
- typed `overlayTargets` per step

This allows one lesson to remain maintainable while adapting scaffolding by support level.

### Tool panel emphasis defaults

Tool panel defaults now adapt by support profile (`toolPanelDefaults.ts`):

- Guided emphasizes tutor/diagnostics flow
- Coached emphasizes explain/diagnostics/instruments
- Independent emphasizes instruments/diagnostics/flow

Users can still override panel selection manually.
