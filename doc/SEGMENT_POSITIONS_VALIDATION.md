# Segment Positions Validation Report

**Date**: 2026-01-21
**Purpose**: Validate SEGMENT_P/Q/R_POSITIONS against official FEBRABAN CNAB240 specification

## Summary

This document compares current constant definitions with the official FEBRABAN specification (doc/CNAB240-FEBRABAN.md).

---

## Segment P - Validation Results

### Fields 1-17: ✅ CORRECT (Positions Match)

| Field | Current Constant | Spec Position | Status |
|-------|------------------|---------------|--------|
| BANK_CODE | 1-3 | 1-3 | ✅ |
| BATCH_NUMBER | 4-7 | 4-7 | ✅ |
| RECORD_TYPE | 8-8 | 8-8 | ✅ |
| RECORD_NUMBER | 9-13 | 9-13 | ✅ |
| SEGMENT_CODE | 14-14 | 14-14 | ✅ |
| RESERVED_1 | 15-15 | 15-15 | ✅ |
| MOVEMENT_CODE | 16-17 | 16-17 | ✅ |
| AGENCY | 18-22 | 18-22 | ✅ |
| AGENCY_DIGIT | 23-23 | 23-23 | ✅ |
| ACCOUNT | 24-35 | 24-35 | ✅ |
| ACCOUNT_DIGIT | 36-36 | 36-36 | ✅ |
| ACCOUNT_DV | 37-37 | 37-37 | ✅ |
| DOCUMENT_NUMBER | 38-57 | 38-57 | ✅ |
| PORTFOLIO | 58-58 | 58-58 | ✅ |
| BOLETO_TYPE | 59-59 | 59-59 | ✅ |
| BOLETO_FORM | 60-60 | 60-60 | ✅ |
| DOCUMENT_PRINT | 61-61 | 61-61 | ✅ |

### ⚠️ ERRORS FOUND: Fields 18-42

**CRITICAL**: Current constants have WRONG positions from field 18 onwards!

| Field # | FEBRABAN Spec | Current Constant | Status |
|---------|---------------|------------------|--------|
| **18.3P** | POSTING_FORM: 62-62 (Distribution) | POSTING_FORM: 62-62 | ✅ |
| **19.3P** | DOCUMENT_TYPE: **63-77** (15 chars) | DOCUMENT_TYPE: **63-63** (1 char) ❌ | ❌ WRONG SIZE |
| **20.3P** | DUE_DATE: **78-85** (8 chars) | DUE_DATE: **80-87** ❌ | ❌ WRONG OFFSET |
| **21.3P** | AMOUNT: **86-100** (15 chars, 13+2) | AMOUNT: **88-102** ❌ | ❌ WRONG OFFSET |
| **22.3P** | AGENCY_COLLECTOR: **101-105** | AGENCY_COLLECTOR: **103-107** ❌ | ❌ WRONG OFFSET |
| **23.3P** | AGENCY_COLLECTOR_DIGIT: **106-106** | AGENCY_COLLECTOR_DIGIT: **108-108** ❌ | ❌ WRONG OFFSET |
| **24.3P** | DOCUMENT_SPECIES: **107-108** | DOCUMENT_SPECIES: **109-110** ❌ | ❌ WRONG OFFSET |
| **25.3P** | ACCEPTANCE: **109-109** | ACCEPTANCE: **111-111** ❌ | ❌ WRONG OFFSET |
| **26.3P** | ISSUE_DATE: **110-117** (8 chars) | ISSUE_DATE: **64-71** ❌ | ❌ COMPLETELY WRONG |
| **27.3P** | INTEREST_CODE: **118-118** | INTEREST_CODE: **115-115** ❌ | ❌ WRONG OFFSET |
| **28.3P** | INTEREST_DATE: **119-126** | INTEREST_DATE: **116-123** ❌ | ❌ WRONG OFFSET |
| **29.3P** | INTEREST_AMOUNT: **127-141** | INTEREST_AMOUNT: **124-138** ❌ | ❌ WRONG OFFSET |
| **30.3P** | DISCOUNT_CODE: **142-142** | DISCOUNT_CODE: **139-139** ❌ | ❌ WRONG OFFSET |
| **31.3P** | DISCOUNT_DATE: **143-150** | DISCOUNT_DATE: **140-147** ❌ | ❌ WRONG OFFSET |
| **32.3P** | DISCOUNT_AMOUNT: **151-165** | DISCOUNT_AMOUNT: **148-162** ❌ | ❌ WRONG OFFSET |
| **33.3P** | IOF_AMOUNT: **166-180** | IOF_AMOUNT: **163-177** ❌ | ❌ WRONG OFFSET |
| **34.3P** | REBATE_AMOUNT: **181-195** | REBATE_AMOUNT: **178-192** ❌ | ❌ WRONG OFFSET |
| **35.3P** | COMPANY_USE: **196-220** (25 chars) | MISSING ❌ | ❌ FIELD MISSING |
| **36.3P** | PROTEST_CODE: **221-221** | PROTEST_CODE: **195-195** ❌ | ❌ WRONG OFFSET |
| **37.3P** | PROTEST_DAYS: **222-223** | PROTEST_DAYS: **196-197** ❌ | ❌ WRONG OFFSET |
| **38.3P** | LOW_CODE: **224-224** | LOW_CODE: **198-198** ❌ | ❌ WRONG OFFSET |
| **39.3P** | LOW_DAYS: **225-227** | LOW_DAYS: **199-201** ❌ | ❌ WRONG OFFSET |
| **40.3P** | CURRENCY_CODE: **228-229** | CURRENCY_CODE: **202-203** ❌ | ❌ WRONG OFFSET |
| **41.3P** | CONTRACT_NUMBER: **230-239** (10 chars) | MISSING ❌ | ❌ FIELD MISSING |
| **42.3P** | FREE_USE: **240-240** | RESERVED_2: **204-240** ❌ | ❌ WRONG SIZE |

