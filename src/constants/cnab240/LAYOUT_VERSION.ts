/**
 * CNAB240 Layout Version Constants
 *
 * Official FEBRABAN CNAB240 layout version and related identifiers.
 *
 * @module constants/cnab240/LAYOUT_VERSION
 */

/**
 * CNAB240 layout version code
 * @constant
 * @see FEBRABAN CNAB240 specification section 2.1
 */
export const LAYOUT_VERSION = '087' as const;

/**
 * File type code for CNAB240
 * @constant
 */
export const FILE_TYPE_CODE = '2' as const;

/**
 * Line length for CNAB240 files (in characters)
 * @constant
 */
export const LINE_LENGTH = 240 as const;

/**
 * File density code (default)
 * @constant
 */
export const FILE_DENSITY = '01600' as const;

/**
 * Record size in bytes
 * @constant
 */
export const RECORD_SIZE = '240' as const;

/**
 * Block size factor
 * @constant
 */
export const BLOCK_SIZE = '000' as const;

/**
 * Reserved field default value
 * @constant
 */
export const RESERVED_FIELD = ' ' as const;

/**
 * Currency code for Brazilian Real (BRL)
 * @constant
 */
export const CURRENCY_CODE = '009' as const;

/**
 * Default bank number for batch trailer
 * @constant
 */
export const BATCH_TRAILER_BANK = '9999' as const;
