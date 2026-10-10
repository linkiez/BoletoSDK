interface TextStyle {
  size?: number;
  font?: 'regular' | 'bold' | 'mono';
  color?: string;
  align?: 'left' | 'center' | 'right';
  lineGap?: number;
}

interface FormCell {
  label: string;
  value: string;
  detail?: string;
  fraction: number;
  shaded?: boolean;
  borderless?: boolean;
  style?: TextStyle;
}

/**
 * Draws measured bank-form cells without truncating values or crossing page margins.
 * Domain sections stay in PdfRenderer; this class owns typography and geometry.
 */
export class PdfFormCanvas {
  public readonly colors = {
    ink: '#1A1D21',
    muted: '#666A70',
    border: '#DDE0E4',
    surface: '#F5F6F8',
    accent: '#E30016',
  };
  private readonly labelStyle: TextStyle = { size: 6, color: this.colors.muted };
  private readonly detailStyle: TextStyle = { size: 6.8, color: this.colors.muted };

  constructor(
    public readonly document: PDFKit.PDFDocument,
    private readonly fonts: Record<'regular' | 'bold' | 'mono', string>,
  ) {}

  get left(): number {
    return this.document.page.margins.left;
  }

  get width(): number {
    return this.document.page.width - this.left - this.document.page.margins.right;
  }

  get pageHeight(): number {
    const page = this.document.page;
    return page.height - page.margins.top - page.margins.bottom;
  }

  /** Measures the same font, wrapping and line spacing used for drawing. */
  public textHeight(value: string, width: number, style: TextStyle = {}): number {
    this.selectFont(style);
    return this.document.heightOfString(value, { width, lineGap: style.lineGap ?? 1 });
  }

  /** Draws selectable text; callers reserve the measured height before drawing. */
  public text(value: string, x: number, y: number, width: number, style: TextStyle = {}): void {
    this.selectFont(style);
    this.document.fillColor(style.color ?? this.colors.ink).text(value, x, y, {
      width,
      lineGap: style.lineGap ?? 1,
      align: style.align ?? 'left',
    });
  }

  /** Starts a continuation page when a complete block cannot fit at the cursor. */
  public reserve(height: number): number {
    if (height > this.pageHeight) {
      throw new Error('PDF form block exceeds the printable page height; split the content');
    }
    const bottom = this.document.page.height - this.document.page.margins.bottom;
    if (this.document.y + height > bottom) {
      this.document.addPage();
    }
    return this.document.y;
  }

  /** Measures all cells, including wrapped labels, values and addresses. */
  public rowHeight(cells: FormCell[], width = this.width, minimum = 30): number {
    return Math.max(
      minimum,
      ...cells.map((cell) => {
        const innerWidth = width * cell.fraction - 16;
        if (innerWidth <= 0) {
          throw new Error('PDF form column is too narrow for the configured page');
        }
        const labelHeight = cell.label
          ? this.textHeight(cell.label, innerWidth, this.labelStyle) + 3
          : 0;
        const valueHeight = this.textHeight(cell.value, innerWidth, cell.style);
        const detailHeight = cell.detail
          ? this.textHeight(cell.detail, innerWidth, this.detailStyle) + 3
          : 0;
        return 8 + labelHeight + valueHeight + detailHeight;
      }),
    );
  }

  /** Draws a full-width row and advances the cursor, keeping every cell together. */
  public row(cells: FormCell[], minimum = 30): void {
    const height = this.rowHeight(cells, this.width, minimum);
    const y = this.reserve(height);
    this.drawRow(cells, this.left, y, this.width, height);
    this.document.y = y + height;
  }

  /** Draws a previously measured row at an explicit position (including side panels). */
  public drawRow(cells: FormCell[], x: number, y: number, width: number, height: number): void {
    for (const cell of cells) {
      const cellWidth = width * cell.fraction;
      if (!cell.borderless) {
        this.document
          .rect(x, y, cellWidth, height)
          .lineWidth(0.4)
          .fillAndStroke(cell.shaded ? this.colors.surface : '#FFFFFF', this.colors.border);
      } else if (cell.shaded) {
        this.document.rect(x, y, cellWidth, height).fill(this.colors.surface);
      }
      let textY = y + 4;
      if (cell.label) {
        this.text(cell.label, x + 8, textY, cellWidth - 16, {
          ...this.labelStyle,
          align: cell.style?.align,
        });
        textY += this.textHeight(cell.label, cellWidth - 16, this.labelStyle) + 3;
      }
      this.text(cell.value, x + 8, textY, cellWidth - 16, cell.style);
      textY += this.textHeight(cell.value, cellWidth - 16, cell.style);
      if (cell.detail) {
        this.text(cell.detail, x + 8, textY + 3, cellWidth - 16, this.detailStyle);
      }
      x += cellWidth;
    }
  }

  /** Draws a thin separator, optionally dashed for the detachable payer receipt. */
  public rule(y: number, dashed = false): void {
    this.document.save().lineWidth(0.5).strokeColor(this.colors.border);
    if (dashed) this.document.dash(2, { space: 2 });
    this.document
      .moveTo(this.left, y)
      .lineTo(this.left + this.width, y)
      .stroke()
      .restore();
  }

  private selectFont(style: TextStyle): void {
    this.document.font(this.fonts[style.font ?? 'regular']).fontSize(style.size ?? 8);
  }
}
