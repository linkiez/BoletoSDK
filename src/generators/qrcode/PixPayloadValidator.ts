type TlvField = {
  id: string;
  length: number;
  value: string;
};

const CRC_FIELD_ID = '63';
const CRC_LENGTH = 4;

export function validatePixPayload(payload: string): void {
  if (!payload?.trim()) {
    throw new Error('PIX payload cannot be empty');
  }

  const fields = parseTlvFields(payload.trim());
  const lastField = fields.at(-1);

  if (lastField?.id !== CRC_FIELD_ID) {
    throw new Error('PIX payload must end with CRC field 63');
  }

  if (lastField.length !== CRC_LENGTH) {
    throw new Error('PIX payload CRC field must have length 4');
  }

  const expectedCrc = calculateCrc16(payload.slice(0, -CRC_LENGTH));
  if (lastField.value !== expectedCrc) {
    throw new Error('PIX payload CRC is invalid');
  }

  ensureRequiredField(fields, '00', 'payload format indicator');
  ensureRequiredField(fields, '26', 'merchant account information');
  ensureRequiredField(fields, '52', 'merchant category code');
  ensureRequiredField(fields, '53', 'transaction currency');
  ensureRequiredField(fields, '58', 'country code');
  ensureRequiredField(fields, '59', 'merchant name');
  ensureRequiredField(fields, '60', 'merchant city');
  ensureRequiredField(fields, '62', 'additional data');
}

function parseTlvFields(payload: string): TlvField[] {
  const fields: TlvField[] = [];
  let index = 0;

  while (index + 4 <= payload.length) {
    const id = payload.slice(index, index + 2);
    const lengthText = payload.slice(index + 2, index + 4);
    const length = Number.parseInt(lengthText, 10);

    if (!Number.isInteger(length) || length < 0) {
      throw new Error(`Invalid TLV length for field ${id}`);
    }

    const valueStart = index + 4;
    const valueEnd = valueStart + length;

    if (valueEnd > payload.length) {
      throw new Error(`TLV field ${id} exceeds payload length`);
    }

    fields.push({ id, length, value: payload.slice(valueStart, valueEnd) });
    index = valueEnd;

    if (id === CRC_FIELD_ID) {
      break;
    }
  }

  return fields;
}

function ensureRequiredField(fields: TlvField[], id: string, fieldName: string): void {
  const field = fields.find((item) => item.id === id);

  if (!field || field.length === 0) {
    throw new Error(`PIX payload is missing ${fieldName}`);
  }
}

function calculateCrc16(payload: string): string {
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
}
