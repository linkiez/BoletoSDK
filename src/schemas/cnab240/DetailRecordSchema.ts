/**
 * CNAB240 Detail Record schema
 */

import { z } from 'zod';
import { SegmentPSchema } from './SegmentPSchema';
import { SegmentQSchema } from './SegmentQSchema';
import { SegmentRSchema } from './SegmentRSchema';

export const DetailRecordSchema = z.object({
  segmentP: SegmentPSchema,
  segmentQ: SegmentQSchema,
  segmentR: SegmentRSchema.optional(),
});
