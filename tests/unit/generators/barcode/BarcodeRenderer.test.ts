import { renderI2of5Svg } from '@generators/barcode';

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
});
