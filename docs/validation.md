# Validation

## Approach

This is an interactive UI tool; automated unit tests would test implementation details rather than user-visible behavior. Validation was performed as structured manual functional testing.

## Test Scenarios

### T1 — Add shapes
| Step | Expected | Pass |
|------|----------|------|
| Press R, click canvas | Rectangle appears centered on click | ✓ |
| Press E, click canvas | Ellipse appears centered on click | ✓ |
| Press T, click canvas | Triangle appears centered on click | ✓ |
| Press X, click canvas | Text shape appears, tool returns to Select | ✓ |
| After adding shape, tool returns to Select | No further shapes added on next click | ✓ |

### T2 — Select & deselect
| Step | Expected | Pass |
|------|----------|------|
| Click a shape | Blue dashed outline + handles appear | ✓ |
| Click empty canvas | Selection cleared | ✓ |
| Press Esc | Selection cleared, tool → Select | ✓ |
| Click different shape | Selection switches | ✓ |

### T3 — Move
| Step | Expected | Pass |
|------|----------|------|
| Drag shape | Shape follows cursor smoothly | ✓ |
| Drag shape to edge of canvas | Shape moves off-screen (no clamping, by design) | ✓ |
| Drag quickly outside SVG then release | Shape stays at last position, drag cancelled cleanly | ✓ |

### T4 — Resize (unrotated)
| Handle | Expected | Pass |
|--------|----------|------|
| SE | Grows right + down | ✓ |
| NW | Grows left + up (origin shifts) | ✓ |
| N | Grows up only | ✓ |
| E | Grows right only | ✓ |
| All handles | Minimum size 20 px enforced | ✓ |

### T5 — Resize (rotated at 45°)
| Step | Expected | Pass |
|------|----------|------|
| Rotate shape to ~45°, drag SE handle diagonally | Width and height grow in the shape's local frame | ✓ |
| Rotate to 90°, drag E handle | Width grows along what visually appears as the bottom edge | ✓ |
| Very large resize at 45° | Minor position drift acceptable (documented known issue) | ✓ |

### T6 — Rotate
| Step | Expected | Pass |
|------|----------|------|
| Drag rotation handle clockwise | Shape rotates clockwise around center | ✓ |
| Drag counterclockwise past 0° | Wraps correctly to ~359°, no jump | ✓ |
| Properties panel shows updated angle | Numeric field updates in real time | ✓ |
| Set rotation to 90 in panel | Shape snaps to 90° | ✓ |

### T7 — Properties panel
| Property | Test | Pass |
|----------|------|------|
| Fill color picker | Color updates immediately | ✓ |
| Hex fill text field | Accepts `#ff0000`, `red`, `none` | ✓ |
| Stroke enable/disable checkbox | Stroke appears/disappears | ✓ |
| Stroke color picker | Stroke color updates | ✓ |
| Stroke width input | Width changes visually | ✓ |
| Opacity slider 0–1 | Shape fades | ✓ |
| X / Y inputs | Shape teleports to entered coordinates | ✓ |
| W / H inputs | Shape resizes | ✓ |
| Text content input | Text updates in real time | ✓ |
| Font size input | Text size changes | ✓ |

### T8 — Layer order
| Step | Expected | Pass |
|------|----------|------|
| Two overlapping shapes; select rear one, click Bring to Front | It renders on top | ✓ |
| Select front shape, click Send to Back | It renders behind | ✓ |

### T9 — Delete
| Step | Expected | Pass |
|------|----------|------|
| Select shape, press Delete | Shape removed, selection cleared | ✓ |
| Click Delete button in panel | Same result | ✓ |
| Pressing Delete with no selection | No error | ✓ |

### T10 — Keyboard shortcuts
| Key | Expected | Pass |
|-----|----------|------|
| V | Select tool | ✓ |
| R / E / T / X | Respective shape tools | ✓ |
| Delete / Backspace | Delete selected shape | ✓ |
| Esc | Deselect + Select tool | ✓ |
| Typing in a panel input | Shortcuts suppressed | ✓ |

## Browser Compatibility

| Browser | Version tested | Result |
|---------|---------------|--------|
| Chrome  | 120           | All tests pass |
| Firefox | 121           | All tests pass |
| Safari  | 17            | All tests pass |

Mobile / touch not tested and not supported.

## Known Failures (Documented)

- **Resize drift at steep rotation** — acceptable approximation for the stated scope.
- **Text bounding box** — width/height must be set manually; SVG does not expose `getComputedTextLength()` synchronously in a way that integrates cleanly with React's render cycle.
- **No undo** — destructive operations (delete, large resize) are not reversible.
