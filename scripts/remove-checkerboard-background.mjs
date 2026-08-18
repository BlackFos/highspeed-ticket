/* global Buffer, console, process */

import sharp from "sharp";

const input =
  process.argv[2] ?? "assets/_source/highspeed-hero-imagegen-v1.png";
const output = process.argv[3] ?? "public/assets/common/highspeed-hero-v1.png";

const { data, info } = await sharp(input)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixelCount = info.width * info.height;
const background = new Uint8Array(pixelCount);
const queued = new Uint8Array(pixelCount);
const queue = new Int32Array(pixelCount);
let head = 0;
let tail = 0;

function isCheckerPixel(pixelIndex) {
  const offset = pixelIndex * info.channels;
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);

  return minimum >= 222 && maximum - minimum <= 5;
}

function enqueue(pixelIndex) {
  if (queued[pixelIndex] || !isCheckerPixel(pixelIndex)) return;
  queued[pixelIndex] = 1;
  queue[tail] = pixelIndex;
  tail += 1;
}

for (let x = 0; x < info.width; x += 1) {
  enqueue(x);
  enqueue((info.height - 1) * info.width + x);
}

for (let y = 0; y < info.height; y += 1) {
  enqueue(y * info.width);
  enqueue(y * info.width + info.width - 1);
}

while (head < tail) {
  const pixelIndex = queue[head];
  head += 1;
  background[pixelIndex] = 1;

  const x = pixelIndex % info.width;
  const y = Math.floor(pixelIndex / info.width);
  if (x > 0) enqueue(pixelIndex - 1);
  if (x + 1 < info.width) enqueue(pixelIndex + 1);
  if (y > 0) enqueue(pixelIndex - info.width);
  if (y + 1 < info.height) enqueue(pixelIndex + info.width);
}

const rgba = Buffer.alloc(pixelCount * 4);
for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
  const sourceOffset = pixelIndex * info.channels;
  const targetOffset = pixelIndex * 4;
  rgba[targetOffset] = data[sourceOffset];
  rgba[targetOffset + 1] = data[sourceOffset + 1];
  rgba[targetOffset + 2] = data[sourceOffset + 2];
  rgba[targetOffset + 3] = background[pixelIndex] ? 0 : 255;
}

await sharp(rgba, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
})
  .resize(398, 422, {
    fit: "cover",
    position: "centre",
  })
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log(
  JSON.stringify({
    input,
    output,
    source: `${info.width}x${info.height}`,
    outputSize: "398x422",
    transparentPixels: background.reduce((sum, value) => sum + value, 0),
  }),
);
