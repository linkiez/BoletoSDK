---
applyTo: '**'
---

# BoletoSDK - Architecture & Best Practices

## Core Objective

**CNAB ↔ JSON bidirectional conversion** with validation, type-safety, and performance optimization.

## Fundamental Principles

### SOLID

**S - Single Responsibility**: One class = one responsibility
```typescript
// ✅ Separate concerns
class FileHeaderParser { parse(line: string): FileHeader }
class Cnab240Parser { parse(content: string): CnabJson }

// ❌ God object
class Cnab240Parser { parse(); validate(); generate(); saveToFile() }
```

**O - Open/Closed**: Extend via interfaces, not modification
```typescript
interface ISegmentParser { parse(line: string): Segment }
class SegmentAParser implements ISegmentParser { }
class SegmentJParser implements ISegmentParser { } // Add new without changing existing
```

**L - Liskov Substitution**: Subclasses interchangeable
```typescript
interface ICnabParser { parse(content: string): CnabJson }
class Cnab240Parser implements ICnabParser { }
class Cnab400Parser implements ICnabParser { }
// Both work in: function process(parser: ICnabParser)
```

**I - Interface Segregation**: Small, focused interfaces
```typescript
// ✅ Separate interfaces
interface IParser { parse(content: string): unknown }
interface IValidator { validate(data: unknown): boolean }

// ❌ Fat interface
interface ICnabProcessor { parse(); validate(); generate(); save(); load() }
```

**D - Dependency Inversion**: Depend on abstractions
```typescript
// ✅ Inject interface
class Cnab240Parser {
  constructor(private lineParser: ILineParser) { }
}

// ❌ Hardcoded dependency
class Cnab240Parser { constructor() { this.lineParser = new FileHeaderParser() } }
```

### DRY - Extract, don't duplicate
```typescript
// ✅ Reusable utility
import { padLeft, padRight } from '@utils';
const formatted = padRight(value, 30);

// ❌ Repeated logic
value.padEnd(30, ' '); // Duplicated across multiple functions
```

### Layer Separation
```
API Layer (src/index.ts) → Factories → Parsers/Generators → Validators → Utils → Types/Enums/Constants
```

## Design Patterns

### 1. Factory Pattern - Parser/Generator Selection
**File**: `src/parsers/CnabParserFactory.ts`
```typescript
export class CnabParserFactory {
  static create(content: string): ICnabParser {
    const lineLength = content.split('\n')[0].length;
    if (lineLength === 240) return new Cnab240Parser();
    if (lineLength === 400) return new Cnab400Parser();
    throw new CnabError(`Invalid line length: ${lineLength}`);
  }

  static createByType(type: '240' | '400'): ICnabParser {
    return type === '240' ? new Cnab240Parser() : new Cnab400Parser();
  }
}
```

### 2. Strategy Pattern - Segment Parsing
**File**: `src/parsers/cnab240/SegmentParser.ts`
```typescript
interface ISegmentParser {
  parse(line: string): Segment;
  supports(code: string): boolean;
}

export class SegmentParser {
  private strategies = new Map<string, ISegmentParser>();

  constructor() {
    this.registerStrategy(new SegmentAParser());
    this.registerStrategy(new SegmentJParser());
  }

  parse(line: string): Segment {
    const code = line.substring(13, 14);
    const strategy = this.strategies.get(code);
    if (!strategy) throw new ParseError(`Unknown segment: ${code}`);
    return strategy.parse(line);
  }
}
```

### 3. Builder Pattern - CNAB Construction
**File**: `src/generators/cnab240/Cnab240Builder.ts`
```typescript
export class Cnab240Builder {
  private header?: FileHeader;
  private batches: Batch[] = [];

  withHeader(header: FileHeader): this { this.header = header; return this; }
  addBatch(batch: Batch): this { this.batches.push(batch); return this; }

  build(): string {
    if (!this.header) throw new Error('Header required');
    return [
      this.formatHeader(this.header),
      ...this.batches.flatMap(b => this.formatBatch(b))
    ].join('\n');
  }
}

// Usage
const cnab = new Cnab240Builder()
  .withHeader(header)
  .addBatch(batch1)
  .build();
```

### 4. Chain of Responsibility - Validation Pipeline
**File**: `src/validators/common/ValidationChain.ts`
```typescript
abstract class Validator<T> {
  private next?: Validator<T>;

  setNext(validator: Validator<T>): Validator<T> {
    this.next = validator;
    return validator;
  }

  validate(data: T): ValidationResult {
    const result = this.doValidate(data);
    if (!result.isValid || !this.next) return result;
    return this.next.validate(data);
  }

  protected abstract doValidate(data: T): ValidationResult;
}

// Usage
new SchemaValidator()
  .setNext(new BusinessRuleValidator())
  .setNext(new DateValidator())
  .validate(data);
```

