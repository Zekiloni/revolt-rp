export interface Vector3Like {
  x: number;
  y: number;
  z: number;
}

export const distanceBetween = (a: Vector3Like, b: Vector3Like): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
