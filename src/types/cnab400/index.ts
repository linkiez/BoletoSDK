/**
 * CNAB400 Type Definitions Barrel Export
 *
 * This module exports TypeScript types for CNAB400 file format
 * based on FEBRABAN standard with Itaú bank layout.
 *
 * CNAB400 Format Structure:
 * - Header Record (Type 0): 1 record per file
 * - Detail Records (Type 1): Multiple transaction records
 * - Detail Records (Type 5): Optional guarantor records
 * - Detail Records (Type 7): Required front message records
 * - Detail Records (Type 8): Optional back message records
 * - Trailer Record (Type 9): 1 record per file
 *
 * @module types/cnab400
 */

export type { Cnab400File } from './Cnab400File';
export type { Cnab400ReturnFile } from './Cnab400ReturnFile';
export type { DetailRecord } from './DetailRecord';
export type { FileHeader } from './FileHeader';
export type { FileTrailer } from './FileTrailer';
export type { GuarantorRecord } from './GuarantorRecord';
export type { MessageBackRecord } from './MessageBackRecord';
export type { MessageFrontRecord } from './MessageFrontRecord';
export type { PenaltyRecord } from './PenaltyRecord';
export type { ReturnDetailRecord } from './ReturnDetailRecord';
