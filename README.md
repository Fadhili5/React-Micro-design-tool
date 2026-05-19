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

| Action | Mouse | Touch |
|--------|-------|-------|
| Select tool | Click toolbar or press **V** | Tap toolbar |
| Add shape | Press shortcut, click canvas | Tap tool, tap canvas |
| Move | Drag shape | One-finger drag |
| Resize | Drag any of the 8 square handles | One-finger drag handle |
| Rotate | Drag circular handle above shape | One-finger drag rotation handle |
| Edit text | Type in Content field in panel | Tap Content field, type |
| Delete | **Delete** / **Backspace**, or panel button | Tap panel button |
| Deselect | Click empty canvas or **Esc** | Tap empty canvas |

**Keyboard shortcuts (desktop):** V=select · R=rect · E=ellipse · T=triangle · X=text · Del=delete · Esc=deselect

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # serve production build locally
```

## Browser & Device Support

| Platform | Tested on | Status |
|----------|-----------|--------|
| Desktop Chrome | 120+ | ✅ Full support |
| Desktop Firefox | 121+ | ✅ Full support |
| Desktop Safari | 17+ | ✅ Full support |
| Mobile Chrome (Android) | 120+ | ✅ Touch supported |
| Mobile Safari (iOS) | 17+ | ✅ Touch supported |

> The layout (toolbar + canvas + properties panel) is optimised for landscape or tablet-sized screens. On a narrow phone the properties panel may overflow — scroll horizontally or rotate to landscape.

## AI Usage

Claude Sonnet generated the initial scaffold and SVG math. All logic reviewed and tested manually — see `docs/agents.md`.

## Known Issues

- **Text bounding box is approximate** — SVG text has no synchronous computed bbox; width/height must be adjusted manually.
- **Resize drift at steep rotation** — unrotating around the original center introduces minor drift for very large resizes on heavily-rotated shapes.
- **No undo/redo** — changes are immediate and irreversible without a page reload.
- **No zoom or pan** — canvas is fixed at viewport size.
- **No export** — no SVG or PNG download in the current version.
- **Triangle resize is bbox-based** — handles resize the bounding box; triangle vertices recompute from it.
- **Narrow phone layout** — properties panel may clip on screens under ~400px wide.
