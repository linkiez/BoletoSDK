/**
 * CNAB400 Constants Tests
 * Validates all constant definitions for CNAB400 format
 */

import {
  COMMON_FIELD_SIZES,
  CURRENCY_CODE,
  DETAIL_RECORD_REMESSA_POSITIONS,
  DETAIL_RECORD_RETORNO_POSITIONS,
  DETAIL_RECORD_SIZES,
  FILE_HEADER_POSITIONS,
  FILE_HEADER_RETORNO_POSITIONS,
  FILE_HEADER_SIZES,
  FILE_TRAILER_POSITIONS,
  FILE_TRAILER_SIZES,
  FILE_TYPE_REMESSA,
  FILE_TYPE_RETORNO,
  FILLER_CHARACTER,
  LINE_LENGTH,
  OPERATION_LITERAL_REMESSA,
  OPERATION_LITERAL_RETORNO,
  PENALTY_RECORD_POSITIONS,
  PENALTY_RECORD_SIZES,
  SERVICE_CODE_COBRANCA,
  SERVICE_LITERAL_COBRANCA,
  TOTAL_LINE_LENGTH,
  validatePositions,
  ZERO_PAD_CHARACTER,
} from '../../../src/constants/cnab400';

describe('CNAB400 Layout Version Constants', () => {
  it('should have correct line length', () => {
    expect(LINE_LENGTH).toBe(400);
  });

  it('should have correct file type for REMESSA', () => {
    expect(FILE_TYPE_REMESSA).toBe('1');
  });

  it('should have correct file type for RETORNO', () => {
    expect(FILE_TYPE_RETORNO).toBe('2');
  });

  it('should have correct service code', () => {
    expect(SERVICE_CODE_COBRANCA).toBe('01');
  });

  it('should have correct operation literal for REMESSA', () => {
    expect(OPERATION_LITERAL_REMESSA).toBe('REMESSA');
  });

  it('should have correct operation literal for RETORNO', () => {
    expect(OPERATION_LITERAL_RETORNO).toBe('RETORNO');
  });

  it('should have correct service literal', () => {
    expect(SERVICE_LITERAL_COBRANCA).toBe('COBRANCA');
  });

  it('should have correct currency code for BRL', () => {
    expect(CURRENCY_CODE).toBe('009');
  });

  it('should have correct filler character', () => {
    expect(FILLER_CHARACTER).toBe(' ');
  });

  it('should have correct zero pad character', () => {
    expect(ZERO_PAD_CHARACTER).toBe('0');
  });
});

