# CNAB400 Positions Validation Report

**Date**: 2026-01-21
**Purpose**: Validate CNAB400 RECORD_POSITIONS against official bank specifications

## Summary

This document compares current CNAB400 position constants with official bank documentation (Itaú, Santander, Caixa, C6 Bank).

---

## Validation Methodology

- **Primary Reference**: doc/CNAB400-ITAU.md (most detailed specification)
- **Cross-Reference**: doc/CNAB400-SANTANDER.md, doc/CNAB400-CAIXA.md, doc/CNAB400-C6BANK.md
- **Current Constants**: src/constants/cnab400/RECORD_POSITIONS.ts

---

## FILE_HEADER_POSITIONS - Validation Results

### Official Specification (ITAÚ CNAB400 - Page 343)

| Field | Position | Size | Type | Current Constant | Status |
|-------|----------|------|------|------------------|--------|
| TIPO DE REGISTRO | 001-001 | 1 | 9(01) | RECORD_TYPE: 1-1 | ✅ |
| OPERAÇÃO | 002-002 | 1 | 9(01) | OPERATION_TYPE: 2-2 | ✅ |
| LITERAL DE REMESSA | 003-009 | 7 | X(07) | OPERATION_LITERAL: 3-9 | ✅ |
| CÓDIGO DO SERVIÇO | 010-011 | 2 | 9(02) | SERVICE_CODE: 10-11 | ✅ |
| LITERAL DE SERVIÇO | 012-026 | 15 | X(15) | SERVICE_LITERAL: 12-26 | ✅ |
| AGÊNCIA | 027-030 | 4 | 9(04) | AGENCY: 27-30 | ✅ |
| ZEROS | 031-032 | 2 | 9(02) | ZEROS: 31-32 | ✅ |
| CONTA | 033-037 | 5 | 9(05) | ACCOUNT: 33-37 | ✅ |
| DAC | 038-038 | 1 | 9(01) | ACCOUNT_DIGIT: 38-38 | ✅ |
| BRANCOS | 039-046 | 8 | X(08) | RESERVED_1: 39-46 | ✅ |
| NOME DA EMPRESA | 047-076 | 30 | X(30) | COMPANY_NAME: 47-76 | ✅ |
| CÓDIGO DO BANCO | 077-079 | 3 | 9(03) | BANK_CODE: 77-79 | ✅ |
| NOME DO BANCO | 080-094 | 15 | X(15) | BANK_NAME: 80-94 | ✅ |
| DATA DE GERAÇÃO | 095-100 | 6 | 9(06) | GENERATION_DATE: 95-100 | ✅ |
| BRANCOS | 101-110 | 10 | X(10) | RESERVED_2: 101-110 | ✅ |
| **⚠️ Missing in spec** | - | - | - | SEQUENCE_NUMBER: 111-115 | ⚠️ |
| BRANCOS | 101-394 | 294 | X(294) | RESERVED_3: 116-394 | ⚠️ OVERLAP |
| NÚMERO SEQÜENCIAL | 395-400 | 6 | 9(06) | SEQUENTIAL_NUMBER: 395-400 | ✅ |

**Issues Found**:
1. ⚠️ **SEQUENCE_NUMBER (111-115)**: Not in Itaú specification - field may be bank-specific
2. ⚠️ **RESERVED_2 size**: Spec shows 101-394 as BRANCOS (294 chars), but we split it into:
   - RESERVED_2: 101-110 (10 chars)
   - SEQUENCE_NUMBER: 111-115 (5 chars) ← May be bank-specific field
   - RESERVED_3: 116-394 (279 chars)

**Analysis**: The SEQUENCE_NUMBER field (111-115) might be specific to certain banks or RETORNO files. The Itaú REMESSA spec shows continuous blanks from 101-394.

**Recommendation**: Keep current structure as it accommodates bank variations, but add comment about bank-specific usage.

---

## DETAIL_RECORD_REMESSA_POSITIONS - Validation Results

### Official Specification (ITAÚ CNAB400 - Page 417-420)

