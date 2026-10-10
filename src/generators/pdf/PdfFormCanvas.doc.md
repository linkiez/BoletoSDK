# PdfFormCanvas

## Overview

Internal PDFKit drawing helper for compact boleto forms. Domain fields and
section ordering belong to [PdfRenderer](./PdfRenderer.ts).

## Responsibilities

- Share the gray/charcoal palette, JCM brand red (`#E30016`) and registered regular/bold/mono fonts.
- Use sans-serif labels and details, reserving monospaced type for identifiers
  explicitly styled by the renderer.
- Measure wrapped text before drawing grid cells.
- Support borderless receipt fields and shaded payment summaries.
- Keep rows within page margins and move complete rows to continuation pages.
- Draw the detachable receipt's dashed separator.

## Inputs and outputs

The constructor receives an active PDFKit document and registered font names.
Cells specify a label, value, optional detail text, proportional width and
optional text style (including line spacing), shading and borderless rendering.
Right-aligned values also align their labels to the right.
Methods render into the document and update its cursor;
measurement methods return heights in PDF points.

## Main flow

`row` measures each cell with the drawing font/spacing, uses the tallest height,
reserves space, draws the full row and advances the cursor. `drawRow` is used by
the renderer for already-measured side-by-side notes and amount panels.

## Errors and edge cases

- Throws when a column has no usable text width.
- Throws when an indivisible block exceeds the printable page height.
- Never sets a clipping height or ellipsis on values.
- Labels, values and addresses can wrap independently.
- Measuring and drawing use identical line spacing, horizontal insets and
  vertical padding, including borderless fields.

## Example

```ts
canvas.row([
  { label: 'PAGADOR', value: data.payer.name, detail: data.payer.address, fraction: 1 },
]);
```

## Dependencies and integrations

Uses PDFKit only. Font files are registered by `DirectPdfGenerator`; no font
downloads, external styling assets or additional runtime dependencies are used.
