# React Micro Design Tool

A lightweight browser-based graphic editor built with React and SVG. Move, resize, rotate, and recolor basic shapes — a minimal design canvas.

## Clone, Install & Run

```bash
git clone https://github.com/fadhili5/react-micro-design-tool.git
cd react-micro-design-tool
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Supported Objects & Modifications

| Object       | Move | Resize (8 handles) | Rotate | Fill Color | Stroke | Opacity | Layer Order |
|--------------|------|--------------------|--------|------------|--------|---------|-------------|
| Rectangle    | ✅   | ✅                 | ✅     | ✅         | ✅     | ✅      | ✅          |
| Ellipse      | ✅   | ✅                 | ✅     | ✅         | ✅     | ✅      | ✅          |
| Triangle     | ✅   | ✅                 | ✅     | ✅         | ✅     | ✅      | ✅          |
| Text         | ✅   | ✅ (bbox)          | ✅     | ✅         | —      | ✅      | ✅          |

All objects also support numeric property editing (X, Y, W, H, rotation) in the properties panel.

## Controls

| Action            | How                                             |
|-------------------|-------------------------------------------------|
| Select tool       | Click toolbar or press **V**                    |
| Add Rectangle     | Press **R**, click canvas                       |
| Add Ellipse       | Press **E**, click canvas                       |
| Add Triangle      | Press **T**, click canvas                       |
| Add Text          | Press **X**, click canvas                       |
| Move              | Drag selected shape                             |
| Resize            | Drag any of the 8 square handles                |
| Rotate            | Drag the circular handle above the shape        |
| Edit text content | Type in the Content field in the properties panel |
| Delete            | **Delete** / **Backspace** key, or panel button |
| Deselect          | Click empty canvas or press **Esc**             |

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Browser Support

Tested on Chrome 120+, Firefox 121+, Safari 17+. Desktop only — no touch/mobile support.

## AI Usage

Claude Sonnet was used to generate the initial component scaffold and the SVG rotation math (unrotate-then-resize transform). All interaction logic was reviewed and tested manually — particularly the event propagation between shape and canvas mouse handlers, and the resize-with-rotation edge cases.

## Known Issues

- **Text bounding box is approximate** — SVG text doesn't expose a computed bounding box until rendered; width/height serve as a drag target and must be set manually.
- **Resize drift at steep rotation** — unrotating around the original center (not the evolving center) introduces minor positional drift when resizing rotated shapes by large amounts.
- **No undo/redo** — changes are immediate and irreversible without a page reload.
- **No zoom or pan** — the canvas is fixed at viewport size.
- **No export** — there is no SVG or PNG download in the current version.
- **Triangle resize is bbox-based** — dragging a vertex handle resizes the bounding box; the triangle vertices recompute from that box, so handles don't directly correspond to triangle corners.
