# BoletoSDK - Development Roadmap

**Project Goal**: Build a bank-agnostic Brazilian bank slip (boleto) SDK supporting CNAB file format parsing and generation.

**Development Flow**: BASE → CNAB400 → CNAB240

**Last Updated**: 2026-01-23

---

## Current Status 🚀

**Active Phase**: ⏳ Phase 3.5 - Boleto HTML/PDF Generation

**Completed Phases**:

- ✅ **Phase 0**: Base Infrastructure (152 tests, 95.79% coverage)
- ✅ **Phase 1**: CNAB400 Complete (96 tests, 1800+ lines documentation)
- ✅ **Phase 1.5**: CNAB400 Constants (68 tests)
- ✅ **Phase 2.1**: CNAB240 Types (11 tests)
- ✅ **Phase 2.2**: CNAB240 Enums (15 tests)
- ✅ **Phase 2.3**: CNAB240 Parsers (51 tests)
- ✅ **Phase 2.4**: CNAB240 Generators (148 tests)
- ✅ **Phase 2.5**: CNAB240 Constants (78 tests)
- ✅ **Phase 2.6**: CNAB240 Validators
- ✅ **Phase 2.7**: CNAB240 Schemas

**Overall Statistics**:

- **Total Tests**: 821 (821 passing)
- **Code Coverage**: >80%
- **Documentation**: ~1800 lines (README + USAGE-GUIDE + API-REFERENCE)
- **Production Ready**: CNAB400 fully operational with real files
- **CNAB240**: Complete parsers + generators + constants + validators + schemas (File/Batch/Segments P/Q/R)

**Recent Accomplishments (2026-01-23)**:

- ✅ Implemented CNAB400 constants for consistency (68 tests)
- ✅ Created LAYOUT_VERSION constants (400-char format, file types, service codes)
- ✅ Created FIELD_SIZES constants (30+ field definitions organized by record type)
- ✅ Created RECORD_POSITIONS constants (separate maps for REMESSA vs RETORNO layouts)
- ✅ Position validation helper (validates 400-char coverage, no gaps/overlaps)
- ✅ Fixed export conflicts using namespace exports (CNAB240 vs CNAB400)
- ✅ All constants match CNAB400 specification
- ✅ Type-safe constants using `as const` literal types
- ✅ Comprehensive documentation with JSDoc on all exports
- ✅ Implemented all CNAB240 constants (78 tests)
- ✅ Created CNAB240 LAYOUT_VERSION constants (FEBRABAN spec v087)
- ✅ Created CNAB240 FIELD_SIZES constants (100+ field definitions)
- ✅ Created CNAB240 SEGMENT_POSITIONS constants (position maps for all segments)
- ✅ Implemented CNAB240 validators with structure and sequence validation
- ✅ Implemented CNAB240 Zod schemas with unit tests
- ✅ Implemented CNAB400 Zod schemas with unit tests
- ✅ Added unit tests for CNAB auto-detection (CnabParserFactory)
- ✅ Added unit tests for parseDateShort utility
- ✅ Added unit tests for CNAB240 Segment P/Q parsers
- ✅ Added unit tests for CNAB400 parser
- ✅ Added unit tests for CNAB400 header/trailer parsers
- ✅ Added unit tests for CNAB400 detail and return detail parsers
- ✅ Added unit tests for CNAB400 message, penalty, and guarantor parsers
- ✅ Added edge case tests for CNAB400 message/penalty parsers
- ✅ Added unit tests for CNAB generator factory
- ✅ Added barrel export coverage tests
- ✅ Added CNAB400 return schema validation test
- ✅ Added unit tests for CNAB400 generator records and orchestration
- ✅ Added cross-format integration tests (CNAB240/400)
- ✅ Added large-file CNAB240 integration test
- ✅ Added CONTRIBUTING, ARCHITECTURE, and TESTING guides
- ✅ Added CNAB240 guide, migration notes, examples, and FAQ
- ✅ Updated README with current API and docs links
- ✅ Added integration test .doc.md documentation
- ✅ Added generator documentation (CNAB240/400 + factory)
- ✅ Added parser documentation (CNAB240/400 + factory)
- ✅ Added utilities documentation (formatters, parsers, generators, validators)
- ✅ Added index documentation (errors, constants, enums, types)
- ✅ Completed .doc.md coverage for core components
- ✅ Added initial HTML template scaffolding (BoletoTemplate, GenericTemplate, TemplateRenderer)
- ✅ Added HtmlTemplateBuilder and ItauTemplate for shared HTML layout
- ✅ Added BradescoTemplate and BBTemplate using shared HTML layout
- ✅ Added HTML layout options (simple, instructions, detailed) with tests

**Next Steps**: Phase 3.5 - Boleto HTML/PDF Generation

---

## Table of Contents

