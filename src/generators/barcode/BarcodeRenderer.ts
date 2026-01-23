import { PNG } from 'pngjs';

export interface I2of5SvgOptions {
  height?: number;
  narrowWidth?: number;
  wideWidth?: number;
  quietZone?: number;
}

export type I2of5PngOptions = I2of5SvgOptions;

const DIGIT_PATTERNS: Array<Array<'n' | 'w'>> = [
  ['n', 'n', 'w', 'w', 'n'],
  ['w', 'n', 'n', 'n', 'w'],
  ['n', 'w', 'n', 'n', 'w'],
  ['w', 'w', 'n', 'n', 'n'],
  ['n', 'n', 'w', 'n', 'w'],
  ['w', 'n', 'w', 'n', 'n'],
  ['n', 'w', 'w', 'n', 'n'],
  ['n', 'n', 'n', 'w', 'w'],
  ['w', 'n', 'n', 'w', 'n'],
  ['n', 'w', 'n', 'w', 'n'],
];

const DEFAULT_HEIGHT = 50;
const DEFAULT_NARROW = 1;
const DEFAULT_WIDE = 3;
const DEFAULT_QUIET = 10;

export function renderI2of5Svg(code: string, options: I2of5SvgOptions = {}): string {
  const layout = buildI2of5Layout(code, options);
  const rects = layout.bars
    .map(
      (bar) =>
        `<rect x="${bar.x}" y="0" width="${bar.width}" height="${layout.height}" fill="#000" />`,
    )
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${layout.totalWidth}" height="${layout.height}" viewBox="0 0 ${layout.totalWidth} ${layout.height}" shape-rendering="crispEdges">${rects}</svg>`;
}

export function renderI2of5Png(code: string, options: I2of5PngOptions = {}): Buffer {
  const layout = buildI2of5Layout(code, options);
  const png = new PNG({ width: layout.totalWidth, height: layout.height, colorType: 6 });

  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = 255;
    png.data[i + 1] = 255;
    png.data[i + 2] = 255;
    png.data[i + 3] = 255;
  }

  layout.bars.forEach((bar) => {
    const startX = Math.max(0, bar.x);
    const endX = Math.min(layout.totalWidth, bar.x + bar.width);

    for (let y = 0; y < layout.height; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        const index = (layout.totalWidth * y + x) * 4;
        png.data[index] = 0;
        png.data[index + 1] = 0;
        png.data[index + 2] = 0;
        png.data[index + 3] = 255;
      }
    }
  });

  return PNG.sync.write(png);
}

function normalizeCode(code: string): string {
  if (code.length % 2 === 0) {
    return code;
  }

  return `0${code}`;
}

function buildI2of5Layout(
  code: string,
  options: I2of5SvgOptions,
): {
  bars: Array<{ x: number; width: number }>;
  totalWidth: number;
  height: number;
} {
  if (!code || !/^\d+$/.test(code)) {
    throw new Error('Barcode must contain only numeric characters');
  }

  const height = normalizeDimension(options.height ?? DEFAULT_HEIGHT, 'Height');
  const narrowWidth = normalizeDimension(options.narrowWidth ?? DEFAULT_NARROW, 'Narrow width');
  const wideWidth = normalizeDimension(options.wideWidth ?? DEFAULT_WIDE, 'Wide width');
  const quietZone = normalizeDimension(options.quietZone ?? DEFAULT_QUIET, 'Quiet zone');

  const normalizedCode = normalizeCode(code);
  const bars: Array<{ x: number; width: number }> = [];
  let x = quietZone;

  const pushElement = (isBar: boolean, width: number): void => {
    if (isBar) {
      bars.push({ x, width });
    }
    x += width;
  };

  const pushPattern = (pattern: Array<'n' | 'w'>, startsWithBar: boolean): void => {
    let isBar = startsWithBar;
    pattern.forEach((token) => {
      const width = token === 'n' ? narrowWidth : wideWidth;
      pushElement(isBar, width);
      isBar = !isBar;
    });
  };

  pushPattern(['n', 'n', 'n', 'n'], true);

  for (let i = 0; i < normalizedCode.length; i += 2) {
    const left = Number(normalizedCode[i]);
    const right = Number(normalizedCode[i + 1]);
    const leftPattern = DIGIT_PATTERNS[left];
    const rightPattern = DIGIT_PATTERNS[right];

    for (let j = 0; j < 5; j += 1) {
      const barWidth = leftPattern[j] === 'n' ? narrowWidth : wideWidth;
      const spaceWidth = rightPattern[j] === 'n' ? narrowWidth : wideWidth;
      pushElement(true, barWidth);
      pushElement(false, spaceWidth);
    }
  }

  pushPattern(['w', 'n', 'n'], true);

  return {
    bars,
    totalWidth: x + quietZone,
    height,
  };
}

function normalizeDimension(value: number, fieldName: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }

  return Math.max(1, Math.round(value));
}
