import { renderI2of5Png, renderI2of5Svg } from '@generators/barcode';

describe('renderI2of5Svg', () => {
  it('should render an SVG with bars for numeric input', () => {
    const svg = renderI2of5Svg('1234');
    const rectCount = (svg.match(/<rect /g) ?? []).length;

    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(rectCount).toBe(14);
  });

  it('should honor height option', () => {
    const svg = renderI2of5Svg('12', { height: 24 });
    expect(svg).toContain('height="24"');
  });

  it('should render a PNG buffer for numeric input', () => {
    const png = renderI2of5Png('1234', { height: 32 });

    expect(Buffer.isBuffer(png)).toBe(true);
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  });
});
