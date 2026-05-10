import { CommonInstructionCode } from '../../../../src/enums';
import {
  ITAU_INSTRUCTION_CODE_MAP,
  isValidItauInstructionCode,
  mapItauInstructionCode,
} from '../../../../src/adapters/itau/ItauInstructionMapper';

describe('ItauInstructionMapper', () => {
  it('should expose known Itaú instruction mappings', () => {
    expect(ITAU_INSTRUCTION_CODE_MAP['01'].commonCode).toBe(CommonInstructionCode.PROTEST);
    expect(ITAU_INSTRUCTION_CODE_MAP['02'].commonCode).toBe(CommonInstructionCode.DO_NOT_PROTEST);
    expect(ITAU_INSTRUCTION_CODE_MAP['10'].commonCode).toBe(CommonInstructionCode.NO_INTEREST);
  });

  it('should validate supported Itaú instruction codes', () => {
    expect(isValidItauInstructionCode('00')).toBe(true);
    expect(isValidItauInstructionCode('06')).toBe(true);
    expect(isValidItauInstructionCode('15')).toBe(true);
  });

  it('should reject unsupported Itaú instruction codes', () => {
    expect(isValidItauInstructionCode('99')).toBe(false);
    expect(isValidItauInstructionCode('AA')).toBe(false);
  });

  it('should map protest instruction to the generic instruction code', () => {
    expect(mapItauInstructionCode('01')).toEqual({
      code: '01',
      commonCode: CommonInstructionCode.PROTEST,
      description: 'Protest automatically after N days',
    });
  });

  it('should keep Itaú-specific semantics when there is no generic equivalent', () => {
    expect(mapItauInstructionCode('15')).toEqual({
      code: '15',
      commonCode: undefined,
      description: 'Cancel protest and automatic negative',
    });
  });

  it('should throw for unsupported instruction codes', () => {
    expect(() => mapItauInstructionCode('99')).toThrow('Unsupported Itau instruction code: 99');
  });
});
