import type {
  ItauLiquidationCode,
  ItauLiquidationMapping,
  ItauRejectionMessageMapping,
} from '../../types/adapters';

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
 * Known Itaú rejection code descriptions extracted from return message area conventions.
 */
export const ITAU_REJECTION_CODE_DESCRIPTION_MAP: Record<string, string> = {
  '00000001': 'Rejected due to invalid wallet code',
  '00000002': 'Rejected due to invalid payer document',
  '00000003': 'Rejected due to invalid due date',
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
 * Checks whether a code is a supported Itaú liquidation channel code.
 *
 * @param liquidationCode - Two-digit liquidation code.
 * @returns True when the code is supported by the Itaú return mapper.
 */
export function isValidItauLiquidationCode(
  liquidationCode: string,
): liquidationCode is ItauLiquidationCode {
  return /^\d{2}$/.test(liquidationCode) && liquidationCode in ITAU_LIQUIDATION_CODE_MAP;
}

/**
 * Maps an Itaú liquidation code to a normalized representation.
 *
 * @param liquidationCode - Two-digit Itaú liquidation code.
 * @returns Normalized liquidation mapping.
 * @throws {Error} When the liquidation code is not supported.
 */
export function mapItauLiquidationCode(liquidationCode: string): ItauLiquidationMapping {
  if (!isValidItauLiquidationCode(liquidationCode)) {
    throw new Error(`Unsupported Itau liquidation code: ${liquidationCode}`);
  }

  return ITAU_LIQUIDATION_CODE_MAP[liquidationCode];
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

  if (/^\d+$/.test(rejectionMessage)) {
    const normalizedCode = normalizeItauRejectionCode(rejectionMessage);

    if (/^0+$/.test(normalizedCode)) {
      return undefined;
    }

    const knownDescription = ITAU_REJECTION_CODE_DESCRIPTION_MAP[normalizedCode];

    return {
      raw: rejectionMessage,
      category: 'code',
      code: normalizedCode,
      source: knownDescription ? 'catalog' : 'fallback',
      description:
        knownDescription ?? `Itaú rejection code from return message area: ${normalizedCode}`,
    };
  }

  return {
    raw: rejectionMessage,
    category: 'text',
    source: 'free-text',
    description: 'Itaú free-text rejection message from return message area',
  };
}
