import { BatchHeader } from '../../types/cnab240';
import { buildLine, formatDateField, formatField, formatNumericField } from './LineGenerator';

/**
 * Generates CNAB240 Batch Header (Record Type 1)
 *
 * The batch header starts each batch and contains company information
 * and batch configuration such as operation type and service type.
 *
 * @example
 * ```typescript
 * const generator = new BatchHeaderGenerator();
 * const header: BatchHeader = {
 *   bankCode: '341',
 *   batchNumber: 1,
 *   recordType: '1',
 *   operationType: 'C',
 *   serviceType: '01',
 *   companyRegistrationType: '2',
 *   companyRegistrationNumber: '12345678000195',
 *   agency: '1234',
 *   account: '123456',
 *   accountDigit: '7',
 *   companyName: 'EMPRESA TESTE LTDA'
 * };
 * const line = generator.generate(header);
 * ```
 */
export class BatchHeaderGenerator {
  /**
   * Generates a CNAB240 batch header line (240 characters)
   *
   * Field positions (1-indexed as per FEBRABAN spec):
   * - 001-003 (3): Bank code
   * - 004-007 (4): Batch number (sequential starting from 1)
   * - 008-008 (1): Record type (always 1 for batch header)
   * - 009-009 (1): Operation type (C=Credit, D=Debit)
   * - 010-011 (2): Service type (01=Bank slip, etc.)
   * - 012-013 (2): Service release version
   * - 014-014 (1): CNAB reserved
   * - 015-017 (3): Form type (usually 000)
   * - 018-018 (1): Company registration type (1=CNPJ, 2=CPF)
   * - 019-032 (14): Company registration number
   * - 033-052 (20): Agreement code
   * - 053-057 (5): Agency
   * - 058-058 (1): Agency digit
   * - 059-070 (12): Account
   * - 071-071 (1): Account digit
   * - 072-072 (1): Full account digit
   * - 073-102 (30): Company name
   * - 103-142 (40): Message 1
   * - 143-182 (40): Message 2
   * - 183-190 (8): Remittance/return sequential number
   * - 191-198 (8): Recording date (DDMMYYYY)
   * - 199-206 (8): Credit date (DDMMYYYY)
   * - 207-240 (34): CNAB reserved
   *
   * @param header - Batch header data
   * @returns 240-character CNAB240 batch header line
   * @throws Error if validation fails
   */
  public generate(header: BatchHeader): string {
    this.validate(header);

    const fields = new Map<string, string>();

    // Positions 1-3: Bank code (3 numeric)
    fields.set('bankCode', formatNumericField(Number(header.bankCode), 1, 3));

    // Positions 4-7: Batch number (4 numeric, sequential from 1)
    fields.set('batchNumber', formatNumericField(Number(header.batchNumber), 4, 7));

    // Position 8: Record type (always 1 for batch header)
    fields.set('recordType', formatField('1', 8, 8, 'numeric'));

    // Position 9: Operation type (C, D, E, I)
    fields.set('operationType', formatField(header.operationType, 9, 9, 'text'));

    // Positions 10-11: Service type (01, 02, 03, etc.)
    fields.set('serviceType', formatField(header.serviceType, 10, 11, 'text'));

    // Positions 12-13: Service version (optional, default 00)
    fields.set('serviceVersion', formatField(header.serviceVersion || '00', 12, 13, 'numeric'));

    // Position 14: CNAB reserved (space)
    fields.set('cnabReserved1', formatField('', 14, 14, 'text'));

    // Positions 15-17: Form type (usually 000)
    fields.set('formType', formatField('000', 15, 17, 'numeric'));

    // Position 18: Company registration type
    fields.set(
      'companyRegistrationType',
      formatField(header.companyRegistrationType, 18, 18, 'numeric'),
    );

    // Positions 19-32: Company registration number (14 numeric)
    fields.set(
      'companyRegistrationNumber',
      formatNumericField(Number(header.companyRegistrationNumber), 19, 32),
    );

    // Positions 33-52: Agreement code (20 text)
    fields.set('agreementCode', formatField(header.agreementCode || '', 33, 52, 'text'));

    // Positions 53-57: Agency (5 numeric)
    fields.set('agency', formatNumericField(Number(header.agency), 53, 57));

    // Position 58: Agency digit (1 text)
    fields.set('agencyDigit', formatField(header.agencyDigit || '', 58, 58, 'text'));

    // Positions 59-70: Account (12 numeric)
    fields.set('account', formatNumericField(Number(header.account), 59, 70));

    // Position 71: Account digit (1 text)
    fields.set('accountDigit', formatField(header.accountDigit, 71, 71, 'text'));

    // Position 72: Full account digit (1 text, optional)
    fields.set('fullAccountDigit', formatField(header.fullAccountDigit || '', 72, 72, 'text'));

    // Positions 73-102: Company name (30 text)
    fields.set('companyName', formatField(header.companyName, 73, 102, 'text'));

    // Positions 103-142: Message 1 (40 text, optional)
    fields.set('message1', formatField(header.message1 || '', 103, 142, 'text'));

    // Positions 143-182: Message 2 (40 text, optional)
    fields.set('message2', formatField(header.message2 || '', 143, 182, 'text'));

    // Positions 183-190: Remittance/return number (8 numeric, optional)
    fields.set(
      'remittanceReturnNumber',
      formatNumericField(header.remittanceReturnNumber || 0, 183, 190),
    );

    // Positions 191-198: Recording date (8 date DDMMYYYY, optional)
    fields.set('recordingDate', formatDateField(header.recordingDate, 191, 198));

    // Positions 199-206: Credit date (8 date DDMMYYYY, optional)
    fields.set('creditDate', formatDateField(header.creditDate, 199, 206));

    // Positions 207-240: CNAB reserved (34 spaces)
    fields.set('cnabReserved2', formatField('', 207, 240, 'text'));

    const line = buildLine(fields);

    // Validate line length
    if (line.length !== 240) {
      throw new Error(`Invalid batch header length: expected 240, got ${line.length}`);
    }

    return line;
  }

  /**
   * Validates required fields in batch header
   *
   * @param header - Batch header to validate
   * @throws Error if required fields are missing or invalid
   */
  private validate(header: BatchHeader): void {
    if (!header.bankCode) {
      throw new Error('Bank code is required');
    }

    if (header.batchNumber === undefined || header.batchNumber === null) {
      throw new Error('Batch number is required');
    }

    if (!header.recordType) {
      throw new Error('Record type is required');
    }

    if (!header.operationType) {
      throw new Error('Operation type is required');
    }

    if (!header.serviceType) {
      throw new Error('Service type is required');
    }

    if (!header.companyRegistrationType) {
      throw new Error('Company registration type is required');
    }

    if (!header.companyRegistrationNumber) {
      throw new Error('Company registration number is required');
    }

    if (!header.agency) {
      throw new Error('Agency is required');
    }

    if (!header.account) {
      throw new Error('Account is required');
    }

    if (!header.accountDigit) {
      throw new Error('Account digit is required');
    }

    if (!header.companyName) {
      throw new Error('Company name is required');
    }
  }
}
