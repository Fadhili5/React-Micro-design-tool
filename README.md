# React Micro Design Tool

A browser-based graphic editor built with React 18 and SVG. Select, move, resize, rotate, and recolor basic shapes on a shared canvas. Works on desktop and mobile.

## Getting Started

```bash
git clone https://github.com/fadhili5/react-micro-design-tool.git
cd react-micro-design-tool
npm install
npm run dev
```

Open the local URL printed by Vite (default: `http://localhost:5173`).

## Supported Object Types

### Rectangle
A basic axis-aligned rectangle with optional corner rounding. Supports all modifications.

### Ellipse
An ellipse (or circle when width equals height). Supports all modifications.

### Triangle
An isosceles triangle defined by its bounding box. The three vertices are calculated from the box dimensions, so the shape always stays in the same proportional form — you cannot drag individual vertices.

### Text
A single-line text label. Position, size, rotation, fill, opacity, and layer order all work. Stroke is not supported on text. The width and height fields control the invisible bounding box used for hit-testing and handles — they do not auto-fit the text content, so you may need to adjust them manually.

## Modifications by Object Type

| Modification | Rectangle | Ellipse | Triangle | Text |
|---|---|---|---|---|
| Move | yes | yes | yes | yes |
| Resize (8 handles) | yes | yes | yes | yes |
| Rotate | yes | yes | yes | yes |
| Fill color | yes | yes | yes | yes |
| Stroke color and width | yes | yes | yes | no |
| Opacity | yes | yes | yes | yes |
| Layer order | yes | yes | yes | yes |
| Text content | no | no | no | yes |
| Font size | no | no | no | yes |

Notes:
- **Triangle resize** scales the bounding box. The vertex positions are derived from the box, so the proportional shape stays fixed.
- **Text resize** moves the hit-target rectangle and handle positions. It does not reflow or clip the text — if the visible text is wider than the W value, the handles will not line up with the text edges.

## Controls

### Desktop

| Action | Input |
|--------|-------|
| Select tool | Click toolbar or press `V` |
| Rectangle | `R` or toolbar |
| Ellipse | `E` or toolbar |
| Triangle | `T` or toolbar |
| Text | `X` or toolbar |
| Move shape | Drag |
| Resize | Drag any of the 8 square handles |
| Rotate | Drag the circular handle above the shape |
| Delete | `Delete` / `Backspace`, or the panel button |
| Deselect | Click empty canvas or `Esc` |

### Mobile

The layout switches to a full-screen canvas with a floating toolbar at the bottom and a slide-up properties drawer when a shape is selected.

| Action | Input |
|--------|-------|
| Add shape | Tap a tool button in the bottom toolbar |
| Select | Tap a shape |
| Move | One-finger drag |
| Resize / Rotate | One-finger drag on a handle |
| Edit properties | Tap a shape to open the properties drawer |
| Delete | Tap Delete in the properties drawer |
| Deselect | Tap empty canvas or tap Done in the header |

## Build

```bash
npm run build    # production build, output in dist/
npm run preview  # serve the production build locally
```

## Deployment

Deploy the `dist/` folder to any static host. On Vercel:
- Framework: Vite
- Root directory: leave blank (project root)
- Build command: `npm run build`
- Output directory: `dist`

## Browser Support

| Platform | Version | Notes |
|----------|---------|-------|
| Chrome (desktop) | 120+ | Full support |
| Firefox (desktop) | 121+ | Full support |
| Safari (desktop) | 17+ | Full support |
| Chrome (Android) | 120+ | Touch supported |
| Safari (iOS) | 17+ | Touch supported, safe-area aware |

## Known Issues

**Resize drifts on rotated shapes.**
When you drag a resize handle on a shape that has been rotated, the shape will drift away from the cursor. The more rotation and the longer the drag distance, the worse the drift. It resets when you release and start a new drag. This is a known approximation in the resize math: both mouse points are unrotated around the center captured at mousedown, but that center shifts slightly as the resize progresses. Fixing it properly requires an iterative solver; it was left as-is for scope reasons.

**There is no undo.**
Deleting a shape or making any property change is permanent within the session. There is no history stack. The only way to recover a deleted shape is to reload the page, which also resets everything else.

**Text width and height do not auto-fit.**
SVG does not expose synchronous computed text dimensions. The W and H fields on a text shape control the hit-target and handle positions only — they have no effect on the rendered text size. If you type a long string, the text will overflow the handles visually. You need to widen the W value manually to match.

**No multi-select.**
Only one shape can be selected at a time. There is no way to move, delete, or recolor a group of shapes in one action.

**Shapes can go off-screen permanently.**
There is no canvas boundary clamping and no zoom or pan. If you drag a shape off the visible area, the only way to retrieve it is to type new X/Y coordinates in the properties panel while the shape is selected — but you cannot select it once it is fully off-screen.

**Triangle vertex control does not exist.**
You can scale the triangle’s bounding box, but you cannot drag individual vertices. The three points are always recalculated from the box dimensions in a fixed proportion.

**No export.**
There is no way to save the canvas as SVG, PNG, or any other format. Work is lost on page reload.

## Project Structure

```
src/
  components/
    Canvas.jsx           SVG canvas, mouse/touch event handling
    ShapeRenderer.jsx    Renders each shape type
    SelectionHandles.jsx Resize and rotation handles
    Toolbar.jsx          Desktop tool selector
    PropertiesPanel.jsx  Desktop properties panel
    MobileDrawer.jsx     Mobile slide-up properties drawer
  hooks/
    useIsMobile.js       Responsive breakpoint detection
  store/
    useShapes.js         Shape state (no external library)
  utils/
    constants.js         Shared TYPE_LABEL and TOOLS definitions
    geometry.js          Rotation, unrotation, point math
docs/
  plan.md
  architecture.md
  agents.md
  validation.md
```

## AI Usage

Initial scaffold and SVG math generated by Claude. All code reviewed and tested manually. See `docs/agents.md` for what was generated, what was changed, and what was verified.
