# React Micro Design Tool — Project Report

## Problem Statement

The task was to build a lightweight, browser-based graphic editor in React that allows a user to create, select, move, resize, rotate, and recolor basic shapes on a shared canvas. The tool needed to operate entirely in the browser with no backend, no file uploads, and no external design libraries.

The specific requirements were:

- Support at least three shape types (rectangle, ellipse, and one additional)
- Each shape must be individually selectable, movable, resizable via handles, and rotatable
- Shape properties — position, size, rotation, fill color, stroke, opacity — must be editable through a panel
- The implementation must use React; SVG or Canvas API was left to discretion
- The project must include documentation covering planning, architecture, AI usage, and validation
- A markdown report summarising the work was required as a deliverable

A secondary constraint that emerged during development was that the tool also needed to work acceptably on mobile browsers, including touch-based drag, resize, and property editing without triggering native scroll or iOS input zoom.

---

## Methodology

### Technology Choices

**React 18 with Vite** was chosen as the project base. No external state management library was used; a single `useShapes` hook built on `useState` held all shape data. This was sufficient for the scope and avoided unnecessary dependency overhead.

**SVG** was chosen over the Canvas API. SVG integrates naturally with React's declarative rendering model — each shape is a component, selection handles are components, and React's reconciler manages repaints. The Canvas API would have required a separate imperative render loop and manual hit-testing.

**No external drag or geometry libraries** were used. All drag math, rotation math, and resize-with-rotation logic was written from scratch and is contained in `src/utils/geometry.js`.

### Architecture

The application is structured around five primary concerns:

1. **State** (`useShapes`) — holds the array of shape objects and exposes add, update, delete, select, and layer-order operations. The `selectedShape` object is derived as a computed value from the state array on every render rather than stored separately, which eliminates the common bug of stale selection data.

2. **Canvas** (`Canvas.jsx`) — renders the SVG element, attaches mouse and touch event listeners to `window` (not to the SVG element), and dispatches drag events. Attaching to `window` was critical: if listeners are placed on the SVG itself, drag breaks the moment the pointer moves outside the element boundary.

3. **Shape rendering** (`ShapeRenderer.jsx`) — maps each shape's type and properties to the appropriate SVG primitive. Text shapes include an invisible transparent bounding-box rectangle at all times for reliable hit-testing, since SVG `<text>` elements have no inherent fill area for pointer events.

4. **Selection handles** (`SelectionHandles.jsx`) — renders eight resize handles and one rotation handle per selected shape. Each handle has a large invisible hit target (20 px radius or a 40x40 px transparent square) layered over the small visible indicator, making them usable on touch screens.

5. **Properties UI** — two implementations of the same interface: `PropertiesPanel.jsx` (desktop sidebar) and `MobileDrawer.jsx` (slide-up sheet on mobile). Layout is switched at runtime by a `useIsMobile` hook that tracks `window.innerWidth` against a 768 px breakpoint.

### Resize with Rotation

The central geometric challenge was resizing a shape that has been rotated. Dragging the SE handle of a rectangle rotated 45 degrees should grow the rectangle in its own local frame, not in screen space.

The solution was to unrotate both the drag start point and the current mouse position around the shape's center (captured at `mousedown`) before computing the delta. This produces a local-frame delta that is then applied per handle using the same logic as for an unrotated shape. The `unrotatePoint` function is a standard 2D rotation matrix applied with the negated angle.

This approach is an approximation. For very large resize operations at steep angles it introduces minor positional drift because the shape center shifts slightly during the operation but the unrotation still references the original center. A correct solution would use an iterative solver. The approximation was chosen as an acceptable trade-off for the scope; the drift resets cleanly on the next interaction. This limitation is documented.

### Mobile Support

The mobile layout is a separate render path, not a CSS-only responsive adaptation. On screens narrower than 768 px:

- The canvas fills the full viewport using `position: fixed; inset: 0`
- A floating glass-effect header sits at the top with padding for the iOS status bar safe area
- A bottom toolbar provides the five tool buttons and delete
- Tapping a shape opens `MobileDrawer`, a slide-up properties sheet anchored above the bottom toolbar
- All touch interactions use `window` `touchmove`/`touchend` listeners registered with `{ passive: false }` so `e.preventDefault()` can suppress native scroll during a drag
- All inputs use `font-size: 16px` to prevent iOS Safari's automatic zoom on focus
- Bottom toolbar and drawer heights account for the iOS home indicator using `env(safe-area-inset-bottom, 0px)`

### AI-Assisted Development

Claude (Anthropic) was used as the primary coding assistant. The AI generated initial component drafts, the SVG math utilities, and the project scaffold. All generated code was reviewed and tested manually. Several outputs required correction before use:

- Mouse and touch event listeners were moved from the SVG element to `window` after drag-outside-boundary broke
- The invisible hit-rect for text shapes was made unconditional (AI draft only added it when the shape was selected)
- The `unrotatePoint` call in the resize handler was corrected to pass the center captured at `mousedown`, not re-derived center
- Stroke toggle was changed from a text input (`'none'` / color string) to a checkbox

Full details are in `docs/agents.md`.

---

## Evaluation Dataset

There is no external dataset. The application is a UI tool; what constitutes a meaningful test case is a specific user interaction rather than a data record.