**Extra fields in current constant (not in spec)**:
- OCCURRENCE_CODE: 193-194 ❌ (NOT IN REMESSA SEGMENT P)
- CURRENCY: 112-114 ❌ (NOT IN SPEC)
- CREDIT_DATE: 72-79 ❌ (NOT IN SPEC)

### Root Cause Analysis

**The error cascade started at field 19.3P**:
- Spec says: Nº do Documento de Cobrança = positions **63-77** (15 characters)
- Current constant has: DOCUMENT_TYPE = positions **63-63** (1 character)
- This caused a **14-character offset error** in all subsequent fields!

**Missing fields that should exist**:
1. Field between 63-77 was incorrectly split
2. COMPANY_USE (Identificação do Título na Empresa): **196-220** (25 chars) - MISSING
3. CONTRACT_NUMBER (Nº do Contrato da Operação de Créd.): **230-239** (10 chars) - MISSING

---

## Segment Q - Validation Results

### All Fields: ✅ CORRECT

| Field | Current Constant | Spec Position | Status |
|-------|------------------|---------------|--------|
| BANK_CODE | 1-3 | 1-3 | ✅ |
| BATCH_NUMBER | 4-7 | 4-7 | ✅ |
| RECORD_TYPE | 8-8 | 8-8 | ✅ |
| RECORD_NUMBER | 9-13 | 9-13 | ✅ |
| SEGMENT_CODE | 14-14 | 14-14 | ✅ |
| RESERVED_1 | 15-15 | 15-15 | ✅ |
| MOVEMENT_CODE | 16-17 | 16-17 | ✅ |
| PAYER_PERSON_TYPE | 18-18 | 18-18 | ✅ |
| PAYER_TAX_ID | 19-33 | 19-33 | ✅ |
| PAYER_NAME | 34-73 | 34-73 | ✅ |
| PAYER_ADDRESS | 74-113 | 74-113 | ✅ |
| PAYER_DISTRICT | 114-128 | 114-128 | ✅ |
| PAYER_ZIP_CODE | 129-136 | 129-136 | ✅ |
| PAYER_CITY | 137-151 | 137-151 | ✅ |
| PAYER_STATE | 152-153 | 152-153 | ✅ |
| GUARANTOR_PERSON_TYPE | 154-154 | 154-154 | ✅ |
| GUARANTOR_TAX_ID | 155-169 | 155-169 | ✅ |
| GUARANTOR_NAME | 170-209 | 170-209 | ✅ |
| BANK_CORRESPONDENT_CODE | 210-212 | 210-212 | ✅ |
| BANK_CORRESPONDENT_DOCUMENT | 213-232 | 213-232 | ✅ |
| RESERVED_2 | 233-240 | 233-240 | ✅ |

