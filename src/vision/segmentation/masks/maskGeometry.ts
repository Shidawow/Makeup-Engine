import type { NormalizedBoundingBox, NormalizedPolygon } from '../../providers';

export const polygonBounds = (
  polygon: NormalizedPolygon,
): NormalizedBoundingBox => {
  const xs = polygon.points.map((point) => point.x);
  const ys = polygon.points.map((point) => point.y);

  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
    space: 'normalized-image',
  };
};

export const pointInPolygon = (
  point: { x: number; y: number },
  polygon: NormalizedPolygon,
): boolean => {
  let inside = false;
  const points = polygon.points;

  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const current = points[i];
    const previous = points[j];
    const intersects =
      current.y > point.y !== previous.y > point.y &&
      point.x <
        ((previous.x - current.x) * (point.y - current.y)) /
          (previous.y - current.y) +
          current.x;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
};

export const distanceToPolygonEdge = (
  point: { x: number; y: number },
  polygon: NormalizedPolygon,
): number => {
  let minDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < polygon.points.length; i += 1) {
    const start = polygon.points[i];
    const end = polygon.points[(i + 1) % polygon.points.length];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy;
    const projection =
      lengthSquared === 0
        ? 0
        : Math.max(
            0,
            Math.min(
              1,
              ((point.x - start.x) * dx + (point.y - start.y) * dy) /
                lengthSquared,
            ),
          );
    const closest = {
      x: start.x + projection * dx,
      y: start.y + projection * dy,
    };
    const distance = Math.sqrt(
      (point.x - closest.x) ** 2 + (point.y - closest.y) ** 2,
    );

    minDistance = Math.min(minDistance, distance);
  }

  return minDistance;
};

