import p5 from 'p5';

const TAU = Math.PI * 2;
type Vec = p5.Vector;
export const sketch = (gfx: p5) => {
  const capturer = new CCapture({
    format: 'webm',
    name: 'mould' + new Date().toISOString(),
    framerate: 30,
    timeLimit: 30,
    verbose: true,
    // motionBlurFrames: 1,
    quality: 100,
  });

  let myCanvas: HTMLCanvasElement;
  let exp = p5;
  // setup
  gfx.setup = () => {
    myCanvas = gfx.createCanvas(720, 720, 'p2d').elt;
    gfx.noSmooth();
    capturer.start();
  };
  // draw

  gfx.draw = () => {
    capturer.capture(myCanvas);
  };
};
export default sketch;
