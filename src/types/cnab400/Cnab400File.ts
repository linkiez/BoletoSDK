/**
 * CNAB400 File Structure Type Definition
 *
 * @module types/cnab400/Cnab400File
 */

import type { DetailRecord } from './DetailRecord';
import type { FileHeader } from './FileHeader';
import type { FileTrailer } from './FileTrailer';
import type { GuarantorRecord } from './GuarantorRecord';
import type { MessageBackRecord } from './MessageBackRecord';
import type { MessageFrontRecord } from './MessageFrontRecord';
import type { PenaltyRecord } from './PenaltyRecord';

/**
 * Complete CNAB400 File Structure
 *
 * Represents a complete CNAB400 remittance or return file.
 * Follows the structure: Header + Details + Trailer
 *
 * @example
 * ```typescript
 * const cnabFile: Cnab400File = {
 *   header: {
 *     recordType: '0',
 *     operationType: '1',
 *     companyName: 'ACME CORP',
 *     bankCode: '341',
 *     generationDate: new Date(),
 *     sequenceNumber: 1
 *   },
 *   details: [
 *     {
 *       recordType: '1',
 *       ourNumber: '12345678',
 *       amount: 150.00,
 *       dueDate: new Date('2026-03-01'),
 *       payerName: 'JOHN DOE',
 *       sequentialNumber: 2
 *     }
 *   ],
 *   guarantorRecords: [],
 *   messageFrontRecords: [
 *     {
 *       recordType: '7',
 *       message1: 'PAYMENT INSTRUCTIONS',
 *       sequentialNumber: 3
 *     }
 *   ],
 *   messageBackRecords: [],
 *   trailer: {
 *     recordType: '9',
 *     totalRecords: 4,
 *     totalAmount: 150.00,
 *     sequentialNumber: 4
 *   }
 * };
 * ```
 */
export interface Cnab400File {
  /** File header record (Type 0) - Required, exactly 1 per file */
  header: FileHeader;

  /** Detail records (Type 1) - One or more transaction records */
  details: DetailRecord[];

  /** Penalty records (Type 2) - Optional, one per detail with penalty */
  penaltyRecords?: PenaltyRecord[];

  /** Guarantor records (Type 5) - Optional, one per detail with guarantor */
  guarantorRecords?: GuarantorRecord[];

  /** Message front records (Type 7) - Required for Itaú, at least 1 */
  messageFrontRecords?: MessageFrontRecord[];

  /** Message back records (Type 8) - Optional */
  messageBackRecords?: MessageBackRecord[];

  /** File trailer record (Type 9) - Required, exactly 1 per file */
  trailer: FileTrailer;
}
