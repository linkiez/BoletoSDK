/**
 * CNAB400 File Header Type Definition
 *
 * @module types/cnab400/FileHeader
 */

/**
 * File Header Record (Type 0)
 *
 * Represents the header information of a CNAB400 file.
 * Contains company identification, bank code, and file metadata.
 *
 * @see CNAB400-ITAU.md section 3.1 - Arquivo Remessa
 *
 * @example
 * ```typescript
 * const header: FileHeader = {
 *   recordType: '0',
 *   operationType: '1',
 *   operationLiteral: 'REMESSA',
 *   serviceCode: '01',
 *   serviceLiteral: 'COBRANCA',
 *   agency: '0001',
 *   zeros: '00',
 *   account: '12345',
 *   accountDigit: '6',
 *   companyName: 'ACME CORPORATION LTDA',
 *   bankCode: '341',
 *   bankName: 'BANCO ITAU SA',
 *   generationDate: new Date('2026-01-20'),
 *   sequenceNumber: 1,
 *   layoutVersion: '400'
 * };
 * ```
 */
export interface FileHeader {
  /** Record type identifier - Always '0' for header (Position 001-001) */
  recordType: '0';

  /** Operation type - '1' for REMESSA (remittance), '2' for RETORNO (return) (Position 002-002) */
  operationType: '1' | '2';

  /** Operation literal - 'REMESSA' or 'RETORNO' (Position 003-009) */
  operationLiteral: string;

  /** Service code - '01' for collection service (Position 010-011) */
  serviceCode: string;

  /** Service literal - 'COBRANCA' (Position 012-026) */
  serviceLiteral: string;

  /** Agency code - 4 digits (Position 027-030) */
  agency: string;

  /** Zeros - Complement '00' (Position 031-032) */
  zeros: string;

  /** Account number - 5 digits (Position 033-037) */
  account: string;

  /** Account check digit - 1 digit (Position 038-038) */
  accountDigit: string;

  /** Company name - Up to 30 characters (Position 047-076) */
  companyName: string;

  /** Bank code - '341' for Itaú (Position 077-079) */
  bankCode: string;

  /** Bank name - 'BANCO ITAU SA' (Position 080-094) */
  bankName: string;

  /** File generation date - DDMMYY format (Position 095-100) */
  generationDate: Date;

  /** Density code - Spaces (Position 101-107) */
  densityCode?: string;

  /** Density unit - Spaces (Position 108-110) */
  densityUnit?: string;

  /** Sequential file number - Incremental (Position 111-115) */
  sequenceNumber: number;

  /** File creation date - DDMMYYYY format (Position 116-123) */
  creationDate?: Date;

  /** Layout version - '400' (Position 124-126) */
  layoutVersion?: string;

  /** Blanks - Complement (Position 127-394) */
  blanks?: string;

  /** Sequential - Record sequence '000001' (Position 395-400) */
  sequential?: string;
}
