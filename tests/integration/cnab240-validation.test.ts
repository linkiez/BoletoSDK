import { validateCnab240File } from '../../src/validators/cnab240';
import { createMinimalCnab240File } from '../helpers/cnab240';

describe('CNAB240 Validation - Integration', () => {
  it('should validate a correct file structure', () => {
    const result = validateCnab240File(createMinimalCnab240File(true));
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should report mismatched file trailer counts', () => {
    const file = createMinimalCnab240File(true);
    file.fileTrailer.totalRecords = 999;

    const result = validateCnab240File(file);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('File trailer record count mismatch: expected 7, got 999');
  });

  it('should report missing segment Q', () => {
    const file = createMinimalCnab240File(false);
    delete (file.batches[0].details[0] as { segmentQ?: unknown }).segmentQ;

    const result = validateCnab240File(file);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Batch 0, Detail 0: missing segment Q');
  });
});
