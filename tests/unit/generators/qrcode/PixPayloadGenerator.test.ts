import { generatePixPayload } from '@generators';

type TlvField = { id: string; value: string };

const parseTlv = (payload: string): TlvField[] => {
  const fields: TlvField[] = [];
  let index = 0;

  while (index + 4 <= payload.length) {
    const id = payload.slice(index, index + 2);
    const length = Number.parseInt(payload.slice(index + 2, index + 4), 10);
    const value = payload.slice(index + 4, index + 4 + length);

    fields.push({ id, value });
    index += 4 + length;

    if (id === '63') break;
  }

  return fields;
};

const computeCrc16 = (payload: string): string => {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i += 1) {
    crc ^= (payload.codePointAt(i) ?? 0) << 8;

    for (let j = 0; j < 8; j += 1) {
      if ((crc & 0x8000) === 0) {
        crc <<= 1;
      } else {
        crc = (crc << 1) ^ 0x1021;
      }

      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
};

describe('generatePixPayload', () => {
  it('should generate payload with required fields and valid CRC', () => {
    const payload = generatePixPayload({
      key: '12345678900',
      amount: 1.23,
      merchantName: 'ACME STORE',
      merchantCity: 'SAO PAULO',
      transactionId: 'INV001',
      description: 'Invoice 1',
    });

    const fields = parseTlv(payload);
    const fieldMap = new Map(fields.map((field) => [field.id, field.value]));

    expect(fieldMap.get('00')).toBe('01');
    expect(fieldMap.get('52')).toBe('0000');
    expect(fieldMap.get('53')).toBe('986');
    expect(fieldMap.get('54')).toBe('1.23');
    expect(fieldMap.get('58')).toBe('BR');
    expect(fieldMap.get('59')).toBe('ACME STORE');
    expect(fieldMap.get('60')).toBe('SAO PAULO');

    const merchantAccount = parseTlv(fieldMap.get('26') ?? '');
    const merchantMap = new Map(merchantAccount.map((field) => [field.id, field.value]));
    expect(merchantMap.get('00')).toBe('br.gov.bcb.pix');
    expect(merchantMap.get('01')).toBe('12345678900');
    expect(merchantMap.get('02')).toBe('Invoice 1');

    const additionalData = parseTlv(fieldMap.get('62') ?? '');
    const additionalMap = new Map(additionalData.map((field) => [field.id, field.value]));
    expect(additionalMap.get('05')).toBe('INV001');

    const crcField = fields.at(-1);
    const crcPayload = payload.slice(0, -4);

    expect(crcField).toBeDefined();

    expect(crcField?.id).toBe('63');
    expect(crcField?.value.length).toBe(4);
    expect(crcField?.value).toBe(computeCrc16(crcPayload));
  });

  it('should omit amount when not provided', () => {
    const payload = generatePixPayload({
      key: '12345678900',
      merchantName: 'ACME STORE',
      merchantCity: 'SAO PAULO',
      transactionId: 'INV001',
    });

    const fields = parseTlv(payload);
    const fieldMap = new Map(fields.map((field) => [field.id, field.value]));

    expect(fieldMap.has('54')).toBe(false);
  });

  it('should throw when transaction id is too long', () => {
    expect(() =>
      generatePixPayload({
        key: '12345678900',
        merchantName: 'ACME STORE',
        merchantCity: 'SAO PAULO',
        transactionId: 'INV001-INV001-INV001-INV001',
      }),
    ).toThrow('Transaction ID must be between 1 and 25 characters');
  });
});
