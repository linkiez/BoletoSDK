import { Cnab240File } from '../../types/cnab240/Cnab240File';
import { Cnab240Generator } from './Cnab240Generator';

/**
 * Generates a CNAB 240 file from structured data.
 *
 * @param data - CNAB 240 file data
 * @returns CNAB 240 content as a string
 */
export function generateCnab240(data: Cnab240File): string {
  const generator = new Cnab240Generator();
  return generator.generate(data);
}