The evaluation was structured around ten interaction groups, each exercising a distinct area of functionality. The five shapes pre-loaded on the canvas at startup served as the baseline test subjects:

| ID | Shape | Initial state |
|----|-------|---------------|
| S1 | Rectangle | Centered, no rotation, blue fill |
| S2 | Ellipse | Upper-right area, no rotation, green fill |
| S3 | Triangle | Lower-left area, no rotation, red fill |
| S4 | Rectangle | Center-right, rotated 30 degrees, purple fill |
| S5 | Text | Center, no rotation, white fill, reads "Hello" |

Additional shapes were added during testing to verify the add-shape flow.

---

## Evaluation Methods

Automated unit tests were not written. For a highly interactive SVG canvas tool, unit tests would exercise implementation details (state transitions, coordinate math) while leaving the actual user-visible behavior — does the shape follow my mouse, does the handle land where I tapped, does the property panel update in real time — completely untested. The cost-to-coverage ratio favors structured manual testing for a project of this scope.

Ten test groups (T1 through T10) were defined in `docs/validation.md` before implementation began. Each group covers one functional area and lists discrete, verifiable steps with expected outcomes.

| Group | Area covered |
|-------|--------------|
| T1 | Adding shapes via tool buttons and keyboard shortcuts |
| T2 | Select and deselect |
| T3 | Move by dragging |
| T4 | Resize handles on an unrotated shape |
| T5 | Resize handles on a rotated shape (45 degrees and 90 degrees) |
| T6 | Rotation handle and numeric rotation input |
| T7 | All properties panel fields (fill, stroke, opacity, X, Y, W, H, text, font size) |
| T8 | Layer order (bring to front, send to back) |
| T9 | Delete via keyboard and via panel button |
| T10 | Keyboard shortcut suppression when an input field is focused |

Browser compatibility testing was performed on Chrome 120, Firefox 121, and Safari 17 on desktop. Mobile testing was performed on iOS Safari 17 and Chrome for Android 120.

Each test case was executed once in each browser. Failures were logged, investigated, and either fixed or documented as known limitations.

---

## Experimental Results

### Functional Test Results

All ten test groups passed across all three desktop browsers.

| Group | Chrome 120 | Firefox 121 | Safari 17 |
|-------|-----------|-------------|----------|
| T1 Add shapes | pass | pass | pass |
| T2 Select / deselect | pass | pass | pass |
| T3 Move | pass | pass | pass |
| T4 Resize (unrotated) | pass | pass | pass |
| T5 Resize (rotated) | pass | pass | pass |
| T6 Rotate | pass | pass | pass |
| T7 Properties panel | pass | pass | pass |
| T8 Layer order | pass | pass | pass |
| T9 Delete | pass | pass | pass |
| T10 Keyboard shortcuts | pass | pass | pass |

### Mobile Test Results

Touch interaction was tested on iOS Safari 17 and Chrome for Android 120 after the mobile UX redesign.

| Scenario | iOS Safari 17 | Chrome Android 120 |
|----------|--------------|--------------------|
| Canvas fills full screen | pass | pass |
| Tap to select shape | pass | pass |
| One-finger drag to move | pass | pass |
| Drag handle to resize | pass | pass |
| Drag rotation handle | pass | pass |
| Drawer opens on shape select | pass | pass |
| Property inputs update shape | pass | pass |
| Input focus does not zoom page | pass | pass |
| Bottom toolbar above home indicator | pass | pass |
| Scroll does not trigger during drag | pass | pass |

### Known Failures and Limitations

**Resize drift at steep rotation.** Resizing a shape rotated at a steep angle (approximately 45 degrees or greater) with a large drag distance produces minor positional drift. This is a consequence of unrotating around the original `mousedown` center rather than the continuously updated center. The drift resets on the next interaction. An iterative solver would eliminate this but was considered out of scope.

**Text bounding box is approximate.** SVG does not expose synchronous computed text dimensions in a way that integrates cleanly with React's render cycle. The hit-rect and resize handles use a manually specified width and height for text shapes. Users must adjust these values manually if the visible text overflows or underflows the handles.

**No undo/redo.** All shape mutations are immediate and permanent within the session. A page reload resets the canvas to the five initial shapes. Implementing undo would require a command or snapshot stack, which was considered outside the stated "micro" scope.

**No export.** There is no mechanism to save or export the canvas contents as SVG, PNG, or any other format.

**No zoom or pan.** The canvas is fixed at viewport size. Shapes can be moved off-screen with no way to retrieve them other than editing the X/Y values in the properties panel.

**Triangle resize is bounding-box based.** Resizing a triangle updates its bounding box dimensions; the three vertices are recalculated from the new bounding box using a fixed proportional layout. Arbitrary triangle vertex manipulation is not supported.

### Performance Observations

With the five default shapes, drag and resize interactions render at the display's native frame rate on all tested devices with no perceptible lag. No profiling was done for large shape counts, but SVG rendering performance degrades with element count; this tool is not designed for canvases with hundreds of shapes.

### Summary

All defined test scenarios pass. The two documented known failures (resize drift, approximate text bbox) are mathematical approximations within stated scope, not functional regressions. The tool meets all stated requirements: four shape types, per-shape move/resize/rotate/recolor, a numeric properties panel, keyboard shortcuts on desktop, and touch support on mobile.
