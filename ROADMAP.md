# BoletoSDK - Development Roadmap

**Project Goal**: Build a bank-agnostic Brazilian bank slip (boleto) SDK supporting CNAB file format parsing and generation.

**Development Flow**: BASE → CNAB400 → CNAB240

**Last Updated**: 2026-01-21

---

## Current Status 🚀

**Active Phase**: Phase 1 - CNAB400 Implementation ✅ **COMPLETED**

**Progress Overview**:

- ✅ **Phase 0**: Base Infrastructure - 152 tests (95.79% coverage)
- ✅ **Phase 1**: CNAB400 Complete - 96 additional tests (248 total passing)
  - ✅ 1.1: Types & Enums (17 tests)
  - ✅ 1.2: Parser - RETORNO (8 tests)
  - ✅ 1.3: Generator - RETORNO (19 tests)
  - ✅ 1.4: Validation (6 tests)
  - ✅ 1.5: Error Handling (18 tests)
  - ✅ 1.6: REMESSA Support (28 tests)
    - Dual-format architecture (REMESSA vs RETORNO)
    - Type 2 penalty record support
    - Complete round-trip conversion
- 🔄 **Phase 1.7**: Documentation (In Progress)
- ⏳ **Phase 2**: CNAB240 Implementation (Pending)

**Test Statistics**:

- Total Tests: 250 (248 passing, 2 skipped - CNAB240 placeholders)
- Code Coverage: >80%
- All CNAB400 features working with real production files

**Recent Milestone** (2026-01-21):

- ✅ Complete CNAB400 REMESSA generator support
- ✅ Penalty records (Type 2) parsing and generation
- ✅ Automatic format detection (REMESSA vs RETORNO)
- ✅ Field position differences handled correctly
- ✅ All 28 REMESSA integration tests passing
- ✅ Full round-trip conversion validated

---

## Table of Contents