describe('CNAB400 Field Sizes', () => {
  describe('Common Field Sizes', () => {
    it('should have valid record type size', () => {
      expect(COMMON_FIELD_SIZES.RECORD_TYPE).toBe(1);
    });

    it('should have valid operation type size', () => {
      expect(COMMON_FIELD_SIZES.OPERATION_TYPE).toBe(1);
    });

    it('should have valid bank code size', () => {
      expect(COMMON_FIELD_SIZES.BANK_CODE).toBe(3);
    });

    it('should have valid agency size', () => {
      expect(COMMON_FIELD_SIZES.AGENCY).toBe(4);
    });

    it('should have valid account size', () => {
      expect(COMMON_FIELD_SIZES.ACCOUNT).toBe(5);
    });

    it('should have valid our number size', () => {
      expect(COMMON_FIELD_SIZES.OUR_NUMBER).toBe(8);
    });

    it('should have valid amount size', () => {
      expect(COMMON_FIELD_SIZES.AMOUNT).toBe(13);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(COMMON_FIELD_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('File Header Sizes', () => {
    it('should have valid operation literal size', () => {
      expect(FILE_HEADER_SIZES.OPERATION_LITERAL).toBe(7);
    });

    it('should have valid service literal size', () => {
      expect(FILE_HEADER_SIZES.SERVICE_LITERAL).toBe(15);
    });

    it('should have valid company name size', () => {
      expect(FILE_HEADER_SIZES.COMPANY_NAME).toBe(30);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(FILE_HEADER_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('Detail Record Sizes', () => {
    it('should have valid company control size', () => {
      expect(DETAIL_RECORD_SIZES.COMPANY_CONTROL).toBe(25);
    });

    it('should have valid payer name size', () => {
      expect(DETAIL_RECORD_SIZES.PAYER_NAME).toBe(30);
    });

    it('should have valid payer address size', () => {
      expect(DETAIL_RECORD_SIZES.PAYER_ADDRESS).toBe(40);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(DETAIL_RECORD_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('Penalty Record Sizes', () => {
    it('should have valid message line size', () => {
      expect(PENALTY_RECORD_SIZES.MESSAGE_LINE).toBe(80);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(PENALTY_RECORD_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('File Trailer Sizes', () => {
    it('should have valid total records size', () => {
      expect(FILE_TRAILER_SIZES.TOTAL_RECORDS).toBe(6);
    });

    it('should have valid total amount size', () => {
      expect(FILE_TRAILER_SIZES.TOTAL_AMOUNT).toBe(13);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(FILE_TRAILER_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('Total Line Length', () => {
    it('should match standard CNAB400 line length', () => {
      expect(TOTAL_LINE_LENGTH).toBe(400);
    });

    it('should match LINE_LENGTH constant', () => {
      expect(TOTAL_LINE_LENGTH).toBe(LINE_LENGTH);
    });
  });
});

describe('CNAB400 Field Positions', () => {
  describe('File Header Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(FILE_HEADER_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 400', () => {
      const positions = Object.values(FILE_HEADER_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(400);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(FILE_HEADER_POSITIONS)).toBe(true);
    });

    it('should have record type at position 1', () => {
      expect(FILE_HEADER_POSITIONS.RECORD_TYPE).toEqual({ start: 1, end: 1 });
    });

    it('should have operation type at position 2', () => {
      expect(FILE_HEADER_POSITIONS.OPERATION_TYPE).toEqual({ start: 2, end: 2 });
    });

    it('should have bank code at positions 77-79', () => {
      expect(FILE_HEADER_POSITIONS.BANK_CODE).toEqual({ start: 77, end: 79 });
    });
  });

  describe('File Header RETORNO Positions', () => {
    it('should include all standard header fields', () => {
      expect(FILE_HEADER_RETORNO_POSITIONS.RECORD_TYPE).toEqual(FILE_HEADER_POSITIONS.RECORD_TYPE);
      expect(FILE_HEADER_RETORNO_POSITIONS.BANK_CODE).toEqual(FILE_HEADER_POSITIONS.BANK_CODE);
    });

    it('should have creation date field', () => {
      expect(FILE_HEADER_RETORNO_POSITIONS.CREATION_DATE).toEqual({ start: 114, end: 119 });
    });
  });

  describe('Detail Record REMESSA Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(DETAIL_RECORD_REMESSA_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 400', () => {
      const positions = Object.values(DETAIL_RECORD_REMESSA_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(400);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(DETAIL_RECORD_REMESSA_POSITIONS)).toBe(true);
    });

    it('should have record type at position 1', () => {
      expect(DETAIL_RECORD_REMESSA_POSITIONS.RECORD_TYPE).toEqual({ start: 1, end: 1 });
    });

    it('should have our number at positions 63-70', () => {
      expect(DETAIL_RECORD_REMESSA_POSITIONS.OUR_NUMBER).toEqual({ start: 63, end: 70 });
    });

    it('should have due date at positions 121-126', () => {
      expect(DETAIL_RECORD_REMESSA_POSITIONS.DUE_DATE).toEqual({ start: 121, end: 126 });
    });

    it('should have amount at positions 127-139', () => {
      expect(DETAIL_RECORD_REMESSA_POSITIONS.AMOUNT).toEqual({ start: 127, end: 139 });
    });
  });

  describe('Detail Record RETORNO Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(DETAIL_RECORD_RETORNO_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 400', () => {
      const positions = Object.values(DETAIL_RECORD_RETORNO_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(400);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(DETAIL_RECORD_RETORNO_POSITIONS)).toBe(true);
    });

    it('should have occurrence code at positions 109-110', () => {
      expect(DETAIL_RECORD_RETORNO_POSITIONS.OCCURRENCE_CODE).toEqual({ start: 109, end: 110 });
    });

    it('should have received amount at positions 254-266', () => {
      expect(DETAIL_RECORD_RETORNO_POSITIONS.RECEIVED_AMOUNT).toEqual({ start: 254, end: 266 });
    });
  });

  describe('Penalty Record Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(PENALTY_RECORD_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 400', () => {
      const positions = Object.values(PENALTY_RECORD_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(400);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(PENALTY_RECORD_POSITIONS)).toBe(true);
    });

    it('should have record type at position 1', () => {
      expect(PENALTY_RECORD_POSITIONS.RECORD_TYPE).toEqual({ start: 1, end: 1 });
    });

    it('should have message lines of 80 characters each', () => {
      expect(PENALTY_RECORD_POSITIONS.MESSAGE_LINE_1).toEqual({ start: 2, end: 81 });
      expect(PENALTY_RECORD_POSITIONS.MESSAGE_LINE_2).toEqual({ start: 82, end: 161 });
      expect(PENALTY_RECORD_POSITIONS.MESSAGE_LINE_3).toEqual({ start: 162, end: 241 });
      expect(PENALTY_RECORD_POSITIONS.MESSAGE_LINE_4).toEqual({ start: 242, end: 321 });
    });
  });

  describe('File Trailer Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(FILE_TRAILER_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 400', () => {
      const positions = Object.values(FILE_TRAILER_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(400);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(FILE_TRAILER_POSITIONS)).toBe(true);
    });

    it('should have record type at position 1', () => {
      expect(FILE_TRAILER_POSITIONS.RECORD_TYPE).toEqual({ start: 1, end: 1 });
    });

    it('should have total records at positions 2-7', () => {
      expect(FILE_TRAILER_POSITIONS.TOTAL_RECORDS).toEqual({ start: 2, end: 7 });
    });

    it('should have total amount at positions 8-20', () => {
      expect(FILE_TRAILER_POSITIONS.TOTAL_AMOUNT).toEqual({ start: 8, end: 20 });
    });
  });
});

describe('Position Validation Helper', () => {
  it('should validate correct positions', () => {
    const validPositions = {
      FIELD_1: { start: 1, end: 10 },
      FIELD_2: { start: 11, end: 400 },
    };
    expect(validatePositions(validPositions)).toBe(true);
  });

  it('should reject positions not starting at 1', () => {
    const invalidPositions = {
      FIELD_1: { start: 2, end: 400 },
    };
    expect(validatePositions(invalidPositions)).toBe(false);
  });

  it('should reject positions not ending at 400', () => {
    const invalidPositions = {
      FIELD_1: { start: 1, end: 399 },
    };
    expect(validatePositions(invalidPositions)).toBe(false);
  });

  it('should reject positions with gaps', () => {
    const invalidPositions = {
      FIELD_1: { start: 1, end: 10 },
      FIELD_2: { start: 12, end: 400 },
    };
    expect(validatePositions(invalidPositions)).toBe(false);
  });
});
