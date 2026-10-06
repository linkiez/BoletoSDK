/**
 * CNAB400 Penalty Record Type Definition
 *
 * @module types/cnab400/PenaltyRecord
 */

/**
 * Penalty Record (Type 2) - Optional
 *
 * Optional record containing penalty/fine (multa) information.
 * Used to register or update fine values/percentages for the bank slip.
 * Valid only for registered portfolios.
 *
 * @see CNAB400-ITAU.md section 3.1 - Registro Detalhe Multa (Opcional)
 *
 * @example
 * ```typescript
 * const penaltyRecord: PenaltyRecord = {
 *   recordType: '2',
 *   penaltyCode: '2',
 *   penaltyDate: new Date('2026-03-10'),
 *   penaltyValue: 5.00,
 *   sequentialNumber: 3
 * };
 * ```
 */
export interface PenaltyRecord {
  /** Record type identifier - Always '2' for penalty (Position 001-001) */
  recordType: '2';

  /** Company control of the type 1 detail this record follows; not serialized */
  detailCompanyControl?: string;

  /** Zero-based index of the associated detail; inferred by the parser and not serialized */
  detailIndex?: number;

  /** Itaú penalty code - '0'=no penalty, '1'=fixed amount, '2'=percentage (Position 002-002) */
  penaltyCode: '0' | '1' | '2';

  /** Penalty date - Date when penalty starts (Position 003-010, DDMMYYYY) */
  penaltyDate?: Date;

  /** Penalty value - Amount or percentage (Position 011-023) */
  penaltyValue?: number;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}
