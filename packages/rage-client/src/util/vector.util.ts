// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const TWOPI = 6.283185307179586476925287;
const EPSILON = 0.0000001;

const modulus = (p: Vector3) => Math.sqrt((p.x * p.x) + (p.y * p.y) + (p.z * p.z));


export const getDistance = (vector1: Vector3, vector2: Vector3): number => {
  return mp.game.system.vdist(vector1.x, vector1.y, vector1.z, vector2.x, vector2.y, vector2.z);
};

export function distanceTo(from: Vector3, to: Vector3) {
  const difference = new mp.Vector3(from.x - to.x, from.y - to.y, from.z - to.z);
  const distance = Math.sqrt(Math.pow(difference.x, 2) + Math.pow(difference.y, 2) + Math.pow(difference.z, 2));
  return Math.abs(distance);
}

export const getForwardVector = (rotation: Vector3) => {
  const z = -rotation.z;
  const x = rotation.x;
  const num = Math.abs(Math.cos(x));
  return {
    x: -Math.sin(z) * num,
    y: Math.cos(z) * num,
    z: Math.sin(x)
  };
};

export const getForwardVector3D = (rotation: Vector3) => {
  const roll = rotation.x * (Math.PI / 180.0);
  const pitch = rotation.y * (Math.PI / 180.0);
  const yaw = rotation.z * (Math.PI / 180.0);
  // build quaternion
  const qx = Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) -
    Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);
  const qy = Math.cos(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2) +
    Math.sin(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2);
  const qz = Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.sin(yaw / 2) -
    Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.cos(yaw / 2);
  const qw = Math.cos(roll / 2) * Math.cos(pitch / 2) * Math.cos(yaw / 2) +
    Math.sin(roll / 2) * Math.sin(pitch / 2) * Math.sin(yaw / 2);
  const quatRot = { x: qx, y: qy, z: qz, w: qw };
  const fVectorX = 2 * (quatRot.x * quatRot.y - quatRot.w * quatRot.z);
  const fVectorY = 1 - 2 * (quatRot.x * quatRot.x + quatRot.z * quatRot.z);
  const fVectorZ = 2 * (quatRot.y * quatRot.z + quatRot.w * quatRot.x);
  return new mp.Vector3(fVectorX, fVectorY, fVectorZ);
}

export const compareVectors = (i: Vector3, x: Vector3): boolean => {
  return i.x == x.x && i.y == x.y && i.z == x.z;
};

export const getNormalizedVector = (vector: Vector3): Vector3 => {
  const mag = Math.sqrt(
    vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
  );

  vector.x = vector.x / mag;
  vector.y = vector.y / mag;
  vector.z = vector.z / mag;
  return vector;
};

export const getCrossProduct = function(v1: Vector3, v2: Vector3) {
  const vector = new mp.Vector3(0, 0, 0);
  vector.x = v1.y * v2.z - v1.z * v2.y;
  vector.y = v1.z * v2.x - v1.x * v2.z;
  vector.z = v1.x * v2.y - v1.y * v2.x;
  return vector;
};


export const getHeadingTo = (heading: number): string => {
  switch (true) {
    case (heading < 30):
      return 'N';
    case (heading < 90):
      return 'NW';
    case (heading < 135):
      return 'W';
    case (heading < 180):
      return 'SW';
    case (heading < 225):
      return 'S';
    case (heading < 270):
      return 'SE';
    case (heading < 315):
      return 'E';
    case (heading < 360):
      return 'NE';
    default:
      return 'N';
  }
};


export const isPointInArea2D = (point: [number, number], area: [number, number][]) => {
  const x = point[0], y = point[1];

  let inside = false;

  for (let i = 0, j = area.length - 1; i < area.length; j = i++) {
    const xi = area[i][0], yi = area[i][1];
    const xj = area[j][0], yj = area[j][1];

    const intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect)
      inside = !inside;
  }

  return inside;
};


export const getAngleSumBetweenPositionAndVertices = (position: Vector3, vertices: Vector3[]) => {
  let i: number;
  let m1: number, m2: number;
  let angleSum = 0, cosTheta: number;

  for (i = 0; i < vertices.length; i++) {

    const p1 = new mp.Vector3(vertices[i].x - position.x, vertices[i].y - position.y, vertices[i].z - position.z);
    const p2 = new mp.Vector3(vertices[(i + 1) % vertices.length].x - position.x, vertices[(i + 1) % vertices.length].y - position.y, vertices[(i + 1) % vertices.length].z - position.z);

    m1 = modulus(p1);
    m2 = modulus(p2);

    if (m1 * m2 <= EPSILON)
      return (TWOPI);
    else
      cosTheta = (p1.x * p2.x + p1.y * p2.y + p1.z * p2.z) / (m1 * m2);

    angleSum += Math.acos(cosTheta);
  }
  return (angleSum);
};


export const isPositionInRange = (position: Vector3, range: number, target: Vector3) => {
  return Math.sqrt(
    Math.pow(position.x - target.x, 2) +
    Math.pow(position.y - target.y, 2) +
    Math.pow(position.z - target.z, 2)
  ) <= range;
}
