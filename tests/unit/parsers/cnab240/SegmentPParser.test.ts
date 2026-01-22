import { ParseError } from '../../../../src/errors';
import { SEGMENT_P_POSITIONS } from '../../../../src/constants/cnab240';
import { parseSegmentP } from '../../../../src/parsers/cnab240/SegmentPParser';
import { createMinimalCnab240Content, updateLineField } from '../../../helpers/cnab240-content';

describe('CNAB240 SegmentPParser', () => {
  const getSegmentPLine = (): string => createMinimalCnab240Content().split('\n')[2];

  it('should parse Segment P fields', () => {
    const segmentP = parseSegmentP(getSegmentPLine());

    expect(segmentP.bankCode).toBe('341');
    expect(segmentP.batchNumber).toBe(1);
    expect(segmentP.recordType).toBe('3');
    expect(segmentP.segmentCode).toBe('P');
    expect(segmentP.documentNumber).toBe('NF-001');
    expect(segmentP.amount).toBe(1500);
    expect(segmentP.currencyCode).toBe('09');
    expect(segmentP.dueDate).toBeInstanceOf(Date);
    expect(segmentP.issueDate).toBeInstanceOf(Date);
  });

  it('should throw on invalid record type', () => {
    const invalid = updateLineField(getSegmentPLine(), '1', 8, 8);
    expect(() => parseSegmentP(invalid)).toThrow(ParseError);
  });

  it('should throw on invalid segment code', () => {
    const invalid = updateLineField(
      getSegmentPLine(),
      'Q',
      SEGMENT_P_POSITIONS.SEGMENT_CODE.start,
      SEGMENT_P_POSITIONS.SEGMENT_CODE.end,
    );

    expect(() => parseSegmentP(invalid)).toThrow(ParseError);
  });

  it('should require due date', () => {
    const invalid = updateLineField(
      getSegmentPLine(),
      '00000000',
      SEGMENT_P_POSITIONS.DUE_DATE.start,
      SEGMENT_P_POSITIONS.DUE_DATE.end,
    );

    expect(() => parseSegmentP(invalid)).toThrow('Due date is required in Segment P');
  });

  it('should require issue date', () => {
    const invalid = updateLineField(
      getSegmentPLine(),
      '00000000',
      SEGMENT_P_POSITIONS.ISSUE_DATE.start,
      SEGMENT_P_POSITIONS.ISSUE_DATE.end,
    );

    expect(() => parseSegmentP(invalid)).toThrow('Issue date is required in Segment P');
  });
});
