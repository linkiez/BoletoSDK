import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import PDFDocument from 'pdfkit';
import { createReadStream, createWriteStream, statSync, unlink } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Readable } from 'node:stream';
import {
  renderBoletoToPdf,
  type PdfRendererDependencies,
  type PdfRendererFonts,
} from './PdfRenderer';
import {
  resolvePdfTemplateOptions,
  type PdfTemplateOptions,
  type ResolvedPdfTemplateOptions,
} from './PdfTemplate';

/**
 * Generates a boleto PDF directly with PDFKit and returns it as buffer.
 *
 * @param data - Boleto template data.
 * @param options - Optional PDF template options.
 * @param dependencies - Optional renderer dependencies.
 * @returns Generated PDF bytes.
 */
export async function generateDirectPdfBuffer(
  data: BoletoTemplateData,
  options: PdfTemplateOptions = {},
  dependencies: PdfRendererDependencies = {},
): Promise<Buffer> {
  return generateDirectPdfBuffers([data], options, dependencies);
}

/**
 * Generates a boleto PDF as readable stream to reduce memory usage.
 *
 * @param data - Boleto template data.
 * @param options - Optional PDF template options.
 * @param dependencies - Optional renderer dependencies.
 * @returns Readable stream with generated PDF bytes.
 */
export async function generateDirectPdfStream(
  data: BoletoTemplateData,
  options: PdfTemplateOptions = {},
  dependencies: PdfRendererDependencies = {},
): Promise<Readable> {
  return generateDirectPdfStreams([data], options, dependencies);
}

/**
 * Generates a PDF buffer for multiple boletos with configurable pagination.
 *
 * @param dataList - List of boleto template data.
 * @param options - Optional PDF template options.
 * @param dependencies - Optional renderer dependencies.
 * @returns Generated PDF bytes.
 */
export async function generateDirectPdfBuffers(
  dataList: BoletoTemplateData[],
  options: PdfTemplateOptions = {},
  dependencies: PdfRendererDependencies = {},
): Promise<Buffer> {
  const pdfStream = await generateDirectPdfStreams(dataList, options, dependencies);
  return streamToBuffer(pdfStream);
}

/**
 * Generates a PDF stream for multiple boletos with configurable pagination.
 *
 * @param dataList - List of boleto template data.
 * @param options - Optional PDF template options.
 * @param dependencies - Optional renderer dependencies.
 * @returns Readable stream for generated PDF.
 */
export async function generateDirectPdfStreams(
  dataList: BoletoTemplateData[],
  options: PdfTemplateOptions = {},
  dependencies: PdfRendererDependencies = {},
): Promise<Readable> {
  if (dataList.length === 0) {
    throw new Error('At least one boleto is required to generate PDF');
  }

  const resolvedOptions = resolvePdfTemplateOptions(options);
  const tempOutputPath = join(tmpdir(), `boletosdk-${randomUUID()}.pdf`);
  const output = createWriteStream(tempOutputPath);
  const pdf = createPdfDocument(resolvedOptions);
  const rendererDependencies = resolveRendererDependencies(
    pdf,
    resolvedOptions,
    dependencies,
  );

  const completion = new Promise<void>((resolve, reject) => {
    output.on('finish', resolve);
    output.on('error', reject);
    pdf.on('error', reject);
  });

  pdf.pipe(output);
  await renderDataListToPdf(pdf, dataList, resolvedOptions, rendererDependencies);
  pdf.end();

  await completion;

  const stream = createReadStream(tempOutputPath);
  stream.on('close', () => {
    unlink(tempOutputPath, () => undefined);
  });

  return stream;
}

async function renderDataListToPdf(
  pdf: PDFKit.PDFDocument,
  dataList: BoletoTemplateData[],
  options: ResolvedPdfTemplateOptions,
  dependencies: PdfRendererDependencies,
): Promise<void> {
  for (let index = 0; index < dataList.length; index += 1) {
    const data = dataList[index];
    await renderBoletoToPdf(pdf, data, options, dependencies);

    const isLast = index === dataList.length - 1;
    if (isLast) {
      continue;
    }

    const isPageBoundary = (index + 1) % options.boletosPerPage === 0;

    if (isPageBoundary) {
      pdf.addPage();
      continue;
    }

    addSectionSpacing(pdf, options.sectionSpacing);
  }
}

function createPdfDocument(options: ResolvedPdfTemplateOptions): PDFKit.PDFDocument {
  const pageMargins = {
    top: options.margins.top + options.bleed,
    right: options.margins.right + options.bleed,
    bottom: options.margins.bottom + options.bleed,
    left: options.margins.left + options.bleed,
  };

  const info: Record<string, string | Date> = {
    Title: options.title,
    Author: options.author,
    Creator: options.creator,
    CreationDate: new Date(),
  };

  if (options.subject) {
    info['Subject'] = options.subject;
  }

  if (options.keywords) {
    info['Keywords'] = options.keywords;
  }

  return new PDFDocument({
    size: options.pageSize,
    margins: pageMargins,
    compress: options.compress,
    info,
  });
}

function resolveRendererDependencies(
  pdf: PDFKit.PDFDocument,
  options: ResolvedPdfTemplateOptions,
  dependencies: PdfRendererDependencies,
): PdfRendererDependencies {
  const registeredFonts = registerEmbeddedFonts(pdf, options);
  return {
    ...dependencies,
    fonts: {
      ...registeredFonts,
      ...dependencies.fonts,
    },
  };
}

function registerEmbeddedFonts(
  pdf: PDFKit.PDFDocument,
  options: ResolvedPdfTemplateOptions,
): PdfRendererFonts {
  const fonts: PdfRendererFonts = {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    mono: 'Courier',
  };

  if (options.fonts.regularPath) {
    assertReadableFontPath(options.fonts.regularPath);
    pdf.registerFont('BoletoSdk-Regular', options.fonts.regularPath);
    fonts.regular = 'BoletoSdk-Regular';
  }

  if (options.fonts.boldPath) {
    assertReadableFontPath(options.fonts.boldPath);
    pdf.registerFont('BoletoSdk-Bold', options.fonts.boldPath);
    fonts.bold = 'BoletoSdk-Bold';
  }

  if (options.fonts.monoPath) {
    assertReadableFontPath(options.fonts.monoPath);
    pdf.registerFont('BoletoSdk-Mono', options.fonts.monoPath);
    fonts.mono = 'BoletoSdk-Mono';
  }

  return fonts;
}

function assertReadableFontPath(path: string): void {
  const stats = statSync(path);
  if (!stats.isFile()) {
    throw new Error(`Invalid font path: ${path}`);
  }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

function addSectionSpacing(pdf: PDFKit.PDFDocument, sectionSpacing: number): void {
  const safeSpacing = sectionSpacing > 0 ? sectionSpacing : 16;
  pdf.moveDown();
  pdf.moveTo(pdf.page.margins.left, pdf.y)
    .lineTo(pdf.page.width - pdf.page.margins.right, pdf.y)
    .strokeColor('#CFCFCF')
    .lineWidth(0.5)
    .stroke();
  pdf.moveDown();
  pdf.y += safeSpacing;
}