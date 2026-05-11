import type {
  BradescoCnab240Segment,
  BradescoCnab400RemittanceDetail,
  BradescoCnab400ReturnDetail,
  BradescoOccurrenceMapping,
  BradescoOurNumberResult,
  BradescoRemittanceFields,
  BradescoReturnFields,
  BradescoWalletConfig,
} from '../../types/adapters';
import type {
  Batch as Cnab240Batch,
  Cnab240File,
  DetailRecord as Cnab240DetailRecord,
} from '../../types/cnab240';
import { parseCnab240 } from '../../parsers/cnab240';
import { parseDetailRecord, parseReturnDetailRecord } from '../../parsers/cnab400';
import { parseBradescoRemittanceFields, parseBradescoReturnFields } from './BradescoFieldParser';
import { mapBradescoOccurrenceCode, isValidBradescoOccurrenceCode } from './BradescoOccurrenceMapper';
import { buildBradescoOurNumber, formatBradescoOurNumber } from './BradescoOurNumberCalculator';
import { validateBradescoRemittanceFields, validateBradescoReturnFields } from './BradescoValidator';
import {
  assertValidBradescoWallet,
  getBradescoWalletConfig,
  isValidBradescoWallet,
} from './BradescoWalletValidator';
import type { IBankAdapter } from '../IBankAdapter';

/**
 * Facade for Bradesco-specific rules and helpers.
 */
export class BradescoAdapter implements IBankAdapter<
  BradescoWalletConfig,
  BradescoCnab400RemittanceDetail,
  BradescoCnab400ReturnDetail,
  BradescoCnab240Segment
