import { SEGMENT_Q_POSITIONS } from '../../../../src/constants/cnab240';
import { ParseError } from '../../../../src/errors';
import { parseSegmentQ } from '../../../../src/parsers/cnab240/SegmentQParser';
import { createMinimalCnab240Content, updateLineField } from '../../../helpers/cnab240-content';

describe('CNAB240 SegmentQParser', () => {
  const getSegmentQLine = (): string => createMinimalCnab240Content().split('\n')[3];

  it('should parse Segment Q fields', () => {
    const segmentQ = parseSegmentQ(getSegmentQLine());

    expect(segmentQ.bankCode).toBe('341');
    expect(segmentQ.batchNumber).toBe(1);
    expect(segmentQ.recordType).toBe('3');
    expect(segmentQ.segmentCode).toBe('Q');
    expect(segmentQ.payerRegistrationType).toBe('2');
    expect(segmentQ.payerName).toBe('ACME CORPORATION LTDA');
    expect(segmentQ.payerCity).toBe('SAO PAULO');
    expect(segmentQ.payerState).toBe('SP');
  });

  it('should return undefined for optional guarantor fields when blank', () => {
    const segmentQ = parseSegmentQ(getSegmentQLine());

    expect(segmentQ.guarantorRegistrationType).toBeUndefined();
    expect(segmentQ.guarantorTaxId).toBeUndefined();
    expect(segmentQ.guarantorName).toBeUndefined();
  });

  it('should throw on invalid record type', () => {
    const invalid = updateLineField(getSegmentQLine(), '1', 8, 8);
    expect(() => parseSegmentQ(invalid)).toThrow(ParseError);
  });

  it('should throw on invalid segment code', () => {
    const invalid = updateLineField(
      getSegmentQLine(),
      'P',
      SEGMENT_Q_POSITIONS.SEGMENT_CODE.start,
      SEGMENT_Q_POSITIONS.SEGMENT_CODE.end,
    );

    expect(() => parseSegmentQ(invalid)).toThrow(ParseError);
  });
});
