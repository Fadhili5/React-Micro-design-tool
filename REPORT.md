# Report: React Micro Design Tool

## Problem Statement

Build a browser-based UI where users can perform basic graphic object modification — move, resize, rotate, and recolor shapes — using React. The scope is a "micro design tool": more capable than a static page, far simpler than Figma. Key constraints are React + browser-native rendering (no canvas libraries), clean state management, and intentional UX.

## Methodology

### Technology Choices

**React 18 + Vite** — minimal setup overhead, fast HMR, no boilerplate.

**SVG (not Canvas API)** — SVG integrates naturally with React's declarative model. Shapes are DOM nodes, so selection and event handling work without hit-testing math. Rotation/transform maps directly to SVG attributes. No pixel buffer to manage.

**No external state library** — a single `useShapes` hook with `useState` is sufficient. The shape list is small; mutations are targeted per-ID. Adding Redux or Zustand would be over-engineering for this scope.

### Architecture

```
App
├── Toolbar              — tool selection, keyboard shortcut labels
├── Canvas (SVG)         — all pointer event handling; renders shapes and handles
│   ├── ShapeRenderer    — per-shape SVG primitives (rect/ellipse/polygon/text)
│   └── SelectionHandles — 8 resize squares + rotation circle overlay
└── PropertiesPanel      — numeric inputs, color pickers, layer controls
```

### Interaction Model

All drag state (move, resize, rotate) lives in a single `dragRef` — a React ref, not state — so mid-drag updates don't cause extra re-renders. On `mousemove`, the ref is read and `onUpdate` (setState) is called once per event, triggering one re-render per frame. Event listeners are attached to `window` via `useEffect` so dragging outside the SVG bounds still works.

### Resize With Rotation

The tricky interaction: resizing a rotated shape. Screen-space mouse deltas must be transformed into the shape's local coordinate space before being applied to width/height.

1. On `mousedown` on a handle, record the full shape state (`orig`) and the pointer position.
2. On each `mousemove`, unrotate both the current pointer and the start pointer around the original shape center:
   ```
   localDelta = unrotate(currentPt, origCenter, θ) - unrotate(startPt, origCenter, θ)
   ```
3. Apply `localDelta.x / localDelta.y` to the appropriate edges based on handle ID (e.g. `n` handle → adjust `y` and `height`).

This is an approximation: unrotating around the original center (not the evolving center) introduces minor drift for very large resizes. It is correct for typical interactions and requires no iterative solver.

## Evaluation Dataset

Not applicable — this is an interactive UI, not a model or algorithm with a measurable dataset.

## Evaluation Methods

Manual functional testing against the following scenarios:

1. Add each shape type → appears centered on click point
2. Drag to move → smooth, no jitter, no snapping artifacts
3. Resize from each of the 8 handles at 0°, 45°, and 90° rotation → correct edge anchoring
4. Rotate via circular handle → pivots around shape center
5. Properties panel changes (color, opacity, stroke, font size, X/Y/W/H) → immediate visual feedback
6. Keyboard shortcuts (V/R/E/T/X/Delete/Esc) → correct tool or action triggered
7. Layer order (Bring to Front / Send to Back) → correct z-order in SVG
8. Delete → shape removed, selection cleared
9. Drag outside SVG boundary → drag continues without cancellation

## Experimental Results

All nine scenarios passed in Chrome 120. Known edge cases (text bounding box approximation, drift at extreme rotation) behave as documented and do not crash or corrupt state.

SVG rendering performance is adequate — no dropped frames observed during drag with 20+ shapes on screen. React's reconciliation correctly diffs only the changed shape's attributes per frame.

The declarative approach (shapes as plain objects in state, rendered as SVG declaratively) made property editing trivially correct: the properties panel writes to state; the canvas re-renders from state. No synchronization logic required.
