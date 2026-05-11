import type { BradescoOccurrenceCode, BradescoOccurrenceMapping } from '../../types/adapters';

/**
 * Normalized mapping for Bradesco CNAB return occurrence codes.
 */
export const BRADESCO_OCCURRENCE_CODE_MAP: Record<
  BradescoOccurrenceCode,
  BradescoOccurrenceMapping
> = {
  '02': { code: '02', category: 'entry', description: 'Entry confirmed' },
  '03': { code: '03', category: 'rejection', description: 'Entry rejected' },
  '06': { code: '06', category: 'settlement', description: 'Payment liquidation' },
  '09': { code: '09', category: 'settlement', description: 'Protested and settled' },
  '10': { code: '10', category: 'maintenance', description: 'Low requested' },
  '11': { code: '11', category: 'maintenance', description: 'Title in portfolio' },
  '12': { code: '12', category: 'instruction', description: 'Abatement granted' },
  '13': { code: '13', category: 'instruction', description: 'Abatement canceled' },
  '14': { code: '14', category: 'instruction', description: 'Due date change' },
  '15': {
    code: '15',
    category: 'settlement',
    description: 'Payment liquidation after low',
  },
  '16': {
    code: '16',
    category: 'instruction',
    description: 'Instruction change confirmation',
  },
  '17': { code: '17', category: 'payer', description: 'Payer alteration' },
  '18': { code: '18', category: 'rejection', description: 'Instruction rejected' },
  '19': { code: '19', category: 'instruction', description: 'Instruction confirmation' },
  '20': { code: '20', category: 'charge', description: 'Debited' },
  '23': { code: '23', category: 'settlement', description: 'Bank transfer settlement' },
  '24': { code: '24', category: 'rejection', description: 'Title rejected by CEP/UF' },
  '25': { code: '25', category: 'rejection', description: 'Protest instruction rejected' },
  '26': { code: '26', category: 'rejection', description: 'Protest title rejected' },
  '27': { code: '27', category: 'rejection', description: 'Low instruction rejected' },
  '28': { code: '28', category: 'charge', description: 'Tariff debit' },
  '30': { code: '30', category: 'maintenance', description: 'Occurrence alteration' },
};

/**
 * Checks whether a code is a supported Bradesco occurrence code.
 *
 * @param occurrenceCode - Two-digit occurrence code.
 * @returns True when the code is supported by the Bradesco mapper.
 */
export function isValidBradescoOccurrenceCode(
  occurrenceCode: string,
): occurrenceCode is BradescoOccurrenceCode {
  return /^\d{2}$/.test(occurrenceCode) && occurrenceCode in BRADESCO_OCCURRENCE_CODE_MAP;
}

/**
 * Maps a Bradesco occurrence code to a normalized semantic category.
 *
 * @param occurrenceCode - Two-digit Bradesco occurrence code.
 * @returns Normalized occurrence mapping.
 * @throws {Error} When occurrence code is not supported.
 */
export function mapBradescoOccurrenceCode(occurrenceCode: string): BradescoOccurrenceMapping {
  if (!isValidBradescoOccurrenceCode(occurrenceCode)) {
    throw new Error(`Unsupported Bradesco occurrence code: ${occurrenceCode}`);
  }

  return BRADESCO_OCCURRENCE_CODE_MAP[occurrenceCode];
}
