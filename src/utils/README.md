# Utils

This folder contains utility functions organized by category.

## Structure

- `formatters/` - Formatting functions (formatCpfCnpj, formatDate, etc)
- `validators/` - Validation functions (validateCpfCnpj, validateDate, etc)
- `parsers/` - Parsing helper functions (parseDate, parseMoney, etc)
- `generators/` - Generator helper functions (generateBarcode, etc)

## Rules

- One function per file (or closely related functions)
- File name in camelCase matching main function
- Always import from `@/utils`, never from subfolders

## Example

```typescript
// File: src/utils/formatters/formatCpfCnpj.ts
export function formatCpfCnpj(value: string): string {
  // Implementation
}

// Usage:
import { formatCpfCnpj } from '@/utils';
```
