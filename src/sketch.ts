import p5 from 'p5';
import {
  range,
  interpolateBasisClosed,
  interpolateRainbow,
  hcl,
  mean,
  cubehelix,
} from 'd3';
import { random } from 'node-forge';
const TAU = Math.PI * 2;
type Vec = p5.Vector;
export const sketch = (gfx: p5) => {
  // starters
  const capturer = new CCapture({
    format: 'webm',
    name: 'preylikeThingo' + new Date(),
    framerate: 60,
    timeLimit: 30,
    verbose: true,
  });
  const points = range(64).map(i => ({
    t: i / 64,
    point: new p5.Vector(),
    history: new Array<Vec>(),
  }));
  const handles = range(5).map(i => ({
    pos: p5.Vector.fromAngle(i * (TAU / 5) + gfx.random(TAU / 4), 200),
    vel: 0.02 + gfx.random(0.005, 0.009),
    history: new Array<Vec>(),
  }));
  const VecInterpolator = (points: Vec[]) => {
    const iX = interpolateBasisClosed(points.map(v => v.x));
    const iY = interpolateBasisClosed(points.map(v => v.y));

    return (t: number) => new p5.Vector().set(iX(t), iY(t));
  };
  let myCanvas: HTMLCanvasElement;
  // setup
  gfx.setup = () => {
    myCanvas = gfx.createCanvas(720, 720).elt;
    gfx.background(55, 256);
    gfx.smooth();
    capturer.start();
  };
  // draw
  gfx.draw = () => {
    // gfx.filter('blur', 8);
    gfx.background(55, 200);
    let pFunc = VecInterpolator(handles.map(h => h.pos));
    gfx.translate(360, 360);
    gfx.rectMode('center');
    gfx.noFill();
    gfx.stroke(200);
    gfx.strokeWeight(0.5);
    gfx.rect(-0, -0, 280, 280);
    gfx.ellipse(0, 0, 400);
    handles.forEach(({ pos }) => {
      gfx.beginShape();
      const fst = pos.copy().mult(1.05);
      const lst = pos.copy().mult(0.95);
      gfx.line(fst.x, fst.y, lst.x, lst.y);
    });
    gfx.strokeWeight(1.5);
    gfx.noStroke();
    for (const point of points) {
      for (let i = point.history.length - 1; i > -1; i--) {
        const { x, y } = point.history[i];
        const { length } = point.history;
        let colour = cubehelix(interpolateRainbow(point.t));
        colour.l = 0.2 + 0.2 * (1 - i / length);
        colour.s = 1.1;
        colour.opacity = 0.4;
        gfx.fill(colour.toString());
        gfx.ellipse(x, y, 6 - (i / length) * 5);
      }
    }
    gfx.strokeWeight(4);
    for (const point of points) {
      const t = point.t;
      gfx.stroke(interpolateRainbow(t));
      point.point = pFunc(t);
      const end = pFunc(t + 1 / 64);
      const r = point.point.dist(end) * 0.8;
      gfx.line(point.point.x, point.point.y, end.x, end.y);
      point.history.unshift(point.point);
      if (point.history.length > 64) point.history.length = 64;
    }
    const scale = 1000;
    for (const i of range(5)) {
      const h = handles[i];
      h.pos = h.pos.rotate(h.vel);
      h.vel =
        0.06 * gfx.noise((3 * i + gfx.frameCount) / scale, i * scale) - 0.03;
    }

    capturer.capture(myCanvas);
  };
  const colours = range(0, 1, 1 / 256).map(t =>
    cubehelix(interpolateRainbow(t))
  );
  const chromaMean = mean(colours.map(c => c.s));
  const lumaMean = mean(colours.map(c => c.l));
  console.log(`chroma: ${chromaMean} lumaMean: ${lumaMean}`);
};
export default sketch;
