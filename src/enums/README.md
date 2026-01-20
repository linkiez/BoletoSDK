# Enums

This folder contains all TypeScript enumerations.

## Structure

- `cnab240/` - CNAB 240 specific enums
- `cnab400/` - CNAB 400 specific enums
- `common/` - Common enums (BancoCode, TipoInscricao, etc)

## Rules

- One enum per file
- File name must match enum name (PascalCase)
- Always import from `@/enums`, never from subfolders

## Example

```typescript
// File: src/enums/common/BancoCode.ts
export enum BancoCode {
  BANCO_DO_BRASIL = '001',
  ITAU = '341',
}

// Usage:
import { BancoCode } from '@/enums';
```
