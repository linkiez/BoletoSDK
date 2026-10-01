import { generateDetailRecordRemessa } from './DetailRecordGenerator';
import { parseItauRemittanceFields } from '../../adapters/itau/ItauFieldParser';
import { validateItauRemittanceFields } from '../../adapters/itau/ItauValidator';

describe('generateDetailRecordRemessa', () => {
  it('deve serializar o documento do pagador nas posições do CNAB400', () => {
    const line = generateDetailRecordRemessa({
      recordType: '1',
      companyRegistrationType: '02',
      companyRegistrationNumber: '12345678000195',
      agency: '1234',
      account: '12345',
      accountDigit: '6',
      instructionCancellationCode: '0000',
      ourNumber: '00000001',
      portfolioCode: '109',
      portfolioType: 'I',
      dueDate: new Date(2026, 9, 14),
      amount: 150,
      payerRegistrationType: '02',
      payerRegistrationNumber: '98765432000198',
      payerName: 'PAGADOR TESTE',
      sequentialNumber: 2,
    });

    expect(line).toHaveLength(400);
    expect(line.slice(218, 220)).toBe('02');
    expect(line.slice(220, 234)).toBe('98765432000198');
    expect(line.slice(33, 37)).toBe('0000');
    expect(line.slice(107, 108)).toBe('I');
    expect(validateItauRemittanceFields(parseItauRemittanceFields(line))).toEqual({
      isValid: true,
      errors: [],
    });
  });
});
