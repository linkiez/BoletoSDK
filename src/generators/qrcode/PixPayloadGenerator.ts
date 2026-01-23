import { padLeft } from '@utils/generators';

export interface PixPayloadData {
  key: string;
  amount?: number;
  merchantName: string;
  merchantCity: string;
  transactionId: string;
  description?: string;
}

const PAYLOAD_FORMAT_INDICATOR = '01';
const MERCHANT_ACCOUNT_GUI = 'br.gov.bcb.pix';
const MERCHANT_CATEGORY_CODE = '0000';
const TRANSACTION_CURRENCY = '986';
const COUNTRY_CODE = 'BR';
const CRC_ID = '63';
const CRC_LENGTH = '04';

export function generatePixPayload(data: PixPayloadData): string {
  const key = validateRequired(data.key, 'PIX key');
  const merchantName = normalizeText(data.merchantName, 'Merchant name', 25);
  const merchantCity = normalizeText(data.merchantCity, 'Merchant city', 15);
  const transactionId = normalizeText(data.transactionId, 'Transaction ID', 25, false, false);
  const description = data.description
    ? normalizeText(data.description, 'Description', 99, false)
    : undefined;

  const merchantAccountInfo = buildMerchantAccountInfo(key, description);
  const additionalData = buildAdditionalData(transactionId);

  const fields = [
    formatTlv('00', PAYLOAD_FORMAT_INDICATOR),
    formatTlv('26', merchantAccountInfo),
    formatTlv('52', MERCHANT_CATEGORY_CODE),
    formatTlv('53', TRANSACTION_CURRENCY),
    ...buildAmountField(data.amount),
    formatTlv('58', COUNTRY_CODE),
    formatTlv('59', merchantName),
    formatTlv('60', merchantCity),
    formatTlv('62', additionalData),
  ];

  const payloadWithoutCrc = `${fields.join('')}${CRC_ID}${CRC_LENGTH}`;
  const crc = calculateCrc16(payloadWithoutCrc);

  return `${payloadWithoutCrc}${crc}`;
}

function validateRequired(value: string, fieldName: string): string {
  if (!value?.trim()) {
    throw new Error(`${fieldName} is required`);
  }

  return value.trim();
}

function normalizeText(
  value: string,
  fieldName: string,
  maxLength: number,
  upperCase = true,
  validateMaxLength = true,
): string {
  const trimmed = validateRequired(value, fieldName);
  const normalized = trimmed.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '');
  const output = upperCase ? normalized.toUpperCase() : normalized;

  if (validateMaxLength && output.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters`);
  }

  return output;
}

function buildAmountField(amount?: number): string[] {
  if (amount === undefined || amount <= 0) {
    return [];
  }

  if (!Number.isFinite(amount)) {
    throw new TypeError('Amount must be a valid number');
  }

  const formatted = amount.toFixed(2);
  return [formatTlv('54', formatted)];
}

function buildMerchantAccountInfo(key: string, description?: string): string {
  const fields = [formatTlv('00', MERCHANT_ACCOUNT_GUI), formatTlv('01', key)];

  if (description) {
    fields.push(formatTlv('02', description));
  }

  return fields.join('');
}

function buildAdditionalData(transactionId: string): string {
  if (transactionId.length < 1 || transactionId.length > 25) {
    throw new Error('Transaction ID must be between 1 and 25 characters');
  }

  return formatTlv('05', transactionId);
}

function formatTlv(id: string, value: string): string {
  if (value.length > 99) {
    throw new Error(`Value length for ${id} must be at most 99 characters`);
  }

  return `${id}${padLeft(value.length, 2)}${value}`;
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
