export function degToRad(deg) {
  return (deg * Math.PI) / 180
}

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

export function unrotatePoint(px, py, cx, cy, angleDeg) {
  return rotatePoint(px, py, cx, cy, -angleDeg)
}
