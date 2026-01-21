/**
 * CNAB240 Constants Tests
 * Validates all constant definitions for CNAB240 format
 */

import {
    BATCH_HEADER_POSITIONS,
    BATCH_HEADER_SIZES,
    BATCH_TRAILER_BANK,
    BATCH_TRAILER_POSITIONS,
    BATCH_TRAILER_SIZES,
    BLOCK_SIZE,
    COMMON_FIELD_SIZES,
    CURRENCY_CODE,
    FILE_DENSITY,
    FILE_HEADER_POSITIONS,
    FILE_HEADER_SIZES,
    FILE_TRAILER_POSITIONS,
    FILE_TRAILER_SIZES,
    FILE_TYPE_CODE,
    LAYOUT_VERSION,
    LINE_LENGTH,
    RECORD_SIZE,
    RESERVED_FIELD,
    SEGMENT_P_POSITIONS,
    SEGMENT_P_SIZES,
    SEGMENT_Q_POSITIONS,
    SEGMENT_Q_SIZES,
    SEGMENT_R_POSITIONS,
    SEGMENT_R_SIZES,
    TOTAL_LINE_LENGTH,
    validatePositions,
} from '../../../src/constants/cnab240';

describe('CNAB240 Layout Version Constants', () => {
  it('should have correct layout version', () => {
    expect(LAYOUT_VERSION).toBe('087');
  });

  it('should have correct file type code', () => {
    expect(FILE_TYPE_CODE).toBe('2');
  });

  it('should have correct line length', () => {
    expect(LINE_LENGTH).toBe(240);
  });

  it('should have correct file density', () => {
    expect(FILE_DENSITY).toBe('01600');
  });

  it('should have correct record size', () => {
    expect(RECORD_SIZE).toBe('240');
  });

  it('should have correct block size', () => {
    expect(BLOCK_SIZE).toBe('000');
  });

  it('should have correct reserved field', () => {
    expect(RESERVED_FIELD).toBe(' ');
  });

  it('should have correct currency code for BRL', () => {
    expect(CURRENCY_CODE).toBe('009');
  });

  it('should have correct batch trailer bank code', () => {
    expect(BATCH_TRAILER_BANK).toBe('9999');
  });
});