**Result**: Segment Q is **100% correct** ✅

---

## Segment R - Validation Results

### ⚠️ Field Name Issues (Positions Correct, Names Wrong)

| Field # | FEBRABAN Spec | Current Constant | Status |
|---------|---------------|------------------|--------|
| 01-07 | ✅ Control fields | ✅ Control fields | ✅ |
| **08.3R** | DISCOUNT_2_CODE: 18-18 | DISCOUNT_2_CODE: 18-18 | ✅ |
| **09.3R** | DISCOUNT_2_DATE: 19-26 | DISCOUNT_2_DATE: 19-26 | ✅ |
| **10.3R** | DISCOUNT_2_AMOUNT: 27-41 | DISCOUNT_2_AMOUNT: 27-41 | ✅ |
| **11.3R** | DISCOUNT_3_CODE: 42-42 | DISCOUNT_3_CODE: 42-42 | ✅ |
| **12.3R** | DISCOUNT_3_DATE: 43-50 | DISCOUNT_3_DATE: 43-50 | ✅ |
| **13.3R** | DISCOUNT_3_AMOUNT: 51-65 | DISCOUNT_3_AMOUNT: 51-65 | ✅ |
| **14.3R** | FINE_CODE: 66-66 | FINE_CODE: 66-66 | ✅ |
| **15.3R** | FINE_DATE: 67-74 | FINE_DATE: 67-74 | ✅ |
| **16.3R** | FINE_AMOUNT: 75-89 | FINE_AMOUNT: 75-89 | ✅ |
| **17.3R** | PAYER_INFO: 90-99 | PAYER_INFO: 90-99 | ✅ |
| **18.3R** | MESSAGE_3: 100-139 | MESSAGE_3: 100-139 | ✅ |
| **19.3R** | MESSAGE_4: 140-179 | MESSAGE_4: 140-179 | ✅ |
| **20.3R** | RESERVED: **180-199** | RESERVED_2: **180-199** | ✅ Position correct |
| **21.3R** | OCCURRENCE_CODE_COMPLEMENT: **200-207** | OCCURRENCE_CODE_COMPLEMENT: **200-207** | ✅ |
| **22.3R** | DEBIT_BANK_CODE: **208-210** | DEBIT_BANK_CODE: **208-210** | ✅ |
| **23.3R** | DEBIT_AGENCY: **211-215** | DEBIT_AGENCY: **211-215** | ✅ |
| **24.3R** | DEBIT_AGENCY_DIGIT: **216-216** | DEBIT_AGENCY_DIGIT: **216-216** | ✅ |
| **25.3R** | DEBIT_ACCOUNT: **217-228** | DEBIT_ACCOUNT: **217-228** | ✅ |
| **26.3R** | DEBIT_ACCOUNT_DIGIT: **229-229** | DEBIT_ACCOUNT_DIGIT: **229-229** | ✅ |
| **27.3R** | DEBIT_ACCOUNT_DV: **230-230** | DEBIT_ACCOUNT_DV: **230-230** | ✅ |
| **28.3R** | DEBIT_NOTICE_EMISSION: **231-231** | ⚠️ MISSING | ⚠️ FIELD MISSING |
| **29.3R** | RESERVED: **232-240** (9 chars) | RESERVED_3: **231-240** (10 chars) ❌ | ❌ SIZE OFF BY 1 |

**Issues Found**:
1. ⚠️ DEBIT_NOTICE_EMISSION (Ident. da Emissão do Aviso Déb.): Position **231-231** is MISSING
2. ❌ RESERVED_3 should be **232-240** (9 chars), not 231-240 (10 chars)

