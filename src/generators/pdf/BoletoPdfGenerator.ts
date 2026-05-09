import type { BoletoTemplateData } from '@templates/BoletoTemplate';
import type { Readable } from 'node:stream';
import {
  generateDirectPdfBuffer,
  generateDirectPdfBuffers,
  generateDirectPdfStream,
  generateDirectPdfStreams,
} from './DirectPdfGenerator';
import type { PdfTemplateOptions } from './PdfTemplate';

export type BoletoPdfOptions = PdfTemplateOptions;

export async function generateBoletoPdfBuffer(
  data: BoletoTemplateData,
  options: BoletoPdfOptions = {},
): Promise<Buffer> {
  return generateDirectPdfBuffer(data, options);
}

/**
 * Generates a boleto PDF as readable stream.
 *
 * @param data - Boleto template data.
 * @param options - Optional PDF generation options.
 * @returns Readable stream with generated PDF bytes.
 */
export async function generateBoletoPdfStream(
  data: BoletoTemplateData,
  options: BoletoPdfOptions = {},
): Promise<Readable> {
  return generateDirectPdfStream(data, options);
}

/**
 * Generates a PDF buffer containing multiple boletos.
 *
 * @param dataList - List of boleto template data.
 * @param options - Optional PDF generation options.
 * @returns Generated PDF bytes.
 */
export async function generateBoletosPdfBuffer(
  dataList: BoletoTemplateData[],
  options: BoletoPdfOptions = {},
): Promise<Buffer> {
  return generateDirectPdfBuffers(dataList, options);
}

/**
 * Generates a PDF stream containing multiple boletos.
 *
 * @param dataList - List of boleto template data.
 * @param options - Optional PDF generation options.
 * @returns Readable stream with generated PDF bytes.
 */
export async function generateBoletosPdfStream(
  dataList: BoletoTemplateData[],
  options: BoletoPdfOptions = {},
): Promise<Readable> {
  return generateDirectPdfStreams(dataList, options);
}
