// CNAB 240 generators barrel
import { Cnab240File } from '../../types/cnab240/Cnab240File';
import { Cnab240Generator } from './Cnab240Generator';

export * from './BatchHeaderGenerator';
export * from './BatchTrailerGenerator';
export * from './Cnab240Generator';
export * from './FileHeaderGenerator';
export * from './FileTrailerGenerator';
export * from './LineGenerator';
export * from './SegmentPGenerator';
export * from './SegmentQGenerator';
export * from './SegmentRGenerator';

/**
 * Generate CNAB 240 file from JSON data
 */
export function generateCnab240(data: Cnab240File): string {
  const generator = new Cnab240Generator();
  return generator.generate(data);
}
