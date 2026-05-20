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
- The UI must feel intentional: clear layout, sensible controls or gestures, and feedback when something changes

A secondary constraint that emerged during development was that the tool also needed to work acceptably on mobile browsers, including touch-based drag, resize, and property editing without triggering native scroll or iOS input zoom.

---

## Methodology

### Technology Choices

**React 18 with Vite** was chosen as the project base. No external state management library was used; a single `useShapes` hook built on `useState` held all shape data. This was sufficient for the scope and avoided unnecessary dependency overhead.

**SVG** was chosen over the Canvas API. SVG integrates naturally with React's declarative rendering model — each shape is a component, selection handles are components, and React's reconciler manages repaints. The Canvas API would have required a separate imperative render loop and manual hit-testing.

**No external drag, geometry, or animation libraries** were used. All drag math, rotation math, resize-with-rotation logic, and UI animations were implemented from scratch.

### Architecture

The application is structured around five primary concerns:

1. **State** (`useShapes`) — holds the array of shape objects and exposes add, update, delete, select, and layer-order operations. The `selectedShape` object is derived as a computed value from the state array on every render rather than stored separately, which eliminates the common bug of stale selection data.

2. **Canvas** (`Canvas.jsx`) — renders the SVG element, attaches mouse and touch event listeners to `window` (not to the SVG element), and dispatches drag events. Also tracks the hovered shape ID for hover feedback. Attaching to `window` was critical: if listeners are placed on the SVG itself, drag breaks the moment the pointer moves outside the element boundary.

3. **Shape rendering** (`ShapeRenderer.jsx`) — maps each shape's type and properties to the appropriate SVG primitive. Text shapes include an invisible transparent bounding-box rectangle at all times for reliable hit-testing, since SVG `<text>` elements have no inherent fill area for pointer events.

4. **Selection handles** (`SelectionHandles.jsx`) — renders eight resize handles and one rotation handle per selected shape. Each handle has a large invisible hit target (20 px radius or a 40x40 px transparent square) layered over the small visible indicator, making them usable on touch screens.

5. **Properties UI** — two implementations of the same interface: `PropertiesPanel.jsx` (desktop sidebar) and `MobileDrawer.jsx` (slide-up sheet on mobile). Layout is switched at runtime by a `useIsMobile` hook that tracks `window.innerWidth` against a 768 px breakpoint.

**Shared constants** (`utils/constants.js`) — `TYPE_LABEL` (shape type to display name) and `TOOLS` (tool list with icons, labels, and keyboard hints) are defined once and imported by every component that needs them. Defining these inline per-component is the kind of duplication that silently diverges over time.

### Resize with Rotation

The central geometric challenge was resizing a shape that has been rotated. Dragging the SE handle of a rectangle rotated 45 degrees should grow the rectangle in its own local frame, not in screen space.

The solution was to unrotate both the drag start point and the current mouse position around the shape's center (captured at `mousedown`) before computing the delta. This produces a local-frame delta that is then applied per handle using the same logic as for an unrotated shape. The `unrotatePoint` function is a standard 2D rotation matrix applied with the negated angle.

This approach is an approximation. For very large resize operations at steep angles it introduces minor positional drift because the shape center shifts slightly during the operation but the unrotation still references the original center. A correct solution would use an iterative solver. The approximation was chosen as an acceptable trade-off for the scope; the drift resets cleanly on the next interaction. This limitation is documented.

### Interaction Feedback

A deliberate pass was made to ensure the interface communicates state changes rather than just reflecting them silently.

**Hover glow.** In select mode, hovering over any shape applies a blue `drop-shadow` filter (`rgba(0,153,255,0.65)`) to the shape's SVG group. The blue matches the selection handle colour so hover and selection feel like a connected progression rather than two unrelated states. The glow is suppressed on the currently selected shape so it does not fight with the dashed selection outline.

**Shape entrance.** Every shape fades in when it is added to the canvas. This is implemented as a CSS `@keyframes fadeIn` animation on the wrapping `<g>` element via a `shape-new` class. CSS animations fire once per DOM insertion, so the class can live permanently on the element — it will not replay on subsequent re-renders of the same shape.

**Selection handle animation.** The selection handles (outline, resize squares, rotation circle) fade in whenever a shape is selected. The `SelectionHandles` component receives `key={selectedId}` in `Canvas.jsx`, which remounts it on every new selection and replays the `handles-in` fade animation. This makes it clear that the handle set belongs to the newly selected shape rather than persisting from the previous one.

**Mobile drawer slide-up.** On mobile, the properties drawer slides up from below the toolbar when a shape is tapped. The animation uses a `cubic-bezier(0.32, 0.72, 0, 1)` easing — the same curve iOS uses for native sheet presentations — which makes the gesture feel native rather than generic. The drawer is conditionally rendered, so it remounts on each new selection and the animation always plays.

