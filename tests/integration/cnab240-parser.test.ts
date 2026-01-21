import { parseCnab240 } from '../../src/parsers/cnab240';

describe('CNAB240 Parser - Integration', () => {
  // Helper to set field in a 240-character line (1-indexed positions)
  const setField = (line: string[], value: string, start: number, end: number): void => {
    const valueStr = value.padEnd(end - start + 1, ' ').substring(0, end - start + 1);
    for (let i = 0; i < valueStr.length; i++) {
      line[start - 1 + i] = valueStr[i];
    }
  };

  // Helper to create a minimal valid CNAB240 file
  const createMinimalCnab240File = (): string => {
    const lines: string[] = [];

    // File Header (Type 0)
    const fileHeader = new Array(240).fill(' ');
    setField(fileHeader, '341', 1, 3); // Bank code
    setField(fileHeader, '0000', 4, 7); // Batch 0000
    setField(fileHeader, '0', 8, 8); // Record type 0
    setField(fileHeader, '2', 18, 18); // CNPJ
    setField(fileHeader, '12345678000195', 19, 32); // CNPJ number
    setField(fileHeader, '04897', 53, 57); // Agency
    setField(fileHeader, '000000017450', 59, 70); // Account
    setField(fileHeader, '6', 71, 71); // Account digit
    setField(fileHeader, 'JCM INDUSTRIA E COMERCIO LTDA', 73, 102); // Company name
    setField(fileHeader, 'BANCO ITAU SA', 103, 132); // Bank name
    setField(fileHeader, '1', 143, 143); // File code (Remessa)
    setField(fileHeader, '21012026', 144, 151); // Date
    setField(fileHeader, '000001', 158, 163); // Sequential
    setField(fileHeader, '103', 164, 166); // Layout version
    lines.push(fileHeader.join(''));

    // Batch Header (Type 1)
    const batchHeader = new Array(240).fill(' ');
    setField(batchHeader, '341', 1, 3); // Bank code
    setField(batchHeader, '0001', 4, 7); // Batch 1
    setField(batchHeader, '1', 8, 8); // Record type 1
    setField(batchHeader, 'C', 9, 9); // Operation type
    setField(batchHeader, '01', 10, 11); // Service type
    setField(batchHeader, '2', 18, 18); // CNPJ
    setField(batchHeader, '12345678000195', 19, 32); // CNPJ
    setField(batchHeader, '04897', 53, 57); // Agency
    setField(batchHeader, '000000017450', 59, 70); // Account
    setField(batchHeader, '6', 71, 71); // Account digit
    setField(batchHeader, 'JCM INDUSTRIA E COMERCIO LTDA', 73, 102); // Company
    lines.push(batchHeader.join(''));

    // Segment P (Type 3, Segment P)
    const segmentP = new Array(240).fill(' ');
    setField(segmentP, '341', 1, 3); // Bank code
    setField(segmentP, '0001', 4, 7); // Batch 1
    setField(segmentP, '3', 8, 8); // Record type 3
    setField(segmentP, '00001', 9, 13); // Sequential
    setField(segmentP, 'P', 14, 14); // Segment P
    setField(segmentP, '01', 16, 17); // Occurrence code
    setField(segmentP, '04897', 18, 22); // Agency
    setField(segmentP, '000000017450', 24, 35); // Account
    setField(segmentP, '6', 36, 36); // Account digit
    setField(segmentP, '12345678901234567890', 38, 57); // Our number
    setField(segmentP, '109', 59, 61); // Portfolio
    setField(segmentP, 'NF-001', 66, 80); // Document number
    setField(segmentP, '28022026', 81, 88); // Due date
    setField(segmentP, '000000000150000', 89, 103); // Amount 1500.00
    setField(segmentP, '01', 110, 111); // Species code (DM)
    setField(segmentP, 'N', 112, 112); // Acceptance
    setField(segmentP, '21012026', 113, 120); // Issue date
    setField(segmentP, '09', 231, 232); // Currency (Real)
    lines.push(segmentP.join(''));

    // Segment Q (Type 3, Segment Q)
    const segmentQ = new Array(240).fill(' ');
    setField(segmentQ, '341', 1, 3); // Bank code
    setField(segmentQ, '0001', 4, 7); // Batch 1
    setField(segmentQ, '3', 8, 8); // Record type 3
    setField(segmentQ, '00002', 9, 13); // Sequential
    setField(segmentQ, 'Q', 14, 14); // Segment Q
    setField(segmentQ, '01', 16, 17); // Occurrence code
    setField(segmentQ, '2', 18, 18); // CNPJ
    setField(segmentQ, '987654320001000', 19, 33); // CNPJ
    setField(segmentQ, 'ACME CORPORATION LTDA', 34, 73); // Name
    setField(segmentQ, 'RUA EXEMPLO 123', 74, 113); // Address
    setField(segmentQ, 'CENTRO', 114, 128); // Neighborhood
    setField(segmentQ, '01310100', 129, 136); // Postal code
    setField(segmentQ, 'SAO PAULO', 137, 151); // City
    setField(segmentQ, 'SP', 152, 153); // State
    lines.push(segmentQ.join(''));

    // Batch Trailer (Type 5)
    const batchTrailer = new Array(240).fill(' ');
    setField(batchTrailer, '341', 1, 3); // Bank code
    setField(batchTrailer, '0001', 4, 7); // Batch 1
    setField(batchTrailer, '5', 8, 8); // Record type 5
    setField(batchTrailer, '000004', 18, 23); // Total records (header + 2 segments + trailer)
    setField(batchTrailer, '000001', 24, 29); // Total slips
    setField(batchTrailer, '00000000000150000', 30, 46); // Total amount
    lines.push(batchTrailer.join(''));

    // File Trailer (Type 9)
    const fileTrailer = new Array(240).fill(' ');
    setField(fileTrailer, '341', 1, 3); // Bank code
    setField(fileTrailer, '9999', 4, 7); // Batch 9999
    setField(fileTrailer, '9', 8, 8); // Record type 9
    setField(fileTrailer, '000001', 18, 23); // Total batches
    setField(fileTrailer, '000006', 24, 29); // Total records
    lines.push(fileTrailer.join(''));

    return lines.join('\n');
  };

  it('should parse minimal valid CNAB240 file', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    expect(cnabFile).toBeDefined();
    expect(cnabFile.fileHeader).toBeDefined();
    expect(cnabFile.batches).toHaveLength(1);
    expect(cnabFile.fileTrailer).toBeDefined();
  });

  it('should parse file header correctly', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    expect(cnabFile.fileHeader.bankCode).toBe('341');
    expect(cnabFile.fileHeader.batchNumber).toBe('0000');
    expect(cnabFile.fileHeader.recordType).toBe('0');
    expect(cnabFile.fileHeader.companyName).toBe('JCM INDUSTRIA E COMERCIO LTDA');
    expect(cnabFile.fileHeader.fileCode).toBe('1'); // Remessa
  });

  it('should parse batch structure correctly', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    const batch = cnabFile.batches[0];
    expect(batch.header).toBeDefined();
    expect(batch.details).toHaveLength(1);
    expect(batch.trailer).toBeDefined();
  });

  it('should parse batch header correctly', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    const header = cnabFile.batches[0].header;
    expect(header.bankCode).toBe('341');
    expect(header.batchNumber).toBe(1);
    expect(header.recordType).toBe('1');
    expect(header.operationType).toBe('C');
    expect(header.serviceType).toBe('01');
  });

  it('should parse detail record with segments P and Q', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    const detail = cnabFile.batches[0].details[0];
    expect(detail.segmentP).toBeDefined();
    expect(detail.segmentQ).toBeDefined();
  });

  it('should parse Segment P correctly', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    const segmentP = cnabFile.batches[0].details[0].segmentP;
    expect(segmentP.segmentCode).toBe('P');
    expect(segmentP.documentNumber).toBe('NF-001');
    expect(segmentP.amount).toBe(1500.0);
    expect(segmentP.speciesCode).toBe('01');
    expect(segmentP.acceptance).toBe('N');
  });

  it('should parse Segment Q correctly', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    const segmentQ = cnabFile.batches[0].details[0].segmentQ;
    expect(segmentQ.segmentCode).toBe('Q');
    expect(segmentQ.payerRegistrationType).toBe('2');
    expect(segmentQ.payerName).toBe('ACME CORPORATION LTDA');
    expect(segmentQ.payerCity).toBe('SAO PAULO');
    expect(segmentQ.payerState).toBe('SP');
  });

  it('should parse batch trailer correctly', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    const trailer = cnabFile.batches[0].trailer;
    expect(trailer.recordType).toBe('5');
    expect(trailer.totalRecords).toBe(4);
    expect(trailer.totalSimpleSlips).toBe(1);
    expect(trailer.totalSimpleAmount).toBe(1500.0);
  });

  it('should parse file trailer correctly', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    expect(cnabFile.fileTrailer.recordType).toBe('9');
    expect(cnabFile.fileTrailer.totalBatches).toBe(1);
    expect(cnabFile.fileTrailer.totalRecords).toBe(6);
  });

  it('should handle hierarchical structure correctly', () => {
    const content = createMinimalCnab240File();
    const cnabFile = parseCnab240(content);

    // File → Batches → Details → Segments
    expect(cnabFile.batches).toHaveLength(1);
    expect(cnabFile.batches[0].details).toHaveLength(1);
    expect(cnabFile.batches[0].details[0].segmentP).toBeDefined();
    expect(cnabFile.batches[0].details[0].segmentQ).toBeDefined();
  });
});