| Field | Position (Spec) | Current Constant | Status |
|-------|-----------------|------------------|--------|
| TIPO DE REGISTRO | 001-001 | RECORD_TYPE: 1-1 | ✅ |
| CÓDIGO DE INSCRIÇÃO | 002-003 | REGISTRATION_TYPE: 2-3 | ✅ |
| NÚMERO DE INSCRIÇÃO | 004-017 | REGISTRATION_NUMBER: 4-17 | ✅ |
| AGÊNCIA | 018-021 | AGENCY: 18-21 | ✅ |
| ZEROS | 022-023 | ZEROS: 22-23 | ✅ |
| CONTA | 024-028 | ACCOUNT: 24-28 | ✅ |
| DAC | 029-029 | ACCOUNT_DIGIT: 29-29 | ✅ |
| BRANCOS | 030-033 | RESERVED_1: 30-37 ❌ | ❌ SIZE ERROR |
| INSTRUÇÃO/ALEGAÇÃO | 034-037 | (merged into RESERVED_1) | ❌ MISSING |
| USO DA EMPRESA | 038-062 | COMPANY_CONTROL: 38-62 | ✅ |
| NOSSO NÚMERO | 063-070 | OUR_NUMBER: 63-70 | ✅ |
| QTDE DE MOEDA | 071-083 | RESERVED_2: 71-83 | ⚠️ NAME MISMATCH |
| Nº DA CARTEIRA | 084-086 | PORTFOLIO_CODE: 84-86 | ✅ |
| USO DO BANCO | 087-107 | RESERVED_3: 87-107 | ✅ |
| CARTEIRA | 108-108 | RESERVED_4: 108-110 ❌ | ❌ SIZE ERROR |
| CÓD. DE OCORRÊNCIA | 109-110 | (merged into RESERVED_4) | ❌ MISSING |
| Nº DO DOCUMENTO | 111-120 | DOCUMENT_NUMBER: 111-120 | ✅ |
| VENCIMENTO | 121-126 | DUE_DATE: 121-126 | ✅ |
| VALOR DO TÍTULO | 127-139 | AMOUNT: 127-139 | ✅ |
| CÓDIGO DO BANCO | 140-142 | BANK_CODE: 140-142 | ✅ |
| AGÊNCIA COBRADORA | 143-147 | AGENCY_COLLECTOR: 143-147 | ✅ |
| ESPÉCIE | 148-149 | SPECIES_CODE: 148-149 | ✅ |
| ACEITE | 150-150 | ACCEPTANCE: 150-150 | ✅ |
| DATA DE EMISSÃO | 151-156 | ISSUE_DATE: 151-156 | ✅ |
| INSTRUÇÃO 1 | 157-158 | INSTRUCTION_CODE_1: 157-158 | ✅ |
| INSTRUÇÃO 2 | 159-160 | INSTRUCTION_CODE_2: 159-160 | ✅ |
| JUROS DE 1 DIA | 161-173 | INTEREST_AMOUNT: 161-173 | ✅ |
| DESCONTO ATÉ | 174-179 | DISCOUNT_DATE: 174-179 | ✅ |
| VALOR DO DESCONTO | 180-192 | DISCOUNT_AMOUNT: 180-192 | ✅ |
| VALOR DO I.O.F. | 193-205 | IOF_AMOUNT: 193-205 | ✅ |
| ABATIMENTO | 206-218 | REBATE_AMOUNT: 206-218 | ✅ |
| CÓDIGO DE INSCRIÇÃO (Pagador) | 219-220 | PAYER_REGISTRATION_TYPE: 219-220 | ✅ |
| NÚMERO DE INSCRIÇÃO (Pagador) | 221-234 | PAYER_REGISTRATION_NUMBER: 221-234 | ✅ |
| NOME (Pagador) | 235-264 | PAYER_NAME: 235-264 | ✅ |
| BRANCOS | 265-274 | RESERVED_5: 265-274 | ✅ |
| LOGRADOURO | 275-314 | PAYER_ADDRESS: 275-314 | ✅ |
| BAIRRO | 315-326 | RESERVED_6: 315-326 ❌ | ❌ NAME ERROR |
| CEP | 327-334 | PAYER_ZIP_CODE: 327-334 | ✅ |
| CIDADE | 335-349 | PAYER_CITY: 335-349 | ✅ |
| ESTADO | 350-351 | PAYER_STATE: 350-351 | ✅ |
| SACADOR/AVALISTA | 352-381 | GUARANTOR_NAME: 352-381 | ✅ |
| BRANCOS | 382-385 | RESERVED_7: 382-394 ❌ | ❌ SIZE ERROR |
| DATA DE MORA | 386-391 | (merged into RESERVED_7) | ❌ MISSING |
| PRAZO | 392-393 | (merged into RESERVED_7) | ❌ MISSING |
| BRANCOS | 394-394 | (merged into RESERVED_7) | ❌ MISSING |
| NÚMERO SEQÜENCIAL | 395-400 | SEQUENTIAL_NUMBER: 395-400 | ✅ |