All four animations are implemented with CSS keyframes and class names. No JavaScript animation library or `requestAnimationFrame` loop was used.

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
- The `unrotatePoint` call in the resize handler was corrected to pass the center captured at `mousedown`, not the re-derived center
- Stroke toggle was changed from a text input (`'none'` / color string) to a checkbox, because a color-picker input cannot represent the string `'none'`
- A redundant `clearSelection()` call following `deleteShape()` was removed; `deleteShape` already calls `setSelectedId(null)` internally when the deleted shape was selected
- Comments that cited planning documents by filename were removed from code and replaced with descriptions of the actual constraint or decision

Full details are in `docs/agents.md`.

---

## Evaluation Dataset

There is no external dataset. The application is a UI tool; what constitutes a meaningful test case is a specific user interaction rather than a data record.

The evaluation was structured around test groups, each exercising a distinct area of functionality. The five shapes pre-loaded on the canvas at startup served as the baseline test subjects:

| ID | Shape | Initial state |
|----|-------|---------------|
| S1 | Rectangle | Centered, no rotation, teal fill |
| S2 | Ellipse | Upper-right area, no rotation, red fill |
| S3 | Triangle | Left area, no rotation, yellow fill |
| S4 | Rectangle | Center-right, rotated -15 degrees, purple fill |
| S5 | Text | Lower area, no rotation, reads "Click a shape to select it" |

Additional shapes were added during testing to verify the add-shape flow and entrance animation.

---

## Evaluation Methods

Automated unit tests were not written. For a highly interactive SVG canvas tool, unit tests would exercise implementation details (state transitions, coordinate math) while leaving the actual user-visible behaviour — does the shape follow my mouse, does the handle land where I tapped, does the property panel update in real time — completely untested. The cost-to-coverage ratio favours structured manual testing for a project of this scope.

Ten core test groups (T1 through T10) plus one feedback group (T11) were defined. Each group covers one functional area and lists discrete, verifiable steps with expected outcomes.

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
| T11 | UI feedback: hover glow, entrance animation, handle animation, drawer slide |

Browser compatibility testing was performed on Chrome 120, Firefox 121, and Safari 17 on desktop. Mobile testing was performed on iOS Safari 17 and Chrome for Android 120.

Each test case was executed once in each browser. Failures were logged, investigated, and either fixed or documented as known issues.

---

## Experimental Results

### Functional Test Results

All ten core test groups passed across all three desktop browsers.

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

| Scenario | iOS Safari 17 | Chrome Android 120 |
|----------|--------------|--------------------||
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

### UI Feedback Test Results (T11)

| Behaviour | Chrome 120 | Firefox 121 | Safari 17 | iOS Safari 17 |
|-----------|-----------|-------------|----------|---------------|
| Hover glow appears in select mode | pass | pass | pass | n/a (touch) |
| Hover glow absent when tool is not select | pass | pass | pass | n/a |
| Hover glow absent on already-selected shape | pass | pass | pass | n/a |
| New shape fades in on add | pass | pass | pass | pass |
| Entrance animation does not replay on re-render | pass | pass | pass | pass |
| Selection handles fade in on each new selection | pass | pass | pass | pass |
| Mobile drawer slides up on shape tap | n/a | n/a | n/a | pass |
| Mobile drawer slides up on Chrome Android | n/a | n/a | n/a | pass |

### Known Issues

**Resize drift at steep rotation.** Resizing a shape rotated at a steep angle (approximately 45 degrees or greater) with a large drag distance produces minor positional drift. This is a consequence of unrotating around the original `mousedown` center rather than the continuously updated center. The drift resets on the next interaction. An iterative solver would eliminate this but was considered out of scope.

**Text bounding box is approximate.** SVG does not expose synchronous computed text dimensions in a way that integrates cleanly with React's render cycle. The hit-rect and resize handles use a manually specified width and height for text shapes. Users must adjust these values manually if the visible text overflows or underflows the handles.

**No undo/redo.** All shape mutations are immediate and permanent within the session. A page reload resets the canvas to the five initial shapes.

**No export.** There is no mechanism to save or export the canvas contents as SVG, PNG, or any other format.

**No zoom or pan.** The canvas is fixed at viewport size. Shapes can be moved off-screen with no way to retrieve them other than editing the X/Y values in the properties panel while the shape is still partially visible.

**No multi-select.** Only one shape can be selected at a time.

**Triangle resize is bounding-box based.** Resizing a triangle updates its bounding box dimensions; the three vertices are recalculated from the new bounding box using a fixed proportional layout. Arbitrary vertex manipulation is not supported.

### Performance Observations

With the five default shapes, drag and resize interactions render at the display's native frame rate on all tested devices with no perceptible lag. The CSS animations (180ms fade for shapes, 140ms for handles, 260ms for the drawer) were chosen to be fast enough not to slow down repeated interactions while long enough to be perceptible. No profiling was done for large shape counts, but SVG rendering performance degrades with element count; this tool is not designed for canvases with hundreds of shapes.

### Summary

All defined test scenarios pass. The two core known issues (resize drift at steep rotation, approximate text bounding box) are mathematical approximations within stated scope, not regressions. The tool meets all stated requirements: four shape types, per-shape move/resize/rotate/recolor, a numeric properties panel, keyboard shortcuts on desktop, touch support on mobile, and clear visual feedback at each interaction state.
