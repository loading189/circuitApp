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