**Result**: Segment R is **95% correct** (minor offset error at end)

---

## Correction Plan

### Priority 1: FIX SEGMENT_P_POSITIONS (CRITICAL)

The entire Segment P constant needs to be rewritten based on official spec:

```typescript
export const SEGMENT_P_POSITIONS = {
  // Fields 01-17: ✅ Already correct (1-62)
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RECORD_NUMBER: { start: 9, end: 13 },
  SEGMENT_CODE: { start: 14, end: 14 },
  RESERVED_1: { start: 15, end: 15 },
  MOVEMENT_CODE: { start: 16, end: 17 },
  AGENCY: { start: 18, end: 22 },
  AGENCY_DIGIT: { start: 23, end: 23 },
  ACCOUNT: { start: 24, end: 35 },
  ACCOUNT_DIGIT: { start: 36, end: 36 },
  ACCOUNT_DV: { start: 37, end: 37 },
  DOCUMENT_NUMBER: { start: 38, end: 57 }, // Nosso Número
  PORTFOLIO: { start: 58, end: 58 }, // Carteira
  REGISTRATION_FORM: { start: 59, end: 59 }, // Forma de Cadastramento
  DOCUMENT_TYPE: { start: 60, end: 60 }, // Tipo de Documento
  BOLETO_EMISSION: { start: 61, end: 61 }, // Emissão do Boleto
  BOLETO_DISTRIBUTION: { start: 62, end: 62 }, // Distribuição do Boleto

  // Fields 19-42: ❌ All need to be corrected
  BILLING_DOCUMENT_NUMBER: { start: 63, end: 77 }, // Nº do Documento de Cobrança (15 chars!)
  DUE_DATE: { start: 78, end: 85 }, // Data de Vencimento
  AMOUNT: { start: 86, end: 100 }, // Valor do Título (15 chars, 13+2)
  COLLECTION_AGENCY: { start: 101, end: 105 }, // Agência Cobradora
  COLLECTION_AGENCY_DIGIT: { start: 106, end: 106 }, // DV da Agência
  DOCUMENT_SPECIES: { start: 107, end: 108 }, // Espécie do Título
  ACCEPTANCE: { start: 109, end: 109 }, // Aceite
  ISSUE_DATE: { start: 110, end: 117 }, // Data de Emissão
  INTEREST_CODE: { start: 118, end: 118 }, // Código do Juros
  INTEREST_DATE: { start: 119, end: 126 }, // Data do Juros
  INTEREST_AMOUNT: { start: 127, end: 141 }, // Valor/Taxa do Juros (15 chars, 13+2)
  DISCOUNT_CODE: { start: 142, end: 142 }, // Código do Desconto 1
  DISCOUNT_DATE: { start: 143, end: 150 }, // Data do Desconto 1
  DISCOUNT_AMOUNT: { start: 151, end: 165 }, // Valor do Desconto 1 (15 chars, 13+2)
  IOF_AMOUNT: { start: 166, end: 180 }, // Valor do IOF (15 chars, 13+2)
  REBATE_AMOUNT: { start: 181, end: 195 }, // Valor do Abatimento (15 chars, 13+2)
  COMPANY_IDENTIFICATION: { start: 196, end: 220 }, // Identificação na Empresa (25 chars)
  PROTEST_CODE: { start: 221, end: 221 }, // Código para Protesto
  PROTEST_DAYS: { start: 222, end: 223 }, // Prazo para Protesto
  LOW_RETURN_CODE: { start: 224, end: 224 }, // Código para Baixa/Devolução
  LOW_RETURN_DAYS: { start: 225, end: 227 }, // Prazo para Baixa/Devolução
  CURRENCY_CODE: { start: 228, end: 229 }, // Código da Moeda
  CONTRACT_NUMBER: { start: 230, end: 239 }, // Nº do Contrato (10 chars)
  FREE_USE: { start: 240, end: 240 }, // Uso Livre
} as const;
```

### Priority 2: FIX SEGMENT_R_POSITIONS (Minor)

Add missing field and adjust reserved area:

