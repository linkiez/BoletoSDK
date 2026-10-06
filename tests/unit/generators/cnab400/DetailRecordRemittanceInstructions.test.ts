import { generateDetailRecordRemessa } from '../../../../src/generators/cnab400/DetailRecordGenerator';
import type { DetailRecord } from '../../../../src/types/cnab400';

describe('generateDetailRecordRemessa instructions', () => {
  it('serializes interest, discount, and protest days to Itaú CNAB400 positions', () => {
    const detail: DetailRecord = {
      recordType: '1',
      companyRegistrationType: '02',
      companyRegistrationNumber: '12345678000195',
      agency: '1234',
      account: '12345',
      accountDigit: '6',
      ourNumber: '00000123',
      companyControl: '10',
      portfolioCode: '109',
      portfolioType: 'I',
      dueDate: new Date(2026, 5, 30),
      amount: 125.5,
      issueDate: new Date(2026, 5, 1),
      instructionCode1: '01',
      dailyInterestAmount: 1.25,
      discountLimitDate: new Date(2026, 5, 20),
      discountValue: 15.5,
      payerName: 'PAGADOR TESTE',
      payerAddress: 'RUA A, 100',
      payerZipCode: '01310100',
      payerCity: 'SAO PAULO',
      payerState: 'SP',
      protestDays: 10,
      sequentialNumber: 2,
    };

    const line = generateDetailRecordRemessa(detail);

    expect(line).toHaveLength(400);
    expect(line.slice(156, 158)).toBe('01');
    expect(line.slice(160, 173)).toBe('0000000000125');
    expect(line.slice(173, 179)).toBe('200626');
    expect(line.slice(179, 192)).toBe('0000000001550');
    expect(line.slice(391, 393)).toBe('10');
  });
});
