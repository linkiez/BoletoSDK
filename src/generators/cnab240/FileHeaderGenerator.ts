import { LINE_LENGTH, RECORD_TYPE } from '../../constants/cnab240';
import { FileHeader } from '../../types';
import { buildLine, formatDateField, formatField, formatNumericField } from './LineGenerator';

/**
 * Generator for CNAB240 File Header (Registro 0 - Header de Arquivo)
 * Position: First line of file
 * Record type: 0
 * Length: 240 characters
 */
export class FileHeaderGenerator {
  /**
   * Generate CNAB240 file header line
   * @param header - File header data
   * @returns 240-character formatted line
   */
  public generate(header: FileHeader): string {
    this.validate(header);

    const fields = new Map<string, string>();

    // Positions 1-3: Bank code
    fields.set('bankCode', formatField(header.bankCode, 1, 3, 'numeric'));

    // Positions 4-7: Batch number (always 0000 for file header)
    fields.set('batchNumber', formatNumericField(0, 4, 7));

    // Position 8: Record type (always 0 for file header)
    fields.set('recordType', RECORD_TYPE.FILE_HEADER);

    // Positions 9-17: Reserved (spaces)
    fields.set('reserved1', formatField('', 9, 17, 'text'));

    // Position 18: Company registration type (0=CPF, 1=CNPJ, 2=PIS/PASEP)
    fields.set('companyRegistrationType', String(header.companyRegistrationType));

    // Positions 19-32: Company registration number (CPF/CNPJ)
    fields.set(
      'companyRegistrationNumber',
      formatField(header.companyRegistrationNumber, 19, 32, 'numeric'),
    );

    // Positions 33-52: Agreement code (varies by bank)
    fields.set('agreementCode', formatField(header.agreementCode || '', 33, 52, 'text'));

    // Positions 53-57: Agency
    fields.set('agency', formatNumericField(Number(header.agency || 0), 53, 57));

    // Position 58: Agency check digit
    fields.set('agencyDigit', formatField(header.agencyDigit || '', 58, 58, 'text'));

    // Positions 59-70: Account number
    fields.set('account', formatNumericField(Number(header.account || 0), 59, 70));

    // Position 71: Account check digit
    fields.set('accountDigit', formatField(header.accountDigit || '', 71, 71, 'text'));

    // Position 72: Full account check digit (optional)
    fields.set('fullAccountDigit', formatField(header.fullAccountDigit || '', 72, 72, 'text'));

    // Positions 73-102: Company name
    fields.set('companyName', formatField(header.companyName, 73, 102, 'text'));

    // Positions 103-132: Bank name
    fields.set('bankName', formatField(header.bankName, 103, 132, 'text'));

    // Positions 133-142: Reserved (spaces)
    fields.set('reserved2', formatField('', 133, 142, 'text'));

    // Position 143: File code (1=Remessa, 2=Retorno)
    fields.set('fileCode', String(header.fileCode));

    // Positions 144-151: File generation date (DDMMYYYY)
    fields.set('generationDate', formatDateField(header.generationDate, 144, 151));

    // Positions 152-157: File generation time (HHMMSS)
    fields.set('generationTime', formatField(header.generationTime || '', 152, 157, 'numeric'));

    // Positions 158-163: Sequential file number
    fields.set('sequentialNumber', formatNumericField(header.sequentialNumber, 158, 163));

    // Positions 164-166: File layout version
    fields.set('layoutVersion', formatField(header.layoutVersion, 164, 166, 'numeric'));

    // Positions 167-171: Density (always 00000)
    fields.set('density', formatNumericField(0, 167, 171));

    // Positions 172-191: Reserved for bank
    fields.set('bankReserved', formatField(header.bankReserved || '', 172, 191, 'text'));

    // Positions 192-211: Reserved for company
    fields.set('companyReserved', formatField(header.companyReserved || '', 192, 211, 'text'));

    // Positions 212-240: Reserved (spaces)
    fields.set('reserved3', formatField('', 212, LINE_LENGTH, 'text'));

    const line = buildLine(fields);

    if (line.length !== LINE_LENGTH) {
      throw new Error(
        `Generated file header has invalid length: ${line.length} (expected ${LINE_LENGTH})`,
      );
    }

    return line;
  }

  /**
   * Validate file header required fields
   * @param header - File header to validate
   */
  private validate(header: FileHeader): void {
    if (!header.bankCode || header.bankCode.trim() === '') {
      throw new Error('Bank code is required');
    }

    if (!header.companyRegistrationNumber || header.companyRegistrationNumber.trim() === '') {
      throw new Error('Company registration number is required');
    }

    if (!header.companyName || header.companyName.trim() === '') {
      throw new Error('Company name is required');
    }

    if (!header.bankName || header.bankName.trim() === '') {
      throw new Error('Bank name is required');
    }

    if (!header.generationDate) {
      throw new Error('File generation date is required');
    }

    if (!header.layoutVersion || header.layoutVersion.trim() === '') {
      throw new Error('Layout version is required');
    }
  }
}
