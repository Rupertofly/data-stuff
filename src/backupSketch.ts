// / <reference path="./global.d.ts" />

import p5 from 'p5';
import regl from 'regl';
import fr from './test.frag';
import vr from './test.vert';
import { range, interpolateHclLong, rgb, interpolate, hcl } from 'd3';

const TAU = Math.PI * 2;
new p5.Image();
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

  let myCanvas: p5.Renderer;
  let fxf = capturer;
  // setup
  gfx.setup = () => {
    myCanvas = gfx.createCanvas(720, 720, 'p2d');
    gfx.noSmooth();
    // capturer.start();
    const cv = document.createElement('canvas');
    gfx.background(0);
    // document.querySelector('#base-div')!.append(cv);
    cv.setAttribute('width', '720');
    cv.setAttribute('height', '720');
    const glGfx = regl(
      cv.getContext('webgl', { preserveDrawingBuffer: true })!
    );
    const uniforms: any = {};
    const hcl1 = hcl('#00f494');
    const hcl2 = hcl('#2f0a4a');
    const hLerp = interpolate(hcl1.h, hcl2.h);
    const cLerp = interpolate(hcl1.c, hcl2.c);
    const lLerp = interpolate(hcl1.l, hcl2.l);
    const hclLerp = (t: number) => {
      const h = hLerp(t);
      const c = cLerp(t);
      const l = lLerp(t);
      return hcl(h, l, c);
    };
    let cinterpolator = interpolateHclLong(rgb('#00f494'), rgb('#2f0a4a'));
    range(128).forEach(i => {
      const t = i / 127;
      const col = cinterpolator(t);
      const o = rgb(col);
      uniforms[`col_map[${i}]`] = [o.r / 255, o.g / 255, o.b / 255];
    });
    glGfx.clear({ color: [0, 0, 1, 1] });
    glGfx({
      vert: vr,
      frag: fr,
      uniforms: uniforms,
      attributes: {
        position: [-2, 0, 0, -2, 2, 2],
      },
      count: 3,
    })();
    const ot = glGfx.read();
    (myCanvas as any).drawingContext.putImageData(
      new ImageData(new Uint8ClampedArray(ot), 720, 720),
      0,
      0
    );
  };
  // draw

  gfx.draw = () => {
    // capturer.capture(myCanvas);
  };
};
export default sketch;
