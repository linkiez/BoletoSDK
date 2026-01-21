/**
 * CNAB400 Penalty Record Generator
 *
 * Generates penalty/fine records (Type 2) for CNAB400 REMESSA files.
 *
 * @module generators/cnab400/PenaltyRecordGenerator
 */

import type { PenaltyRecord } from '../../types/cnab400';
import { formatDecimal } from '../../utils/formatters';
import { padLeft } from '../../utils/generators';

/**
 * Generates penalty/fine record (Type 2)
 *
 * Creates a 400-character penalty line for REMESSA files.
 * This record is optional and defines penalty information for late payment.
 *
 * @param penalty - PenaltyRecord data object
 * @returns 400-character penalty line
 *
 * @example
 * ```typescript
 * const penalty: PenaltyRecord = {
 *   recordType: '2',
 *   penaltyCode: '2', // Percentage penalty
 *   penaltyDate: new Date('2026-03-20'),
 *   penaltyValue: 2.50, // 2.5% penalty
 *   sequentialNumber: 3
 * };
 *
 * const line = generatePenaltyRecord(penalty);
 * // Returns: 400-character string starting with '22...'
 * ```
 */
export function generatePenaltyRecord(penalty: PenaltyRecord): string {
  let line = '';

  // Position 001-001: Record type
  line += '2';

  // Position 002-002: Penalty code (1=None, 2=Percentage, 3=Fixed value)
  line += penalty.penaltyCode;

  // Position 003-010: Penalty date (DDMMYYYY)
  if (penalty.penaltyDate) {
    const date = penalty.penaltyDate;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    line += day + month + year;
  } else {
    line += '00000000';
  }

  // Position 011-023: Penalty value/percentage (13 positions)
  if (penalty.penaltyValue !== undefined && penalty.penaltyValue !== null) {
    line += formatDecimal(penalty.penaltyValue, 13, 2);
  } else {
    line += padLeft('0', 13, '0');
  }

  // Position 024-394: Blanks (371 positions)
  line += ' '.repeat(371);

  // Position 395-400: Sequential number (6 positions)
  line += padLeft(penalty.sequentialNumber || '0', 6, '0');

  return line;
}
