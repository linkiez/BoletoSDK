import {
  BRADESCO_OCCURRENCE_CODE_MAP,
  isValidBradescoOccurrenceCode,
  mapBradescoOccurrenceCode,
} from '../../../../src/adapters/bradesco/BradescoOccurrenceMapper';

describe('BradescoOccurrenceMapper', () => {
  it('should expose known Bradesco occurrence mappings', () => {
    expect(BRADESCO_OCCURRENCE_CODE_MAP['02'].category).toBe('entry');
    expect(BRADESCO_OCCURRENCE_CODE_MAP['06'].category).toBe('settlement');
    expect(BRADESCO_OCCURRENCE_CODE_MAP['28'].category).toBe('charge');
  });

  it('should validate supported Bradesco occurrence codes', () => {
    expect(isValidBradescoOccurrenceCode('02')).toBe(true);
    expect(isValidBradescoOccurrenceCode('06')).toBe(true);
    expect(isValidBradescoOccurrenceCode('28')).toBe(true);
  });

  it('should reject unsupported Bradesco occurrence codes', () => {
    expect(isValidBradescoOccurrenceCode('99')).toBe(false);
    expect(isValidBradescoOccurrenceCode('AA')).toBe(false);
  });

  it('should map entry confirmation to a normalized category', () => {
    expect(mapBradescoOccurrenceCode('02')).toEqual({
      code: '02',
      category: 'entry',
      description: 'Entry confirmed',
    });
  });

  it('should map liquidation to settlement category', () => {
    expect(mapBradescoOccurrenceCode('06')).toEqual({
      code: '06',
      category: 'settlement',
      description: 'Payment liquidation',
    });
  });

  it('should throw for unsupported occurrence codes', () => {
    expect(() => mapBradescoOccurrenceCode('99')).toThrow(
      'Unsupported Bradesco occurrence code: 99',
    );
  });
});