```typescript
export const SEGMENT_R_POSITIONS = {
  // ... (all existing fields 1-230 are correct)
  DEBIT_ACCOUNT_DV: { start: 230, end: 230 },
  DEBIT_NOTICE_EMISSION: { start: 231, end: 231 }, // ← ADD THIS
  RESERVED_3: { start: 232, end: 240 }, // ← CHANGE from 231-240
} as const;
```

### Priority 3: SEGMENT_Q_POSITIONS

**NO CHANGES NEEDED** ✅ - Already 100% correct!

---

## Impact Assessment

### Files Affected by SEGMENT_P Fix:

1. **src/generators/cnab240/SegmentPGenerator.ts**
   - ~40-50 position references need updating
   - Field name changes required
   - Logic review needed (especially BILLING_DOCUMENT_NUMBER vs DOCUMENT_TYPE)

2. **src/parsers/cnab240/SegmentPParser.ts**
   - ~40-50 position references need updating
   - extractField calls need adjustment
   - Field mapping review

3. **src/types/cnab240/SegmentP.ts**
   - Type definitions may need field name updates
   - Add missing fields: COMPANY_IDENTIFICATION, CONTRACT_NUMBER

4. **tests/unit/generators/cnab240/SegmentPGenerator.test.ts**
   - Test data may need adjustment
   - Verify test assertions still valid

5. **tests/unit/parsers/cnab240/SegmentPParser.test.ts**
   - Test fixtures may need regeneration
   - Update expected values

### Files Affected by SEGMENT_R Fix:

1. **src/generators/cnab240/SegmentRGenerator.ts**
   - Adjust RESERVED_3 (change from position 231 to 232)
   - Add DEBIT_NOTICE_EMISSION at position 231

2. **src/parsers/cnab240/SegmentRParser.ts**
   - Adjust RESERVED_3 extraction
   - Add DEBIT_NOTICE_EMISSION extraction

3. **src/types/cnab240/SegmentR.ts**
   - Add debitNoticeEmission field

4. **tests/** - Minor updates for Segment R tests

---

## Testing Strategy

### Phase 1: Validate Constant Corrections

```bash
# After fixing SEGMENT_POSITIONS.ts:
npm test -- SEGMENT_POSITIONS.test.ts
```

### Phase 2: Update & Test Generators

```bash
# After updating SegmentPGenerator.ts:
npm test -- SegmentPGenerator.test.ts

# After updating SegmentRGenerator.ts:
npm test -- SegmentRGenerator.test.ts

# SegmentQGenerator should not change:
npm test -- SegmentQGenerator.test.ts  # Should still pass
```

### Phase 3: Full Integration

```bash
# Run all tests:
npm test

# Expected: All 619+ tests pass
```

---

## Recommendations

1. ⚠️ **DO NOT proceed with refactoring until constants are fixed**
2. ✅ Fix SEGMENT_P_POSITIONS first (most critical)
3. ✅ Fix SEGMENT_R_POSITIONS (minor)
4. ✅ Keep SEGMENT_Q_POSITIONS as-is (already correct)
5. ✅ Update generators and parsers AFTER constants are corrected
6. ✅ Test thoroughly at each step
7. ✅ Use incremental commits for rollback safety

---

## Next Actions

1. [ ] Correct SEGMENT_P_POSITIONS in constants/cnab240/SEGMENT_POSITIONS.ts
2. [ ] Correct SEGMENT_R_POSITIONS in constants/cnab240/SEGMENT_POSITIONS.ts
3. [ ] Run tests to ensure no regressions
4. [ ] Commit: "fix(cnab240): correct SEGMENT_P and SEGMENT_R positions to match FEBRABAN spec"
5. [ ] Update SegmentPGenerator.ts with corrected constants
6. [ ] Update SegmentQGenerator.ts (already correct constants)
7. [ ] Update SegmentRGenerator.ts with corrected constants
8. [ ] Update all parsers
9. [ ] Full test suite validation
10. [ ] Final commit

---

**Status**: ⚠️ VALIDATION COMPLETE - ERRORS FOUND
**Next Step**: Fix SEGMENT_POSITIONS.ts constants before any refactoring
**Risk Level**: HIGH if constants not corrected first
