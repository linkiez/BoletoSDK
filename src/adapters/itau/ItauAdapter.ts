import type {
  ItauCnab240Segment,
  ItauCnab400RemittanceDetail,
  ItauCnab400ReturnDetail,
  ItauInstructionMapping,
  ItauLiquidationMapping,
  ItauOccurrenceMapping,
  ItauOurNumberResult,
  ItauRejectionMessageMapping,
  ItauRemittanceFields,
  ItauWalletConfig,
  ItauReturnFields,
} from '../../types/adapters';
import type {
  Batch as Cnab240Batch,
  Cnab240File,
  DetailRecord as Cnab240DetailRecord,
} from '../../types/cnab240';
import { parseCnab240 } from '../../parsers/cnab240';
import { parseDetailRecord, parseReturnDetailRecord } from '../../parsers/cnab400';
import { parseItauRemittanceFields, parseItauReturnFields } from './ItauFieldParser';
import { isValidItauInstructionCode, mapItauInstructionCode } from './ItauInstructionMapper';
import { buildItauOurNumber, formatItauOurNumber } from './ItauOurNumberCalculator';
import { isValidItauOccurrenceCode, mapItauOccurrenceCode } from './ItauOccurrenceMapper';
import {
  isValidItauLiquidationCode,
  mapItauLiquidationCode,
  mapItauRejectionMessage,
} from './ItauReturnMapper';
import { validateItauRemittanceFields, validateItauReturnFields } from './ItauValidator';
import {
  assertValidItauWallet,
  getItauWalletConfig,
  isValidItauWallet,
} from './ItauWalletValidator';
import type { IBankAdapter } from '../IBankAdapter';

/**
 * Facade for Ita\u00fa-specific rules and helpers.
 */
export class ItauAdapter implements IBankAdapter<
  ItauWalletConfig,
  ItauCnab400RemittanceDetail,
  ItauCnab400ReturnDetail,
  ItauCnab240Segment
