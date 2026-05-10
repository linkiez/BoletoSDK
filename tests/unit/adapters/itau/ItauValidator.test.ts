import {
  assertValidItauRemittanceFields,
  assertValidItauReturnFields,
  validateItauRemittanceFields,
  validateItauReturnFields,
} from '../../../../src/adapters/itau/ItauValidator';

describe('ItauValidator', () => {
  it('should validate a consistent remittance field set', () => {
    expect(
      validateItauRemittanceFields({
        instructionCancellationCode: '0000',
        walletNumber: '109',
        walletType: 'I',
        occurrenceCode: '01',
        daysCount: 0,
      }),
    ).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('should report remittance business rule violations', () => {
    expect(
      validateItauRemittanceFields({
        instructionCancellationCode: '12',
        walletNumber: '999',
        walletType: 'X',
        occurrenceCode: '99',
        daysCount: 101,
      }),
    ).toEqual({
      isValid: false,
      errors: [
        'Invalid Itaú instruction cancellation code: 12',
        'Unsupported Itau wallet code: 999',
        'Invalid Itaú wallet type: X',
        'Unsupported Itau occurrence code: 99',
        'Invalid Itaú days count: 101',
      ],
    });
  });

  it('should validate a consistent return field set', () => {
    expect(
      validateItauReturnFields({
        walletNumber: '109',
        walletType: 'I',
        bankOurNumber: '00004965',
        bankOurNumberDigit: '3',
        confirmedOurNumber: '00004965',
        canceledInstructionCode: '0000',
        liquidationCode: '02',
      }),
    ).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('should report return business rule violations', () => {
    expect(
      validateItauReturnFields({
        walletNumber: '999',
        walletType: 'X',
        bankOurNumber: '00004965',
        bankOurNumberDigit: '3',
        confirmedOurNumber: '00004966',
        canceledInstructionCode: '12',
        liquidationCode: 'AA',
      }),
    ).toEqual({
      isValid: false,
      errors: [
        'Unsupported Itau wallet code: 999',
        'Invalid Itaú wallet type: X',
        'Bank our-number does not match confirmed our-number',
        'Invalid Itaú canceled instruction code: 12',
        'Invalid Itaú liquidation code: AA',
      ],
    });
  });

  it('should throw when asserting invalid remittance fields', () => {
    expect(() =>
      assertValidItauRemittanceFields({
        instructionCancellationCode: '12',
        walletNumber: '999',
        walletType: 'X',
        occurrenceCode: '99',
      }),
    ).toThrow('Invalid Itaú remittance fields');
  });

  it('should throw when asserting invalid return fields', () => {
    expect(() =>
      assertValidItauReturnFields({
        walletNumber: '999',
        walletType: 'X',
        bankOurNumber: '00004965',
        bankOurNumberDigit: '3',
        confirmedOurNumber: '00004966',
        canceledInstructionCode: '12',
      }),
    ).toThrow('Invalid Itaú return fields');
  });
});
