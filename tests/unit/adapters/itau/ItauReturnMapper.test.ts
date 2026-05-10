import {
  ITAU_LIQUIDATION_CODE_MAP,
  ITAU_REJECTION_CODE_DESCRIPTION_MAP,
  isValidItauLiquidationCode,
  mapItauLiquidationCode,
  mapItauRejectionMessage,
} from '../../../../src/adapters/itau/ItauReturnMapper';

describe('ItauReturnMapper', () => {
  it('should expose known Itaú liquidation mappings', () => {
    expect(ITAU_LIQUIDATION_CODE_MAP['01'].category).toBe('bank');
    expect(ITAU_LIQUIDATION_CODE_MAP['02'].category).toBe('clearing');
  });

  it('should validate supported Itaú liquidation codes', () => {
    expect(isValidItauLiquidationCode('01')).toBe(true);
    expect(isValidItauLiquidationCode('04')).toBe(true);
  });

  it('should reject unsupported Itaú liquidation codes', () => {
    expect(isValidItauLiquidationCode('99')).toBe(false);
    expect(isValidItauLiquidationCode('AA')).toBe(false);
  });

  it('should map supported liquidation code', () => {
    expect(mapItauLiquidationCode('02')).toEqual({
      code: '02',
      category: 'clearing',
      description: 'Liquidation channel 02 (clearing)',
    });
  });

  it('should throw for unsupported liquidation code', () => {
    expect(() => mapItauLiquidationCode('99')).toThrow('Unsupported Itau liquidation code: 99');
  });

  it('should return undefined for empty rejection message', () => {
    expect(mapItauRejectionMessage(undefined)).toBeUndefined();
  });

  it('should map numeric rejection message to code category', () => {
    expect(mapItauRejectionMessage('00000001')).toEqual({
      raw: '00000001',
      category: 'code',
      code: '00000001',
      source: 'catalog',
      description: ITAU_REJECTION_CODE_DESCRIPTION_MAP['00000001'],
    });
  });

  it('should fallback to generic description for unknown numeric rejection code', () => {
    expect(mapItauRejectionMessage('12345678')).toEqual({
      raw: '12345678',
      category: 'code',
      code: '12345678',
      source: 'fallback',
      description: 'Itaú rejection code from return message area: 12345678',
    });
  });

  it('should normalize short numeric rejection message and resolve known catalog code', () => {
    expect(mapItauRejectionMessage('1')).toEqual({
      raw: '1',
      category: 'code',
      code: '00000001',
      source: 'catalog',
      description: ITAU_REJECTION_CODE_DESCRIPTION_MAP['00000001'],
    });
  });

  it('should normalize short numeric rejection message and keep fallback when unknown', () => {
    expect(mapItauRejectionMessage('123')).toEqual({
      raw: '123',
      category: 'code',
      code: '00000123',
      source: 'fallback',
      description: 'Itaú rejection code from return message area: 00000123',
    });
  });

  it('should treat all-zero numeric rejection message as undefined', () => {
    expect(mapItauRejectionMessage('00000000')).toBeUndefined();
  });

  it('should map text rejection message to text category', () => {
    expect(mapItauRejectionMessage('TITLEERR')).toEqual({
      raw: 'TITLEERR',
      category: 'text',
      source: 'free-text',
      description: 'Itaú free-text rejection message from return message area',
    });
  });
});