## Data Flow

### Parse Flow (CNAB → JSON)
```
CNAB File → Detect Format → Parser (240/400) → Parse Header/Batches/Trailer → Validate (Zod) → Typed JSON
```

**Implementation**:
```typescript
import { CnabParserFactory } from '@parsers';
import { validateCnabJson } from '@validators';

export function parseCnab(content: string): CnabJson {
  const parser = CnabParserFactory.create(content);
  const json = parser.parse(content);
  return validateCnabJson(json);
}
```

### Generate Flow (JSON → CNAB)
```
Typed JSON → Validate (Zod) → Generator (240/400) → Build Header/Batches/Trailer → Calculate Fields → CNAB String
```

**Implementation**:
```typescript
import { CnabGeneratorFactory } from '@generators';
import { validateBoletoJson } from '@validators';

export function generateCnab(data: BoletoJson, type: '240' | '400'): string {
  const validated = validateBoletoJson(data);
  const generator = CnabGeneratorFactory.createByType(type);
  return generator.generate(validated);
}
```

## Validation Strategy

### Three-Layer Validation

#### 1. Schema Validation (Zod - Runtime)
```typescript
import { z } from 'zod';

export const BankSlipSchema = z.object({
  documentNumber: z.string().min(1),
  amount: z.number().positive(),
  dueDate: z.date(),
  taxId: z.string().regex(/^\d{11}$|^\d{14}$/),
});

export type BankSlip = z.infer<typeof BankSlipSchema>;
```

#### 2. Business Rules Validation
```typescript
export function validateBankSlipBusinessRules(slip: BankSlip): void {
  if (slip.dueDate < new Date()) {
    throw new ValidationError('Due date cannot be in the past');
  }
  if (slip.amount < 1) {
    throw new ValidationError('Minimum slip amount is R$ 1.00');
  }
  if (!validateDocumentNumber(slip.documentNumber, slip.bankCode)) {
    throw new ValidationError('Invalid document number for this bank');
  }
}
```

#### 3. Format Validation
```typescript
export function validateCnab240Format(content: string): void {
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length !== 240) {
      throw new ValidationError(`Line ${i + 1} has invalid length`);
    }
  }

  if (lines[0].charAt(7) !== '0') throw new ValidationError('First line must be header');
  if (lines[lines.length - 1].charAt(7) !== '9') throw new ValidationError('Last line must be trailer');
}
```

### Validation Order
```typescript
export function validateAndParseCnab(content: string): CnabJson {
  validateCnab240Format(content);  // 1. Fast fail
  const parser = CnabParserFactory.create(content);
  const json = parser.parse(content);  // 2. Parse
  const validated = CnabJsonSchema.parse(json);  // 3. Schema
  validateCnabBusinessRules(validated);  // 4. Business rules
  return validated;
}
```

## Error Handling

### Error Hierarchy
```typescript
export class CnabError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CnabError';
  }
}

export class ParseError extends CnabError {
  constructor(message: string, public readonly line?: number) {
    super(message, 'PARSE_ERROR', { line });
    this.name = 'ParseError';
  }
}

export class ValidationError extends CnabError {
  constructor(message: string, public readonly issues?: z.ZodIssue[]) {
    super(message, 'VALIDATION_ERROR', { issues });
    this.name = 'ValidationError';
  }
}

export class GenerationError extends CnabError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'GENERATION_ERROR', { field });
    this.name = 'GenerationError';
  }
}
```

### Error Handling Pattern
```typescript
export function safeParseCnab(content: string): {
  success: boolean;
  data?: CnabJson;
  error?: CnabError;
} {
  try {
    const data = parseCnab(content);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ParseError) {
      console.error(`Parse error at line ${error.line}`);
    } else if (error instanceof ValidationError) {
      console.error('Validation errors:', error.issues);
    }
    return {
      success: false,
      error: error instanceof CnabError ? error : new CnabError(error.message)
    };
  }
}
```

## Testing Strategy

### 1. Unit Tests (TDD)
```typescript
// tests/unit/utils/formatters/formatTaxId.test.ts
import { formatTaxId } from '@utils';

describe('formatTaxId', () => {
  it('should format CPF correctly', () => {
    expect(formatTaxId('12345678901')).toBe('123.456.789-01');
  });

  it('should format CNPJ correctly', () => {
    expect(formatTaxId('12345678000195')).toBe('12.345.678/0001-95');
  });
});
```

