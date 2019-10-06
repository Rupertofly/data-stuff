import {
  select,
  range,
  rgb,
  interpolateCubehelixLong,
  hcl,
  interpolate,
  easeCircleInOut,
} from 'd3';
import { arrayStart, Dir, MouldParticle, sense, move } from './mouldUtils';

// import p5 from 'p5';
// import sketch from './backupSketch';
// const TAU = 2 * Math.PI;
// const instance = new p5(sketch, document.querySelector(
//   '#base-div'
// )! as HTMLElement);
const { random: rand, floor: flr } = Math;
const [width, height] = [512, 512];
const drawingCanvas = select('body')
  .append('canvas')
  .style('width', width)
  .style('height', height)
  .attr('width', width)
  .attr('height', height);
const capturer = new CCapture({
  format: 'webm',
  name: 'mould' + new Date().toISOString(),
  framerate: 60,
  timeLimit: 30,
  verbose: true,
  // motionBlurFrames: 1,
  quality: 100,
});

const gfx = drawingCanvas.node()!.getContext('2d')!;
gfx.fillStyle = 'black';
const startingData = gfx.getImageData(0, 0, width, height);
gfx.fillRect(0, 0, width, height);
for (let x of range(width))
  for (let y of range(height)) {
    const pos = arrayStart(x, y, width);
    const value = flr(easeCircleInOut(rand()) * 150);
    startingData.data.set([value, value, value, 255], pos);
  }
gfx.putImageData(startingData, 0, 0);

const startingParticles = range(0.08 * width * height).map(i => {
  const [x, y] = [flr(width * rand()), flr(height * rand())];
  const d = flr(rand() * 16) as Dir;
  return new MouldParticle(x, y, d);
});
console.log(startingParticles);
const hcl2 = hcl('#00f494');
const hcl1 = hcl('#2f0a4a');
const hLerp = interpolate(hcl1.h, hcl2.h);
const cLerp = interpolate(hcl1.c, hcl2.c);
const lLerp = interpolate(hcl1.l, hcl2.l);
const hclLerp = (t: number) => {
  const h = hLerp(t);
  const c = cLerp(t);
  const l = lLerp(t);
  return hcl(h, l, c);
};
capturer.start();
capturer.capture(drawingCanvas.node()!);
const renderLoop = (t: number, data: ImageData, pcls: MouldParticle[]) => {
  const senseArr = pcls.map(p => {
    return sense(p, data.data, data.width, data.height, 16);
  });
  const newPos = senseArr.map(s => {
    if (s.move) {
      const movedPcl = move(s.particle, data.width, data.height, 2);
      const { x: nX, y: nY } = movedPcl;
      data.data.set(
        [255, 255, 255, 255],
        arrayStart(movedPcl.x, movedPcl.y, data.width)
      );
      return movedPcl;
    } else {
      return new MouldParticle(s.particle.x, s.particle.y, s.newDirection);
    }
  });
  for (let x of range(width))
    for (let y of range(height)) {
      let avg = 0;
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++) {
          let nx = (width + x + dx) % width;
          let ny = (height + y + dy) % height;
          avg += data.data[arrayStart(nx, ny, width)] * 0.105;
        }
      avg = flr(avg);
      data.data.set([avg, avg, avg, 255], arrayStart(x, y, width));
    }
  gfx.putImageData(data, 0, 0);
  let newData = gfx.getImageData(0, 0, width, height);
  const itch = interpolateCubehelixLong('#2f0a4a', '#00f494');
  for (let i = 0; i < newData.data.length; i = i + 4) {
    const v = newData.data[i] / 255;
    const col = rgb(hclLerp(easeCircleInOut(v)));
    newData.data.set([col.r, col.g, col.b, 255], i);
  }
  gfx.putImageData(newData, 0, 0);
  capturer.capture(drawingCanvas.node()!);
  requestAnimationFrame(() => renderLoop(0, data, newPos));
};
requestAnimationFrame(() => renderLoop(0, startingData, startingParticles));
