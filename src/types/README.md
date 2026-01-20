# Types

This folder contains all TypeScript type definitions and interfaces.

## Structure

- `cnab240/` - CNAB 240 specific types (Header, Lote, Segmentos, Trailer)
- `cnab400/` - CNAB 400 specific types
- `common/` - Common/shared types (Boleto, Beneficiario, Pagador, etc)
- `json/` - JSON input/output types

## Rules

- One type/interface per file
- File name must match export name (PascalCase)
- Always import from `@/types`, never from subfolders

## Example

```typescript
// File: src/types/common/Boleto.ts
export interface Boleto {
  nossoNumero: string;
  valorTitulo: number;
}

// Usage in other files:
import { Boleto } from '@/types';
```