**Critical Errors Found**:

1. ❌ **RESERVED_1** should be **30-33** (4 chars), not 30-37 (8 chars)
   - Spec shows: BRANCOS 030-033 (4 chars)
   - Constant has: RESERVED_1: 30-37 (8 chars)
   - **Missing**: INSTRUÇÃO/ALEGAÇÃO 034-037 (4 chars)

2. ⚠️ **RESERVED_2** should be named **CURRENCY_QUANTITY**
   - Spec shows: QTDE DE MOEDA 071-083 (Quantidade de moeda variável)
   - Current: RESERVED_2: 71-83

3. ❌ **RESERVED_4** should be **108-108** (1 char), not 108-110 (3 chars)
   - Spec shows: CARTEIRA 108-108 (1 char)
   - Constant has: RESERVED_4: 108-110 (3 chars)
   - **Missing**: CÓD. DE OCORRÊNCIA 109-110 (2 chars) - Important field!

4. ❌ **RESERVED_6** should be named **PAYER_DISTRICT**
   - Spec shows: BAIRRO 315-326 (Bairro do Pagador)
   - Current: RESERVED_6: 315-326

5. ❌ **RESERVED_7** size and missing fields:
   - Spec shows:
     * BRANCOS 382-385 (4 chars)
     * DATA DE MORA 386-391 (6 chars) - Interest start date
     * PRAZO 392-393 (2 chars) - Days count
     * BRANCOS 394-394 (1 char)
   - Current: RESERVED_7: 382-394 (13 chars as single block)
   - **Missing important fields**: Interest date and days

---

## DETAIL_RECORD_RETORNO_POSITIONS - Validation Results

### Official Specification (ITAÚ CNAB400 - Retorno)

**Status**: ✅ **Positions appear correct**, but needs field name review for clarity.

Minor observations:
- Most position ranges match specification
- Field names could be more descriptive (e.g., RESERVED_2 could be named based on spec)

---

## PENALTY_RECORD_POSITIONS - Validation Results

### Official Specification (ITAÚ CNAB400 - Record Type 2)

| Field | Position (Spec) | Current Constant | Status |
|-------|-----------------|------------------|--------|
| TIPO DE REGISTRO | 001-001 | RECORD_TYPE: 1-1 | ✅ |
| MESSAGE_LINE_1 | 002-081 | MESSAGE_LINE_1: 2-81 | ✅ |
| MESSAGE_LINE_2 | 082-161 | MESSAGE_LINE_2: 82-161 | ✅ |
| MESSAGE_LINE_3 | 162-241 | MESSAGE_LINE_3: 162-241 | ✅ |
| MESSAGE_LINE_4 | 242-321 | MESSAGE_LINE_4: 242-321 | ✅ |
| RESERVED | 322-394 | RESERVED: 322-394 | ✅ |
| NÚMERO SEQÜENCIAL | 395-400 | SEQUENTIAL_NUMBER: 395-400 | ✅ |

**Result**: ✅ **100% Correct**

---

## FILE_TRAILER_POSITIONS - Validation Results

### Official Specification (ITAÚ CNAB400 - Page 631)