> {
  private buildCnab240Validation(walletNumber: string | undefined): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!walletNumber || !this.getWalletConfig(walletNumber)) {
      errors.push(`Unsupported Itau wallet code: ${walletNumber ?? ''}`.trim());
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
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

  /**
   * Checks whether a wallet code is supported by Ita\u00fa.
   *
   * @param walletCode - Wallet code to validate.
   * @returns True when the wallet code is supported.
   */
  public isSupportedWallet(walletCode: string): boolean {
    return isValidItauWallet(walletCode);
  }

  /**
   * Asserts that a wallet code is supported by Ita\u00fa.
   *
   * @param walletCode - Wallet code to validate.
   * @throws {Error} When wallet code is not supported.
   */
  public assertSupportedWallet(walletCode: string): void {
    assertValidItauWallet(walletCode);
  }

  /**
   * Resolves wallet configuration metadata for a given wallet code.
   *
   * @param walletCode - Wallet code to resolve.
   * @returns Wallet configuration when supported; otherwise undefined.
   */
  public getWalletConfig(walletCode: string): ItauWalletConfig | undefined {
    return getItauWalletConfig(walletCode);
  }

  /**
   * Builds Ita\u00fa "our number" by appending the modulo 10 check digit.
   *
   * @param baseNumber - Numeric base value.
   * @returns Formatted "our number".
   */
  public formatOurNumber(baseNumber: string): string {
    return formatItauOurNumber(baseNumber);
  }

  /**
   * Builds a detailed representation of Itaú "our number".
   *
   * @param baseNumber - Numeric base value.
   * @returns Object containing the base number, calculated check digit and formatted value.
   */
  public buildOurNumber(baseNumber: string): ItauOurNumberResult {
    return buildItauOurNumber(baseNumber);
  }

  /**
   * Maps an Itaú return occurrence code to a normalized semantic category.
   *
   * @param occurrenceCode - Two-digit Itaú occurrence code.
   * @returns Normalized occurrence mapping.
   */
  public mapOccurrenceCode(occurrenceCode: string): ItauOccurrenceMapping {
    return mapItauOccurrenceCode(occurrenceCode);
  }

  /**
   * Maps an Itaú return liquidation code to a normalized semantic category.
   *
   * @param liquidationCode - Two-digit Itaú liquidation code.
   * @returns Normalized liquidation mapping.
   */
  public mapLiquidationCode(liquidationCode: string): ItauLiquidationMapping {
    return mapItauLiquidationCode(liquidationCode);
  }

  /**
   * Normalizes Itaú return rejection message metadata.
   *
   * @param rejectionMessage - Raw rejection message from return detail area.
   * @returns Normalized rejection metadata when present.
   */
  public mapRejectionMessage(
    rejectionMessage: string | undefined,
  ): ItauRejectionMessageMapping | undefined {
    return mapItauRejectionMessage(rejectionMessage);
  }

  /**
   * Maps an Itaú remittance instruction code to a normalized representation.
   *
   * @param instructionCode - Two-digit Itaú instruction code.
   * @returns Normalized instruction mapping.
   */
  public mapInstructionCode(instructionCode: string): ItauInstructionMapping {
    return mapItauInstructionCode(instructionCode);
  }

  /**
   * Parses Itaú-specific CNAB400 remittance detail fields.
   *
   * @param line - 400-character remittance detail line.
   * @returns Parsed Itaú-specific remittance fields.
   */
  public parseRemittanceFields(line: string): ItauRemittanceFields {
    return parseItauRemittanceFields(line);
  }

  /**
   * Parses Itaú-specific CNAB400 return detail fields.
   *
   * @param line - 400-character return detail line.
   * @returns Parsed Itaú-specific return fields.
   */
  public parseReturnFields(line: string): ItauReturnFields {
    return parseItauReturnFields(line);
  }

  /**
   * Validates Itaú-specific remittance fields.
   *
   * @param fields - Parsed Itaú remittance fields.
   * @returns Validation result with collected errors.
   */
  public validateRemittanceFields(fields: ItauRemittanceFields) {
    return validateItauRemittanceFields(fields);
  }

  /**
   * Validates Itaú-specific return fields.
   *
   * @param fields - Parsed Itaú return fields.
   * @returns Validation result with collected errors.
   */
  public validateReturnFields(fields: ItauReturnFields) {
    return validateItauReturnFields(fields);
  }

  /**
   * Builds an enriched Itaú CNAB400 remittance detail payload.
   *
   * @param line - 400-character remittance detail line.
   * @returns Remittance detail with generic parsing, Itaú-specific fields, mappings and validation.
   */
  public buildRemittanceDetail(line: string): ItauCnab400RemittanceDetail {
    const detail = parseDetailRecord(line);
    const fields = this.parseRemittanceFields(line);
    const wallet = fields.walletNumber ? getItauWalletConfig(fields.walletNumber) : undefined;
    const validation = this.validateRemittanceFields(fields);

    const instructionCode1 =
      detail.instructionCode1 && isValidItauInstructionCode(detail.instructionCode1)
        ? this.mapInstructionCode(detail.instructionCode1)
        : undefined;
    const instructionCode2 =
      detail.instructionCode2 && isValidItauInstructionCode(detail.instructionCode2)
        ? this.mapInstructionCode(detail.instructionCode2)
        : undefined;

    return {
      movementType: 'remittance',
      detail,
      fields,
      wallet,
      instructionCode1,
      instructionCode2,
      validation,
    };
  }

  /**
   * Builds an enriched Itaú CNAB400 return detail payload.
   *
   * @param line - 400-character return detail line.
   * @returns Return detail with generic parsing, Itaú-specific fields, mappings and validation.
   */
  public buildReturnDetail(line: string): ItauCnab400ReturnDetail {
    const detail = parseReturnDetailRecord(line);
    const fields = this.parseReturnFields(line);
    const wallet = fields.walletNumber ? getItauWalletConfig(fields.walletNumber) : undefined;
    const validation = this.validateReturnFields(fields);

    const occurrence = isValidItauOccurrenceCode(detail.occurrenceCode)
      ? this.mapOccurrenceCode(detail.occurrenceCode)
      : undefined;
    const liquidation: ItauLiquidationMapping | undefined =
      fields.liquidationCode && isValidItauLiquidationCode(fields.liquidationCode)
        ? this.mapLiquidationCode(fields.liquidationCode)
        : undefined;
    const rejection: ItauRejectionMessageMapping | undefined = this.mapRejectionMessage(
      fields.rejectionMessage,
    );

    return {
      movementType: 'return',
      detail,
      fields,
      wallet,
      occurrence,
      liquidation,
      rejection,
      validation,
    };
  }

  /**
   * Builds enriched Itaú CNAB400 remittance details from full file content.
   *
   * @param content - Complete CNAB400 remittance file content.
   * @returns Enriched remittance details for all record type 1 lines.
   */
  public buildRemittanceDetailsFromContent(content: string): ItauCnab400RemittanceDetail[] {
    return ItauAdapter.extractDetailLines(content).map((line) => this.buildRemittanceDetail(line));
  }

  /**
   * Builds enriched Itaú CNAB400 return details from full file content.
   *
   * @param content - Complete CNAB400 return file content.
   * @returns Enriched return details for all record type 1 lines.
   */
  public buildReturnDetailsFromContent(content: string): ItauCnab400ReturnDetail[] {
    return ItauAdapter.extractDetailLines(content).map((line) => this.buildReturnDetail(line));
  }

  /**
   * Builds an enriched Itaú CNAB240 detail payload from parsed segments.
   *
   * @param detail - Parsed CNAB240 detail record (segments P/Q/R).
   * @returns Enriched Itaú CNAB240 payload with wallet and occurrence interpretation.
   */
  public buildCnab240Detail(detail: Cnab240DetailRecord): ItauCnab240Segment {
    const walletNumber = detail.segmentP.portfolioCode;
    const wallet = getItauWalletConfig(walletNumber);
    const occurrenceCode = detail.segmentP.occurrenceCode;
    const occurrence = isValidItauOccurrenceCode(occurrenceCode)
      ? this.mapOccurrenceCode(occurrenceCode)
      : undefined;

    return {
      movementType: 'cnab240',
      detail,
      walletNumber,
      wallet,
      occurrenceCode,
      occurrence,
      validation: this.buildCnab240Validation(walletNumber),
    };
  }

  /**
   * Builds enriched Itaú CNAB240 detail payloads from parsed detail records.
   *
   * @param details - Parsed CNAB240 detail records.
   * @returns Enriched Itaú CNAB240 payloads.
   */
  public buildCnab240Details(details: Cnab240DetailRecord[]): ItauCnab240Segment[] {
    return details.map((detail) => this.buildCnab240Detail(detail));
  }

  /**
   * Builds enriched Itaú CNAB240 detail payloads from a parsed batch.
   *
   * @param batch - Parsed CNAB240 batch.
   * @returns Enriched Itaú CNAB240 payloads for the batch details.
   */
  public buildCnab240DetailsFromBatch(batch: Cnab240Batch): ItauCnab240Segment[] {
    return this.buildCnab240Details(batch.details);
  }

  /**
   * Builds enriched Itaú CNAB240 detail payloads from a parsed file.
   *
   * @param file - Parsed CNAB240 file.
   * @returns Enriched Itaú CNAB240 payloads for all file batches.
   */
  public buildCnab240DetailsFromFile(file: Cnab240File): ItauCnab240Segment[] {
    return file.batches.flatMap((batch) => this.buildCnab240DetailsFromBatch(batch));
  }

  /**
   * Builds enriched Itaú CNAB240 detail payloads from raw CNAB240 content.
   *
   * @param content - Complete CNAB240 file content.
   * @returns Enriched Itaú CNAB240 payloads for all parsed batches.
   */
  public buildCnab240DetailsFromContent(content: string): ItauCnab240Segment[] {
    const file = parseCnab240(content);
    return this.buildCnab240DetailsFromFile(file);
  }
}

/**
 * Creates a new Itaú adapter instance.
 *
 * @returns New {@link ItauAdapter} instance.
 * @example
 * ```typescript
 * const adapter = createItauAdapter();
 * adapter.assertSupportedWallet('109');
 * ```
 */
export function createItauAdapter(): ItauAdapter {
  return new ItauAdapter();
}
