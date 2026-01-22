import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateCnab } from '../../src/generators';
import { Cnab240Generator } from '../../src/generators/cnab240/Cnab240Generator';
import { parseCnab } from '../../src/parsers';
import type { Cnab240File } from '../../src/types';
import { createMinimalCnab240File } from '../helpers/cnab240';

describe('CNAB Cross-Format - Integration', () => {
  const fixturesPath = join(__dirname, '../fixtures/cnab400');

  it('should parse and regenerate CNAB240 using factories', () => {
    const file = createMinimalCnab240File(true);
    const content = generateCnab(file);
    const parsed = parseCnab(content) as Cnab240File;
    const regenerated = generateCnab(parsed);

    const lines = regenerated.split('\n');
    expect(lines).toHaveLength(7);
    lines.forEach((line) => expect(line).toHaveLength(240));
    expect(lines[0][7]).toBe('0');
    expect(lines.at(-1)?.[7]).toBe('9');
  });

  it('should parse CNAB400 fixture and regenerate with 400-char lines', () => {
    const fixturePath = join(fixturesPath, 'itau-remessa-sample1.ret');
    const content = readFileSync(fixturePath, 'utf-8');
    const parsed = parseCnab(content);
    const regenerated = generateCnab(parsed);

    const lines = regenerated.split('\n').filter((line) => line.length > 0);
    lines.forEach((line) => expect(line).toHaveLength(400));
    expect(lines[0][0]).toBe('0');
    expect(lines.at(-1)?.[0]).toBe('9');
  });

  it('should generate and parse a large CNAB240 file', () => {
    const batchesCount = 10;
    const detailsPerBatch = 20;
    const file = createLargeCnab240File(batchesCount, detailsPerBatch);

    const generator = new Cnab240Generator();
    const content = generator.generate(file);
    const parsed = parseCnab(content) as Cnab240File;

    const expectedLines = 1 + batchesCount * (1 + detailsPerBatch * 2 + 1) + 1;
    expect(content.split('\n')).toHaveLength(expectedLines);
    expect(parsed.batches).toHaveLength(batchesCount);
    parsed.batches.forEach((batch) => {
      expect(batch.details).toHaveLength(detailsPerBatch);
    });
  });
});

const createLargeCnab240File = (batchesCount: number, detailsPerBatch: number): Cnab240File => {
  const base = createMinimalCnab240File(false);
  const baseDetail = base.batches[0].details[0];
  const baseHeader = base.batches[0].header;
  const baseTrailer = base.batches[0].trailer;

  const batches = Array.from({ length: batchesCount }, (_, batchIndex) => {
    const batchNumber = batchIndex + 1;
    const details = Array.from({ length: detailsPerBatch }, (_, detailIndex) => {
      const sequentialBase = detailIndex * 2 + 1;

      return {
        segmentP: {
          ...baseDetail.segmentP,
          batchNumber,
          sequentialNumber: sequentialBase,
          documentNumber: `DOC-${batchNumber}-${detailIndex + 1}`,
          dueDate: cloneDate(baseDetail.segmentP.dueDate),
          issueDate: cloneDate(baseDetail.segmentP.issueDate),
          interestDate: cloneOptionalDate(baseDetail.segmentP.interestDate),
          discountDate: cloneOptionalDate(baseDetail.segmentP.discountDate),
        },
        segmentQ: {
          ...baseDetail.segmentQ,
          batchNumber,
          sequentialNumber: sequentialBase + 1,
          payerName: `PAYER ${batchNumber}-${detailIndex + 1}`,
        },
      };
    });

    return {
      header: {
        ...baseHeader,
        batchNumber,
      },
      details,
      trailer: {
        ...baseTrailer,
        batchNumber,
        totalRecords: detailsPerBatch * 2 + 2,
      },
    };
  });

  const totalRecords = 1 + batchesCount * (1 + detailsPerBatch * 2 + 1) + 1;

  return {
    fileHeader: {
      ...base.fileHeader,
    },
    batches,
    fileTrailer: {
      ...base.fileTrailer,
      totalBatches: batchesCount,
      totalRecords,
    },
  };
};

const cloneDate = (value: Date): Date => new Date(value);

const cloneOptionalDate = (value?: Date): Date | undefined => (value ? new Date(value) : undefined);
