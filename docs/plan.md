# Implementation Plan

## Goal

Build a browser-based micro design tool in React where users can add, move, resize, rotate, and recolor basic graphic shapes. Scope is deliberately limited: real interactions must work correctly, no fantasy features.

## Scope Decision

| In scope | Out of scope |
|----------|---------------|
| 4 shape types (rect, ellipse, triangle, text) | Bezier paths, freehand drawing |
| Move, resize (8 handles), rotate, recolor | Multi-select, group operations |
| Opacity, stroke, layer order | Snap-to-grid, alignment guides |
| Keyboard shortcuts | Undo/redo history |
| Properties panel with numeric inputs | Zoom/pan |
| Delete, bring-to-front/send-to-back | Export (SVG, PNG) |

## Implementation Steps

### Phase 1 — Project scaffold
- Vite + React 18 project (`npm create vite`)
- Minimal CSS reset, dark theme
- Empty canvas renders full-height SVG

### Phase 2 — Shape state
- `useShapes` hook: `shapes[]`, `selectedId`, CRUD operations
- Shape schema: `{ id, type, x, y, width, height, fill, stroke, strokeWidth, opacity, rotation }`
- Pre-populate 5 sample shapes so the canvas is not blank on first load

### Phase 3 — Rendering
- `ShapeRenderer` maps `type` → SVG primitive (`<rect>`, `<ellipse>`, `<polygon>`, `<text>`)
- Rotation applied via SVG `transform="rotate(θ, cx, cy)"` on a wrapping `<g>`
- Text shape uses an invisible `<rect>` hit-target over the bounding box

### Phase 4 — Selection & move
- Click a shape → `onSelect(id)`, renders `SelectionHandles` overlay
- `mousedown` on shape stores `{ type:'move', origX, origY, startX, startY }` in `dragRef`
- `mousemove` on `window` reads ref and calls `updateShape`
- `mouseup` on `window` clears ref
- Using `window` (not SVG) for move/up so drag continues when cursor leaves canvas

### Phase 5 — Resize
- 8 handles at corners and edge midpoints
- `mousedown` on handle stores `{ type:'resize', handle, orig, startX, startY }`
- On `mousemove`: unrotate both current point and start point around original center, compute `localDelta`, apply to appropriate edges based on handle ID
- Minimum size 20 px enforced

### Phase 6 — Rotate
- Circular handle 30 px above the top edge of the bounding box
- `mousedown` stores `{ type:'rotate', cx, cy, startAngle, origRotation }`
- On `mousemove`: `angle = atan2(pt - center)`, `rotation = origRotation + (angle - startAngle)`

### Phase 7 — Properties panel
- Numeric inputs for X, Y, W, H, Rotation
- Color pickers (native `<input type="color">`) + hex text fields for Fill and Stroke
- Checkbox to enable/disable stroke
- Range slider for Opacity
- Text content input + Font Size (text shapes only)
- Bring to Front / Send to Back buttons
- Delete button

### Phase 8 — Toolbar & shortcuts
- 5-button vertical toolbar: Select, Rect, Ellipse, Triangle, Text
- Keyboard shortcuts: V / R / E / T / X for tools; Delete/Backspace to remove; Esc to deselect
- Adding a shape switches tool back to Select so next click doesn't add another shape

### Phase 9 — Polish
- Grid background (SVG `<pattern>`)
- Dark navy color scheme throughout
- Header status bar: object count + selected type
- Shortcut hint bar in header

## File Layout

```
src/
  main.jsx
  index.css
  App.jsx
  store/
    useShapes.js
  components/
    Toolbar.jsx
    Canvas.jsx
    ShapeRenderer.jsx
    SelectionHandles.jsx
    PropertiesPanel.jsx
  utils/
    geometry.js
```

## Risk Register

| Risk | Mitigation |
|------|------------|
| Resize with rotation is mathematically tricky | Unrotate mouse delta into local space; document drift limitation |
| Text has no inherent SVG bounding box | Use explicit width/height on the shape; invisible hit-rect for drag |
| Drag breaking when mouse leaves SVG | Attach `mousemove`/`mouseup` to `window` via `useEffect` |
| `useCallback` stale closure on drag handlers | Capture all needed values into `dragRef` on `mousedown`; only `onUpdate` in dep array |
