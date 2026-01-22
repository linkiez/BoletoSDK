# Cnab400FileSchema

## Overview

Zod schema for complete CNAB400 files.

## Responsibilities

- Validate header, detail records, and trailer.
- Support optional record collections (penalties, messages, guarantors).

## Inputs and outputs

- Inputs: CNAB400 file object.
- Outputs: validated CNAB400 file data.

## Main flow

```mermaid
flowchart TD
  A[Cnab400FileSchema] --> B[Header validation]
  A --> C[Detail validation]
  A --> D[Trailer validation]
  B --> E[Parsed file]
  C --> E
  D --> E
```

## Error handling and edge cases

- Requires at least one detail record.

## Examples

```ts
import { Cnab400FileSchema } from '@/schemas/cnab400';

Cnab400FileSchema.parse({
  header: { /* ... */ },
  details: [{ /* ... */ }],
  trailer: { /* ... */ },
});
```

## Dependencies and integrations

- Uses CNAB400 record schemas.
