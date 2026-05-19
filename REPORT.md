# Report: React Micro Design Tool

## Problem Statement

Build a browser-based UI where users can perform basic graphic object modification — move, resize, rotate, and recolor shapes — using React. The scope is a "micro design tool": more capable than a static page, far simpler than Figma. Key constraints are React + browser-native rendering (no canvas libraries), clean state management, and intentional UX.

## Methodology

### Technology Choices

**React 18 + Vite** — minimal setup overhead, fast HMR, no boilerplate.

**SVG over Canvas API** — SVG integrates naturally with React's declarative model. Shapes are DOM nodes, so selection and event handling work without hit-testing math. Rotation and transforms map directly to SVG attributes with no pixel buffer to manage.

**No external state library** — a single `useShapes` hook with `useState` is sufficient. The shape list is small; mutations are targeted per-ID.

### Architecture

See `docs/architecture.md` for the full component diagram, state model, drag interaction flow, and resize math.

```
App
├── Toolbar              — tool selection, keyboard shortcut labels
├── Canvas (SVG)         — all pointer event handling; renders shapes and handles
│   ├── ShapeRenderer    — per-shape SVG primitives (rect/ellipse/polygon/text)
│   └── SelectionHandles — 8 resize squares + rotation circle overlay
└── PropertiesPanel      — numeric inputs, color pickers, layer controls
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| SVG over Canvas API | Declarative; shapes are DOM nodes; no hit-testing needed |
| `useRef` for drag state | Avoids re-renders on every `mousemove` |
| `window` listeners for drag | Prevents drag breaking when cursor leaves SVG |
| Flat shape array | List is small; O(n) lookup is fine; no premature optimisation |
| No undo/redo | Requires command pattern + history stack; out of scope |
| No zoom/pan | Requires viewport transform and coordinate remapping; deferred |

## Evaluation Dataset

Not applicable — this is an interactive UI, not a model or algorithm with a measurable dataset.

## Evaluation Methods

Structured manual functional testing across 10 scenario groups covering add, select, move, resize (unrotated and rotated), rotate, property panel, layer order, delete, and keyboard shortcuts. See `docs/validation.md` for the full test matrix.

## Experimental Results

All scenarios in `docs/validation.md` pass in Chrome 120, Firefox 121, and Safari 17. Documented edge cases (text bbox approximation, resize drift at steep rotation) behave as expected and do not corrupt state.

SVG rendering performance is adequate — no dropped frames observed during drag with 20+ shapes on screen. React's VDOM diffing correctly updates only the changed shape's attributes per frame.
