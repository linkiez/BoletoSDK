import type { ItauOccurrenceCode, ItauOccurrenceMapping } from '../../types/adapters';

/**
 * Normalized mapping for Itaú CNAB400 return occurrence codes.
 */
export const ITAU_OCCURRENCE_CODE_MAP: Record<ItauOccurrenceCode, ItauOccurrenceMapping> = {
  '02': { code: '02', category: 'entry', description: 'Entry confirmed' },
  '03': { code: '03', category: 'rejection', description: 'Entry rejected' },
  '04': { code: '04', category: 'maintenance', description: 'Transfer to discounted' },
  '05': { code: '05', category: 'maintenance', description: 'Transfer to pledge' },
  '06': { code: '06', category: 'settlement', description: 'Payment liquidation' },
  '07': { code: '07', category: 'settlement', description: 'Payment confirmation via bank' },
  '08': { code: '08', category: 'settlement', description: 'Payment by clearing' },
  '09': { code: '09', category: 'settlement', description: 'Partial payment' },
  '10': { code: '10', category: 'maintenance', description: 'Low via file' },
  '11': { code: '11', category: 'maintenance', description: 'Title in being' },
  '12': { code: '12', category: 'instruction', description: 'Abatement granted' },
  '13': { code: '13', category: 'instruction', description: 'Abatement canceled' },
  '14': { code: '14', category: 'instruction', description: 'Due date change' },
  '15': { code: '15', category: 'settlement', description: 'Payment liquidation after low' },
  '16': { code: '16', category: 'instruction', description: 'Instruction change confirmation' },
  '17': { code: '17', category: 'payer', description: 'Allegation payer' },
  '18': { code: '18', category: 'rejection', description: 'Instruction rejected' },
  '19': { code: '19', category: 'instruction', description: 'Instruction confirmation' },
  '20': { code: '20', category: 'charge', description: 'Debited' },
  '21': { code: '21', category: 'maintenance', description: 'Title change' },
  '23': { code: '23', category: 'settlement', description: 'Late payment' },
  '24': { code: '24', category: 'rejection', description: 'Entry rejected - duplicate' },
  '25': { code: '25', category: 'rejection', description: 'Protest entry rejected' },
  '26': {
    code: '26',
    category: 'rejection',
    description: 'Instruction rejected - title already protested',
  },
  '27': { code: '27', category: 'rejection', description: 'Protest withdrawal rejected' },
  '28': { code: '28', category: 'charge', description: 'Debit of fees/commissions' },
  '29': { code: '29', category: 'maintenance', description: 'Protest maintained' },
  '30': { code: '30', category: 'rejection', description: 'Command recused' },
  '31': { code: '31', category: 'payer', description: 'Manual change of payer' },
  '32': { code: '32', category: 'payer', description: 'Returned by Correios' },
  '33': { code: '33', category: 'settlement', description: 'Delayed payment' },
};

/**
 * Checks whether a code is a supported Itaú occurrence code.
 *
 * @param occurrenceCode - Two-digit occurrence code.
 * @returns True when the code is supported by the Itaú mapper.
 */
export function isValidItauOccurrenceCode(
  occurrenceCode: string,
): occurrenceCode is ItauOccurrenceCode {
  return /^\d{2}$/.test(occurrenceCode) && occurrenceCode in ITAU_OCCURRENCE_CODE_MAP;
}

/**
 * Maps an Itaú occurrence code to a normalized semantic category.
 *
 * @param occurrenceCode - Two-digit Itaú occurrence code.
 * @returns Normalized occurrence mapping.
 * @throws {Error} When the occurrence code is not supported.
 */
export function mapItauOccurrenceCode(occurrenceCode: string): ItauOccurrenceMapping {
  if (!isValidItauOccurrenceCode(occurrenceCode)) {
    throw new Error(`Unsupported Itau occurrence code: ${occurrenceCode}`);
  }

  return ITAU_OCCURRENCE_CODE_MAP[occurrenceCode];
}
