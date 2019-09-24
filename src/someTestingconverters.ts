type p = [number, number];
type c = [number, number, number];
function fromVecToCol(x, y) {
  const xTl = x & 15;
  const yTl = y & 15;
  const xHd = (x & 4080) >> 4;
  const yHd = (y & 4080) >> 4;
  return [xHd, (xTl << 4) + yTl, yHd] as c;
}
let f = fromVecToCol(32, 76);
const floaterise = (a: c) => a.map(n => n / 255) as c;

const fromColToVec = (r, g, b) =>
  [(r << 4) + (g >> 4), (b << 4) + (g & 15)] as p;
const defloaterise = (a: c) => a.map(n => n * 255) as c;
const outliers = [];
for (let x = 0; x < 720; x++) {
  for (let y = 719; y >= 0; y--) {
    const intC = fromVecToCol(x, y);
    const floatC = floaterise(intC);
    const deFloat = defloaterise(floatC);
    const [z, w] = fromColToVec(...deFloat);
    if (x !== z || y !== w) {
      outliers.push(`in: ${x + ',' + y} out: ${z + ',' + w}`);
    }
  }
}
console.log(outliers);