| Field | Position (Spec) | Current Constant | Status |
|-------|-----------------|------------------|--------|
| TIPO DE REGISTRO | 001-001 | RECORD_TYPE: 1-1 | ✅ |
| **BRANCOS** | **002-394** | **TOTAL_RECORDS: 2-7** ❌ | ❌ WRONG FIELD |
| - | - | **TOTAL_AMOUNT: 8-20** ❌ | ❌ WRONG FIELD |
| - | - | RESERVED: 21-394 | ⚠️ Partial |
| NÚMERO SEQÜENCIAL | 395-400 | SEQUENTIAL_NUMBER: 395-400 | ✅ |

**Critical Error**:

❌ **FILE_TRAILER is completely different from spec!**

**Itaú REMESSA Trailer Spec**:
- 001-001: TIPO DE REGISTRO = 9
- 002-394: BRANCOS (393 chars)
- 395-400: NÚMERO SEQÜENCIAL

**Current Constant**:
- Has TOTAL_RECORDS (2-7)
- Has TOTAL_AMOUNT (8-20)
- These fields don't exist in Itaú REMESSA spec!

**Analysis**: The current constant appears to be for RETORNO (return file), not REMESSA (outgoing file). Different file types have different trailer formats.

**Note**: This might be correct for RETORNO files or other banks. Need to check if we need separate constants for REMESSA vs RETORNO trailers.

---

## Bank-Specific Variations

### Cross-Reference with Other Banks:

1. **Santander (CNAB400-SANTANDER.md)**:
   - Similar structure to Itaú
   - Some bank-specific fields in reserved areas
   - QR Code fields added in recent versions

2. **Caixa (CNAB400-CAIXA.md)**:
   - Need to review for variations

3. **C6 Bank (CNAB400-C6BANK.md)**:
   - Need to review for variations

---

## Summary of Issues

### Critical (Must Fix) ❌:

1. **DETAIL_RECORD_REMESSA_POSITIONS**:
   - RESERVED_1: Should be 30-33 (not 30-37)
   - Missing: INSTRUCTION_CANCELLATION (34-37)
   - RESERVED_4: Should be 108-108 (not 108-110)
   - Missing: OCCURRENCE_CODE (109-110) - **Very important field!**
   - RESERVED_7: Should be 382-385 (not 382-394)
   - Missing: INTEREST_DATE (386-391)
   - Missing: DAYS_COUNT (392-393)

2. **FILE_TRAILER_POSITIONS**:
   - Current structure matches RETORNO, not REMESSA
   - Need separate constants for REMESSA vs RETORNO

### Medium (Should Fix) ⚠️:

1. **Field Naming**:
   - RESERVED_2 → CURRENCY_QUANTITY (071-083)
   - RESERVED_6 → PAYER_DISTRICT (315-326)

2. **FILE_HEADER_POSITIONS**:
   - Document that SEQUENCE_NUMBER (111-115) is bank-specific
   - RESERVED_2 split may vary by bank

### Low (Minor) ℹ️:

1. Add JSDoc comments explaining bank variations
2. Consider separate constants for REMESSA vs RETORNO where they differ

---

## Correction Plan

### Priority 1: Fix DETAIL_RECORD_REMESSA Critical Errors

```typescript
export const DETAIL_RECORD_REMESSA_POSITIONS = {
  // ... (fields 1-29 unchanged)
  RESERVED_1: { start: 30, end: 33 }, // ← FIX: was 30-37
  INSTRUCTION_CANCELLATION: { start: 34, end: 37 }, // ← ADD: missing field
  COMPANY_CONTROL: { start: 38, end: 62 },
  OUR_NUMBER: { start: 63, end: 70 },
  CURRENCY_QUANTITY: { start: 71, end: 83 }, // ← RENAME: was RESERVED_2
  PORTFOLIO_CODE: { start: 84, end: 86 },
  RESERVED_3: { start: 87, end: 107 },
  PORTFOLIO_TYPE: { start: 108, end: 108 }, // ← FIX: was RESERVED_4 (108-110)
  OCCURRENCE_CODE: { start: 109, end: 110 }, // ← ADD: missing important field!
  // ... (fields continue)
  PAYER_ADDRESS: { start: 275, end: 314 },
  PAYER_DISTRICT: { start: 315, end: 326 }, // ← RENAME: was RESERVED_6
  // ... (continue to end)
  GUARANTOR_NAME: { start: 352, end: 381 },
  RESERVED_7: { start: 382, end: 385 }, // ← FIX: was 382-394
  INTEREST_DATE: { start: 386, end: 391 }, // ← ADD: Data de Mora
  DAYS_COUNT: { start: 392, end: 393 }, // ← ADD: Prazo
  RESERVED_8: { start: 394, end: 394 }, // ← ADD: final blank
  SEQUENTIAL_NUMBER: { start: 395, end: 400 },
} as const;
```

