import { Cnab240File } from '../../types';
import { BatchHeaderGenerator } from './BatchHeaderGenerator';
import { BatchTrailerGenerator } from './BatchTrailerGenerator';
import { FileHeaderGenerator } from './FileHeaderGenerator';
import { FileTrailerGenerator } from './FileTrailerGenerator';
import { SegmentPGenerator } from './SegmentPGenerator';
import { SegmentQGenerator } from './SegmentQGenerator';
import { SegmentRGenerator } from './SegmentRGenerator';

/**
 * Main generator for CNAB240 files
 * Orchestrates the complete file generation hierarchy:
 * File → Batches → Details → Segments
 */
export class Cnab240Generator {
  private readonly fileHeaderGenerator: FileHeaderGenerator;
  private readonly fileTrailerGenerator: FileTrailerGenerator;
  private readonly batchHeaderGenerator: BatchHeaderGenerator;
  private readonly batchTrailerGenerator: BatchTrailerGenerator;
  private readonly segmentPGenerator: SegmentPGenerator;
  private readonly segmentQGenerator: SegmentQGenerator;
  private readonly segmentRGenerator: SegmentRGenerator;

  constructor() {
    this.fileHeaderGenerator = new FileHeaderGenerator();
    this.fileTrailerGenerator = new FileTrailerGenerator();
    this.batchHeaderGenerator = new BatchHeaderGenerator();
    this.batchTrailerGenerator = new BatchTrailerGenerator();
    this.segmentPGenerator = new SegmentPGenerator();
    this.segmentQGenerator = new SegmentQGenerator();
    this.segmentRGenerator = new SegmentRGenerator();
  }

  /**
   * Generates a complete CNAB240 file from structured data
   * @param file - CNAB240 file structure
   * @returns Complete CNAB240 file content (lines joined with \n)
   * @throws Error if validation fails
   */
  public generate(file: Cnab240File): string {
    this.validate(file);

    const lines: string[] = [];

    // Generate file header
    lines.push(this.fileHeaderGenerator.generate(file.fileHeader));

    // Generate batches
    for (const batch of file.batches) {
      // Batch header
      lines.push(this.batchHeaderGenerator.generate(batch.header));

      // Details (segments)
      for (const detail of batch.details) {
        const detailLines: string[] = [
          // Segment P (mandatory)
          this.segmentPGenerator.generate(detail.segmentP),
          // Segment Q (mandatory)
          this.segmentQGenerator.generate(detail.segmentQ),
        ];

        // Segment R (optional)
        if (detail.segmentR) {
          detailLines.push(this.segmentRGenerator.generate(detail.segmentR));
        }

        lines.push(...detailLines);
      }

      // Batch trailer
      lines.push(this.batchTrailerGenerator.generate(batch.trailer));
    }

    // Generate file trailer
    lines.push(this.fileTrailerGenerator.generate(file.fileTrailer));

    return lines.join('\n');
  }

  /**
   * Validates the CNAB240 file structure
   * @param file - CNAB240 file structure to validate
   * @throws Error if validation fails
   */
  private validate(file: Cnab240File): void {
    if (!file.fileHeader) {
      throw new Error('File header is required');
    }

    if (!file.batches || file.batches.length === 0) {
      throw new Error('At least one batch is required');
    }

    for (const batch of file.batches) {
      if (!batch.details || batch.details.length === 0) {
        throw new Error('At least one detail is required in batch');
      }

      for (const detail of batch.details) {
        if (!detail.segmentP) {
          throw new Error('Segment P is required in detail');
        }
        if (!detail.segmentQ) {
          throw new Error('Segment Q is required in detail');
        }
      }
    }

    if (!file.fileTrailer) {
      throw new Error('File trailer is required');
    }
  }
}
