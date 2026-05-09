export type PdfLayout = 'simple' | 'instructions' | 'detailed';

export interface PdfMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PdfFontOptions {
  regularPath?: string;
  boldPath?: string;
  monoPath?: string;
}

export interface PdfBarcodeOptions {
  /** Rendered barcode width in PDF points (default: 350). */
  width?: number;
  /** Rendered barcode height in PDF points (default: 50). */
  height?: number;
}

export interface PdfTemplateOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  includePixQr?: boolean;
  /** Whether to render the barcode as an image (default: true). */
  includeBarcode?: boolean;
  /** Barcode image rendering dimensions. */
  barcode?: PdfBarcodeOptions;
  pageSize?: string | [number, number];
  layout?: PdfLayout;
  compress?: boolean;
  boletosPerPage?: number;
  sectionSpacing?: number;
  margins?: number | Partial<PdfMargins>;
  bleed?: number;
  fonts?: PdfFontOptions;
}

export interface ResolvedPdfTemplateOptions {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  includePixQr: boolean;
  includeBarcode: boolean;
  barcode: Required<PdfBarcodeOptions>;
  pageSize: string | [number, number];
  layout: PdfLayout;
  compress: boolean;
  boletosPerPage: number;
  sectionSpacing: number;
  margins: PdfMargins;
  bleed: number;
  fonts: PdfFontOptions;
}

export interface PdfLayoutFlags {
  showInstructions: boolean;
  showAdditionalInfo: boolean;
}

const DEFAULT_TEMPLATE_OPTIONS: ResolvedPdfTemplateOptions = {
  title: 'Boleto',
  author: 'BoletoSDK',
  subject: '',
  keywords: '',
  creator: 'BoletoSDK',
  includePixQr: false,
  includeBarcode: true,
  barcode: { width: 350, height: 50 },
  pageSize: 'A4',
  layout: 'detailed',
  compress: true,
  boletosPerPage: 1,
  sectionSpacing: 0,
  margins: {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
  },
  bleed: 0,
  fonts: {},
};

/**
 * Resolves PDF template options with stable defaults.
 *
 * @param options - Partial PDF rendering options.
 * @returns Resolved options with defaults applied.
 */
export function resolvePdfTemplateOptions(
  options: PdfTemplateOptions = {},
): ResolvedPdfTemplateOptions {
  const boletosPerPage = normalizePositiveInteger(
    options.boletosPerPage,
    DEFAULT_TEMPLATE_OPTIONS.boletosPerPage,
  );
  const sectionSpacing = normalizeNonNegativeNumber(
    options.sectionSpacing,
    DEFAULT_TEMPLATE_OPTIONS.sectionSpacing,
  );
  const margins = normalizeMargins(options.margins, DEFAULT_TEMPLATE_OPTIONS.margins);
  const bleed = normalizeNonNegativeNumber(options.bleed, DEFAULT_TEMPLATE_OPTIONS.bleed);

  return {
    title: options.title ?? DEFAULT_TEMPLATE_OPTIONS.title,
    author: options.author ?? DEFAULT_TEMPLATE_OPTIONS.author,
    subject: options.subject ?? DEFAULT_TEMPLATE_OPTIONS.subject,
    keywords: options.keywords ?? DEFAULT_TEMPLATE_OPTIONS.keywords,
    creator: options.creator ?? DEFAULT_TEMPLATE_OPTIONS.creator,
    includePixQr: options.includePixQr ?? DEFAULT_TEMPLATE_OPTIONS.includePixQr,
    includeBarcode: options.includeBarcode ?? DEFAULT_TEMPLATE_OPTIONS.includeBarcode,
    barcode: {
      width: normalizeDimension(options.barcode?.width, DEFAULT_TEMPLATE_OPTIONS.barcode.width),
      height: normalizeDimension(options.barcode?.height, DEFAULT_TEMPLATE_OPTIONS.barcode.height),
    },
    pageSize: options.pageSize ?? DEFAULT_TEMPLATE_OPTIONS.pageSize,
    layout: options.layout ?? DEFAULT_TEMPLATE_OPTIONS.layout,
    compress: options.compress ?? DEFAULT_TEMPLATE_OPTIONS.compress,
    boletosPerPage,
    sectionSpacing,
    margins,
    bleed,
    fonts: {
      regularPath: normalizeString(options.fonts?.regularPath),
      boldPath: normalizeString(options.fonts?.boldPath),
      monoPath: normalizeString(options.fonts?.monoPath),
    },
  };
}

/**
 * Derives layout visibility flags from a PDF layout mode.
 *
 * @param layout - Layout mode.
 * @returns Flags controlling optional sections.
 */
export function derivePdfLayoutFlags(layout: PdfLayout): PdfLayoutFlags {
  return {
    showInstructions: layout !== 'simple',
    showAdditionalInfo: layout === 'detailed',
  };
}

function normalizeDimension(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
}

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  const normalized = Math.floor(value);
  return normalized > 0 ? normalized : fallback;
}

function normalizeNonNegativeNumber(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return value >= 0 ? value : fallback;
}

function normalizeMargins(
  value: number | Partial<PdfMargins> | undefined,
  fallback: PdfMargins,
): PdfMargins {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const normalized = Math.max(value, 0);
    return {
      top: normalized,
      right: normalized,
      bottom: normalized,
      left: normalized,
    };
  }

  if (!value || typeof value !== 'object') {
    return { ...fallback };
  }

  return {
    top: normalizeNonNegativeNumber(value.top, fallback.top),
    right: normalizeNonNegativeNumber(value.right, fallback.right),
    bottom: normalizeNonNegativeNumber(value.bottom, fallback.bottom),
    left: normalizeNonNegativeNumber(value.left, fallback.left),
  };
}

function normalizeString(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
