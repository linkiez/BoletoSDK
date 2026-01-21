/**
 * CNAB400 Layout Version Constants
 *
 * Standard CNAB400 layout specifications and file-level constants.
 * Based on FEBRABAN CNAB400 specification.
 *
 * @module constants/cnab400/LAYOUT_VERSION
 */

/**
 * CNAB400 line length (400 characters)
 */
export const LINE_LENGTH = 400 as const;

/**
 * File type indicator for REMESSA (send to bank)
 */
export const FILE_TYPE_REMESSA = '1' as const;

/**
 * File type indicator for RETORNO (return from bank)
 */
export const FILE_TYPE_RETORNO = '2' as const;

/**
 * Service code for bank slip collection (cobranca)
 */
export const SERVICE_CODE_COBRANCA = '01' as const;

/**
 * Operation literal for REMESSA files
 */
export const OPERATION_LITERAL_REMESSA = 'REMESSA' as const;

/**
 * Operation literal for RETORNO files
 */
export const OPERATION_LITERAL_RETORNO = 'RETORNO' as const;

/**
 * Service literal for bank slip collection
 */
export const SERVICE_LITERAL_COBRANCA = 'COBRANCA' as const;

/**
 * Currency code for BRL (Brazilian Real)
 */
export const CURRENCY_CODE = '009' as const;

/**
 * Default filler character for empty fields
 */
export const FILLER_CHARACTER = ' ' as const;

/**
 * Zero padding character for numeric fields
 */
export const ZERO_PAD_CHARACTER = '0' as const;
