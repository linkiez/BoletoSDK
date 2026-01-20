# Schemas

This folder contains Zod schemas for runtime validation and type inference.

## 🎯 Purpose

- **Runtime validation** of CNAB and JSON data structures
- **Type inference** from schemas (TypeScript types derived from Zod)
- **Data transformation** (e.g., string dates to Date objects)
- **Error handling** with detailed validation messages

## 📁 Structure

- `cnab240/` - Zod schemas for CNAB 240 structures
- `cnab400/` - Zod schemas for CNAB 400 structures
- `common/` - Shared/reusable schemas (Boleto, Beneficiario, etc)

## 🔑 Key Concepts

### Schema Definition Pattern

```typescript
import { z } from 'zod';

// Define schema
export const BoletoSchema = z.object({
  nossoNumero: z.string().min(1),
  valorTitulo: z.number().positive(),
});

// Infer type from schema
export type Boleto = z.infer<typeof BoletoSchema>;
```

### Naming Convention

- **File**: `{Name}Schema.ts` (e.g., `BoletoSchema.ts`)
- **Schema export**: `export const BoletoSchema = z.object({...})`
- **Type export**: `export type Boleto = z.infer<typeof BoletoSchema>`

### Import Pattern

Always import from root barrel:

```typescript
✅ import { BoletoSchema, HeaderArquivoSchema } from '@/schemas';
❌ import { BoletoSchema } from '@/schemas/common/BoletoSchema';
```

## 🛠️ Usage Examples

### Validation

```typescript
import { BoletoSchema } from '@/schemas';

const result = BoletoSchema.safeParse(data);

if (!result.success) {
  console.error(result.error.issues);
} else {
  const boleto = result.data; // Type-safe!
}
```

### Schema Composition

```typescript
import { z } from 'zod';
import { EnderecoSchema } from './EnderecoSchema';

export const PagadorSchema = z.object({
  nome: z.string(),
  endereco: EnderecoSchema, // Reuse schema
});
```

### Transformation

```typescript
const DateSchema = z.string()
  .length(8)
  .transform((val) => new Date(val));

// "20260120" → Date(2026, 0, 20)
```

## ✅ Rules

1. One schema per file
2. Always export both schema and inferred type
3. Use descriptive validation messages
4. Reuse schemas when possible
5. Import only from `@/schemas` barrel
