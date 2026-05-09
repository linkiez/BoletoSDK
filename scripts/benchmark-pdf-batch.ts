/* eslint-disable no-console */
import 'tsconfig-paths/register';
import { generateBoletosPdfStream } from '../src/generators/pdf/BoletoPdfGenerator';
import { createBoletoTemplateDataBatch } from '../tests/helpers/boleto-batch-data';

async function runBenchmark(batchSize: number, boletosPerPage: number): Promise<void> {
  const payload = createBoletoTemplateDataBatch(batchSize);
  const startedAt = Date.now();

  const stream = await generateBoletosPdfStream(payload, {
    layout: 'simple',
    includeBarcode: false,
    includePixQr: false,
    boletosPerPage,
    compress: true,
  });

  const buffer = await streamToBuffer(stream);
  const elapsedMs = Date.now() - startedAt;

  console.log(
    `Batch ${batchSize} boletos | ${elapsedMs}ms | ${Math.round(buffer.length / 1024)} KiB`,
  );
}

async function main(): Promise<void> {
  await runBenchmark(100, 5);
  await runBenchmark(1000, 10);
}

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

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
