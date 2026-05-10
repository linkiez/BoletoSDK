import {
  ITAU_OCCURRENCE_CODE_MAP,
  isValidItauOccurrenceCode,
  mapItauOccurrenceCode,
} from '../../../../src/adapters/itau/ItauOccurrenceMapper';

describe('ItauOccurrenceMapper', () => {
  it('should expose known Itaú occurrence mappings', () => {
    expect(ITAU_OCCURRENCE_CODE_MAP['02'].category).toBe('entry');
    expect(ITAU_OCCURRENCE_CODE_MAP['06'].category).toBe('settlement');
    expect(ITAU_OCCURRENCE_CODE_MAP['28'].category).toBe('charge');
  });

  it('should validate supported Itaú occurrence codes', () => {
    expect(isValidItauOccurrenceCode('02')).toBe(true);
    expect(isValidItauOccurrenceCode('06')).toBe(true);
    expect(isValidItauOccurrenceCode('28')).toBe(true);
  });

  it('should reject unsupported Itaú occurrence codes', () => {
    expect(isValidItauOccurrenceCode('99')).toBe(false);
    expect(isValidItauOccurrenceCode('AA')).toBe(false);
  });

  it('should map entry confirmation to a normalized category', () => {
    expect(mapItauOccurrenceCode('02')).toEqual({
      code: '02',
      category: 'entry',
      description: 'Entry confirmed',
    });
  });

  it('should map payment liquidation to settlement category', () => {
    expect(mapItauOccurrenceCode('06')).toEqual({
      code: '06',
      category: 'settlement',
      description: 'Payment liquidation',
    });
  });

  it('should throw for unsupported occurrence codes', () => {
    expect(() => mapItauOccurrenceCode('99')).toThrow('Unsupported Itau occurrence code: 99');
  });
});
