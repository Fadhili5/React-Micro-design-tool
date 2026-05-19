# Architecture

## Overview

A single-page React app with no backend. All state lives in memory; nothing is persisted between sessions.

```
┌─────────────────────────────────────────────┐
│                    App                        │
│  ┌───────┐  ┌──────────────┐  ┌──────────────┐  │
│  │Toolbar│  │    Canvas     │  │  Properties  │  │
│  │       │  │  (SVG host)  │  │    Panel     │  │
│  └───────┘  │ ┌────────┐ │  └──────────────┘  │
│           │ │ShapeRend│ │                     │
│           │ └────────┘ │                     │
│           │ ┌────────┐ │                     │
│           │ │Selection│ │                     │
│           │ │ Handles │ │                     │
│           │ └────────┘ │                     │
│           └──────────────┘                     │
└─────────────────────────────────────────────┘
                         ↑
                    useShapes (hook)
                    useState([shapes])
                    useState(selectedId)
```

## State Model

Single source of truth: a flat array of shape objects in `useShapes`.

```ts
type Shape = {
  id:          string
  type:        'rect' | 'circle' | 'triangle' | 'text'
  x:           number   // left edge of bounding box, SVG units
  y:           number   // top edge of bounding box, SVG units
  width:       number
  height:      number
  fill:        string   // CSS color or 'none'
  stroke:      string   // CSS color or 'none'
  strokeWidth: number
  opacity:     number   // 0–1
  rotation:    number   // degrees, 0–360
  // text only:
  text?:       string
  fontSize?:   number
}
```

No normalisation, no selector memoisation — the list is small (tens of shapes max) and every shape is re-rendered on any state change anyway because React diffs the SVG VDOM cheaply.

## Component Responsibilities

### `App`
- Owns `tool` state (current drawing tool)
- Renders the three-column layout (toolbar / canvas / panel)
- Registers keyboard shortcuts via `useEffect`
- Bridges `useShapes` to child components

### `useShapes` (hook)
- `shapes[]` and `selectedId` via `useState`
- Exposes: `addShape`, `updateShape`, `deleteShape`, `bringToFront`, `sendToBack`, `selectShape`, `clearSelection`
- Derives `selectedShape` as `shapes.find(s => s.id === selectedId)`

### `Canvas`
- Renders the SVG viewport (fills its flex cell)
- Owns `dragRef` — a `useRef` (not state) storing the active drag operation
- Registers `mousemove` / `mouseup` on `window` via `useEffect` so drag works outside the SVG
- Delegates shape rendering to `ShapeRenderer` and handle rendering to `SelectionHandles`
- `handleCanvasMouseDown`: deselect (select tool) or place new shape (shape tool)
- `handleShapeMouseDown`: select + start move drag
- `handleResizeStart`: start resize drag from a handle
- `handleRotateStart`: start rotate drag from the rotation handle

### `ShapeRenderer`
- Pure render: maps shape data to SVG primitives
- Wraps everything in a `<g transform="rotate(...)">` for rotation
- Text shape renders an invisible `<rect>` hit-target over the bounding box

### `SelectionHandles`
- Renders the dashed selection outline, 8 resize handles, rotation stem and circle
- Handles have `pointerEvents: all`; the group has `pointerEvents: none`
- Calls `onResizeStart(e, handleId)` or `onRotateStart(e)` via props

### `Toolbar`
- 5 icon buttons, active state styled via `tool === id`
- No business logic; delegates to `onToolChange`

### `PropertiesPanel`
- Reads selected shape from props; renders nothing meaningful if `shape` is null
- Each control calls `onUpdate(shape.id, { key: newValue })` directly
- Stroke enable/disable checkbox avoids exposing the `'none'` string to the color picker

## Drag Interaction Flow

```
mousedown (shape)      → Canvas.handleShapeMouseDown
  → onSelect(id)
  → dragRef.current = { type:'move', origX, origY, startX, startY, id }

mousemove (window)     → Canvas.handleMouseMove
  → reads dragRef.current
  → calls onUpdate(id, { x: origX + dx, y: origY + dy })
  → React re-renders ShapeRenderer with new coords

mouseup (window)       → dragRef.current = null
```

Same pattern for `resize` and `rotate`; only the payload in `dragRef` and the update math differ.

## Resize Math

For a shape rotated by angle `θ` with original bounding box `orig`:

```
// Both points unrotated around the original center
localPt    = unrotate(currentMousePt,  origCenter, θ)
localStart = unrotate(dragStartPt,     origCenter, θ)
dx = localPt.x - localStart.x
dy = localPt.y - localStart.y

// Apply per handle ('n','s','e','w' components)
if handle has 'e': width  = max(20, orig.width  + dx)
if handle has 's': height = max(20, orig.height + dy)
if handle has 'w': width  = max(20, orig.width  - dx); x = orig.x + orig.width - width
if handle has 'n': height = max(20, orig.height - dy); y = orig.y + orig.height - height
```

Unrotation uses the standard 2D rotation matrix applied at `-θ`.

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| SVG over Canvas API | Declarative; shapes are DOM nodes; no hit-testing needed; transforms map directly to SVG attributes |
| `useRef` for drag state | Avoids re-renders on every `mousemove`; drag state is ephemeral and doesn't need to be reflected in the VDOM until `onUpdate` is called |
| `window` listeners for drag | Prevents drag breaking when cursor leaves the SVG element |
| Flat shape array, no normalisation | List is small; lookup by ID is O(n) but n < 100; premature optimisation would hurt readability |
| No undo/redo | Would require a history stack and command pattern; out of scope for the time budget |
| No zoom/pan | Would require a viewport transform and coordinate mapping on every interaction; deferred to keep scope manageable |
