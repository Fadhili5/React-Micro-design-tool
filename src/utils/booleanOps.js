function rotatePoint(px, py, cx, cy, angleDeg) {
  const rad = angleDeg * Math.PI / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return {
    x: cx + (px - cx) * cos - (py - cy) * sin,
    y: cy + (px - cx) * sin + (py - cy) * cos,
  }
}

function shapeToPoints(shape) {
  const { x, y, width: w, height: h, rotation = 0 } = shape
  const cx = x + w / 2
  const cy = y + h / 2
  let pts

  if (shape.type === 'rect') {
    pts = [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ]
  } else if (shape.type === 'circle') {
    const N = 48
    pts = Array.from({ length: N }, (_, i) => {
      const angle = (2 * Math.PI * i) / N
      return { x: cx + (w / 2) * Math.cos(angle), y: cy + (h / 2) * Math.sin(angle) }
    })
  } else if (shape.type === 'triangle') {
    pts = [
      { x: x + w / 2, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ]
  } else {
    return null
  }

  if (rotation) {
    pts = pts.map(p => rotatePoint(p.x, p.y, cx, cy, rotation))
  }
  return pts
}

function pointsToPath(pts) {
  return 'M ' + pts.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' L ') + ' Z'
}

function makeResult(shapeA, ptsA, ptsB, fillRule) {
  const all = [...ptsA, ...ptsB]
  const minX = Math.min(...all.map(p => p.x))
  const minY = Math.min(...all.map(p => p.y))
  const maxX = Math.max(...all.map(p => p.x))
  const maxY = Math.max(...all.map(p => p.y))
  return {
    type: 'path',
    d: pointsToPath(ptsA) + ' ' + pointsToPath(ptsB),
    fillRule,
    bx: minX, by: minY,
    x: minX, y: minY,
    width: maxX - minX,
    height: maxY - minY,
    fill: shapeA.fill,
    stroke: shapeA.stroke,
    strokeWidth: shapeA.strokeWidth,
    opacity: shapeA.opacity,
    rotation: 0,
  }
}

export function booleanSubtract(shapeA, shapeB) {
  const ptsA = shapeToPoints(shapeA)
  const ptsB = shapeToPoints(shapeB)
  if (!ptsA || !ptsB) return null
  return makeResult(shapeA, ptsA, ptsB, 'evenodd')
}

export function booleanUnite(shapeA, shapeB) {
  const ptsA = shapeToPoints(shapeA)
  const ptsB = shapeToPoints(shapeB)
  if (!ptsA || !ptsB) return null
  return makeResult(shapeA, ptsA, ptsB, 'nonzero')
}
