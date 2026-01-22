import { parseCnab240 } from '../../src/parsers/cnab240';
import { createMinimalCnab240Content } from '../helpers/cnab240-content';

describe('CNAB240 Parser - Integration', () => {
  it('should parse minimal valid CNAB240 file', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    expect(cnabFile).toBeDefined();
    expect(cnabFile.fileHeader).toBeDefined();
    expect(cnabFile.batches).toHaveLength(1);
    expect(cnabFile.fileTrailer).toBeDefined();
  });

  it('should parse file header correctly', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    expect(cnabFile.fileHeader.bankCode).toBe('341');
    expect(cnabFile.fileHeader.batchNumber).toBe('0000');
    expect(cnabFile.fileHeader.recordType).toBe('0');
    expect(cnabFile.fileHeader.companyName).toBe('JCM INDUSTRIA E COMERCIO LTDA');
    expect(cnabFile.fileHeader.fileCode).toBe('1'); // Remessa
  });

  it('should parse batch structure correctly', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    const batch = cnabFile.batches[0];
    expect(batch.header).toBeDefined();
    expect(batch.details).toHaveLength(1);
    expect(batch.trailer).toBeDefined();
  });

  it('should parse batch header correctly', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    const header = cnabFile.batches[0].header;
    expect(header.bankCode).toBe('341');
    expect(header.batchNumber).toBe(1);
    expect(header.recordType).toBe('1');
    expect(header.operationType).toBe('C');
    expect(header.serviceType).toBe('01');
  });

  it('should parse detail record with segments P and Q', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    const detail = cnabFile.batches[0].details[0];
    expect(detail.segmentP).toBeDefined();
    expect(detail.segmentQ).toBeDefined();
  });

  it('should parse Segment P correctly', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    const segmentP = cnabFile.batches[0].details[0].segmentP;
    expect(segmentP.segmentCode).toBe('P');
    expect(segmentP.documentNumber).toBe('NF-001');
    expect(segmentP.amount).toBe(1500.0);
    expect(segmentP.speciesCode).toBe('01');
    expect(segmentP.acceptance).toBe('N');
  });

  it('should parse Segment Q correctly', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    const segmentQ = cnabFile.batches[0].details[0].segmentQ;
    expect(segmentQ.segmentCode).toBe('Q');
    expect(segmentQ.payerRegistrationType).toBe('2');
    expect(segmentQ.payerName).toBe('ACME CORPORATION LTDA');
    expect(segmentQ.payerCity).toBe('SAO PAULO');
    expect(segmentQ.payerState).toBe('SP');
  });

  it('should parse batch trailer correctly', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    const trailer = cnabFile.batches[0].trailer;
    expect(trailer.recordType).toBe('5');
    expect(trailer.totalRecords).toBe(4);
    expect(trailer.totalSimpleSlips).toBe(1);
    expect(trailer.totalSimpleAmount).toBe(1500.0);
  });

  it('should parse file trailer correctly', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    expect(cnabFile.fileTrailer.recordType).toBe('9');
    expect(cnabFile.fileTrailer.totalBatches).toBe(1);
    expect(cnabFile.fileTrailer.totalRecords).toBe(6);
  });

  it('should handle hierarchical structure correctly', () => {
    const content = createMinimalCnab240Content();
    const cnabFile = parseCnab240(content);

    // File → Batches → Details → Segments
    expect(cnabFile.batches).toHaveLength(1);
    expect(cnabFile.batches[0].details).toHaveLength(1);
    expect(cnabFile.batches[0].details[0].segmentP).toBeDefined();
    expect(cnabFile.batches[0].details[0].segmentQ).toBeDefined();
  });
});
