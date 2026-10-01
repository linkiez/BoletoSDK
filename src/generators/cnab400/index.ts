/**
 * CNAB400 Generator Barrel Export
 *
 * Generates CNAB400 files according to FEBRABAN standard and Itaú specifications.
 * Converts structured data into fixed-position 400-character lines.
 *
 * @module generators/cnab400
 */

export { generateCnab400 } from './Cnab400Generator';
export { generateDetailRecord, generateDetailRecordRemessa } from './DetailRecordGenerator';
export { generateFileHeader } from './FileHeaderGenerator';
export { generateFileTrailer } from './FileTrailerGenerator';
export { generateMessageFrontRecord } from './MessageFrontRecordGenerator';
export { generatePenaltyRecord } from './PenaltyRecordGenerator';
