import sharp from "sharp";

const assetJobs = [
  {
    input: "public/assets/common/process-steps.png",
    output: "public/assets/common/process-steps-highspeed.png",
  },
  {
    input: "public/assets/icons/why-speed.png",
    output: "public/assets/icons/why-speed-highspeed.png",
  },
  {
    input: "public/assets/icons/why-service.png",
    output: "public/assets/icons/why-service-highspeed.png",
  },
  {
    input: "public/assets/icons/why-registered.png",
    output: "public/assets/icons/why-registered-highspeed.png",
  },
  {
    input: "public/assets/icons/why-safe.png",
    output: "public/assets/icons/why-safe-highspeed.png",
  },
];

function rgbToHsl(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) return [0, 0, lightness];

  const difference = max - min;
  const saturation =
    lightness > 0.5 ? difference / (2 - max - min) : difference / (max + min);

  let hue;
  if (max === red) hue = (green - blue) / difference + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / difference + 2;
  else hue = (red - green) / difference + 4;

  return [(hue / 6) * 360, saturation, lightness];
}

function hueToRgb(p, q, t) {
  let value = t;
  if (value < 0) value += 1;
  if (value > 1) value -= 1;
  if (value < 1 / 6) return p + (q - p) * 6 * value;
  if (value < 1 / 2) return q;
  if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return [gray, gray, gray];
  }

  const hue = h / 360;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hueToRgb(p, q, hue + 1 / 3) * 255),
    Math.round(hueToRgb(p, q, hue) * 255),
    Math.round(hueToRgb(p, q, hue - 1 / 3) * 255),
  ];
}

async function recolor(job) {
  let pipeline = sharp(job.input).ensureAlpha();
  if (job.width && job.height) {
    pipeline = pipeline.resize(job.width, job.height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });

  for (let index = 0; index < data.length; index += info.channels) {
    if (data[index + 3] === 0) continue;

    const [hue, saturation, lightness] = rgbToHsl(
      data[index],
      data[index + 1],
      data[index + 2],
    );

    if (hue >= 245 && hue <= 315 && saturation >= 0.18) {
      const targetHue = lightness < 0.42 ? 226 : 220;
      const targetSaturation = Math.min(0.82, Math.max(0.48, saturation * 0.95));
      const [red, green, blue] = hslToRgb(targetHue, targetSaturation, lightness);
      data[index] = red;
      data[index + 1] = green;
      data[index + 2] = blue;
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(job.output);
}

for (const job of assetJobs) {
  await recolor(job);
}
