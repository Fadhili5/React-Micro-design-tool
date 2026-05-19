export function degToRad(deg) {
  return (deg * Math.PI) / 180
}

// Standard 2-D rotation around an arbitrary center point.
export function rotatePoint(px, py, cx, cy, angleDeg) {
  const rad = degToRad(angleDeg)
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const dx = px - cx
  const dy = py - cy
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  }
}

// Inverse rotation — transforms screen-space coords into the shape's local frame.
export function unrotatePoint(px, py, cx, cy, angleDeg) {
  return rotatePoint(px, py, cx, cy, -angleDeg)
}
