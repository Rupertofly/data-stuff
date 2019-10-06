enum Dir {
  E,
  N,
  W,
  S,
}
export const turns: (d: Dir) => { left: Dir; right: Dir } = d => {
  return {
    left: (d + 1) % 4,
    right: (4 + d - 1) % 4,
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
export declare function getNewPosition(
  xp: number,
  yp: number,
  np: Dir,
  width: number,
  height: number,
  distance: number
): { x: number; y: number; facing: Dir };
export declare function getNewPosition(
  mp: MouldParticle,
  width: number,
  height: number,
  distance: number
): MouldParticle;
export function getNewPosition(...args: (number | MouldParticle)[]) {
  let x: number;
  let y: number;
  let n: Dir;
  if (!(args[0] instanceof MouldParticle)) {
    x = args[0];
    y = args[1] as number;
    n = args[2] as Dir;
  } else {
    let ap = args[0] as MouldParticle;
    x = ap.x;
    y = ap.y;
    n = ap.facing;
  }
}
