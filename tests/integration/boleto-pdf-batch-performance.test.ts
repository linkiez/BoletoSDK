import { generateBoletosPdfStream } from '../../src/generators/pdf/BoletoPdfGenerator';
import { createBoletoTemplateDataBatch } from '../helpers/boleto-batch-data';

describe('Boleto PDF Batch - Integration Performance', () => {
  it('should generate a valid PDF stream for 1000+ boletos', async () => {
    const batch = createBoletoTemplateDataBatch(1000);

    const pdfStream = await generateBoletosPdfStream(batch, {
      layout: 'simple',
      includeBarcode: false,
      includePixQr: false,
      boletosPerPage: 10,
      compress: true,
    });

    const buffer = await streamToBuffer(pdfStream);

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
    expect(buffer.length).toBeGreaterThan(0);
  }, 60000);

  it('should run a measurable PDF benchmark for 100 boletos', async () => {
    const batch = createBoletoTemplateDataBatch(100);
    const startedAt = Date.now();

    const pdfStream = await generateBoletosPdfStream(batch, {
      layout: 'simple',
      includeBarcode: false,
      includePixQr: false,
      boletosPerPage: 5,
      compress: true,
    });

    const buffer = await streamToBuffer(pdfStream);
    const elapsedMs = Date.now() - startedAt;

    expect(buffer.subarray(0, 4).toString('ascii')).toBe('%PDF');
    expect(elapsedMs).toBeGreaterThan(0);
    expect(elapsedMs).toBeLessThan(30000);
  }, 60000);
});

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];

  return new Promise<Buffer>((resolve, reject) => {
    stream.on('data', (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}
