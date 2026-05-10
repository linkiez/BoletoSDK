import type {
  ItauLiquidationCode,
  ItauLiquidationMapping,
  ItauRejectionMessageMapping,
} from '../../types/adapters';
import { ITAU_REJECTION_CODE_DESCRIPTION_MAP } from '../../constants/bancos';

/**
 * Normalized liquidation channel mappings for Itaú return detail records.
 */
export const ITAU_LIQUIDATION_CODE_MAP: Record<ItauLiquidationCode, ItauLiquidationMapping> = {
  '01': { code: '01', category: 'bank', description: 'Liquidation channel 01 (bank)' },
  '02': { code: '02', category: 'clearing', description: 'Liquidation channel 02 (clearing)' },
  '03': {
    code: '03',
    category: 'electronic',
    description: 'Liquidation channel 03 (electronic)',
  },
  '04': { code: '04', category: 'other', description: 'Liquidation channel 04 (other)' },
};

/**
 * Normalizes numeric Itaú rejection codes to the canonical 8-digit representation.
 */
function normalizeItauRejectionCode(rejectionMessage: string): string {
  if (rejectionMessage.length >= 8) {
    return rejectionMessage;
  }

  return rejectionMessage.padStart(8, '0');
}

/**
 * Normalizes Itaú liquidation code input by trimming surrounding whitespace.
 */
function normalizeItauLiquidationCodeInput(liquidationCode: string): string {
  const normalizedCode = liquidationCode.trim();

  if (/^\d$/.test(normalizedCode)) {
    return normalizedCode.padStart(2, '0');
  }

  return normalizedCode;
}

/**
 * Checks whether a code is a supported Itaú liquidation channel code.
 *
 * @param liquidationCode - Two-digit liquidation code.
 * @returns True when the code is supported by the Itaú return mapper.
 */
export function isValidItauLiquidationCode(liquidationCode: string): boolean {
  const normalizedCode = normalizeItauLiquidationCodeInput(liquidationCode);

  return /^\d{2}$/.test(normalizedCode) && normalizedCode in ITAU_LIQUIDATION_CODE_MAP;
}

/**
 * Maps an Itaú liquidation code to a normalized representation.
 *
 * @param liquidationCode - Two-digit Itaú liquidation code.
 * @returns Normalized liquidation mapping.
 * @throws {Error} When the liquidation code is not supported.
 */
export function mapItauLiquidationCode(liquidationCode: string): ItauLiquidationMapping {
  const normalizedCode = normalizeItauLiquidationCodeInput(liquidationCode);

  if (!isValidItauLiquidationCode(normalizedCode)) {
    throw new Error(`Unsupported Itau liquidation code: ${liquidationCode}`);
  }

  return ITAU_LIQUIDATION_CODE_MAP[normalizedCode as ItauLiquidationCode];
}

/**
 * Normalizes Itaú return rejection message area.
 *
 * @param rejectionMessage - Raw rejection message area.
 * @returns Normalized rejection message mapping when content is present.
 */
export function mapItauRejectionMessage(
  rejectionMessage: string | undefined,
): ItauRejectionMessageMapping | undefined {
  if (!rejectionMessage) {
    return undefined;
  }

  const normalizedMessage = rejectionMessage.trim();

  if (normalizedMessage.length === 0) {
    return undefined;
  }

  if (/^\d+$/.test(normalizedMessage)) {
    const normalizedCode = normalizeItauRejectionCode(normalizedMessage);

    if (/^0+$/.test(normalizedCode)) {
      return undefined;
    }

    const knownDescription = ITAU_REJECTION_CODE_DESCRIPTION_MAP[normalizedCode];

    return {
      raw: normalizedMessage,
      category: 'code',
      code: normalizedCode,
      source: knownDescription ? 'catalog' : 'fallback',
      description:
        knownDescription ?? `Itaú rejection code from return message area: ${normalizedCode}`,
    };
  }

  return {
    raw: normalizedMessage,
    category: 'text',
    source: 'free-text',
    description: 'Itaú free-text rejection message from return message area',
  };
}
