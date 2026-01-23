export interface I2of5SvgOptions {
  height?: number;
  narrowWidth?: number;
  wideWidth?: number;
  quietZone?: number;
}

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
  if (!code || !/^\d+$/.test(code)) {
    throw new Error('Barcode must contain only numeric characters');
  }

  const height = options.height ?? DEFAULT_HEIGHT;
  const narrowWidth = options.narrowWidth ?? DEFAULT_NARROW;
  const wideWidth = options.wideWidth ?? DEFAULT_WIDE;
  const quietZone = options.quietZone ?? DEFAULT_QUIET;

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

  const totalWidth = x + quietZone;
  const rects = bars
    .map((bar) => `<rect x="${bar.x}" y="0" width="${bar.width}" height="${height}" fill="#000" />`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" shape-rendering="crispEdges">${rects}</svg>`;
}

function normalizeCode(code: string): string {
  if (code.length % 2 === 0) {
    return code;
  }

  return `0${code}`;
}
