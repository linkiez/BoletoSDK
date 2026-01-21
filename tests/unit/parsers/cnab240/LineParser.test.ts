import { ParseError } from '../../../../src/errors';
import {
  extractField,
  parseDateField,
  parseDecimalField,
  parseNumericField,
  validateRecordType,
  validateSegmentCode,
} from '../../../../src/parsers/cnab240';

describe('CNAB240 LineParser', () => {
  // Create a valid 240-character line for testing
  const createLine = (data: Record<number, string> = {}): string => {
    const line = new Array(240).fill(' ');
    Object.entries(data).forEach(([pos, value]) => {
      const startPos = Number.parseInt(pos, 10) - 1; // Convert to 0-indexed
      for (let i = 0; i < value.length; i++) {
        line[startPos + i] = value[i];
      }
    });
    return line.join('');
  };

  describe('extractField', () => {
    it('should extract field from valid 240-character line', () => {
      const line = createLine({ 1: '341' }); // Bank code
      expect(extractField(line, 1, 3)).toBe('341');
    });

    it('should trim whitespace from extracted field', () => {
      const line = createLine({ 10: '  TEST  ' });
      expect(extractField(line, 10, 17)).toBe('TEST');
    });

    it('should throw ParseError for invalid line length', () => {
      const shortLine = 'SHORT';
      expect(() => extractField(shortLine, 1, 3)).toThrow(ParseError);
      expect(() => extractField(shortLine, 1, 3)).toThrow(/Invalid CNAB240 line length/);
    });

    it('should handle start and end positions correctly', () => {
      const line = createLine({ 5: 'ABCDE' });
      expect(extractField(line, 5, 9)).toBe('ABCDE');
      expect(extractField(line, 6, 8)).toBe('BCD');
    });
  });

  describe('parseNumericField', () => {
    it('should parse numeric field correctly', () => {
      const line = createLine({ 10: '123456' });
      expect(parseNumericField(line, 10, 15)).toBe(123456);
    });

    it('should handle leading zeros', () => {
      const line = createLine({ 10: '000042' });
      expect(parseNumericField(line, 10, 15)).toBe(42);
    });

    it('should return 0 for empty field', () => {
      const line = createLine();
      expect(parseNumericField(line, 10, 15)).toBe(0);
    });

    it('should throw for invalid 240-character line', () => {
      expect(() => parseNumericField('SHORT', 1, 5)).toThrow(ParseError);
    });
  });

  describe('parseDecimalField', () => {
    it('should parse decimal with 2 implied decimals', () => {
      const line = createLine({ 10: '0000015000' }); // 150.00
      expect(parseDecimalField(line, 10, 19, 2)).toBe(150.0);
    });

    it('should parse decimal with different decimal places', () => {
      const line = createLine({ 10: '0000015000' });
      expect(parseDecimalField(line, 10, 19, 3)).toBe(15.0);
      expect(parseDecimalField(line, 10, 19, 0)).toBe(15000);
    });

    it('should return 0 for empty field', () => {
      const line = createLine();
      expect(parseDecimalField(line, 10, 19, 2)).toBe(0);
    });

    it('should use 2 decimals by default', () => {
      const line = createLine({ 10: '0000100000' });
      expect(parseDecimalField(line, 10, 19)).toBe(1000.0);
    });
  });

  describe('parseDateField', () => {
    it('should parse valid date in DDMMYYYY format', () => {
      const line = createLine({ 10: '21012026' }); // 21/01/2026
      const date = parseDateField(line, 10, 17);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getDate()).toBe(21);
      expect(date?.getMonth()).toBe(0); // January (0-indexed)
      expect(date?.getFullYear()).toBe(2026);
    });

    it('should return undefined for zero date', () => {
      const line = createLine({ 10: '00000000' });
      expect(parseDateField(line, 10, 17)).toBeUndefined();
    });

    it('should return undefined for empty date', () => {
      const line = createLine(); // Empty spaces
      expect(parseDateField(line, 10, 17)).toBeUndefined();
    });

    it('should parse different dates correctly', () => {
      const line = createLine({ 10: '31122025' }); // 31/12/2025
      const date = parseDateField(line, 10, 17);
      expect(date?.getDate()).toBe(31);
      expect(date?.getMonth()).toBe(11); // December
      expect(date?.getFullYear()).toBe(2025);
    });
  });

  describe('validateRecordType', () => {
    it('should pass for correct record type', () => {
      const line = createLine({ 8: '0' }); // File header
      expect(() => validateRecordType(line, '0')).not.toThrow();
    });

    it('should throw ParseError for incorrect record type', () => {
      const line = createLine({ 8: '1' }); // Batch header
      expect(() => validateRecordType(line, '0')).toThrow(ParseError);
      expect(() => validateRecordType(line, '0')).toThrow(/Invalid record type/);
    });

    it('should validate all record types', () => {
      const recordTypes = ['0', '1', '3', '5', '9'];
      recordTypes.forEach((type) => {
        const line = createLine({ 8: type });
        expect(() => validateRecordType(line, type)).not.toThrow();
      });
    });
  });

  describe('validateSegmentCode', () => {
    it('should pass for correct segment code', () => {
      const line = createLine({ 14: 'P' }); // Segment P
      expect(() => validateSegmentCode(line, 'P')).not.toThrow();
    });

    it('should throw ParseError for incorrect segment code', () => {
      const line = createLine({ 14: 'Q' }); // Segment Q
      expect(() => validateSegmentCode(line, 'P')).toThrow(ParseError);
      expect(() => validateSegmentCode(line, 'P')).toThrow(/Invalid segment code/);
    });

    it('should validate all segment codes', () => {
      const segmentCodes = ['P', 'Q', 'R', 'S', 'T', 'U', 'Y'];
      segmentCodes.forEach((code) => {
        const line = createLine({ 14: code });
        expect(() => validateSegmentCode(line, code)).not.toThrow();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle full 240-character line', () => {
      const line = 'A'.repeat(240);
      expect(extractField(line, 1, 240)).toBe('A'.repeat(240));
    });

    it('should handle extraction at boundaries', () => {
      const line = createLine({ 1: 'START', 236: 'END' });
      expect(extractField(line, 1, 5)).toBe('START');
      expect(extractField(line, 236, 240)).toBe('END');
    });

    it('should handle single character extraction', () => {
      const line = createLine({ 8: '0', 14: 'P' });
      expect(extractField(line, 8, 8)).toBe('0');
      expect(extractField(line, 14, 14)).toBe('P');
    });
  });
});
