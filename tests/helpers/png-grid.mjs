import { inflateSync } from 'node:zlib';

function paeth(left, above, upperLeft) {
  const prediction = left + above - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const aboveDistance = Math.abs(prediction - above);
  const upperLeftDistance = Math.abs(prediction - upperLeft);
  if (leftDistance <= aboveDistance && leftDistance <= upperLeftDistance) return left;
  return aboveDistance <= upperLeftDistance ? above : upperLeft;
}

export function readPng(buffer) {
  if (buffer.toString('hex', 1, 4) !== '504e47') throw new TypeError('Expected a PNG image.');
  let offset = 8;
  let width;
  let height;
  let colorType;
  const compressed = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      assertSupported(data[8], data[9]);
      colorType = data[9];
    } else if (type === 'IDAT') compressed.push(data);
    offset += length + 12;
  }

  const channels = colorType === 6 ? 4 : 3;
  const rowLength = width * channels;
  const source = inflateSync(Buffer.concat(compressed));
  const pixels = Buffer.alloc(rowLength * height);
  let sourceOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = source[sourceOffset++];
    const rowOffset = y * rowLength;
    for (let x = 0; x < rowLength; x += 1) {
      const raw = source[sourceOffset++];
      const left = x >= channels ? pixels[rowOffset + x - channels] : 0;
      const above = y > 0 ? pixels[rowOffset + x - rowLength] : 0;
      const upperLeft = y > 0 && x >= channels ? pixels[rowOffset + x - rowLength - channels] : 0;
      const predictor = filter === 0 ? 0
        : filter === 1 ? left
          : filter === 2 ? above
            : filter === 3 ? Math.floor((left + above) / 2)
              : filter === 4 ? paeth(left, above, upperLeft) : NaN;
      if (Number.isNaN(predictor)) throw new TypeError(`Unsupported PNG filter: ${filter}.`);
      pixels[rowOffset + x] = (raw + predictor) & 255;
    }
  }

  return { width, height, channels, pixels };
}

function assertSupported(bitDepth, colorType) {
  if (bitDepth !== 8 || ![2, 6].includes(colorType)) throw new TypeError(`Unsupported PNG format: depth ${bitDepth}, color type ${colorType}.`);
}

export function pixelGrid(image, columns = 8, rows = 6) {
  const values = [];
  const { width, height, channels, pixels } = image;
  for (let row = 0; row < rows; row += 1) {
    const startY = Math.floor(row * height / rows);
    const endY = Math.floor((row + 1) * height / rows);
    for (let column = 0; column < columns; column += 1) {
      const startX = Math.floor(column * width / columns);
      const endX = Math.floor((column + 1) * width / columns);
      const totals = [0, 0, 0];
      let count = 0;
      for (let y = startY; y < endY; y += 2) {
        for (let x = startX; x < endX; x += 2) {
          const offset = (y * width + x) * channels;
          totals[0] += pixels[offset];
          totals[1] += pixels[offset + 1];
          totals[2] += pixels[offset + 2];
          count += 1;
        }
      }
      values.push(...totals.map((total) => Math.round(total / count)));
    }
  }
  return values;
}
