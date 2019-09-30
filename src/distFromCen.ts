type point = [number, number];
import * as d3 from 'd3';
function sqr(x: number) {
  return x * x;
}
function dist2(v: point, w: point) {
  return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}
function distToSegmentSquared(p: point, v: point, w: point) {
  const l2 = dist2(v, w);
  if (l2 === 0) return dist2(p, v);
  let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
}
/**
 * Returns Distance betweeen a point and a line
 *
 * @param {[Number,Number]} origin Point
 * @param {[Number,Number]} first line vertice
 * @param {[Number,Number]} second line vertice
 * @returns {Number} Distance
 */
export function distToSegment(p: point, v: point, w: point) {
  return Math.sqrt(distToSegmentSquared(p, v, w));
}
/**
 * Returns the minimum distance between the centroid of a polygon and an edge
 *
 * @param {[Number, Number][]} poly polygon
 *
 */
export function getMinDist(poly: point[], point: point) {
  const c = point;
  const r = d3.range(poly.length).map(i => {
    const thisP = poly[i];
    const nextP = poly[(i + 1) % poly.length];
    return distToSegment(c, thisP, nextP);
  });
  return Math.min(...r);
}
