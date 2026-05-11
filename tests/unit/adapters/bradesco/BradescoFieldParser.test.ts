import {
  parseBradescoRemittanceFields,
  parseBradescoReturnFields,
} from '../../../../src/adapters/bradesco/BradescoFieldParser';

function replaceAt(line: string, start: number, end: number, value: string): string {
  const normalizedValue = value.padEnd(end - start + 1, ' ').slice(0, end - start + 1);
  return `${line.slice(0, start - 1)}${normalizedValue}${line.slice(end)}`;
}

describe('BradescoFieldParser', () => {
  const baseLine = ''.padEnd(400, ' ');

  it('should parse remittance-specific Bradesco fields', () => {
    const line = replaceAt(
      replaceAt(
        replaceAt(
          replaceAt(replaceAt(baseLine, 157, 158, '00'), 84, 86, '019'),
          108,
          108,
          'R',
        ),
        109,
        110,
        '01',
      ),
      392,
      393,
      '05',
    );

    expect(parseBradescoRemittanceFields(line)).toEqual({
      instructionCode: '00',
      walletNumber: '019',
      walletType: 'R',
      occurrenceCode: '01',
      daysCount: 5,
    });
  });

  it('should parse return-specific Bradesco fields', () => {
    const line = replaceAt(
      replaceAt(
        replaceAt(
          replaceAt(
            replaceAt(
              replaceAt(
                replaceAt(baseLine, 84, 86, '019'),
                108,
                108,
                'R',
              ),
              109,
              110,
              '06',
            ),
            63,
            70,
            '12345678',
          ),
          71,
          71,
          '8',
        ),
        127,
        134,
        '12345678',
      ),
      135,
      135,
      '8',
    );

    expect(parseBradescoReturnFields(line)).toEqual({
      walletNumber: '019',
      walletType: 'R',
      occurrenceCode: '06',
      ourNumber: '12345678',
      ourNumberCheckDigit: '8',
      confirmedOurNumber: '12345678',
      confirmedOurNumberCheckDigit: '8',
    });
  });

  it('should reject invalid remittance lines', () => {
    expect(() => parseBradescoRemittanceFields('short')).toThrow(
      'Invalid Bradesco remittance detail line length: 5',
    );
  });

  it('should reject invalid return lines', () => {
    expect(() => parseBradescoReturnFields('short')).toThrow(
      'Invalid Bradesco return detail line length: 5',
    );
  });
});
