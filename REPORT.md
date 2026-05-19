# Report: React Micro Design Tool

## Problem Statement

Build a browser-based UI where users can perform basic graphic object modification — move, resize, rotate, and recolor shapes — using React. The scope is a “micro design tool”: more capable than a static page, far simpler than Figma. Key constraints: React + browser-native rendering (no canvas libraries), clean state management, intentional UX.

## Methodology

### Technology Choices

**React 18 + Vite** — minimal setup overhead, fast HMR.

**SVG over Canvas API** — declarative, integrates naturally with React’s VDOM. Shapes are DOM nodes; no hit-testing math needed. Rotation maps directly to SVG `transform` attributes.

**No external state library** — a single `useShapes` hook with `useState` is sufficient. The shape list is small; mutations are targeted per-ID.

### Architecture

See `docs/architecture.md` for the full component diagram, state model, drag flow, and resize math.

```
App
├── Toolbar              — tool selection, keyboard shortcut labels
├── Canvas (SVG)         — all pointer event handling
│   ├── ShapeRenderer    — per-shape SVG primitives
│   └── SelectionHandles — 8 resize squares + rotation circle
└── PropertiesPanel      — numeric inputs, color pickers, layer controls
```

### Implementation Phases

The code was built incrementally in 9 phases matching `docs/plan.md`:

1. Vite + React scaffold
2. Shape state hook + geometry utilities
3. SVG shape rendering
4. Select + drag-to-move (window-level listeners)
5. Resize (8 handles, rotation-aware unrotate math)
6. Rotate (circular handle, atan2 angle, 0–360 wrap)
7. Properties panel (all controls)
8. Toolbar + keyboard shortcuts
9. Grid, header status bar, shortcut hints

## Evaluation Dataset

Not applicable — this is an interactive UI, not a model or algorithm.

## Evaluation Methods

Structured manual testing across 10 scenario groups. Full test matrix in `docs/validation.md`.

## Experimental Results

All scenarios in `docs/validation.md` pass in Chrome 120, Firefox 121, and Safari 17. No frame drops observed during drag with 20+ shapes. Documented edge cases (text bbox, resize drift at steep rotation) behave as expected and do not corrupt state.
