import {
  select,
  range,
  interpolateCubehelixDefault,
  interpolateInferno,
} from 'd3';
import p5 from 'p5';
import sketch from './sketch';

const TAU = 2 * Math.PI;
const instance = new p5(sketch, document.querySelector(
  '#base-div'
)! as HTMLElement);
