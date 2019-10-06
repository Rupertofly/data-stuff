export enum Dir {
  E,
  ENE,
  NE,
  NNE,
  N,
  NNW,
  NW,
  WNW,
  W,
  WSW,
  SW,
  SSW,
  S,
  SSE,
  SE,
  ESE,
}
const TAU = Math.PI * 2;
const { sin, cos, floor: flr } = Math;
export const degOfMv = 16;
export const turns: (d: Dir) => { left: Dir; right: Dir } = d => {
  return {
    left: (d + 1) % degOfMv,
    right: (degOfMv + d - 1) % degOfMv,
  };
};
export class MouldParticle {
  x: number;
  y: number;
  facing: Dir;
  constructor(x: number, y: number, n: Dir) {
    this.x = x;
    this.y = y;
    this.facing = n;
  }
}
const _qc: (...args: number[]) => [number, number] = (x, y, n, d) => {
  const deltaA = TAU / degOfMv;
  const angle = n * deltaA;
  return [flr(x + cos(angle) * d), flr(y + sin(angle) * d)];
};
export function getNewPosition(
  xp: number,
  yp: number,
  np: Dir,
  width: number,
  height: number,
  distance: number
): { x: number; y: number; facing: Dir };
export function getNewPosition(
  mp: MouldParticle,
  width: number,
  height: number,
  distance: number
): MouldParticle;
export function getNewPosition(
  ...args: (number | MouldParticle)[]
): { x: number; y: number; facing: Dir } | MouldParticle {
  let x: number;
  let y: number;
  let n: Dir;
  let wid: number;
  let hei: number;
  let stepLen: number;
  if (!(args[0] instanceof MouldParticle)) {
    x = args[0];
    y = args[1] as number;
    n = args[2] as Dir;
    wid = args[3] as number;
    hei = args[4] as number;
    stepLen = args[5] as number;
  } else {
    let ap = args[0] as MouldParticle;
    x = ap.x;
    y = ap.y;
    n = ap.facing;
    wid = args[1] as number;
    hei = args[2] as number;
    stepLen = args[3] as number;
  }
  let [nX, nY] = _qc(x, y, n, stepLen);
  nX = (wid + nX) % wid;
  nY = (hei + nY) % hei;
  return args[0] instanceof MouldParticle
    ? new MouldParticle(nX, nY, n)
    : { x: nX, y: nY, facing: n };
}
export function arrayStart(x: number, y: number, rad: number) {
  return 4 * (x + y * rad);
}
export function sense(
  pcl: MouldParticle,
  source: ArrayLike<number>,
  width: number,
  height: number,
  length: number
) {
  const currentDirection = pcl.facing;
  const { left, right } = turns(currentDirection);
  const leftSensorLocation = getNewPosition(
    pcl.x,
    pcl.y,
    left,
    width,
    height,
    length
  );
  const rightSensorLocation = getNewPosition(
    pcl.x,
    pcl.y,
    right,
    width,
    height,
    length
  );
  const forwardSensorLocation = getNewPosition(pcl, width, height, length);
  let [lVal, fVal, rVal] = [
    leftSensorLocation,
    forwardSensorLocation,
    rightSensorLocation,
  ].map(p => {
    return source[arrayStart(p.x, p.y, width)];
  });
  [lVal, fVal, rVal] = [lVal, fVal, rVal].map(n => (n > 200 ? 0 : n));
  let move = true;
  let nDirection = currentDirection;
  if (fVal > lVal && fVal > rVal) move = true;
  else if (fVal < lVal && fVal < rVal) {
    move = false;
    nDirection = Math.random() < 0.5 ? left : right;
  } else if (lVal < rVal) {
    move = false;
    nDirection = right;
  } else if (rVal < lVal) {
    move = false;
    nDirection = left;
  }

  return { particle: pcl, move, newDirection: nDirection };
}
export function move(
  pcl: MouldParticle,
  width: number,
  height: number,
  distance: number
) {
  return getNewPosition(pcl, width, height, distance);
}
export function turn(pcl: MouldParticle, direction: Dir) {
  return new MouldParticle(pcl.x, pcl.y, direction);
}
