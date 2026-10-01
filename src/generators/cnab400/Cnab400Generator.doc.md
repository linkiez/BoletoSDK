# Cnab400Generator

## Overview

Generates a CNAB400 file from a `Cnab400File` structure, including header, detail records, optional penalty and front-message records, and trailer.

## Responsibilities

- Validate required file sections
- Generate header, details, optional penalty and front-message records, and trailer
- Enforce 400-character line length

Itaú type 7 records use a three-character flash code, three message lines of 128, 128, and 127 characters, a two-digit print-line number before each message, a destination code, and a six-digit sequence number.

## Inputs and outputs

- Input: `Cnab400File`
- Output: CNAB400 file content string

## API / Signature

```ts
export function generateCnab400(file: Cnab400File): string;
```

## Main flow

```mermaid
flowchart TD
  A[Cnab400File] --> B[Validate header/trailer/details]
  B --> C[Generate header]
  C --> D[Generate detail records]
  D --> E{Remessa with penalties?}
  E -->|Yes| F[Generate penalty records]
  E -->|No| G[Skip penalties]
  F --> H[Generate front-message records]
  G --> H
  H --> I[Generate trailer]
  I --> J[Validate 400-char line length]
```

## Error handling and edge cases

- Throws `GenerationError` when file structure is invalid
- Throws when any generated line is not 400 characters
- Supports REMESSA vs RETORNO detail record generation

## Examples

```ts
import { generateCnab400 } from '@linkiez/boleto-sdk';

const content = generateCnab400(file);
```

## Dependencies and integrations

- `generateFileHeader`
- `generateDetailRecord` and `generateDetailRecordRemessa`
- `generatePenaltyRecord`
- `generateFileTrailer`
- `generateMessageFrontRecord`
- `GenerationError`
