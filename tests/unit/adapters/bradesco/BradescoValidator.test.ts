import {
  assertValidBradescoRemittanceFields,
  assertValidBradescoReturnFields,
  validateBradescoRemittanceFields,
  validateBradescoReturnFields,
} from '../../../../src/adapters/bradesco/BradescoValidator';

describe('BradescoValidator', () => {
  it('should validate a consistent remittance field set', () => {
    expect(
      validateBradescoRemittanceFields({
        instructionCode: '00',
        walletNumber: '19',
        walletType: 'R',
        occurrenceCode: '01',
        daysCount: 0,
      }),
    ).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('should report remittance rule violations', () => {
    expect(
      validateBradescoRemittanceFields({
        instructionCode: 'A0',
        walletNumber: '99',
        walletType: 'X',
        occurrenceCode: '99',
        daysCount: 120,
      }),
    ).toEqual({
      isValid: false,
      errors: [
        'Invalid Bradesco instruction code: A0',
        'Unsupported Bradesco wallet code: 99',
        'Invalid Bradesco wallet type: X',
        'Unsupported Bradesco occurrence code: 99',
        'Invalid Bradesco days count: 120',
      ],
    });
  });

  it('should validate a consistent return field set', () => {
    expect(
      validateBradescoReturnFields({
        walletNumber: '019',
        walletType: 'R',
        occurrenceCode: '06',
        ourNumber: '12345678901',
        ourNumberCheckDigit: '8',
        confirmedOurNumber: '12345678901',
        confirmedOurNumberCheckDigit: '8',
      }),
    ).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('should report return rule violations', () => {
    expect(
      validateBradescoReturnFields({
        walletNumber: '999',
        walletType: 'X',
        occurrenceCode: 'AA',
        ourNumber: '12345678901',
        ourNumberCheckDigit: '0',
        confirmedOurNumber: '12345678902',
        confirmedOurNumberCheckDigit: 'Y',
      }),
    ).toEqual({
      isValid: false,
      errors: [
        'Unsupported Bradesco wallet code: 999',
        'Invalid Bradesco wallet type: X',
        'Unsupported Bradesco occurrence code: AA',
        'Invalid Bradesco confirmed our-number check digit: Y',
        'Invalid Bradesco our-number check digit for 12345678901: expected 8, got 0',
        'Our-number does not match confirmed our-number',
      ],
    });
  });

  it('should throw when asserting invalid remittance fields', () => {
    expect(() =>
      assertValidBradescoRemittanceFields({
        instructionCode: 'AA',
        walletNumber: '999',
      }),
    ).toThrow('Invalid Bradesco remittance fields');
  });

  it('should throw when asserting invalid return fields', () => {
    expect(() =>
      assertValidBradescoReturnFields({
        walletType: 'X',
      }),
    ).toThrow('Invalid Bradesco return fields');
  });
});
