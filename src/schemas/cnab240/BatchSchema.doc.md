# BatchSchema

## Overview

Zod schema for CNAB240 batches.

## Responsibilities

- Validate batch header, details, and trailer.
- Ensure at least one detail record exists.

## Inputs and outputs

- Inputs: batch object.
- Outputs: validated batch data.

## Main flow

```mermaid
flowchart TD
  A[BatchSchema] --> B[Header validation]
  A --> C[Detail validation]
  A --> D[Trailer validation]
  B --> E[Parsed batch]
  C --> E
  D --> E
```

## Error handling and edge cases

- Empty `details` array is rejected.

## Examples

```ts
import { BatchSchema } from '@/schemas/cnab240';

BatchSchema.parse({
  header: { /* ... */ },
  details: [{ /* ... */ }],
  trailer: { /* ... */ },
});
```

## Dependencies and integrations

- Uses BatchHeaderSchema, DetailRecordSchema, and BatchTrailerSchema.