1. [Phase 0: Base Infrastructure](#phase-0-base-infrastructure--completed)
2. [Phase 1: CNAB400 Implementation](#phase-1-cnab400-implementation--completed)
3. [Phase 2: CNAB240 Implementation](#phase-2-cnab240-implementation-)
4. [Phase 3: Testing & Documentation](#phase-3-testing--documentation)
5. [Phase 3.5: Boleto HTML/PDF Generation](#phase-35-boleto-htmlpdf-generation-)
6. [Phase 4: Release](#phase-4-release)
7. [Post-Release Roadmap](#post-release-roadmap)

---

## Phase 0: Base Infrastructure ✅ **COMPLETED**

**Status**: Complete (2026-01-20)

**Summary**: Foundation layer with error handling, types, enums, utilities, and Zod schemas.

**Metrics**: 152 tests, 95.79% coverage

---

## Phase 1: CNAB400 Implementation ✅ **COMPLETED**

**Objective**: Implement complete CNAB400 parsing and generation (bank-agnostic).

**Status**: ✅ Complete (2026-01-21)

**Completion Summary**:

- ✅ Types & Enums - All CNAB400 interfaces and enumerations (17 tests)
- ✅ RETORNO Parser - Complete parsing of return files (8 tests)
- ✅ RETORNO Generator - Generate valid return files (19 tests)
- ✅ Validation - Schema and business rule validation (6 tests)
- ✅ Error Handling - Comprehensive error scenarios (18 tests)
- ✅ REMESSA Support - Complete dual-format architecture (28 tests)
  - Automatic format detection (REMESSA vs RETORNO)
  - Type 2 penalty record support
  - Field position differences handled correctly
  - Full round-trip conversion validated
- ✅ **96 total tests passing** (all CNAB400 features)
- ✅ Integration with real production files
- ✅ Coverage >80%

### 1.1 CNAB400 Types ✅

**Status**: Complete

**Implementation**:

- ✅ `src/types/cnab400/index.ts` - All CNAB400 interfaces
  - FileHeader, FileTrailer
  - DetailRecord with all field positions
  - PenaltyRecord (Type 2) support
  - Cnab400File complete structure
- ✅ Dual-format support (REMESSA and RETORNO)
- ✅ Field position documentation in JSDoc
- ✅ Tests: 17/17 passing

### 1.2 CNAB400 Enums ✅

**Status**: Complete

**Implementation**:

- ✅ `src/enums/cnab400/index.ts` - All CNAB400 enums
  - RecordType (0, 1, 2, 9)
  - OccurrenceCode (CNAB400-specific)
  - InstructionCode (CNAB400 instructions)
  - MovementType (Entry/Return)
- ✅ Bank-agnostic codes
- ✅ FEBRABAN specification references

### 1.3 CNAB400 Parsers ✅

**Status**: Complete

**Implementation**:

- ✅ `src/parsers/cnab400/index.ts` - Complete CNAB400 parser
- ✅ Automatic format detection (REMESSA vs RETORNO)
- ✅ Field extraction by position
- ✅ Date/money type conversions
- ✅ Type 2 penalty record support
- ✅ Error handling with line numbers
- ✅ Tests: 8/8 passing

### 1.4 CNAB400 Generators ✅

**Status**: Complete

**Implementation**:

- ✅ `src/generators/cnab400/index.ts` - Complete CNAB400 generator
- ✅ Dual-format support (REMESSA and RETORNO)
- ✅ Exact 400-character line generation
- ✅ Correct field positioning and padding
- ✅ Date/money formatting
- ✅ Round-trip validation
- ✅ Tests: 19/19 passing

### 1.5 CNAB400 Validators ✅

**Status**: Complete

**Implementation**:

- ✅ `src/validators/cnab400/index.ts` - Complete CNAB400 validation
- ✅ Structural validation (header, details, trailer)
- ✅ Business rule validation
- ✅ Zod schema integration
- ✅ Clear error messages
- ✅ Tests: 6/6 passing

### 1.6 CNAB400 Integration Tests ✅

**Status**: Complete

**Implementation**:

- ✅ `tests/integration/cnab400-parser.test.ts` - Parse real files (8 tests)
- ✅ `tests/integration/cnab400-generator.test.ts` - Generate valid files (19 tests)
- ✅ `tests/integration/cnab400-remessa.test.ts` - REMESSA support (28 tests)
- ✅ `tests/integration/cnab400-error-handling.test.ts` - Error scenarios (18 tests)
- ✅ Round-trip conversion validated
- ✅ Real production files tested
- ✅ Coverage >80%

**Fixtures**:

- ✅ `tests/fixtures/cnab400/itau-remessa-sample1.ret` - Valid REMESSA file
- ✅ `tests/fixtures/cnab400/itau-retorno-sample1.ret` - Valid RETORNO file

### 1.7 Documentation ✅

**Status**: ✅ **COMPLETED** (2026-01-21)

**Completion Summary**:

- ✅ README updated with comprehensive CNAB400 guide (293 new lines)
  - REMESSA vs RETORNO explanation
  - Field position differences table
  - Parse and generate examples for both formats
  - Penalty records usage
  - Round-trip conversion examples
  - Validation and error handling
- ✅ `doc/CNAB400-USAGE-GUIDE.md` - Complete usage guide (650+ lines)
  - Overview and file structure
  - REMESSA vs RETORNO detailed comparison
  - Parsing files (both formats)
  - Generating files (with complete examples)
  - Field mapping reference
  - Real-world examples (process payments, generate invoices, round-trip)
  - Best practices (validation, sequential numbers, amounts, dates, type safety)
  - Troubleshooting common issues
- ✅ `doc/API-REFERENCE.md` - Full API documentation (900+ lines)
  - Parser functions (parseCnab400 with examples)
  - Generator functions (generateCnab400 with examples)
  - Validator functions (validateCnab400File)
  - Complete type definitions (all interfaces)
  - Error classes (ParseError, ValidationError, GenerationError, CnabError)
  - Utility functions (formatDate, parseDate, padLeft, padRight, validateTaxId)
  - TypeScript signatures for all public APIs

**Total Documentation**: ~1800 lines of comprehensive CNAB400 documentation

### 1.8 CNAB400 Schemas ✅

**Status**: ✅ Complete

**Location**: `src/schemas/cnab400/`

- ✅ `shared.ts`
- ✅ `FileHeaderSchema.ts`
- ✅ `DetailRecordSchema.ts`
- ✅ `ReturnDetailRecordSchema.ts`
- ✅ `PenaltyRecordSchema.ts`
- ✅ `GuarantorRecordSchema.ts`
- ✅ `MessageFrontRecordSchema.ts`
- ✅ `MessageBackRecordSchema.ts`
- ✅ `FileTrailerSchema.ts`
- ✅ `Cnab400FileSchema.ts`
- ✅ `Cnab400ReturnFileSchema.ts`
- ✅ Unit tests: `tests/unit/schemas/cnab400.test.ts`

---

## Phase 1.5: CNAB400 Constants ✅ **COMPLETED**

**Objective**: Create centralized constants for CNAB400 format specifications to improve code maintainability and validator accuracy.

**Duration**: ~1 day

**Status**: ✅ **COMPLETED** (2026-01-21)

**Motivation**: Bring CNAB400 to parity with CNAB240 implementation for consistency and better code organization.

### 1.5.1 Layout Version Constants ✅

**Location**: `src/constants/cnab400/LAYOUT_VERSION.ts`

**Status**: ✅ Complete (10 constants)

- ✅ `LINE_LENGTH` = 400 (line length in characters)
- ✅ `FILE_TYPE_REMESSA` = '1' (send to bank)
- ✅ `FILE_TYPE_RETORNO` = '2' (return from bank)
- ✅ `SERVICE_CODE_COBRANCA` = '01' (collection service)
- ✅ `OPERATION_LITERAL_REMESSA` = 'REMESSA'
- ✅ `OPERATION_LITERAL_RETORNO` = 'RETORNO'
- ✅ `SERVICE_LITERAL_COBRANCA` = 'COBRANCA'
- ✅ `CURRENCY_CODE` = '009' (BRL)
- ✅ `FILLER_CHARACTER` = ' ' (space for padding)
- ✅ `ZERO_PAD_CHARACTER` = '0' (zero for numeric padding)

**Key Features**:

- Type-safe using `as const` literal types
- All constants documented with JSDoc
- Centralized format specifications

### 1.5.2 Field Sizes Constants ✅

**Location**: `src/constants/cnab400/FIELD_SIZES.ts`

**Status**: ✅ Complete (5 constant objects, 30+ field definitions)

**Constant Objects**:

- ✅ `COMMON_FIELD_SIZES` - Shared fields (30+ fields)
  - Record type (1), bank code (3), agency (4)
  - Account (5), registration number (14)
  - Our number (8), amounts (13 with 2 decimals)
  - Dates (6 DDMMYY), names (30), addresses (40)
- ✅ `FILE_HEADER_SIZES` - Header-specific fields
  - Operation literal (7), service literal (15)
  - Company name (30), bank name (15)
  - Generation date (6), sequence number (5)
- ✅ `DETAIL_RECORD_SIZES` - Detail-specific fields
  - Company control (25), payer info (name 30, address 40)
  - Guarantor fields (name 30, registration 14)
- ✅ `PENALTY_RECORD_SIZES` - Penalty-specific fields
  - Message line (80 characters, 4 lines per record)
- ✅ `FILE_TRAILER_SIZES` - Trailer-specific fields
  - Total records (6), total amount (13)
- ✅ `TOTAL_LINE_LENGTH` = 400 (validation constant)

**Benefits**:

- Centralized field size validation
- Self-documenting code
- Easier parser/generator maintenance

### 1.5.3 Record Positions Constants ✅

**Location**: `src/constants/cnab400/RECORD_POSITIONS.ts`

**Status**: ✅ Complete (6 position maps + validation helper)

**Position Maps** (all 1-indexed, covering 1-400):

- ✅ `FILE_HEADER_POSITIONS` (18 fields)
  - Standard header fields for both REMESSA/RETORNO
  - Record type (1-1), operation type (2-2)
  - Bank code (77-79), generation date (95-100)
  - Sequential number (395-400)
- ✅ `FILE_HEADER_RETORNO_POSITIONS` (19 fields)
  - Extends standard header with CREATION_DATE (114-119)
- ✅ `DETAIL_RECORD_REMESSA_POSITIONS` (36 fields)
  - REMESSA-specific layout
  - Due date (121-126), amount (127-139)
  - Payer info, instructions, dates
- ✅ `DETAIL_RECORD_RETORNO_POSITIONS` (36 fields)
  - RETORNO-specific layout (different from REMESSA!)
  - Occurrence code (109-110)
  - Due date (147-152), amount (153-165)
  - Received amount, fees, dates
- ✅ `PENALTY_RECORD_POSITIONS` (7 fields)
  - 4 message lines (80 chars each: 2-81, 82-161, 162-241, 242-321)
  - Record type, sequential number, reserved
- ✅ `FILE_TRAILER_POSITIONS` (6 fields)
  - Total records (8-13), total amount (14-26)
  - Record type, sequential number

**Helper Function**:

- ✅ `validatePositions()` - Validates position maps
  - Checks 1-400 coverage
  - Detects gaps between fields
  - Validates no overlaps

**Key Implementation Details**:

- REMESSA and RETORNO use DIFFERENT field positions
- Example: Due date in REMESSA at 121-126, in RETORNO at 147-152
- All position maps validated for completeness (no gaps)
- Type-safe with `{ start: number; end: number }` objects

### 1.5.4 Tests ✅

**Location**: `tests/unit/constants/cnab400.test.ts`

**Status**: ✅ Complete (68 tests passing)

**Test Coverage**:

- ✅ Layout version constants (10 tests)
- ✅ Common field sizes (8 tests)
- ✅ File header sizes (4 tests)
- ✅ Detail record sizes (4 tests)
- ✅ Penalty record sizes (2 tests)
- ✅ File trailer sizes (3 tests)
- ✅ Total line length (2 tests)
- ✅ File header positions (6 tests)
- ✅ File header RETORNO positions (2 tests)
- ✅ Detail REMESSA positions (7 tests)
- ✅ Detail RETORNO positions (5 tests)
- ✅ Penalty record positions (5 tests)
- ✅ File trailer positions (6 tests)
- ✅ Position validation helper (4 tests)

**Total**: 68 comprehensive tests validating all constants

### 1.5.5 Export Strategy ✅

**Status**: ✅ Complete

**Challenge**: Namespace conflicts with CNAB240 (both have `LINE_LENGTH`, `COMMON_FIELD_SIZES`, etc.)

**Solution**: Namespace exports in `src/constants/index.ts`

```typescript
// Before (caused conflicts):
export * from './cnab240';
export * from './cnab400';

// After (namespace exports):
export * as CNAB240 from './cnab240';
export * as CNAB400 from './cnab400';
```

**Usage**:

```typescript
import { CNAB240, CNAB400 } from '@/constants';

console.log(CNAB240.LINE_LENGTH); // 240
console.log(CNAB400.LINE_LENGTH); // 400
```

**Benefits**: Clean separation, no conflicts, explicit usage

### 1.5.6 Impact ✅

**Improvements**:

- ✅ Consistency between CNAB240 and CNAB400 implementations
- ✅ Centralized specification knowledge
- ✅ Foundation for improved validators (Phase 1.8/2.6)
- ✅ Better code maintainability
- ✅ Self-documenting constants
- ✅ Easier debugging (named constants vs magic numbers)
- ✅ Type-safe literal types (`as const`)

**Test Results**:

- Before: 551 tests passing
- After: 619 tests passing (+68 CNAB400 constants tests)
- All tests passing ✅

**Completion Date**: 2026-01-21

---

## Phase 2: CNAB240 Implementation ⏳

**Objective**: Implement complete CNAB240 parsing and generation (bank-agnostic).

**Duration**: ~6 weeks (more complex than CNAB400)

**Reference**: FEBRABAN CNAB240 specification

### 2.1 CNAB240 Types ✅

**Location**: `src/types/cnab240/`

**Status**: ✅ Complete (2026-01-21)

**Note**: CNAB240 has hierarchical structure (File → Batch → Detail → Segment)

- ✅ `FileHeader.ts` - File header (type 0)
- ✅ `FileTrailer.ts` - File trailer (type 9)
- ✅ `BatchHeader.ts` - Batch header (type 1)
- ✅ `BatchTrailer.ts` - Batch trailer (type 5)
- ✅ `SegmentP.ts` - Segment P (main payment data)
- ✅ `SegmentQ.ts` - Segment Q (payer data)
- ✅ `SegmentR.ts` - Segment R (discount/fine/interest)
- [ ] `SegmentS.ts` - Segment S (additional info) - Deferred
- [ ] `SegmentT.ts` - Segment T (return movement) - Deferred
- [ ] `SegmentU.ts` - Segment U (return detail) - Deferred
- ✅ `Batch.ts` - Complete batch structure
- ✅ `DetailRecord.ts` - Detail record (segments P+Q+R)
- ✅ `Cnab240File.ts` - Complete file structure
- ✅ Tests: 11/11 passing

**Acceptance Criteria**:

- ✅ Types match FEBRABAN CNAB240 specification
- ✅ Hierarchical structure properly modeled
- ✅ All segments documented
- ✅ Type tests validate structure

### 2.2 CNAB240 Enums ✅

**Location**: `src/enums/cnab240/`

**Status**: ✅ Complete (2026-01-21)

- ✅ `RecordType.ts` - Record types (0, 1, 3, 5, 9)
- ✅ `SegmentCode.ts` - Segment codes (P, Q, R, S, T, U, Y)
- ✅ `ServiceType.ts` - Service types (01-04, 98)
- ✅ `OperationType.ts` - Operation types (C, D, E, I)
- ✅ `OccurrenceCode.ts` - CNAB240 occurrence codes (Remessa + Retorno)
- ✅ Tests: 15/15 passing

**Acceptance Criteria**:

- ✅ Enums match FEBRABAN CNAB240 tables
- ✅ JSDoc references specification
- ✅ Bank-agnostic codes

### 2.3 CNAB240 Parsers ✅

**Location**: `src/parsers/cnab240/`

**Status**: ✅ Complete (2026-01-21) - 51 tests passing

**Note**: Hierarchical parsing architecture implemented

**Implementation**:

- ✅ `LineParser.ts` - Base parsing utilities (25 tests)
  - Field extraction with 1-indexed positions
  - Type conversions (numeric, decimal, date)
  - Record type and segment code validation
- ✅ `FileHeaderParser.ts` - File header parser (16 tests)
- ✅ `SegmentPParser.ts` - Segment P parser
- ✅ `SegmentQParser.ts` - Segment Q parser
- ✅ `Cnab240Parser.ts` - Main hierarchical parser (10 integration tests)
  - File → Batches → Details → Segments structure
  - Batch grouping by record types
  - Segment grouping into detail records

**Acceptance Criteria**:

- ✅ Complete hierarchical parsing
- ✅ All mandatory segments (P, Q) parsed
- ✅ Batch structure properly assembled
- ✅ Integration tests with minimal valid file
- ✅ Error handling with ParseError

### 2.4 CNAB240 Generators ⏳

**Status**: 🚧 In Progress (2026-01-21)

**Location**: `src/generators/cnab240/`

**Progress**: 131 tests passing (+131 from Phase 2.3)

**TDD Strategy**: Line utilities → Record generators → Segment generators → Main generator

#### 2.4.1 Base Utilities ✅

- ✅ `LineGenerator.ts` - 240-character line formatting utilities (27 tests)
  - formatField (text/numeric padding)
  - formatNumericField (zero-padded integers)
  - formatDecimalField (implied decimals)
  - formatDateField (DDMMYYYY with UTC fix)
  - buildLine (field concatenation)

#### 2.4.2 Record Generators ✅

- ✅ `FileHeaderGenerator.ts` (8 tests) - File header (type 0)
  - 240-char line generation
  - Bank code, company info, agreement
  - Date/time formatting
  - Field validation
- ✅ `FileTrailerGenerator.ts` (11 tests) - File trailer (type 9)
  - Batch number always 9999
  - Total batches/records/accounts
  - Reserved fields handling
- ✅ `BatchHeaderGenerator.ts` (17 tests) - Batch header (type 1)
  - Operation/service types
  - Company information
  - Date formatting (recording/credit dates)
  - Messages and sequential numbering
- ✅ `BatchTrailerGenerator.ts` (13 tests) - Batch trailer (type 5)
  - Total records/slips/amounts
  - Simple/endorsed/collection totals
  - Reserved fields handling

#### 2.4.3 Segment Generators (REMESSA)

- ✅ `SegmentPGenerator.ts` (16 tests) - Payment data (segment P)
  - Bank/account information
  - Our number and portfolio code
  - Document number and dates
  - Payment amount with implied decimals
  - Interest, discount, IOF, rebate amounts
  - Protest and write-off configuration
  - Currency code
- ✅ `SegmentQGenerator.ts` (21 tests) - Payer data (segment Q)
  - Payer name and address
  - CPF/CNPJ handling (15 digits)
  - Postal code and city/state
  - Neighborhood/district
  - Occurrence code matching
  - Optional guarantor fields
- ✅ `SegmentRGenerator.ts` (18 tests) - Discount/fine/interest (segment R)
  - Second and third discount configuration
  - Fine configuration (fixed amount or percentage)
  - Payer information messages (lines 3 and 4)
  - Date-based discount/fine rules
  - Decimal formatting (values in BRL, formatted as cents)

#### 2.4.4 Segment Generators (RETORNO) - Deferred

- [ ] `SegmentTGenerator.ts` - Return movement
- [ ] `SegmentUGenerator.ts` - Return detail

#### 2.4.5 Main Generator

- ✅ `Cnab240Generator.ts` (17 tests) - Complete file orchestrator
  - Hierarchical generation (File → Batches → Details → Segments)
  - Handles multiple batches and details per batch
  - Mandatory segments P+Q, optional segment R
  - Validates input structure before generation
  - Integration with all component generators
  - Produces complete, spec-compliant CNAB240 files

**Acceptance Criteria**:

- ✅ All generators produce 240-character lines
- ✅ Field positioning matches FEBRABAN spec
- ✅ Validation before generation
- ✅ Decimal values formatted correctly (BRL → cents with 2 implied decimals)
- ✅ Text fields converted to uppercase automatically
- ✅ Date fields use UTC to avoid timezone issues
- ✅ Main orchestrator manages complete file generation
- ⏳ Round-trip tests: Parse → Generate → Parse (identical) - Next phase

**Status**: ✅ COMPLETE (148 tests passing)

### 2.5 CNAB240 Constants ✅

**Location**: `src/constants/cnab240/`

**Status**: ✅ Complete (2026-01-21)

- ✅ `LAYOUT_VERSION.ts` - CNAB240 layout version and file-level constants
  - LAYOUT_VERSION = '087' (FEBRABAN specification version)
  - FILE_TYPE_CODE, LINE_LENGTH (240), FILE_DENSITY
  - CURRENCY_CODE = '009' (BRL), BATCH_TRAILER_BANK
- ✅ `FIELD_SIZES.ts` - Standard field lengths for all records and segments
  - COMMON_FIELD_SIZES (40+ shared fields: bank code, dates, amounts, names, addresses)
  - FILE_HEADER_SIZES (layout version, file density, generation date/time)
  - BATCH_HEADER_SIZES (launch form, messages, warning codes)
  - SEGMENT_P_SIZES (20+ payment fields: amounts, interest, discount, protest)
  - SEGMENT_Q_SIZES (payer and guarantor information)
  - SEGMENT_R_SIZES (additional discounts and fine configuration)
  - BATCH_TRAILER_SIZES (detail count, slip count, total amounts)
  - FILE_TRAILER_SIZES (batch count, record count)
  - TOTAL_LINE_LENGTH validation constant
- ✅ `SEGMENT_POSITIONS.ts` - Exact byte positions for all fields
  - FILE_HEADER_POSITIONS (complete 240-character position map)
  - BATCH_HEADER_POSITIONS (all batch header fields)
  - SEGMENT_P_POSITIONS (payment data field positions)
  - SEGMENT_Q_POSITIONS (payer/guarantor field positions)
  - SEGMENT_R_POSITIONS (discount/fine field positions)
  - BATCH_TRAILER_POSITIONS (batch totals field positions)
  - FILE_TRAILER_POSITIONS (file totals field positions)
  - validatePositions() helper function (validates no gaps/overlaps)
- ✅ Barrel exports in `index.ts`
- ✅ Tests: 78/78 passing

**Acceptance Criteria**:

- ✅ All constants match FEBRABAN CNAB240 specification
- ✅ Position maps validated (start at 1, end at 240, no gaps/overlaps)
- ✅ Field sizes documented with character counts and descriptions
- ✅ All constants immutable (using `as const`)
- ✅ Type-safe with TypeScript literal types
- ✅ Comprehensive test coverage (78 tests)

**Status**: ✅ COMPLETE (78 tests passing)

### 2.6 CNAB240 Validators

**Status**: ✅ Complete

**Location**: `src/validators/cnab240/`

- ✅ `Cnab240Validator.ts` - Validate complete file (structure, sequence, counts)
- ✅ Unit tests: `tests/unit/validators/cnab240.test.ts`

**Acceptance Criteria**:

- Hierarchical structure validation
- Sequence validation
- Count validation
- Business rule validation
- Clear error messages

### 2.7 CNAB240 Schemas

**Location**: `src/schemas/cnab240/`

- ✅ `FileHeaderSchema.ts`
- ✅ `FileTrailerSchema.ts`
- ✅ `BatchHeaderSchema.ts`
- ✅ `BatchTrailerSchema.ts`
- ✅ `SegmentPSchema.ts`
- ✅ `SegmentQSchema.ts`
- ✅ `SegmentRSchema.ts`
- ⏳ `SegmentSSchema.ts` (deferred)
- ⏳ `SegmentTSchema.ts` (deferred)
- ⏳ `SegmentUSchema.ts` (deferred)
- ✅ `BatchSchema.ts`
- ✅ `Cnab240FileSchema.ts`
- ✅ Unit tests: `tests/unit/schemas/cnab240.test.ts`

**Acceptance Criteria**:

- Schemas validate CNAB240 structure
- Hierarchical validation
- Type inference works
- Unit tests

**Status**: ✅ Complete (P/Q/R + file/batch schemas)

### 2.8 CNAB240 Integration Tests

**Location**: `tests/integration/cnab240/`

- [ ] `cnab240-parse.test.ts`
- ✅ `cnab240-parser.test.ts` (existing)
- ✅ `cnab240-generator.test.ts`
- ✅ `cnab240-round-trip.test.ts`
- ✅ `cnab240-validation.test.ts`
- ✅ `cnab240-error-handling.test.ts`

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

**Status**: ✅ Complete

---

## Phase 3: Testing & Documentation

**Objective**: Achieve comprehensive test coverage and complete documentation.

**Duration**: ~2 weeks

### 3.1 Unit Test Coverage

**Target**: ≥ 90% coverage

- [ ] Review all units (formatters, validators, parsers, generators)
- [ ] Add missing unit tests
- ✅ Add unit tests for CNAB parser auto-detection
- ✅ Add unit tests for parseDateShort utility
- ✅ Add unit tests for CNAB240 Segment P/Q parsers
- ✅ Add unit tests for CNAB400 parser
- ✅ Add unit tests for CNAB400 header/trailer parsers
- ✅ Add unit tests for CNAB400 detail and return detail parsers
- ✅ Add unit tests for CNAB400 message, penalty, and guarantor parsers
- ✅ Add unit tests for CNAB generator factory
- ✅ Add unit tests for CNAB400 generators (records and file orchestration)
- [ ] Test edge cases
- [ ] Test error handling
- ✅ Run coverage report: `npm run test:coverage`

**Acceptance Criteria**:

- Line coverage ≥ 90%
- Branch coverage ≥ 85%
- Function coverage ≥ 90%
- All public APIs tested

### 3.2 Integration Test Coverage

**Target**: ≥ 80% coverage

- [x] CNAB400 end-to-end tests
- [x] CNAB240 end-to-end tests
- [x] Cross-format tests
- [x] Performance tests (large files)
- [x] Error scenario tests

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

- [x] `README.md` - Overview, installation, quick start
- [x] `doc/CNAB400-USAGE-GUIDE.md` - CNAB400 usage guide
- [x] `doc/CNAB240_GUIDE.md` - CNAB240 usage guide
- [x] `doc/MIGRATION.md` - Migration guide (if updating existing library)
- [x] `doc/EXAMPLES.md` - Code examples
- [x] `doc/FAQ.md` - Frequently asked questions

#### 3.3.3 Developer Guides

- [x] `CONTRIBUTING.md` - Contribution guidelines
- [x] `ARCHITECTURE.md` - Architecture overview
- [x] `TESTING.md` - Testing strategy
- [x] Update `.doc.md` files for all components

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

## Phase 3.5: Boleto HTML/PDF Generation ⏳

**Objective**: Generate bank slip documents in HTML and PDF formats for printing and digital delivery.

**Duration**: ~3 weeks

**Priority**: HIGH - Core feature for end-user applications

### 3.5.1 HTML Template Engine

**Location**: `src/templates/`

- [x] `BoletoTemplate.ts` - Base template interface
- [x] `ItauTemplate.ts` - Itaú bank slip HTML template
- [x] `BradescoTemplate.ts` - Bradesco bank slip HTML template
- [x] `BBTemplate.ts` - Banco do Brasil bank slip template
- [x] `GenericTemplate.ts` - Generic bank slip template (fallback)
- [x] `TemplateRenderer.ts` - Template rendering engine

**Features**:

- [x] Responsive HTML design
- [x] Print-optimized CSS
- [x] Customizable bank logos
- [x] Barcode rendering (SVG)
- [x] QR Code support (PIX integration)
- [x] Multiple layout options (simple, detailed, with instructions)
- [x] Localization support (pt-BR)

**Template Structure**:

```typescript
interface BoletoTemplateData {
  beneficiary: {
    name: string;
    document: string;
    address: string;
  };
  payer: {
    name: string;
    document: string;
    address: string;
  };
  payment: {
    documentNumber: string;
    ourNumber: string;
    amount: number;
    dueDate: Date;
    barcode: string;
    digitableLine: string;
    pix?: {
      payload: string;
      qrCodeSvg?: string;
    };
  };
  bank: {
    code: string;
    name: string;
    logo?: string;
  };
  instructions?: string[];
  additionalInfo?: Record<string, string>;
}
```

### 3.5.2 Barcode Generation

**Location**: `src/generators/barcode/`

- [x] `BarcodeGenerator.ts` - Generate barcode from CNAB data
- [x] `DigitableLineGenerator.ts` - Generate typeable barcode line
- [x] `BarcodeRenderer.ts` - Render barcode as SVG/PNG
- [x] `BarcodeValidator.ts` - Validate barcode check digits

**Barcode Types**:

- [x] Interleaved 2 of 5 (I2of5) - Standard bank slip barcode
- [x] SVG output for web display
- [x] PNG output for email/PDF
- [x] Configurable dimensions (width, height, quiet zones)

**Example**:

```typescript
import { generateBarcode } from '@linkiez/boleto-sdk';

const barcode = generateBarcode({
  bankCode: '341',
  amount: 15000, // R$ 150.00
  dueDate: new Date('2026-02-28'),
  ourNumber: '12345678',
  // ... other fields
});

// barcode.code: "34191234567890000015000012345678..."
// barcode.digitableLine: "34191.23456 78900.000015 00001.234567..."
// barcode.svg: "<svg>...</svg>"
```

### 3.5.3 PDF Generation

**Location**: `src/generators/pdf/`

**Dependencies**: Consider using `pdfkit` or `puppeteer`

- [x] `BoletoPdfGenerator.ts` - Main PDF generator
- [x] `PdfTemplate.ts` - PDF template configuration
- [x] `PdfRenderer.ts` - PDF content renderer for Direct PDF flow
- [x] `DirectPdfGenerator.ts` - Direct PDF generation (PDFKit approach)

**Approache**:

#### Direct PDF (PDFKit)

- Pros: Lightweight, no browser needed
- Cons: Manual positioning, more complex layout

**Features**:

- [x] A4 page size (210mm x 297mm)
- [x] Multiple boletos per page (configurable)
- [x] Print margins and bleed areas
- [x] High-quality barcode rendering
- [x] Embedded fonts for better compatibility
- [ ] PDF metadata (title, author, creation date)
- [x] Stream-based generation for large batches

**Example**:

```typescript
import { generateBoletoPdf } from '@linkiez/boleto-sdk';

const pdf = await generateBoletoPdf({
  boletos: [boletoData1, boletoData2],
  template: 'itau',
  options: {
    format: 'A4',
    boletosPerPage: 3,
    includeInstructions: true,
  },
});

// Save to file
await pdf.save('boletos.pdf');

// Or get as buffer
const buffer = await pdf.toBuffer();
```

### 3.5.4 QR Code Integration (PIX)

**Location**: `src/generators/qrcode/`

- [x] `QRCodeGenerator.ts` - Generate PIX QR codes
- [x] `PixPayloadGenerator.ts` - Generate PIX static payload
- [x] `QRCodeRenderer.ts` - Render QR code as SVG/PNG

**PIX QR Code Data**:

```typescript
interface PixQRCodeData {
  key: string; // PIX key (CPF, email, phone, random)
  amount: number;
  merchantName: string;
  merchantCity: string;
  transactionId: string;
  description?: string;
}
```

**Example**:

```typescript
import { generatePixQRCode } from '@linkiez/boleto-sdk';

const qrCode = generatePixQRCode({
  key: '12345678000195', // CNPJ PIX key
  amount: 150.0,
  merchantName: 'MY COMPANY LTDA',
  merchantCity: 'SAO PAULO',
  transactionId: 'INV001',
});

// qrCode.payload: "00020126580014br.gov.bcb.pix..."
// qrCode.svg: "<svg>...</svg>"
```

### 3.5.5 Email Integration Utilities

**Location**: `src/utils/email/`

- [ ] `EmailTemplateGenerator.ts` - Generate email with boleto attachment
- [ ] `EmailValidator.ts` - Validate email addresses
- [ ] `AttachmentHelper.ts` - Prepare PDF/HTML attachments

**Email Template**:

```typescript
interface EmailTemplate {
  to: string;
  subject: string;
  body: string; // HTML or plain text
  attachments: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}
```

**Example**:

```typescript
import { generateBoletoEmail } from '@linkiez/boleto-sdk';

const email = generateBoletoEmail({
  to: 'customer@example.com',
  boleto: boletoData,
  template: 'default',
  attachPdf: true,
  includePixQRCode: true,
});

// email.subject: "Boleto - Vencimento 28/02/2026"
// email.attachments: [{ filename: 'boleto.pdf', ... }]
```

### 3.5.6 Testing

**Location**: `tests/generators/`

- [ ] `barcode.test.ts` - Barcode generation tests
  - [x] Check digit validation
  - [x] Digitable line formatting
  - [x] SVG/PNG rendering
- [x] `html.test.ts` - HTML template tests
  - [x] Template rendering
  - [x] Data binding
  - [x] Responsive layout
- [x] `pdf.test.ts` - PDF generation tests
  - [x] PDF structure validation
- [x] `qrcode.test.ts` - QR code tests
  - [x] PIX payload generation
  - [x] QR code rendering
  - [x] Data validation

**Integration Tests**:

- [ ] Generate HTML from CNAB400 data
- [ ] Generate PDF from CNAB240 data
- [ ] Round-trip: CNAB → HTML → Visual verification
- [ ] Batch generation (1000+ boletos)
- [ ] Performance benchmarks

### 3.5.7 Documentation

- [ ] `doc/BOLETO-GENERATION.md` - Complete generation guide
  - [ ] HTML generation examples
  - [ ] PDF generation examples
  - [ ] Barcode usage
  - [ ] QR code integration
  - [ ] Email templates
  - [ ] Customization guide
- [ ] Update `README.md` with generation examples
- [ ] Update `API-REFERENCE.md` with new APIs

**Acceptance Criteria**:

- [ ] Generate valid HTML boleto from CNAB data
- [ ] Generate valid PDF boleto from CNAB data
- [ ] Barcode renders correctly (I2of5)
- [ ] Digitable line matches barcode
- [ ] QR code contains valid PIX payload
- [ ] PDF opens in all major viewers
- [ ] HTML displays correctly in all major browsers
- [ ] Print layout works correctly
- [ ] Performance: Generate 100 PDFs in < 5 seconds
- [ ] Test coverage ≥ 80%
- [ ] Documentation complete with examples

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

| Phase                            | Duration     | Status           | Deliverables                                          |
| -------------------------------- | ------------ | ---------------- | ----------------------------------------------------- |
| **Phase 0: Base Infrastructure** | 2 weeks      | ✅ Complete      | Common types, utils, errors, base schemas (152 tests) |
| **Phase 1: CNAB400**             | 4 weeks      | ✅ Complete      | Complete CNAB400 parsing/generation (96 tests)        |
| **Phase 2: CNAB240**             | 6 weeks      | ⏳ Pending       | Complete CNAB240 parsing/generation                   |
| **Phase 3: Testing & Docs**      | 2 weeks      | 🔄 In Progress   | ≥90% coverage, complete documentation                 |
| **Phase 4: Release**             | 1 week       | ⏳ Pending       | v1.0.0 published to npm                               |
| **Total**                        | **15 weeks** | **60% Complete** | Production-ready SDK                                  |

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

**Last Updated**: 2026-01-23
**Version**: 2.0
**Status**: Phase 1 Complete, Phase 2 Pending
