# templates/index.ts

## Overview

Exports boleto template interfaces and implementations.

## Responsibilities

- Provide public exports for template types and classes

## Inputs and outputs

- Input: N/A
- Output: Template exports

## API / Signature

```ts
export * from './BoletoTemplate';
export * from './BBTemplate';
export * from './BradescoTemplate';
export * from './GenericTemplate';
export * from './HtmlTemplateBuilder';
export * from './ItauTemplate';
export * from './TemplateRenderer';
```

## Main flow

```mermaid
flowchart TD
  A[templates/index.ts] --> B[BoletoTemplate]
  A --> C[BBTemplate]
  A --> D[BradescoTemplate]
  A --> E[GenericTemplate]
  A --> F[HtmlTemplateBuilder]
  A --> G[ItauTemplate]
  A --> H[TemplateRenderer]
```

## Error handling and edge cases

- No runtime logic

## Examples

```ts
import { BBTemplate, BradescoTemplate, GenericTemplate, ItauTemplate, TemplateRenderer } from '@linkiez/boleto-sdk';
```

## Dependencies and integrations

- Used by public exports in `src/index.ts`
