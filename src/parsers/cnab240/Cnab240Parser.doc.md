# Cnab240Parser

## Overview

Parses CNAB240 content into a structured `Cnab240File` object.

## Responsibilities

- Validate file structure (header, batches, trailers)
- Parse batch headers and trailers
- Parse detail records with segments P, Q, and optional R
- Convert date and numeric fields

## Inputs and outputs

- Input: CNAB240 content as string
- Output: `Cnab240File`

## API / Signature

```ts
export function parseCnab240(content: string): Cnab240File
```

## Main flow

```mermaid
flowchart TD
  A[CNAB240 content] --> B[Split lines]
  B --> C[Parse file header]
  C --> D[Parse batches]
  D --> E[Parse details (P/Q/R)]
  E --> F[Parse batch trailers]
  F --> G[Parse file trailer]
```

## Error handling and edge cases

- Throws `ParseError` for invalid line length
- Throws for invalid record type sequences
- Supports optional Segment R

## Examples

```ts
import { parseCnab240 } from '@linkiez/boleto-sdk';

const file = parseCnab240(content);
```

## Dependencies and integrations

- `FileHeaderParser`
- `LineParser`
- `SegmentPParser`, `SegmentQParser`
- `ParseError`