describe('CNAB240 Field Sizes', () => {
  describe('Common Field Sizes', () => {
    it('should have valid bank code size', () => {
      expect(COMMON_FIELD_SIZES.BANK_CODE).toBe(3);
    });

    it('should have valid record type size', () => {
      expect(COMMON_FIELD_SIZES.RECORD_TYPE).toBe(1);
    });

    it('should have valid batch number size', () => {
      expect(COMMON_FIELD_SIZES.BATCH_NUMBER).toBe(4);
    });

    it('should have valid tax ID size', () => {
      expect(COMMON_FIELD_SIZES.TAX_ID).toBe(15);
    });

    it('should have valid amount size', () => {
      expect(COMMON_FIELD_SIZES.AMOUNT).toBe(15);
    });

    it('should have valid date size', () => {
      expect(COMMON_FIELD_SIZES.DATE).toBe(8);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(COMMON_FIELD_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('File Header Sizes', () => {
    it('should have valid layout version size', () => {
      expect(FILE_HEADER_SIZES.LAYOUT_VERSION).toBe(3);
    });

    it('should have valid file density size', () => {
      expect(FILE_HEADER_SIZES.FILE_DENSITY).toBe(5);
    });

    it('should have valid generation date size', () => {
      expect(FILE_HEADER_SIZES.GENERATION_DATE).toBe(8);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(FILE_HEADER_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('Batch Header Sizes', () => {
    it('should have valid layout version size', () => {
      expect(BATCH_HEADER_SIZES.LAYOUT_VERSION).toBe(3);
    });

    it('should have valid message sizes', () => {
      expect(BATCH_HEADER_SIZES.MESSAGE_1).toBe(40);
      expect(BATCH_HEADER_SIZES.MESSAGE_2).toBe(40);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(BATCH_HEADER_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('Segment P Sizes', () => {
    it('should have valid movement code size', () => {
      expect(SEGMENT_P_SIZES.MOVEMENT_CODE).toBe(2);
    });

    it('should have valid interest amount size', () => {
      expect(SEGMENT_P_SIZES.INTEREST_AMOUNT).toBe(15);
    });

    it('should have valid discount amount size', () => {
      expect(SEGMENT_P_SIZES.DISCOUNT_AMOUNT).toBe(15);
    });

    it('should have valid IOF amount size', () => {
      expect(SEGMENT_P_SIZES.IOF_AMOUNT).toBe(15);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(SEGMENT_P_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('Segment Q Sizes', () => {
    it('should have valid payer name size', () => {
      expect(SEGMENT_Q_SIZES.PAYER_NAME).toBe(40);
    });

    it('should have valid payer address size', () => {
      expect(SEGMENT_Q_SIZES.PAYER_ADDRESS).toBe(40);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(SEGMENT_Q_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('Segment R Sizes', () => {
    it('should have valid discount amounts sizes', () => {
      expect(SEGMENT_R_SIZES.DISCOUNT_2_AMOUNT).toBe(15);
      expect(SEGMENT_R_SIZES.DISCOUNT_3_AMOUNT).toBe(15);
    });

    it('should have valid fine amount size', () => {
      expect(SEGMENT_R_SIZES.FINE_AMOUNT).toBe(15);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(SEGMENT_R_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('Batch Trailer Sizes', () => {
    it('should have valid detail count size', () => {
      expect(BATCH_TRAILER_SIZES.DETAIL_COUNT).toBe(6);
    });

    it('should have valid slip count size', () => {
      expect(BATCH_TRAILER_SIZES.SLIP_COUNT).toBe(6);
    });

    it('should have valid total amount size', () => {
      expect(BATCH_TRAILER_SIZES.TOTAL_AMOUNT).toBe(17);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(BATCH_TRAILER_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('File Trailer Sizes', () => {
    it('should have valid batch count size', () => {
      expect(FILE_TRAILER_SIZES.BATCH_COUNT).toBe(6);
    });

    it('should have valid record count size', () => {
      expect(FILE_TRAILER_SIZES.RECORD_COUNT).toBe(6);
    });

    it('should have all field sizes as positive integers', () => {
      Object.values(FILE_TRAILER_SIZES).forEach((size) => {
        expect(size).toBeGreaterThan(0);
        expect(Number.isInteger(size)).toBe(true);
      });
    });
  });

  describe('Total Line Length', () => {
    it('should match standard CNAB240 line length', () => {
      expect(TOTAL_LINE_LENGTH).toBe(240);
    });

    it('should match LINE_LENGTH constant', () => {
      expect(TOTAL_LINE_LENGTH).toBe(LINE_LENGTH);
    });
  });
});

describe('CNAB240 Field Positions', () => {
  describe('File Header Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(FILE_HEADER_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 240', () => {
      const positions = Object.values(FILE_HEADER_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(240);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(FILE_HEADER_POSITIONS)).toBe(true);
    });

    it('should have bank code at correct position', () => {
      expect(FILE_HEADER_POSITIONS.BANK_CODE).toEqual({ start: 1, end: 3 });
    });

    it('should have record type at position 8', () => {
      expect(FILE_HEADER_POSITIONS.RECORD_TYPE).toEqual({ start: 8, end: 8 });
    });
  });

  describe('Batch Header Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(BATCH_HEADER_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 240', () => {
      const positions = Object.values(BATCH_HEADER_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(240);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(BATCH_HEADER_POSITIONS)).toBe(true);
    });

    it('should have bank code at correct position', () => {
      expect(BATCH_HEADER_POSITIONS.BANK_CODE).toEqual({ start: 1, end: 3 });
    });

    it('should have record type at position 8', () => {
      expect(BATCH_HEADER_POSITIONS.RECORD_TYPE).toEqual({ start: 8, end: 8 });
    });
  });

  describe('Segment P Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(SEGMENT_P_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 240', () => {
      const positions = Object.values(SEGMENT_P_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(240);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(SEGMENT_P_POSITIONS)).toBe(true);
    });

    it('should have segment code at position 14', () => {
      expect(SEGMENT_P_POSITIONS.SEGMENT_CODE).toEqual({ start: 14, end: 14 });
    });

    it('should have movement code at correct position', () => {
      expect(SEGMENT_P_POSITIONS.MOVEMENT_CODE).toEqual({ start: 16, end: 17 });
    });
  });

  describe('Segment Q Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(SEGMENT_Q_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 240', () => {
      const positions = Object.values(SEGMENT_Q_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(240);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(SEGMENT_Q_POSITIONS)).toBe(true);
    });

    it('should have segment code at position 14', () => {
      expect(SEGMENT_Q_POSITIONS.SEGMENT_CODE).toEqual({ start: 14, end: 14 });
    });
  });

  describe('Segment R Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(SEGMENT_R_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 240', () => {
      const positions = Object.values(SEGMENT_R_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(240);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(SEGMENT_R_POSITIONS)).toBe(true);
    });

    it('should have segment code at position 14', () => {
      expect(SEGMENT_R_POSITIONS.SEGMENT_CODE).toEqual({ start: 14, end: 14 });
    });
  });

  describe('Batch Trailer Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(BATCH_TRAILER_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 240', () => {
      const positions = Object.values(BATCH_TRAILER_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(240);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(BATCH_TRAILER_POSITIONS)).toBe(true);
    });

    it('should have record type at position 8', () => {
      expect(BATCH_TRAILER_POSITIONS.RECORD_TYPE).toEqual({ start: 8, end: 8 });
    });
  });

  describe('File Trailer Positions', () => {
    it('should start at position 1', () => {
      const firstField = Object.values(FILE_TRAILER_POSITIONS)[0];
      expect(firstField.start).toBe(1);
    });

    it('should end at position 240', () => {
      const positions = Object.values(FILE_TRAILER_POSITIONS);
      const lastField = positions[positions.length - 1];
      expect(lastField.end).toBe(240);
    });

    it('should have valid position ranges', () => {
      expect(validatePositions(FILE_TRAILER_POSITIONS)).toBe(true);
    });

    it('should have record type at position 8', () => {
      expect(FILE_TRAILER_POSITIONS.RECORD_TYPE).toEqual({ start: 8, end: 8 });
    });
  });
});

describe('Position Validation Helper', () => {
  it('should validate correct positions', () => {
    const validPositions = {
      FIELD_1: { start: 1, end: 10 },
      FIELD_2: { start: 11, end: 240 },
    };
    expect(validatePositions(validPositions)).toBe(true);
  });

  it('should reject positions not starting at 1', () => {
    const invalidPositions = {
      FIELD_1: { start: 2, end: 240 },
    };
    expect(validatePositions(invalidPositions)).toBe(false);
  });

  it('should reject positions not ending at 240', () => {
    const invalidPositions = {
      FIELD_1: { start: 1, end: 239 },
    };
    expect(validatePositions(invalidPositions)).toBe(false);
  });

  it('should reject positions with gaps', () => {
    const invalidPositions = {
      FIELD_1: { start: 1, end: 10 },
      FIELD_2: { start: 12, end: 240 },
    };
    expect(validatePositions(invalidPositions)).toBe(false);
  });
});
