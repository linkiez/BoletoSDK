import { FILE_HEADER_POSITIONS, LINE_LENGTH, RECORD_TYPE } from '../../constants/cnab240';
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
    const POS = FILE_HEADER_POSITIONS;

    // Positions 1-3: Bank code
    fields.set(
      'bankCode',
      formatField(header.bankCode, POS.BANK_CODE.start, POS.BANK_CODE.end, 'numeric'),
    );

    // Positions 4-7: Batch number (always 0000 for file header)
    fields.set('batchNumber', formatNumericField(0, POS.BATCH_NUMBER.start, POS.BATCH_NUMBER.end));

    // Position 8: Record type (always 0 for file header)
    fields.set('recordType', RECORD_TYPE.FILE_HEADER);

    // Positions 9-17: Reserved (spaces)
    fields.set('reserved1', formatField('', POS.RESERVED_1.start, POS.RESERVED_1.end, 'text'));

    // Position 18: Company registration type (0=CPF, 1=CNPJ, 2=PIS/PASEP)
    fields.set('companyRegistrationType', String(header.companyRegistrationType));

    // Positions 19-32: Company registration number (CPF/CNPJ)
    fields.set(
      'companyRegistrationNumber',
      formatField(header.companyRegistrationNumber, POS.TAX_ID.start, POS.TAX_ID.end, 'numeric'),
    );

    // Positions 33-52: Agreement code (varies by bank)
    fields.set(
      'agreementCode',
      formatField(
        header.agreementCode || '',
        POS.AGREEMENT_CODE.start,
        POS.AGREEMENT_CODE.end,
        'text',
      ),
    );

    // Positions 53-57: Agency
    fields.set(
      'agency',
      formatNumericField(Number(header.agency || 0), POS.AGENCY.start, POS.AGENCY.end),
    );

    // Position 58: Agency check digit
    fields.set(
      'agencyDigit',
      formatField(header.agencyDigit || '', POS.AGENCY_DIGIT.start, POS.AGENCY_DIGIT.end, 'text'),
    );

    // Positions 59-70: Account number
    fields.set(
      'account',
      formatNumericField(Number(header.account || 0), POS.ACCOUNT.start, POS.ACCOUNT.end),
    );

    // Position 71: Account check digit
    fields.set(
      'accountDigit',
      formatField(
        header.accountDigit || '',
        POS.ACCOUNT_DIGIT.start,
        POS.ACCOUNT_DIGIT.end,
        'text',
      ),
    );

    // Position 72: Full account check digit (optional)
    fields.set(
      'fullAccountDigit',
      formatField(header.fullAccountDigit || '', POS.ACCOUNT_DV.start, POS.ACCOUNT_DV.end, 'text'),
    );

    // Positions 73-102: Company name
    fields.set(
      'companyName',
      formatField(header.companyName, POS.COMPANY_NAME.start, POS.COMPANY_NAME.end, 'text'),
    );

    // Positions 103-132: Bank name
    fields.set(
      'bankName',
      formatField(header.bankName, POS.BANK_NAME.start, POS.BANK_NAME.end, 'text'),
    );

    // Positions 133-142: Reserved (spaces)
    fields.set('reserved2', formatField('', POS.RESERVED_2.start, POS.RESERVED_2.end, 'text'));

    // Position 143: File code (1=Remessa, 2=Retorno)
    fields.set('fileCode', String(header.fileCode));

    // Positions 144-151: File generation date (DDMMYYYY)
    fields.set(
      'generationDate',
      formatDateField(header.generationDate, POS.GENERATION_DATE.start, POS.GENERATION_DATE.end),
    );

    // Positions 152-157: File generation time (HHMMSS)
    fields.set(
      'generationTime',
      formatField(
        header.generationTime || '',
        POS.GENERATION_TIME.start,
        POS.GENERATION_TIME.end,
        'numeric',
      ),
    );

    // Positions 158-163: Sequential file number
    fields.set(
      'sequentialNumber',
      formatNumericField(header.sequentialNumber, POS.FILE_SEQUENCE.start, POS.FILE_SEQUENCE.end),
    );

    // Positions 164-166: File layout version
    fields.set(
      'layoutVersion',
      formatField(
        header.layoutVersion,
        POS.LAYOUT_VERSION.start,
        POS.LAYOUT_VERSION.end,
        'numeric',
      ),
    );

    // Positions 167-171: Density (always 00000)
    fields.set('density', formatNumericField(0, POS.FILE_DENSITY.start, POS.FILE_DENSITY.end));

    // Positions 172-191: Reserved for bank
    fields.set(
      'bankReserved',
      formatField(
        header.bankReserved || '',
        POS.RESERVED_BANK.start,
        POS.RESERVED_BANK.end,
        'text',
      ),
    );

    // Positions 192-211: Reserved for company
    fields.set(
      'companyReserved',
      formatField(
        header.companyReserved || '',
        POS.RESERVED_COMPANY.start,
        POS.RESERVED_COMPANY.end,
        'text',
      ),
    );

    // Positions 212-240: Reserved (spaces)
    fields.set('reserved3', formatField('', POS.RESERVED_3.start, POS.RESERVED_3.end, 'text'));

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
