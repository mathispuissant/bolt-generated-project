export const computeDotProduct = (u, v) => {
  // Dot product: |u| * |v| * cos(angle difference)
  const angleDiff = Math.abs(u.angle - v.angle)
  return u.length * v.length * Math.cos(angleDiff)
}

export const computeAngle = (u, v) => {
  // Compute the angle between two vectors using cosine formula
  const dot = computeDotProduct(u, v)
  const magU = u.length
  const magV = v.length
  if (magU * magV === 0) return 0
  let angle = Math.acos(dot / (magU * magV))
  return angle
}
