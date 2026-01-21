/**
 * CNAB400 Return File Structure Type Definition
 *
 * @module types/cnab400/Cnab400ReturnFile
 */

import type { Cnab400File } from './Cnab400File';
import type { ReturnDetailRecord } from './ReturnDetailRecord';

/**
 * CNAB400 Return File Structure
 *
 * Extends Cnab400File but replaces detail records with return detail records
 * that contain additional occurrence information from the bank.
 */
export type Cnab400ReturnFile = Omit<Cnab400File, 'details'> & {
  /** Return detail records with occurrence information */
  details: ReturnDetailRecord[];
};
