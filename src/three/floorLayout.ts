export type TableShape = 'round' | 'square';
export type TableStatusCode = 'F' | 'M' | 'W' | 'O' | 'C' | 'S';

export interface TableDef {
  id: number;
  shape: TableShape;
  x: number; // world X (-12 to +12)
  z: number; // world Z (-8 to +8)
  chairs: number;
}

export interface Point2D {
  x: number;
  z: number;
}

export const FLOOR_DIMENSIONS = {
  width: 24,
  height: 0.4,
  depth: 16,
} as const;

export const COUNTER_BLOCK = {
  x: -3.5,
  z: -6.2,
  width: 11,
  depth: 1.6,
  height: 1.1,
} as const;

export const RECEPTION_BLOCK = {
  x: 4.2,
  z: -6.2,
  width: 3.4,
  depth: 1.6,
  height: 1.15,
} as const;

export const KITCHEN_BLOCK = {
  x: 9.2,
  z: -0.5,
  width: 3.2,
  depth: 9.6,
  height: 1.6,
} as const;

/**
 * 12 tables: 7 round and 5 square.
 * Table 5 is the focal table in the center-front area.
 */
export const FLOOR_TABLES: TableDef[] = [
  { id: 1, shape: 'round', x: -8.5, z: -3.2, chairs: 2 },
  { id: 2, shape: 'square', x: -4.5, z: -3.2, chairs: 4 },
  { id: 3, shape: 'round', x: -0.5, z: -3.2, chairs: 2 },
  { id: 4, shape: 'square', x: 3.5, z: -3.2, chairs: 4 },
  { id: 5, shape: 'round', x: -0.8, z: 0.8, chairs: 2 }, // Focal Table 5
  { id: 6, shape: 'round', x: -8.5, z: 0.8, chairs: 2 },
  { id: 7, shape: 'square', x: -4.6, z: 0.8, chairs: 4 },
  { id: 8, shape: 'round', x: 3.4, z: 0.8, chairs: 2 },
  { id: 9, shape: 'square', x: -8.5, z: 4.8, chairs: 4 },
  { id: 10, shape: 'round', x: -4.5, z: 4.8, chairs: 2 },
  { id: 11, shape: 'round', x: -0.6, z: 4.8, chairs: 2 },
  { id: 12, shape: 'square', x: 3.5, z: 4.8, chairs: 4 },
];

export const STAFF_PATHS = {
  counterToTable5: [
    { x: -2.2, z: -4.8 },
    { x: -1.8, z: -2.0 },
    { x: -1.2, z: -0.2 },
    { x: -0.8, z: 0.1 },
  ] as Point2D[],
  kitchenToTable5: [
    { x: 7.2, z: -0.5 },
    { x: 4.8, z: -0.8 },
    { x: 1.4, z: 0.2 },
    { x: 0.1, z: 0.7 },
  ] as Point2D[],
  patrolLeft: [
    { x: -6.5, z: -4.8 },
    { x: -6.5, z: 2.5 },
    { x: -2.6, z: 2.5 },
    { x: -2.6, z: -4.8 },
  ] as Point2D[],
  patrolRight: [
    { x: 1.5, z: -4.8 },
    { x: 5.5, z: -1.5 },
    { x: 1.5, z: 2.8 },
    { x: 1.5, z: -4.8 },
  ] as Point2D[],
};

export const ORDER_ROUTES = {
  table5ToReception: [
    { x: -0.8, z: 0.8 },
    { x: 1.6, z: -2.5 },
    { x: 4.2, z: -5.4 },
  ] as Point2D[],
  table5ToKitchen: [
    { x: -0.8, z: 0.8 },
    { x: 3.8, z: 0.2 },
    { x: 7.6, z: -0.5 },
  ] as Point2D[],
};

export function worldToSvg(x: number, z: number): { sx: number; sy: number } {
  // Maps world (-12..12, -8..8) to SVG (0..800, 0..533)
  const sx = ((x + 12) / 24) * 800;
  const sy = ((z + 8) / 16) * 533;
  return { sx: Math.round(sx * 10) / 10, sy: Math.round(sy * 10) / 10 };
}

export function samplePath2D(points: Point2D[], t: number): Point2D {
  if (points.length === 0) return { x: 0, z: 0 };
  if (points.length === 1 || t <= 0) return points[0];
  if (t >= 1) return points[points.length - 1];
  const scaled = t * (points.length - 1);
  const idx = Math.floor(scaled);
  const frac = scaled - idx;
  const p0 = points[idx];
  const p1 = points[Math.min(idx + 1, points.length - 1)];
  return {
    x: p0.x + (p1.x - p0.x) * frac,
    z: p0.z + (p1.z - p0.z) * frac,
  };
}
