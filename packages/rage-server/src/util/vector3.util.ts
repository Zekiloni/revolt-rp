/**
 * Get distance between two vectors.
 * @export
 * @return {number}
 * @param first
 * @param second
 */
export const distanceBetweenVectors = (first: Vector3, second: Vector3): number => {
  return new mp.Vector3(first.x, first.y, first.z).subtract(new mp.Vector3(second.x, second.y, second.z)).length();
}


export const isInRangePointOf = (entity: EntityMp, position: Vector3, range: number) => {
  if (!entity || !entity.position) throw Error("No entity or entity position at function isInRangePointOf");
  return distanceBetweenVectors(entity.position, position) <= range;
}

/**
 * Determine if a vector is between vectors.
 * @returns {boolean}
 * @param position
 * @param v1
 * @param v2
 */
export const isBetweenVectors = (position: Vector3, v1: Vector3, v2: Vector3): boolean => {
  const validX = position.x > v1.x && position.x < v2.x;
  const validY = position.y > v1.y && position.y < v2.y;
  return validX && validY;
}



export function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b;
}


export const getForwardVector = (position: Vector3, heading: number, distance: number) => {
  return new mp.Vector3(
    position.x + Math.cos(((heading + 90) * Math.PI) / 180) * distance,
    position.y + Math.sin(((heading + 90) * Math.PI) / 180) * distance,
    position.z,
  );
}
