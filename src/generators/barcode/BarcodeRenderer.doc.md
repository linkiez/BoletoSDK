# BarcodeRenderer

## Overview

Renders Interleaved 2 of 5 (I2of5) barcodes as SVG or PNG.

## Responsibilities

- Encode numeric barcode strings using I2of5 patterns
- Render bars as SVG rectangles with configurable sizing
- Render bars as PNG buffers for email/PDF use

## Inputs and outputs

- Input: numeric barcode string, optional rendering options
- Output: SVG string or PNG buffer

## API / Signature

```ts
export interface I2of5SvgOptions {
  height?: number;
  narrowWidth?: number;
  wideWidth?: number;
  quietZone?: number;
}

export function renderI2of5Svg(code: string, options?: I2of5SvgOptions): string;
export function renderI2of5Png(code: string, options?: I2of5SvgOptions): Buffer;
```

## Main flow

```mermaid
flowchart TD
  A[Numeric code] --> B[Normalize code]
  B --> C[Encode I2of5]
  C --> D[Render SVG]
  C --> E[Render PNG]
  D --> F[SVG string]
  E --> G[PNG buffer]
```

## Error handling and edge cases

- Throws when code contains non-numeric characters
- Pads odd-length codes with a leading zero

## Examples

```ts
const svg = renderI2of5Svg('34100000000000000000000000000000000000000000');
const png = renderI2of5Png('34100000000000000000000000000000000000000000');
```

## Dependencies and integrations

- Exposed via `src/generators/barcode/index.ts`