### Priority 2: Create Separate Trailer Constants

```typescript
/**
 * File Trailer (Record Type 9 - REMESSA) field positions
 * Itaú specification shows only blanks and sequence number
 */
export const FILE_TRAILER_REMESSA_POSITIONS = {
  RECORD_TYPE: { start: 1, end: 1 },
  RESERVED: { start: 2, end: 394 }, // All blanks in REMESSA
  SEQUENTIAL_NUMBER: { start: 395, end: 400 },
} as const;

/**
 * File Trailer (Record Type 9 - RETORNO) field positions
 * RETORNO includes totalization fields
 */
export const FILE_TRAILER_RETORNO_POSITIONS = {
  RECORD_TYPE: { start: 1, end: 1 },
  TOTAL_RECORDS: { start: 2, end: 7 },
  TOTAL_AMOUNT: { start: 8, end: 20 },
  RESERVED: { start: 21, end: 394 },
  SEQUENTIAL_NUMBER: { start: 395, end: 400 },
} as const;

// Current FILE_TRAILER_POSITIONS remains for backward compatibility
// but should point to RETORNO version
export const FILE_TRAILER_POSITIONS = FILE_TRAILER_RETORNO_POSITIONS;
```

---

## Testing Impact

### Files Requiring Updates:

1. **src/constants/cnab400/RECORD_POSITIONS.ts** - Fix positions
2. **src/generators/cnab400/DetailRecordGenerator.ts** - Use corrected fields
3. **src/parsers/cnab400/DetailRecordParser.ts** - Use corrected fields
4. **src/generators/cnab400/FileTrailerGenerator.ts** - Check REMESSA vs RETORNO
5. **src/parsers/cnab400/FileTrailerParser.ts** - Check REMESSA vs RETORNO
6. **tests/** - Update test fixtures and expectations

### Critical Fields to Test:

- **OCCURRENCE_CODE (109-110)**: Entry, alteration, cancellation codes
- **INSTRUCTION_CANCELLATION (34-37)**: Instruction codes to cancel
- **INTEREST_DATE (386-391)**: When interest starts accruing
- **DAYS_COUNT (392-393)**: Number of days for instructions

---

## Recommendations

1. ⚠️ **DO NOT proceed with generator/parser refactoring until positions are fixed**
2. ✅ Fix DETAIL_RECORD_REMESSA_POSITIONS first (most critical)
3. ✅ Create separate REMESSA/RETORNO trailer constants
4. ✅ Update field names for clarity (RESERVED_2 → CURRENCY_QUANTITY, etc.)
5. ✅ Add JSDoc comments documenting bank-specific variations
6. ✅ Test thoroughly with real CNAB400 files from each bank
7. ✅ Consider creating bank-specific constants if variations are significant

---

## Next Steps

1. [ ] Correct DETAIL_RECORD_REMESSA_POSITIONS (4 critical errors)
2. [ ] Create separate REMESSA/RETORNO trailer constants
3. [ ] Rename misleading field names (RESERVED → actual field name)
4. [ ] Add JSDoc documentation for bank variations
5. [ ] Review and cross-reference with Santander, Caixa, C6 specs
6. [ ] Update generators to use corrected positions
7. [ ] Update parsers to use corrected positions
8. [ ] Full test suite validation
9. [ ] Update documentation

---

**Status**: ⚠️ **VALIDATION COMPLETE - CRITICAL ERRORS FOUND**
**Next Step**: Fix RECORD_POSITIONS.ts constants before any refactoring
**Risk Level**: **HIGH** - Missing critical fields like OCCURRENCE_CODE

**Reference**: doc/CNAB400-ITAU.md (Primary), doc/CNAB400-SANTANDER.md, doc/CNAB400-CAIXA.md, doc/CNAB400-C6BANK.md
