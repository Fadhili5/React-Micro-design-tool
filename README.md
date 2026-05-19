# React Micro Design Tool

A lightweight browser-based graphic editor built with React and SVG. Move, resize, rotate, and recolor basic shapes — a minimal design canvas.

## Clone, Install & Run

```bash
git clone https://github.com/fadhili5/react-micro-design-tool.git
cd react-micro-design-tool
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Supported Objects & Modifications

| Object    | Move | Resize (8 handles) | Rotate | Fill | Stroke | Opacity | Layer order |
|-----------|------|--------------------|--------|------|--------|---------|-------------|
| Rectangle | ✅   | ✅                 | ✅     | ✅   | ✅     | ✅      | ✅          |
| Ellipse   | ✅   | ✅                 | ✅     | ✅   | ✅     | ✅      | ✅          |
| Triangle  | ✅   | ✅                 | ✅     | ✅   | ✅     | ✅      | ✅          |
| Text      | ✅   | ✅ (bbox)          | ✅     | ✅   | —      | ✅      | ✅          |

All objects also support numeric property editing (X, Y, W, H, rotation°) in the panel.

## Controls

| Action | How |
|--------|-----|
| Select tool | Click toolbar or press **V** |
| Add Rectangle | Press **R**, click canvas |
| Add Ellipse | Press **E**, click canvas |
| Add Triangle | Press **T**, click canvas |
| Add Text | Press **X**, click canvas |
| Move | Drag selected shape |
| Resize | Drag any of the 8 square handles |
| Rotate | Drag the circular handle above the shape |
| Edit text | Type in the Content field in the properties panel |
| Delete | **Delete** / **Backspace**, or panel button |
| Deselect | Click empty canvas or press **Esc** |

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # serve production build locally
```

## Browser Support

Tested on Chrome 120+, Firefox 121+, Safari 17+. Desktop only — no touch/mobile support.

## AI Usage

Claude Sonnet generated the initial scaffold and SVG rotation math. All logic was reviewed and tested manually — see `docs/agents.md` for what was generated, what was changed, and what judgment calls were kept out of AI delegation.

## Known Issues

- **Text bounding box is approximate** — SVG text has no synchronous computed bbox; width/height must be adjusted manually.
- **Resize drift at steep rotation** — unrotating around the original center introduces minor drift for very large resizes on heavily-rotated shapes.
- **No undo/redo** — changes are immediate and irreversible without a page reload.
- **No zoom or pan** — canvas is fixed at viewport size.
- **No export** — no SVG or PNG download in the current version.
- **Triangle resize is bbox-based** — handles resize the bounding box; triangle vertices recompute from it.