### 2. Integration Tests
```typescript
// tests/integration/cnab240-to-json.test.ts
import { parseCnab } from '@parsers';

describe('CNAB 240 to JSON', () => {
  it('should parse valid remessa file', () => {
    const cnab = readFileSync('tests/fixtures/cnab240/valid-remessa.txt', 'utf-8');
    const json = parseCnab(cnab);

    expect(json.type).toBe('240');
    expect(json.header.bankCode).toBe('001');
    expect(json.batches).toHaveLength(1);
  });

  it('should throw on invalid format', () => {
    expect(() => parseCnab('invalid')).toThrow(ParseError);
  });
});
```

### 3. Schema Tests
```typescript
// tests/unit/schemas/BankSlipSchema.test.ts
import { BankSlipSchema } from '@schemas';

describe('BankSlipSchema', () => {
  it('should validate correct bank slip', () => {
    const slip = {
      documentNumber: '12345',
      amount: 100.50,
      dueDate: new Date('2026-12-31'),
    };

    expect(BankSlipSchema.safeParse(slip).success).toBe(true);
  });

  it('should reject negative amount', () => {
    const result = BankSlipSchema.safeParse({ amount: -10 });
    expect(result.success).toBe(false);
  });
});
```

**Coverage Requirements**: > 80% (line, branch, function)

## Performance Best Practices

### 1. Avoid Premature Optimization
```typescript
// ✅ Readable first
function parseLine(line: string): Record<string, string> {
  return {
    field1: line.substring(0, 10).trim(),
    field2: line.substring(10, 20).trim(),
  };
}
```

### 2. Use Lazy Evaluation
```typescript
class Cnab240Parser {
  public *parseBatches(content: string): Generator<Batch> {
    for (const line of lines) {
      if (isBatchHeader(line) && currentBatch.length > 0) {
        yield this.parseBatch(currentBatch);
        currentBatch = [];
      }
    }
  }
}

// Process only what's needed
for (const batch of parser.parseBatches(content)) {
  if (batch.id === targetId) return batch;
}
```

### 3. Cache Expensive Operations
```typescript
import { memoize } from '@utils';

export const calculateCheckDigit = memoize((value: string): string => {
  return expensiveCalculation(value);
});
```

### 4. Batch Operations
```typescript
// ✅ Batch processing
function validateMultiple(slips: BankSlip[]): ValidationResult[] {
  return slips.map(slip => BankSlipSchema.safeParse(slip));
}
```

## Best Practices Summary

### Code Organization
- ✅ One file per class/interface/type
- ✅ Barrels (`index.ts`) in all main folders
- ✅ Imports always from root-level (`@/types`, not `@/types/cnab240`)
- ✅ Clear separation of responsibilities

### Naming Conventions
- **Files**: PascalCase (e.g., `BoletoParser.ts`)
- **Classes**: PascalCase (e.g., `class CnabParser`)
- **Interfaces**: PascalCase with optional `I` (e.g., `ICnabParser`)
- **Functions**: camelCase (e.g., `function parseCnab()`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `BANCO_CODE`)
- **Schemas**: PascalCase with `Schema` suffix (e.g., `BoletoSchema`)

### Type Safety
```typescript
// ✅ Type-safe
function processBankSlip(data: unknown): BankSlip {
  return BankSlipSchema.parse(data);
}

// ❌ No type safety
function processBankSlip(data: any): any {
  return data;
}
```

### Error Handling
- ✅ Always use custom error classes
- ✅ Include useful context in errors
- ✅ Validate input before processing
- ✅ Provide clear error messages

### Testing
- ✅ TDD: write test before implementation
- ✅ Unit tests for each public function
- ✅ Integration tests for complete flows
- ✅ Use real CNAB file fixtures

### Documentation
- ✅ JSDoc on all public exports
- ✅ Usage examples in comments
- ✅ README in main folders

### Performance
- ✅ Optimize only when necessary (after measuring)
- ✅ Avoid blocking synchronous operations
- ✅ Use generators for large data
- ✅ Cache for repetitive calculations

## Code Review Checklist

Before committing:
- [ ] Follows SOLID principles
- [ ] No code duplication (DRY)
- [ ] All exports have JSDoc
- [ ] Tests pass with > 80% coverage
- [ ] Lint and format pass
- [ ] Correct TypeScript types (no `any`)
- [ ] Validation with Zod where appropriate
- [ ] Proper error handling
- [ ] Root-level barrel imports
- [ ] Naming conventions followed

## References

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Design Patterns](https://refactoring.guru/design-patterns)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

---

**Last update**: 2026-01-20
**Version**: 1.0.0