1. [Phase 0: Base Infrastructure](#phase-0-base-infrastructure)
2. [Phase 1: CNAB400 Implementation](#phase-1-cnab400-implementation)
3. [Phase 2: CNAB240 Implementation](#phase-2-cnab240-implementation)
4. [Phase 3: Testing & Documentation](#phase-3-testing--documentation)
5. [Phase 4: Release](#phase-4-release)

---

## Phase 0: Base Infrastructure ✅ **COMPLETED**

**Objective**: Establish foundational architecture, patterns, and common utilities.

**Status**: ✅ Complete (2026-01-20)

**Completion Summary**:

- ✅ Error handling with custom error hierarchy (CnabError, ValidationError, ParseError, GenerationError)
- ✅ TypeScript interfaces for all common types (Address, TaxId, BankAccount, Beneficiary, Payer, Discount, Fee, Fine, Interest)
- ✅ Enums and constants (BankCode, DocumentType, SpeciesCode, etc.)
- ✅ Utility functions (formatters, validators, parsers, generators)
- ✅ Zod schemas for runtime validation with Brazilian business rules
- ✅ **152 passing tests** with **95.79% coverage**
- ✅ Complete JSDoc documentation
- ✅ README updated with Phase 0 usage examples

### 0.1 Error Handling ✅

**Status**: Complete

**Implementation**:

- ✅ `src/errors/index.ts` - Custom error classes with context
- ✅ CnabError (base), ParseError, ValidationError, GenerationError
- ✅ Error.captureStackTrace integration
- ✅ Tests: 13/13 passing

### 0.2 Common Types ✅

**Status**: Complete

**Implementation**:

- ✅ `src/types/common/index.ts` - 9 TypeScript interfaces
- ✅ Address, TaxId, BankAccount, Beneficiary, Payer
- ✅ Discount, Fee, Fine, Interest
- ✅ Comprehensive JSDoc with @example tags
- ✅ Validated via Zod schemas

### 0.3 Enums and Constants ✅

**Status**: Complete

**Implementation**:

- ✅ `src/enums/common/index.ts` - 8 enums
  - BankCode, DocumentType, SpeciesCode
  - AcceptanceType, CurrencyCode, CnabType
  - MovementType, InstructionCode
- ✅ `src/constants/bancos/index.ts` - Bank registry
  - BANKS record with 6 major Brazilian banks
  - getBankInfo(), getBankName(), isValidBankCode() helpers
- ✅ Tests: 39/39 passing

### 0.4 Utility Functions ✅

**Status**: Complete

**Implementation**:

- ✅ `src/utils/formatters/index.ts`
  - formatTaxId() - CPF/CNPJ formatting
  - formatMoney() - Brazilian Real currency
- ✅ `src/utils/validators/index.ts`
  - validateTaxId() - Modulo 11 checksum
  - validateCPF(), validateCNPJ()
- ✅ `src/utils/generators/index.ts`
  - padLeft(), padRight() - String padding
  - calculateModulo10(), calculateModulo11() - Check digits
- ✅ `src/utils/parsers/index.ts`
  - parseNumber(), parseDecimal()
  - parseDate(), parseDateCnab()
- ✅ Tests: 85/85 passing (TDD approach)

### 0.5 Zod Schemas ✅

**Status**: Complete

**Implementation**:

- ✅ `src/schemas/common/index.ts` - 9 Zod schemas
  - AddressSchema with BRAZILIAN_STATES enum
  - TaxIdSchema with validateTaxId() refinement
  - BankAccountSchema, BeneficiarySchema, PayerSchema
  - DiscountSchema, FeeSchema, FineSchema, InterestSchema
- ✅ Runtime validation with business rules
- ✅ Exported TypeScript types via z.infer
- ✅ Tests: 28/28 passing

### 0.6 Tests and Documentation ✅

**Status**: Complete

**Metrics**:

- ✅ **152 passing tests** (2 skipped SDK placeholders)
- ✅ **95.79% code coverage** (exceeds 80% threshold)
  - Statements: 95.79%
  - Branches: 91.13%
  - Functions: 100%
  - Lines: 98.14%
- ✅ All public exports have JSDoc
- ✅ README updated with usage examples
- ✅ TDD approach: tests written before implementation

---

## Phase 1: CNAB400 Implementation

**Objective**: Implement CNAB400 format parsing and generation for major banks.

**Status**: 🔄 Next Phase

#### 0.3.1 Bank Registry

**Location**: `src/constants/banks/`

- [ ] `BANK_REGISTRY.ts` - Central bank registry

  ```typescript
  export const BANK_REGISTRY = {
    '001': { code: '001', name: 'Banco do Brasil S.A.', shortName: 'BB' },
    '237': { code: '237', name: 'Banco Bradesco S.A.', shortName: 'Bradesco' },
    '341': { code: '341', name: 'Itaú Unibanco S.A.', shortName: 'Itaú' },
    '104': { code: '104', name: 'Caixa Econômica Federal', shortName: 'Caixa' },
    // ... all FEBRABAN banks
  } as const;
  ```

- [ ] Individual bank constant files (optional, for specific configurations)

**Acceptance Criteria**:

- All major banks registered
- Bank data matches FEBRABAN registry
- Immutable data structure (`as const`)

#### 0.3.2 CNAB Constants

**Location**: `src/constants/cnab/`

- [ ] `CNAB_VERSIONS.ts` - Supported CNAB versions
- [ ] `LINE_LENGTHS.ts` - Standard line lengths (400 for CNAB400, 240 for CNAB240)
- [ ] `RECORD_TYPES.ts` - Record type identifiers (header, detail, trailer)

**Acceptance Criteria**:

- Constants match FEBRABAN specifications
- Typed constants prevent typos

### 0.4 Base Utilities

**TDD**: Write tests first for each utility

**Location**: `src/utils/`

#### 0.4.1 Formatters

**Location**: `src/utils/formatters/`

- [ ] `formatTaxId.ts` - Format CPF/CNPJ with punctuation
- [ ] `formatDate.ts` - Format dates (DDMMAA, DDMMYYYY)
- [ ] `formatMoney.ts` - Format currency values
- [ ] `padLeft.ts` - Pad string/number left with zeros
- [ ] `padRight.ts` - Pad string right with spaces
- [ ] `removeSpecialChars.ts` - Remove accents and special chars

**Acceptance Criteria**:

- Each formatter has ≥5 unit tests
- Edge cases covered (null, undefined, invalid input)
- JSDoc with examples

#### 0.4.2 Validators

**Location**: `src/utils/validators/`

- [ ] `validateTaxId.ts` - Validate CPF/CNPJ with check digit
- [ ] `validateDate.ts` - Validate date format and range
- [ ] `validateBarcode.ts` - Validate barcode check digit
- [ ] `validateBankCode.ts` - Validate bank code exists in registry
- [ ] `validateField.ts` - Generic field validation (length, type, pattern)

**Acceptance Criteria**:

- Validators return boolean or throw descriptive errors
- Check digit algorithms correct
- Unit tests cover valid and invalid inputs

#### 0.4.3 Parsers (Helpers)

**Location**: `src/utils/parsers/`

- [ ] `parseDate.ts` - Parse CNAB date formats to Date object
- [ ] `parseMoney.ts` - Parse CNAB money format (implied decimal)
- [ ] `parseNumeric.ts` - Parse numeric fields with zero padding
- [ ] `parseBoolean.ts` - Parse CNAB boolean representations

**Acceptance Criteria**:

- Parsers handle CNAB-specific formats
- Error handling for malformed input
- Unit tests with FEBRABAN examples

#### 0.4.4 Generators (Helpers)

**Location**: `src/utils/generators/`

- [ ] `generateCheckDigit.ts` - Generate barcode check digit (modulo 11)
- [ ] `generateOurNumber.ts` - Generate sequential our number
- [ ] `calculateBarcode.ts` - Calculate full barcode

**Acceptance Criteria**:

- Algorithms match FEBRABAN specifications
- Unit tests verify check digit calculation
- Examples from real boletos validate correctly

### 0.5 Error Handling

**Location**: `src/errors/`

- [ ] `CnabError.ts` - Base error class

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
  ```

- [ ] `ParseError.ts` - Parsing-specific errors
- [ ] `ValidationError.ts` - Validation errors (wraps Zod errors)
- [ ] `GenerationError.ts` - Generation errors

**Acceptance Criteria**:

- Error classes extend base CnabError
- Contextual information preserved
- Stack traces captured
- Unit tests verify error construction

### 0.6 Zod Base Schemas

**Location**: `src/schemas/common/`

- [ ] `TaxIdSchema.ts` - CPF/CNPJ validation schema
- [ ] `DateSchema.ts` - Date validation with transformations
- [ ] `MoneySchema.ts` - Currency validation
- [ ] `AddressSchema.ts` - Address validation
- [ ] `BeneficiarySchema.ts` - Beneficiary validation
- [ ] `PayerSchema.ts` - Payer validation

**Acceptance Criteria**:

- Schemas validate Brazilian-specific formats
- Type inference works (`z.infer<>`)
- Error messages in English
- Unit tests for valid and invalid data

### 0.7 Factory Pattern Base

**Location**: `src/factories/`

- [ ] `CnabParserFactory.ts` - Detect and create parser

  ```typescript
  export class CnabParserFactory {
    static create(content: string): ICnabParser {
      const lineLength = content.split('\n')[0].length;
      if (lineLength === 400) return new Cnab400Parser();
      if (lineLength === 240) return new Cnab240Parser();
      throw new CnabError('Unknown CNAB format');
    }
  }
  ```

- [ ] `CnabGeneratorFactory.ts` - Create generator by type

**Acceptance Criteria**:

- Factory auto-detects CNAB format
- Interface-based design (SOLID)
- Unit tests for format detection

---

## Phase 1: CNAB400 Implementation

**Objective**: Implement complete CNAB400 parsing and generation (bank-agnostic).

**Duration**: ~4 weeks

**Reference**: FEBRABAN CNAB400 specification + bank-specific layouts

### 1.1 CNAB400 Types

**Location**: `src/types/cnab400/`

**TDD**: Define interfaces based on FEBRABAN spec, then implement parsers

- [ ] `FileHeader.ts` - File header record (type 0)
- [ ] `DetailRecord.ts` - Transaction detail record (type 1)
- [ ] `FileTrailer.ts` - File trailer record (type 9)
- [ ] `Cnab400File.ts` - Complete file structure

  ```typescript
  export interface Cnab400File {
    header: FileHeader;
    details: DetailRecord[];
    trailer: FileTrailer;
  }
  ```

**Acceptance Criteria**:

- Types match FEBRABAN CNAB400 specification
- Bank-specific fields marked as optional
- Position/length documented in JSDoc
- Type tests validate structure

### 1.2 CNAB400 Enums

**Location**: `src/enums/cnab400/`

- [ ] `RecordType.ts` - Record type codes (0, 1, 9)
- [ ] `OccurrenceCode.ts` - CNAB400-specific occurrence codes
- [ ] `InstructionCode.ts` - CNAB400 instruction codes
- [ ] `MovementType.ts` - Entry/return movement types

**Acceptance Criteria**:

- Enums match FEBRABAN tables
- Bank-agnostic codes only
- JSDoc references specification section

### 1.3 CNAB400 Constants

**Location**: `src/constants/cnab400/`

- [ ] `LAYOUT_VERSION.ts` - CNAB400 version identifier
- [ ] `FIELD_SIZES.ts` - Standard field lengths
- [ ] `RECORD_POSITIONS.ts` - Field position mappings

**Acceptance Criteria**:

- Constants reference FEBRABAN spec
- Position maps facilitate parsing
- Immutable structures

### 1.4 CNAB400 Parsers

**Location**: `src/parsers/cnab400/`

**TDD Strategy**:

1. Write test with real CNAB400 file fixture
2. Implement parser to make test pass
3. Refactor for readability

#### 1.4.1 Core Parsers

- [ ] `FileHeaderParser.ts` - Parse header (type 0)

  ```typescript
  export class FileHeaderParser {
    parse(line: string): FileHeader {
      if (line.length !== 400) throw new ParseError('Invalid line length');
      return {
        recordType: line.substring(0, 1),
        operationType: line.substring(1, 2),
        // ... extract all fields by position
      };
    }
  }
  ```

- [ ] `DetailRecordParser.ts` - Parse detail (type 1)
- [ ] `FileTrailerParser.ts` - Parse trailer (type 9)
- [ ] `Cnab400Parser.ts` - Main parser orchestrator

  ```typescript
  export class Cnab400Parser implements ICnabParser {
    parse(content: string): Cnab400File {
      const lines = content.split('\n').filter(l => l.trim());

      const header = this.headerParser.parse(lines[0]);
      const details = lines.slice(1, -1).map(l => this.detailParser.parse(l));
      const trailer = this.trailerParser.parse(lines[lines.length - 1]);

      return { header, details, trailer };
    }
  }
  ```

**Acceptance Criteria**:

- Parsers handle all CNAB400 record types
- Field extraction matches position map
- Dates/money converted to JavaScript types
- Errors include line number context
- Unit tests with real file fixtures
- Integration tests with complete files

#### 1.4.2 Bank-Specific Parsers (Optional Adapters)

**Location**: `src/parsers/cnab400/banks/`

- [ ] Create adapter pattern for bank-specific fields
- [ ] Itaú adapter (if needed)
- [ ] Bradesco adapter (if needed)

**Acceptance Criteria**:

- Adapters extend base parser
- Bank-specific logic isolated
- Falls back to generic parser

### 1.5 CNAB400 Generators

**Location**: `src/generators/cnab400/`

**TDD Strategy**: Test generation then parsing (round-trip test)

#### 1.5.1 Core Generators

- [ ] `FileHeaderGenerator.ts` - Generate header

  ```typescript
  export class FileHeaderGenerator {
    generate(data: FileHeader): string {
      let line = '';
      line += padLeft(data.recordType, 1, '0');
      line += padLeft(data.operationType, 1, '0');
      // ... format all fields to exact positions
      return line.padEnd(400, ' ');
    }
  }
  ```

- [ ] `DetailRecordGenerator.ts` - Generate detail
- [ ] `FileTrailerGenerator.ts` - Generate trailer
- [ ] `Cnab400Generator.ts` - Main generator

  ```typescript
  export class Cnab400Generator implements ICnabGenerator {
    generate(data: Cnab400File): string {
      const lines: string[] = [];

      lines.push(this.headerGenerator.generate(data.header));
      data.details.forEach(d => lines.push(this.detailGenerator.generate(d)));
      lines.push(this.trailerGenerator.generate(data.trailer));

      return lines.join('\n');
    }
  }
  ```

**Acceptance Criteria**:

- Generated lines exactly 400 characters
- All fields in correct positions
- Padding/alignment correct (left/right)
- Dates/money formatted correctly
- Round-trip test: parse → generate → parse = same data
- Unit tests for each generator
- Integration tests for complete files

### 1.6 CNAB400 Validators

**Location**: `src/validators/cnab400/`

- [ ] `FileHeaderValidator.ts` - Validate header structure
- [ ] `DetailRecordValidator.ts` - Validate detail record
- [ ] `FileTrailerValidator.ts` - Validate trailer
- [ ] `Cnab400Validator.ts` - Validate complete file

  ```typescript
  export class Cnab400Validator {
    validate(file: Cnab400File): ValidationResult {
      const errors: string[] = [];

      // Validate structure
      if (!file.header) errors.push('Missing header');
      if (!file.trailer) errors.push('Missing trailer');
      if (!file.details || file.details.length === 0) {
        errors.push('No detail records');
      }

      // Validate counts match
      if (file.trailer.recordCount !== file.details.length + 2) {
        errors.push('Record count mismatch');
      }

      return { isValid: errors.length === 0, errors };
    }
  }
  ```

**Acceptance Criteria**:

- Structural validation (header, details, trailer)
- Business rule validation
- Cross-field validation
- Clear error messages
- Unit tests for valid and invalid files

### 1.7 CNAB400 Schemas

**Location**: `src/schemas/cnab400/`

- [ ] `FileHeaderSchema.ts` - Zod schema for header
- [ ] `DetailRecordSchema.ts` - Zod schema for detail
- [ ] `FileTrailerSchema.ts` - Zod schema for trailer
- [ ] `Cnab400FileSchema.ts` - Complete file schema

**Acceptance Criteria**:

- Schemas validate CNAB400 structure
- Type inference works
- Runtime validation catches errors
- Unit tests with valid/invalid data

### 1.8 CNAB400 Integration Tests

**Location**: `tests/integration/cnab400/`

- [ ] `cnab400-parse.test.ts` - Parse real files
- [ ] `cnab400-generate.test.ts` - Generate valid files
- [ ] `cnab400-round-trip.test.ts` - Parse → Generate → Parse
- [ ] `cnab400-validation.test.ts` - Validation scenarios
- [ ] `cnab400-error-handling.test.ts` - Error scenarios

**Fixtures**: `tests/fixtures/cnab400/`

- [ ] Valid remittance file (entrada)
- [ ] Valid return file (retorno)
- [ ] Invalid files (various error scenarios)
- [ ] Files from different banks (if available)

**Acceptance Criteria**:

- All integration tests pass
- Coverage ≥ 80%
- Real-world files parse correctly
- Round-trip preserves data

---

## Phase 2: CNAB240 Implementation

**Objective**: Implement complete CNAB240 parsing and generation (bank-agnostic).

**Duration**: ~6 weeks (more complex than CNAB400)

**Reference**: FEBRABAN CNAB240 specification

### 2.1 CNAB240 Types

**Location**: `src/types/cnab240/`

**Note**: CNAB240 has hierarchical structure (File → Batch → Detail → Segment)

- [ ] `FileHeader.ts` - File header (type 0)
- [ ] `FileTrailer.ts` - File trailer (type 9)
- [ ] `BatchHeader.ts` - Batch header (type 1)
- [ ] `BatchTrailer.ts` - Batch trailer (type 5)
- [ ] `SegmentP.ts` - Segment P (main payment data)
- [ ] `SegmentQ.ts` - Segment Q (payer data)
- [ ] `SegmentR.ts` - Segment R (discount/fine/interest)
- [ ] `SegmentS.ts` - Segment S (additional info)
- [ ] `SegmentT.ts` - Segment T (return movement)
- [ ] `SegmentU.ts` - Segment U (return detail)
- [ ] `Batch.ts` - Complete batch structure

  ```typescript
  export interface Batch {
    header: BatchHeader;
    details: DetailRecord[]; // P, Q, R, S segments grouped
    trailer: BatchTrailer;
  }
  ```

- [ ] `DetailRecord.ts` - Detail record (segments P+Q+R+S)
- [ ] `Cnab240File.ts` - Complete file structure

  ```typescript
  export interface Cnab240File {
    fileHeader: FileHeader;
    batches: Batch[];
    fileTrailer: FileTrailer;
  }
  ```

**Acceptance Criteria**:

- Types match FEBRABAN CNAB240 specification
- Hierarchical structure properly modeled
- All segments documented
- Type tests validate structure

### 2.2 CNAB240 Enums

**Location**: `src/enums/cnab240/`

- [ ] `RecordType.ts` - Record types (0, 1, 3, 5, 9)
- [ ] `SegmentCode.ts` - Segment codes (P, Q, R, S, T, U, etc.)
- [ ] `ServiceType.ts` - Service types
- [ ] `MovementType.ts` - Movement types
- [ ] `OccurrenceCode.ts` - CNAB240 occurrence codes
- [ ] `InstructionCode.ts` - CNAB240 instruction codes

**Acceptance Criteria**:

- Enums match FEBRABAN CNAB240 tables
- JSDoc references specification
- Bank-agnostic codes

### 2.3 CNAB240 Constants

**Location**: `src/constants/cnab240/`

- [ ] `LAYOUT_VERSION.ts` - CNAB240 version (087)
- [ ] `FIELD_SIZES.ts` - Standard field lengths
- [ ] `SEGMENT_POSITIONS.ts` - Segment field positions

**Acceptance Criteria**:

- Constants match FEBRABAN spec
- Position maps for all segments
- Immutable structures

### 2.4 CNAB240 Parsers

**Location**: `src/parsers/cnab240/`

**TDD Strategy**: Similar to CNAB400 but more complex due to segments

#### 2.4.1 Record Parsers

- [ ] `FileHeaderParser.ts` - Parse file header (type 0)
- [ ] `FileTrailerParser.ts` - Parse file trailer (type 9)
- [ ] `BatchHeaderParser.ts` - Parse batch header (type 1)
- [ ] `BatchTrailerParser.ts` - Parse batch trailer (type 5)

#### 2.4.2 Segment Parsers

- [ ] `SegmentPParser.ts` - Parse segment P
- [ ] `SegmentQParser.ts` - Parse segment Q
- [ ] `SegmentRParser.ts` - Parse segment R
- [ ] `SegmentSParser.ts` - Parse segment S
- [ ] `SegmentTParser.ts` - Parse segment T
- [ ] `SegmentUParser.ts` - Parse segment U
- [ ] `SegmentParser.ts` - Segment factory/router

  ```typescript
  export class SegmentParser {
    parse(line: string): Segment {
      const segmentCode = line.substring(13, 14);

      switch (segmentCode) {
        case 'P': return this.segmentPParser.parse(line);
        case 'Q': return this.segmentQParser.parse(line);
        case 'R': return this.segmentRParser.parse(line);
        // ... other segments
        default: throw new ParseError(`Unknown segment: ${segmentCode}`);
      }
    }
  }
  ```

#### 2.4.3 Main Parser

- [ ] `Cnab240Parser.ts` - Main parser with hierarchical logic

  ```typescript
  export class Cnab240Parser implements ICnabParser {
    parse(content: string): Cnab240File {
      const lines = content.split('\n').filter(l => l.trim());

      const fileHeader = this.parseFileHeader(lines[0]);
      const batches = this.parseBatches(lines.slice(1, -1));
      const fileTrailer = this.parseFileTrailer(lines[lines.length - 1]);

      return { fileHeader, batches, fileTrailer };
    }

    private parseBatches(lines: string[]): Batch[] {
      const batches: Batch[] = [];
      let currentBatch: Partial<Batch> = {};
      let currentDetail: Segment[] = [];

      for (const line of lines) {
        const recordType = line.substring(7, 8);

        if (recordType === '1') {
          // Batch header - start new batch
          if (currentBatch.header) batches.push(this.completeBatch(currentBatch));
          currentBatch = { header: this.parseBatchHeader(line), details: [] };
        } else if (recordType === '3') {
          // Detail segment
          const segment = this.segmentParser.parse(line);
          currentDetail.push(segment);

          // Group segments into detail record (P+Q or T+U)
          if (this.isDetailComplete(currentDetail)) {
            currentBatch.details!.push(this.groupSegments(currentDetail));
            currentDetail = [];
          }
        } else if (recordType === '5') {
          // Batch trailer
          currentBatch.trailer = this.parseBatchTrailer(line);
          batches.push(currentBatch as Batch);
          currentBatch = {};
        }
      }

      return batches;
    }
  }
  ```

**Acceptance Criteria**:

- Correctly groups segments into details
- Correctly groups details into batches
- Handles multiple batches
- Validates segment sequence
- Error handling with line numbers
- Unit tests for each parser
- Integration tests with real files

### 2.5 CNAB240 Generators

**Location**: `src/generators/cnab240/`

**TDD Strategy**: Round-trip tests essential

#### 2.5.1 Record Generators

- [ ] `FileHeaderGenerator.ts`
- [ ] `FileTrailerGenerator.ts`
- [ ] `BatchHeaderGenerator.ts`
- [ ] `BatchTrailerGenerator.ts`

#### 2.5.2 Segment Generators

- [ ] `SegmentPGenerator.ts`
- [ ] `SegmentQGenerator.ts`
- [ ] `SegmentRGenerator.ts`
- [ ] `SegmentSGenerator.ts`
- [ ] `SegmentTGenerator.ts`
- [ ] `SegmentUGenerator.ts`

#### 2.5.3 Main Generator

- [ ] `Cnab240Generator.ts` - Main generator with hierarchy

  ```typescript
  export class Cnab240Generator implements ICnabGenerator {
    generate(data: Cnab240File): string {
      const lines: string[] = [];

      // File header
      lines.push(this.fileHeaderGenerator.generate(data.fileHeader));

      // Batches
      data.batches.forEach((batch, batchIndex) => {
        // Batch header
        lines.push(this.batchHeaderGenerator.generate(batch.header, batchIndex + 1));

        // Details (segments)
        batch.details.forEach((detail, detailIndex) => {
          detail.segments.forEach(segment => {
            lines.push(this.generateSegment(segment, batchIndex + 1, detailIndex + 1));
          });
        });

        // Batch trailer
        lines.push(this.batchTrailerGenerator.generate(batch.trailer));
      });

      // File trailer
      lines.push(this.fileTrailerGenerator.generate(data.fileTrailer));

      return lines.join('\n');
    }
  }
  ```

**Acceptance Criteria**:

- Generated lines exactly 240 characters
- Correct hierarchical structure
- Sequence numbers correct
- Counts correct in trailers
- Round-trip test passes
- Unit tests for each generator
- Integration tests for complete files

### 2.6 CNAB240 Validators

**Location**: `src/validators/cnab240/`

- [ ] `FileHeaderValidator.ts`
- [ ] `FileTrailerValidator.ts`
- [ ] `BatchHeaderValidator.ts`
- [ ] `BatchTrailerValidator.ts`
- [ ] `SegmentValidator.ts` - Validate segments
- [ ] `Cnab240Validator.ts` - Validate complete file

  ```typescript
  export class Cnab240Validator {
    validate(file: Cnab240File): ValidationResult {
      const errors: string[] = [];

      // Validate structure
      if (!file.fileHeader) errors.push('Missing file header');
      if (!file.fileTrailer) errors.push('Missing file trailer');
      if (!file.batches || file.batches.length === 0) {
        errors.push('No batches');
      }

      // Validate each batch
      file.batches.forEach((batch, index) => {
        if (!batch.header) errors.push(`Batch ${index}: missing header`);
        if (!batch.trailer) errors.push(`Batch ${index}: missing trailer`);

        // Validate segment sequence
        batch.details.forEach((detail, detailIndex) => {
          if (!this.validateSegmentSequence(detail.segments)) {
            errors.push(`Batch ${index}, Detail ${detailIndex}: invalid segment sequence`);
          }
        });

        // Validate counts
        const expectedDetailCount = batch.details.reduce((sum, d) => sum + d.segments.length, 0);
        if (batch.trailer.detailCount !== expectedDetailCount) {
          errors.push(`Batch ${index}: detail count mismatch`);
        }
      });

      // Validate file trailer counts
      const totalBatches = file.batches.length;
      if (file.fileTrailer.batchCount !== totalBatches) {
        errors.push('Batch count mismatch in file trailer');
      }

      return { isValid: errors.length === 0, errors };
    }
  }
  ```

**Acceptance Criteria**:

- Hierarchical structure validation
- Sequence validation
- Count validation
- Business rule validation
- Clear error messages

### 2.7 CNAB240 Schemas

**Location**: `src/schemas/cnab240/`

- [ ] `FileHeaderSchema.ts`
- [ ] `FileTrailerSchema.ts`
- [ ] `BatchHeaderSchema.ts`
- [ ] `BatchTrailerSchema.ts`
- [ ] `SegmentPSchema.ts`
- [ ] `SegmentQSchema.ts`
- [ ] `SegmentRSchema.ts`
- [ ] `SegmentSSchema.ts`
- [ ] `SegmentTSchema.ts`
- [ ] `SegmentUSchema.ts`
- [ ] `BatchSchema.ts`
- [ ] `Cnab240FileSchema.ts`

**Acceptance Criteria**:

- Schemas validate CNAB240 structure
- Hierarchical validation
- Type inference works
- Unit tests

### 2.8 CNAB240 Integration Tests

**Location**: `tests/integration/cnab240/`

- [ ] `cnab240-parse.test.ts`
- [ ] `cnab240-generate.test.ts`
- [ ] `cnab240-round-trip.test.ts`
- [ ] `cnab240-validation.test.ts`
- [ ] `cnab240-error-handling.test.ts`

**Fixtures**: `tests/fixtures/cnab240/`

- [ ] Valid remittance file
- [ ] Valid return file
- [ ] Multi-batch file
- [ ] Invalid files
- [ ] Files from different banks

**Acceptance Criteria**:

- All integration tests pass
- Coverage ≥ 80%
- Real-world files parse correctly
- Round-trip preserves data

---

## Phase 3: Testing & Documentation

**Objective**: Achieve comprehensive test coverage and complete documentation.

**Duration**: ~2 weeks

### 3.1 Unit Test Coverage

**Target**: ≥ 90% coverage

- [ ] Review all units (formatters, validators, parsers, generators)
- [ ] Add missing unit tests
- [ ] Test edge cases
- [ ] Test error handling
- [ ] Run coverage report: `npm run test:coverage`

**Acceptance Criteria**:

- Line coverage ≥ 90%
- Branch coverage ≥ 85%
- Function coverage ≥ 90%
- All public APIs tested

### 3.2 Integration Test Coverage

**Target**: ≥ 80% coverage

- [ ] CNAB400 end-to-end tests
- [ ] CNAB240 end-to-end tests
- [ ] Cross-format tests
- [ ] Performance tests (large files)
- [ ] Error scenario tests

**Acceptance Criteria**:

- All integration scenarios covered
- Real-world files tested
- Performance benchmarks established

### 3.3 Documentation

#### 3.3.1 API Documentation

- [ ] Generate TypeDoc documentation
- [ ] Publish to GitHub Pages or docs site
- [ ] Ensure all public APIs have JSDoc

#### 3.3.2 User Guides

- [ ] `README.md` - Overview, installation, quick start
- [ ] `docs/CNAB400_GUIDE.md` - CNAB400 usage guide
- [ ] `docs/CNAB240_GUIDE.md` - CNAB240 usage guide
- [ ] `docs/MIGRATION.md` - Migration guide (if updating existing library)
- [ ] `docs/EXAMPLES.md` - Code examples
- [ ] `docs/FAQ.md` - Frequently asked questions

#### 3.3.3 Developer Guides

- [ ] `CONTRIBUTING.md` - Contribution guidelines
- [ ] `ARCHITECTURE.md` - Architecture overview
- [ ] `TESTING.md` - Testing strategy
- [ ] Update `.doc.md` files for all components

**Acceptance Criteria**:

- All guides complete and reviewed
- Code examples tested and working
- Documentation is beginner-friendly
- Architecture clearly explained

### 3.4 Code Quality

- [ ] Run SonarQube analysis
- [ ] Fix all critical issues
- [ ] Fix all major issues
- [ ] Review and fix code smells
- [ ] Ensure no duplicated code (DRY)
- [ ] Verify SOLID principles compliance

**Acceptance Criteria**:

- SonarQube quality gate passes
- No security vulnerabilities
- Maintainability rating A
- Technical debt < 5%

---

## Phase 4: Release

**Objective**: Prepare and publish first stable release.

**Duration**: ~1 week

### 4.1 Pre-Release Checklist

- [ ] All tests passing (unit + integration)
- [ ] Code coverage meets targets
- [ ] Documentation complete
- [ ] No critical/major bugs
- [ ] Performance benchmarks acceptable
- [ ] Security audit passed
- [ ] License file present
- [ ] CHANGELOG.md updated

### 4.2 Package Configuration

- [ ] Update `package.json` metadata
  - [ ] name
  - [ ] version (1.0.0)
  - [ ] description
  - [ ] keywords
  - [ ] author
  - [ ] license
  - [ ] repository
  - [ ] bugs
  - [ ] homepage
- [ ] Configure npm publishing
  - [ ] `.npmignore` configured
  - [ ] Entry points correct (`main`, `types`)
  - [ ] Exports configured
- [ ] Test package locally with `npm pack`

### 4.3 GitHub Release

- [ ] Create release branch (`release/1.0.0`)
- [ ] Tag version (`v1.0.0`)
- [ ] Write release notes
- [ ] Publish GitHub release
- [ ] Merge to main branch

### 4.4 npm Publishing

- [ ] Publish to npm: `npm publish`
- [ ] Verify package on npm registry
- [ ] Test installation: `npm install boleto-sdk`
- [ ] Verify package contents

### 4.5 Announcement

- [ ] Announce on GitHub
- [ ] Update project website/blog (if applicable)
- [ ] Share on relevant communities
- [ ] Update repository README badges

**Acceptance Criteria**:

- Package published to npm
- GitHub release created
- Documentation accessible
- Installation works correctly

---

## Post-Release Roadmap

### Future Enhancements

#### v1.1.0 - Bank-Specific Adapters (Itaú)

**Objective**: Add comprehensive Itaú bank support with complete validation.

**Duration**: ~2 weeks

##### Itaú Adapter Implementation

**Location**: `src/adapters/itau/`

- [ ] `ItauAdapter.ts` - Main adapter class implementing `IBankAdapter`
- [ ] `ItauOurNumberCalculator.ts` - Our number format and check digit (modulo 10)
- [ ] `ItauWalletValidator.ts` - Wallet codes (109, 112, 115, 180) validation
- [ ] `ItauOccurrenceMapper.ts` - Map Itaú-specific occurrence codes
- [ ] `ItauInstructionMapper.ts` - Map Itaú-specific instruction codes
- [ ] `ItauFieldParser.ts` - Parse Itaú-specific fields in "bank use" areas
- [ ] `ItauValidator.ts` - Business rules specific to Itaú

**Types**: `src/types/adapters/itau/`

- [ ] `ItauCnab400Detail.ts` - Itaú-specific CNAB400 detail record
- [ ] `ItauCnab240Segment.ts` - Itaú-specific CNAB240 segments
- [ ] `ItauWallet.ts` - Wallet configuration types
- [ ] `ItauOccurrence.ts` - Occurrence code types

**Tests**: `tests/adapters/itau/`

- [ ] Unit tests for check digit calculation
- [ ] Unit tests for wallet validation
- [ ] Integration tests with real Itaú CNAB files
- [ ] Round-trip tests with Itaú adapter

**Documentation**:

- [ ] Update README with Itaú adapter usage
- [ ] Create `docs/ADAPTERS.md` with adapter guide
- [ ] Update `doc/BANK_DIFFERENCES.md` with Itaú details

**Acceptance Criteria**:

- Parse Itaú CNAB400 files with full field interpretation
- Parse Itaú CNAB240 files with full field interpretation
- Generate valid Itaú files with correct check digits
- Validate Itaú-specific business rules
- All Itaú occurrence/instruction codes mapped
- Test coverage ≥ 90%

#### v1.2.0 - Bank Adapters (Bradesco)

**Objective**: Add Bradesco bank support.

**Duration**: ~2 weeks

##### Bradesco Adapter Implementation

**Location**: `src/adapters/bradesco/`

- [ ] `BradescoAdapter.ts` - Main adapter
- [ ] `BradescoOurNumberCalculator.ts` - 11 digits + check digit (modulo 11)
- [ ] `BradescoWalletValidator.ts` - Wallets 09, 19, 26 with variations
- [ ] `BradescoOccurrenceMapper.ts` - Bradesco occurrence codes
- [ ] `BradescoFieldParser.ts` - Bank-specific field parsing
- [ ] `BradescoValidator.ts` - Bradesco business rules

**Key Features**:

- [ ] Wallet variation support (019, etc.)
- [ ] Company code field handling
- [ ] Modulo 11 check digit with 'P' for remainder 1
- [ ] Extended instruction codes

**Acceptance Criteria**: Same as Itaú adapter

#### v1.3.0 - Bank Adapters (Banco do Brasil)

**Objective**: Add Banco do Brasil support.

**Duration**: ~2 weeks

##### BB Adapter Implementation

**Location**: `src/adapters/bb/`

- [ ] `BBAdapter.ts` - Main adapter
- [ ] `BBOurNumberCalculator.ts` - 17 digits (no check digit in file)
- [ ] `BBWalletValidator.ts` - Wallets 11, 12, 17, 31
- [ ] `BBAgreementValidator.ts` - Agreement number validation (critical!)
- [ ] `BBFieldParser.ts` - BB-specific fields
- [ ] `BBValidator.ts` - BB business rules

**Key Features**:

- [ ] Agreement number integration with our number
- [ ] Wallet variation (019, 027) support
- [ ] No check digit in file (but calculated for display)
- [ ] Strict agreement validation

**Acceptance Criteria**: Same as previous adapters

#### v1.4.0 - Bank Adapters (Caixa)

**Objective**: Add Caixa Econômica Federal support.

**Duration**: ~2 weeks

##### Caixa Adapter Implementation

**Location**: `src/adapters/caixa/`

- [ ] `CaixaAdapter.ts` - Main adapter
- [ ] `CaixaOurNumberCalculator.ts` - 14 digits + check digit
- [ ] `CaixaWalletValidator.ts` - Wallets CR, SR, CS
- [ ] `CaixaSIGCBIntegration.ts` - SIGCB system integration
- [ ] `CaixaFieldParser.ts` - Caixa-specific fields
- [ ] `CaixaValidator.ts` - Caixa business rules

**Key Features**:

- [ ] Alpha wallet codes (CR, SR, CS)
- [ ] SIGCB integration for wallet CS
- [ ] Modality code handling
- [ ] Identification code (agreement) validation

**Acceptance Criteria**: Same as previous adapters

#### v1.5.0 - Bank Adapters (Santander)

**Objective**: Add Santander support.

**Duration**: ~1 week

##### Santander Adapter Implementation

**Location**: `src/adapters/santander/`

- [ ] `SantanderAdapter.ts` - Main adapter
- [ ] `SantanderOurNumberCalculator.ts` - 13 digits (7 + 6)
- [ ] `SantanderWalletValidator.ts` - Wallets 101, 102, 201
- [ ] `SantanderFieldParser.ts` - IoF and origin code fields
- [ ] `SantanderValidator.ts` - Santander business rules

**Key Features**:

- [ ] Split our number format (7 fixed + 6 sequential)
- [ ] IoF code for insurance slips
- [ ] Origin code handling

**Acceptance Criteria**: Same as previous adapters

#### v1.6.0 - Additional Features

- [ ] Barcode image generation (SVG, PNG)
- [ ] QR Code generation (PIX integration)
- [ ] PDF generation for bank slips
- [ ] Email integration utilities
- [ ] Webhook notification support

#### v1.7.0 - Advanced Features

- [ ] Batch processing utilities
- [ ] File validation CLI tool
- [ ] Real-time file streaming parser
- [ ] Database integration helpers
- [ ] Retry mechanism for failed operations

#### v2.0.0 - Major Enhancements

- [ ] Community bank adapters (15+ banks)
- [ ] Support for CNAB444 (if applicable)
- [ ] Advanced analytics
- [ ] Machine learning for validation

---

## Development Principles

### Always Follow

1. **TDD (Test-Driven Development)**
   - Write test first
   - Make test pass
   - Refactor

2. **DRY (Don't Repeat Yourself)**
   - Extract common logic
   - Reuse utilities
   - Share types/interfaces

3. **SOLID Principles**
   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

4. **English Only**
   - All code in English
   - All docs in English
   - All comments in English

5. **Bank-Agnostic Design**
   - Core logic independent of banks
   - Bank-specific logic in adapters
   - Extensible architecture

6. **Quality Standards**
   - Code coverage ≥ 80%
   - Zero critical bugs
   - Pass all linters
   - Follow TypeScript strict mode

---

## Timeline Summary

| Phase | Duration | Deliverables |
| ----- | -------- | ------------ |
| **Phase 0: Base Infrastructure** | 2 weeks | Common types, utils, errors, base schemas |
| **Phase 1: CNAB400** | 4 weeks | Complete CNAB400 parsing/generation |
| **Phase 2: CNAB240** | 6 weeks | Complete CNAB240 parsing/generation |
| **Phase 3: Testing & Docs** | 2 weeks | ≥90% coverage, complete documentation |
| **Phase 4: Release** | 1 week | v1.0.0 published to npm |
| **Total** | **15 weeks** | Production-ready SDK |

---

## Success Criteria

### Technical

- ✅ Parses valid CNAB400 files correctly
- ✅ Parses valid CNAB240 files correctly
- ✅ Generates valid CNAB400 files
- ✅ Generates valid CNAB240 files
- ✅ Round-trip tests pass (parse → generate → parse)
- ✅ Code coverage ≥ 90%
- ✅ All integration tests pass
- ✅ No critical security vulnerabilities
- ✅ Performance: Parse 10,000 line file in < 1 second

### Quality

- ✅ SonarQube quality gate passes
- ✅ ESLint passes with zero errors
- ✅ TypeScript compiles with zero errors
- ✅ All documentation complete
- ✅ All public APIs have JSDoc
- ✅ Examples work as documented

### Business

- ✅ Bank-agnostic design allows easy extension
- ✅ Can be used by any Brazilian bank
- ✅ Supports both file formats (CNAB400 and CNAB240)
- ✅ Easy to integrate (simple API)
- ✅ Well-documented for developers
- ✅ Published to npm registry

---

**Last Updated**: 2026-01-20
**Version**: 1.0
**Maintainer**: BoletoSDK Team