> {
  private static normalizeCnab240Wallet(walletNumber: string | undefined): string | undefined {
    if (!walletNumber) {
      return undefined;
    }

    const normalized = walletNumber.trim();
    if (normalized.length === 1 && /^\d$/.test(normalized)) {
      return `0${normalized}`;
    }

    return normalized;
  }

  private static extractDetailLines(content: string): string[] {
    if (!content || content.trim().length === 0) {
      return [];
    }

    return content
      .replaceAll('\r', '')
      .split('\n')
      .filter((line) => line.length > 0 && line.startsWith('1'));
  }

  private buildCnab240Validation(walletNumber: string | undefined): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!walletNumber || !this.getWalletConfig(walletNumber)) {
      errors.push(`Unsupported Bradesco wallet code: ${walletNumber ?? ''}`.trim());
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Checks whether a wallet code is supported by Bradesco.
   *
   * @param walletCode - Wallet code to validate.
   * @returns True when the wallet code is supported.
   */
  public isSupportedWallet(walletCode: string): boolean {
    return isValidBradescoWallet(walletCode);
  }

  /**
   * Asserts that a wallet code is supported by Bradesco.
   *
   * @param walletCode - Wallet code to validate.
   * @throws {Error} When wallet code is not supported.
   */
  public assertSupportedWallet(walletCode: string): void {
    assertValidBradescoWallet(walletCode);
  }

  /**
   * Resolves wallet configuration metadata for a given wallet code.
   *
   * @param walletCode - Wallet code to resolve.
   * @returns Wallet configuration when supported; otherwise undefined.
   */
  public getWalletConfig(walletCode: string): BradescoWalletConfig | undefined {
    return getBradescoWalletConfig(walletCode);
  }

  /**
   * Formats Bradesco "our number" by appending the modulo 11 check digit.
   *
   * @param baseNumber - Numeric base value.
   * @returns Formatted "our number".
   */
  public formatOurNumber(baseNumber: string): string {
    return formatBradescoOurNumber(baseNumber);
  }

  /**
   * Builds a detailed representation of Bradesco "our number".
   *
   * @param baseNumber - Numeric base value.
   * @returns Object containing base number, check digit, and formatted value.
   */
  public buildOurNumber(baseNumber: string): BradescoOurNumberResult {
    return buildBradescoOurNumber(baseNumber);
  }

  /**
   * Maps a Bradesco return occurrence code to a normalized semantic category.
   *
   * @param occurrenceCode - Two-digit Bradesco occurrence code.
   * @returns Normalized occurrence mapping.
   */
  public mapOccurrenceCode(occurrenceCode: string): BradescoOccurrenceMapping {
    return mapBradescoOccurrenceCode(occurrenceCode);
  }

  /**
   * Validates Bradesco-specific remittance fields.
   *
   * @param fields - Parsed Bradesco remittance fields.
   * @returns Validation result with collected errors.
   */
  public validateRemittanceFields(fields: BradescoRemittanceFields) {
    return validateBradescoRemittanceFields(fields);
  }

  /**
   * Validates Bradesco-specific return fields.
   *
   * @param fields - Parsed Bradesco return fields.
   * @returns Validation result with collected errors.
   */
  public validateReturnFields(fields: BradescoReturnFields) {
    return validateBradescoReturnFields(fields);
  }

  /**
   * Builds an enriched Bradesco CNAB400 remittance detail payload.
   *
   * @param line - 400-character remittance detail line.
   * @returns Remittance detail with generic parsing and Bradesco validation metadata.
   */
  public buildRemittanceDetail(line: string): BradescoCnab400RemittanceDetail {
    const detail = parseDetailRecord(line);
    const fields = parseBradescoRemittanceFields(line);

    return {
      movementType: 'remittance',
      detail,
      fields,
      wallet: fields.walletNumber ? this.getWalletConfig(fields.walletNumber) : undefined,
      validation: this.validateRemittanceFields(fields),
    };
  }

  /**
   * Builds an enriched Bradesco CNAB400 return detail payload.
   *
   * @param line - 400-character return detail line.
   * @returns Return detail with generic parsing and Bradesco validation metadata.
   */
  public buildReturnDetail(line: string): BradescoCnab400ReturnDetail {
    const detail = parseReturnDetailRecord(line);
    const fields = parseBradescoReturnFields(line);

    return {
      movementType: 'return',
      detail,
      fields,
      wallet: fields.walletNumber ? this.getWalletConfig(fields.walletNumber) : undefined,
      occurrence:
        fields.occurrenceCode && isValidBradescoOccurrenceCode(fields.occurrenceCode)
          ? this.mapOccurrenceCode(fields.occurrenceCode)
          : undefined,
      validation: this.validateReturnFields(fields),
    };
  }

  /**
   * Builds enriched Bradesco CNAB400 remittance details from full file content.
   *
   * @param content - Complete CNAB400 remittance file content.
   * @returns Enriched remittance details for all record type 1 lines.
   */
  public buildRemittanceDetailsFromContent(content: string): BradescoCnab400RemittanceDetail[] {
    return BradescoAdapter.extractDetailLines(content).map((line) => this.buildRemittanceDetail(line));
  }

  /**
   * Builds enriched Bradesco CNAB400 return details from full file content.
   *
   * @param content - Complete CNAB400 return file content.
   * @returns Enriched return details for all record type 1 lines.
   */
  public buildReturnDetailsFromContent(content: string): BradescoCnab400ReturnDetail[] {
    return BradescoAdapter.extractDetailLines(content).map((line) => this.buildReturnDetail(line));
  }

  /**
   * Builds an enriched Bradesco CNAB240 detail payload from parsed segments.
   *
   * @param detail - Parsed CNAB240 detail record (segments P/Q/R).
   * @returns Enriched Bradesco CNAB240 payload with wallet and occurrence interpretation.
   */
  public buildCnab240Detail(detail: Cnab240DetailRecord): BradescoCnab240Segment {
    const walletNumber = BradescoAdapter.normalizeCnab240Wallet(detail.segmentP.portfolioCode);
    const occurrenceCode = detail.segmentP.occurrenceCode;

    return {
      movementType: 'cnab240',
      detail,
      walletNumber,
      wallet: walletNumber ? this.getWalletConfig(walletNumber) : undefined,
      occurrenceCode,
      occurrence: isValidBradescoOccurrenceCode(occurrenceCode)
        ? this.mapOccurrenceCode(occurrenceCode)
        : undefined,
      validation: this.buildCnab240Validation(walletNumber),
    };
  }

  /**
   * Builds enriched Bradesco CNAB240 detail payloads from parsed detail records.
   *
   * @param details - Parsed CNAB240 detail records.
   * @returns Enriched Bradesco CNAB240 payloads.
   */
  public buildCnab240Details(details: Cnab240DetailRecord[]): BradescoCnab240Segment[] {
    return details.map((detail) => this.buildCnab240Detail(detail));
  }

  /**
   * Builds enriched Bradesco CNAB240 detail payloads from a parsed batch.
   *
   * @param batch - Parsed CNAB240 batch.
   * @returns Enriched Bradesco CNAB240 payloads for the batch details.
   */
  public buildCnab240DetailsFromBatch(batch: Cnab240Batch): BradescoCnab240Segment[] {
    return this.buildCnab240Details(batch.details);
  }

  /**
   * Builds enriched Bradesco CNAB240 detail payloads from a parsed file.
   *
   * @param file - Parsed CNAB240 file.
   * @returns Enriched Bradesco CNAB240 payloads for all file batches.
   */
  public buildCnab240DetailsFromFile(file: Cnab240File): BradescoCnab240Segment[] {
    return file.batches.flatMap((batch) => this.buildCnab240DetailsFromBatch(batch));
  }

  /**
   * Builds enriched Bradesco CNAB240 detail payloads from raw CNAB240 content.
   *
   * @param content - Complete CNAB240 file content.
   * @returns Enriched Bradesco CNAB240 payloads for all parsed batches.
   */
  public buildCnab240DetailsFromContent(content: string): BradescoCnab240Segment[] {
    const file = parseCnab240(content);
    return this.buildCnab240DetailsFromFile(file);
  }
}

/**
 * Creates a new Bradesco adapter instance.
 *
 * @returns New {@link BradescoAdapter} instance.
 */
export function createBradescoAdapter(): BradescoAdapter {
  return new BradescoAdapter();
}
