/**
 * CNAB240 Segment Field Position Maps
 *
 * Field position definitions for all CNAB240 segments.
 * Positions are 1-indexed (first character is position 1).
 *
 * @module constants/cnab240/SEGMENT_POSITIONS
 */

/**
 * File Header (Record Type 0) field positions
 * Total: 240 characters
 */
export const FILE_HEADER_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RESERVED_1: { start: 9, end: 17 },
  PERSON_TYPE: { start: 18, end: 18 },
  TAX_ID: { start: 19, end: 32 },
  AGREEMENT_CODE: { start: 33, end: 52 },
  AGENCY: { start: 53, end: 57 },
  AGENCY_DIGIT: { start: 58, end: 58 },
  ACCOUNT: { start: 59, end: 70 },
  ACCOUNT_DIGIT: { start: 71, end: 71 },
  ACCOUNT_DV: { start: 72, end: 72 },
  COMPANY_NAME: { start: 73, end: 102 },
  BANK_NAME: { start: 103, end: 132 },
  RESERVED_2: { start: 133, end: 142 },
  FILE_CODE: { start: 143, end: 143 },
  GENERATION_DATE: { start: 144, end: 151 },
  GENERATION_TIME: { start: 152, end: 157 },
  FILE_SEQUENCE: { start: 158, end: 163 },
  LAYOUT_VERSION: { start: 164, end: 166 },
  FILE_DENSITY: { start: 167, end: 171 },
  RESERVED_BANK: { start: 172, end: 191 },
  RESERVED_COMPANY: { start: 192, end: 211 },
  RESERVED_3: { start: 212, end: 240 },
} as const;

/**
 * Batch Header (Record Type 1) field positions
 * Total: 240 characters
 * Based on original implementation for Collection (Cobrança)
 */
export const BATCH_HEADER_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  OPERATION_TYPE: { start: 9, end: 9 },
  SERVICE_TYPE: { start: 10, end: 11 },
  SERVICE_VERSION: { start: 12, end: 13 },
  RESERVED_1: { start: 14, end: 14 },
  FORM_TYPE: { start: 15, end: 17 },
  PERSON_TYPE: { start: 18, end: 18 },
  TAX_ID: { start: 19, end: 32 }, // CPF/CNPJ (14 positions)
  AGREEMENT_CODE: { start: 33, end: 52 },
  AGENCY: { start: 53, end: 57 },
  AGENCY_DIGIT: { start: 58, end: 58 },
  ACCOUNT: { start: 59, end: 70 },
  ACCOUNT_DIGIT: { start: 71, end: 71 },
  ACCOUNT_DV: { start: 72, end: 72 },
  COMPANY_NAME: { start: 73, end: 102 },
  MESSAGE_1: { start: 103, end: 142 },
  MESSAGE_2: { start: 143, end: 182 },
  RETURN_NUMBER: { start: 183, end: 190 },
  RETURN_DATE: { start: 191, end: 198 },
  CREDIT_DATE: { start: 199, end: 206 },
  RESERVED_2: { start: 207, end: 240 },
} as const;

/**
 * Segment P (Record Type 3, Segment P) field positions
 * Total: 240 characters
 *
 * CORRECTED TO MATCH FEBRABAN CNAB240 SPECIFICATION
 * Source: doc/CNAB240-FEBRABAN.md - Registro Detalhe - Segmento P (Obrigatório - Remessa)
 */
export const SEGMENT_P_POSITIONS = {
  // Control fields (01.3P - 07.3P)
  BANK_CODE: { start: 1, end: 3 }, // 01.3P - Código do Banco
  BATCH_NUMBER: { start: 4, end: 7 }, // 02.3P - Lote de Serviço
  RECORD_TYPE: { start: 8, end: 8 }, // 03.3P - Tipo de Registro
  RECORD_NUMBER: { start: 9, end: 13 }, // 04.3P - Nº Sequencial do Registro
  SEGMENT_CODE: { start: 14, end: 14 }, // 05.3P - Código do Segmento
  RESERVED_1: { start: 15, end: 15 }, // 06.3P - Uso Exclusivo FEBRABAN/CNAB
  MOVEMENT_CODE: { start: 16, end: 17 }, // 07.3P - Código de Movimento Remessa

  // Account fields (08.3P - 12.3P)
  AGENCY: { start: 18, end: 22 }, // 08.3P - Agência Mantenedora da Conta
  AGENCY_DIGIT: { start: 23, end: 23 }, // 09.3P - Dígito Verificador da Agência
  ACCOUNT: { start: 24, end: 35 }, // 10.3P - Número da Conta Corrente
  ACCOUNT_DIGIT: { start: 36, end: 36 }, // 11.3P - Dígito Verificador da Conta
  ACCOUNT_DV: { start: 37, end: 37 }, // 12.3P - Dígito Verificador Ag/Conta

  // Document identification (13.3P - 19.3P)
  DOCUMENT_NUMBER: { start: 38, end: 57 }, // 13.3P - Nosso Número (20 chars)
  PORTFOLIO: { start: 58, end: 58 }, // 14.3P - Código da Carteira
  REGISTRATION_FORM: { start: 59, end: 59 }, // 15.3P - Forma de Cadastramento
  DOCUMENT_TYPE: { start: 60, end: 60 }, // 16.3P - Tipo de Documento
  BOLETO_EMISSION: { start: 61, end: 61 }, // 17.3P - Identificação da Emissão do Boleto
  BOLETO_DISTRIBUTION: { start: 62, end: 62 }, // 18.3P - Identificação da Distribuição
  BILLING_DOCUMENT_NUMBER: { start: 63, end: 77 }, // 19.3P - Nº do Documento de Cobrança (15 chars)

  // Payment details (20.3P - 26.3P)
  DUE_DATE: { start: 78, end: 85 }, // 20.3P - Data de Vencimento (DDMMAAAA)
  AMOUNT: { start: 86, end: 100 }, // 21.3P - Valor Nominal do Título (15 chars, 13+2 decimal)
  COLLECTION_AGENCY: { start: 101, end: 105 }, // 22.3P - Agência Encarregada da Cobrança
  COLLECTION_AGENCY_DIGIT: { start: 106, end: 106 }, // 23.3P - Dígito Verificador da Agência
  DOCUMENT_SPECIES: { start: 107, end: 108 }, // 24.3P - Espécie do Título
  ACCEPTANCE: { start: 109, end: 109 }, // 25.3P - Identificação de Título Aceito/Não Aceito
  ISSUE_DATE: { start: 110, end: 117 }, // 26.3P - Data da Emissão do Título (DDMMAAAA)

  // Interest and discount (27.3P - 34.3P)
  INTEREST_CODE: { start: 118, end: 118 }, // 27.3P - Código do Juros de Mora
  INTEREST_DATE: { start: 119, end: 126 }, // 28.3P - Data do Juros de Mora (DDMMAAAA)
  INTEREST_AMOUNT: { start: 127, end: 141 }, // 29.3P - Juros de Mora por Dia/Taxa (15 chars, 13+2 decimal)
  DISCOUNT_CODE: { start: 142, end: 142 }, // 30.3P - Código do Desconto 1
  DISCOUNT_DATE: { start: 143, end: 150 }, // 31.3P - Data do Desconto 1 (DDMMAAAA)
  DISCOUNT_AMOUNT: { start: 151, end: 165 }, // 32.3P - Valor/Percentual a ser Concedido (15 chars, 13+2 decimal)
  IOF_AMOUNT: { start: 166, end: 180 }, // 33.3P - Valor do IOF a ser Recolhido (15 chars, 13+2 decimal)
  REBATE_AMOUNT: { start: 181, end: 195 }, // 34.3P - Valor do Abatimento (15 chars, 13+2 decimal)

  // Company and protest (35.3P - 41.3P)
  COMPANY_IDENTIFICATION: { start: 196, end: 220 }, // 35.3P - Identificação do Título na Empresa (25 chars)
  PROTEST_CODE: { start: 221, end: 221 }, // 36.3P - Código para Protesto
  PROTEST_DAYS: { start: 222, end: 223 }, // 37.3P - Número de Dias para Protesto
  LOW_RETURN_CODE: { start: 224, end: 224 }, // 38.3P - Código para Baixa/Devolução
  LOW_RETURN_DAYS: { start: 225, end: 227 }, // 39.3P - Número de Dias para Baixa/Devolução
  CURRENCY_CODE: { start: 228, end: 229 }, // 40.3P - Código da Moeda
  CONTRACT_NUMBER: { start: 230, end: 239 }, // 41.3P - Nº do Contrato da Operação de Créd. (10 chars)
  FREE_USE: { start: 240, end: 240 }, // 42.3P - Uso livre banco/empresa
} as const;

/**
 * Segment Q (Record Type 3, Segment Q) field positions
 * Total: 240 characters
 */
export const SEGMENT_Q_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RECORD_NUMBER: { start: 9, end: 13 },
  SEGMENT_CODE: { start: 14, end: 14 },
  RESERVED_1: { start: 15, end: 15 },
  MOVEMENT_CODE: { start: 16, end: 17 },
  PAYER_PERSON_TYPE: { start: 18, end: 18 },
  PAYER_TAX_ID: { start: 19, end: 33 },
  PAYER_NAME: { start: 34, end: 73 },
  PAYER_ADDRESS: { start: 74, end: 113 },
  PAYER_DISTRICT: { start: 114, end: 128 },
  PAYER_ZIP_CODE: { start: 129, end: 136 },
  PAYER_CITY: { start: 137, end: 151 },
  PAYER_STATE: { start: 152, end: 153 },
  GUARANTOR_PERSON_TYPE: { start: 154, end: 154 },
  GUARANTOR_TAX_ID: { start: 155, end: 169 },
  GUARANTOR_NAME: { start: 170, end: 209 },
  BANK_CORRESPONDENT_CODE: { start: 210, end: 212 },
  BANK_CORRESPONDENT_DOCUMENT: { start: 213, end: 232 },
  RESERVED_2: { start: 233, end: 240 },
} as const;

/**
 * Segment R (Record Type 3, Segment R) field positions
 * Total: 240 characters
 *
 * CORRECTED TO MATCH FEBRABAN CNAB240 SPECIFICATION
 * Source: doc/CNAB240-FEBRABAN.md - Registro Detalhe - Segmento R (Opcional - Remessa)
 */
export const SEGMENT_R_POSITIONS = {
  // Control fields (01.3R - 07.3R)
  BANK_CODE: { start: 1, end: 3 }, // 01.3R - Código do Banco
  BATCH_NUMBER: { start: 4, end: 7 }, // 02.3R - Lote de Serviço
  RECORD_TYPE: { start: 8, end: 8 }, // 03.3R - Tipo de Registro
  RECORD_NUMBER: { start: 9, end: 13 }, // 04.3R - Nº Sequencial do Registro
  SEGMENT_CODE: { start: 14, end: 14 }, // 05.3R - Código do Segmento
  RESERVED_1: { start: 15, end: 15 }, // 06.3R - Uso Exclusivo FEBRABAN/CNAB
  MOVEMENT_CODE: { start: 16, end: 17 }, // 07.3R - Código de Movimento Remessa

  // Discount 2 and 3 (08.3R - 13.3R)
  DISCOUNT_2_CODE: { start: 18, end: 18 }, // 08.3R - Código do Desconto 2
  DISCOUNT_2_DATE: { start: 19, end: 26 }, // 09.3R - Data do Desconto 2 (DDMMAAAA)
  DISCOUNT_2_AMOUNT: { start: 27, end: 41 }, // 10.3R - Valor/Percentual a ser Concedido (15 chars, 13+2 decimal)
  DISCOUNT_3_CODE: { start: 42, end: 42 }, // 11.3R - Código do Desconto 3
  DISCOUNT_3_DATE: { start: 43, end: 50 }, // 12.3R - Data do Desconto 3 (DDMMAAAA)
  DISCOUNT_3_AMOUNT: { start: 51, end: 65 }, // 13.3R - Valor/Percentual a Ser Concedido (15 chars, 13+2 decimal)

  // Fine (14.3R - 16.3R)
  FINE_CODE: { start: 66, end: 66 }, // 14.3R - Código da Multa
  FINE_DATE: { start: 67, end: 74 }, // 15.3R - Data da Multa (DDMMAAAA)
  FINE_AMOUNT: { start: 75, end: 89 }, // 16.3R - Valor/Percentual a Ser Aplicado (15 chars, 13+2 decimal)

  // Messages (17.3R - 19.3R)
  PAYER_INFO: { start: 90, end: 99 }, // 17.3R - Informação ao Pagador (10 chars)
  MESSAGE_3: { start: 100, end: 139 }, // 18.3R - Mensagem 3 (40 chars)
  MESSAGE_4: { start: 140, end: 179 }, // 19.3R - Mensagem 4 (40 chars)

  // Reserved and occurrence code (20.3R - 21.3R)
  RESERVED_2: { start: 180, end: 199 }, // 20.3R - Uso Exclusivo FEBRABAN/CNAB (20 chars)
  OCCURRENCE_CODE_COMPLEMENT: { start: 200, end: 207 }, // 21.3R - Código de Ocorrência do Pagador (8 chars)

  // Debit information (22.3R - 28.3R)
  DEBIT_BANK_CODE: { start: 208, end: 210 }, // 22.3R - Código do Banco na Conta do Débito
  DEBIT_AGENCY: { start: 211, end: 215 }, // 23.3R - Código da Agência do Débito
  DEBIT_AGENCY_DIGIT: { start: 216, end: 216 }, // 24.3R - Dígito Verificador da Agência
  DEBIT_ACCOUNT: { start: 217, end: 228 }, // 25.3R - Conta Corrente para Débito
  DEBIT_ACCOUNT_DIGIT: { start: 229, end: 229 }, // 26.3R - Dígito Verificador da Conta
  DEBIT_ACCOUNT_DV: { start: 230, end: 230 }, // 27.3R - Dígito Verificador Ag/Conta
  DEBIT_NOTICE_EMISSION: { start: 231, end: 231 }, // 28.3R - Aviso para Débito Automático

  // Final reserved (29.3R)
  RESERVED_3: { start: 232, end: 240 }, // 29.3R - Uso Exclusivo FEBRABAN/CNAB (9 chars)
} as const;

/**
 * Batch Trailer (Record Type 5) field positions
 * Total: 240 characters
 * Based on original implementation for Collection (Cobrança) with multiple total types
 */
export const BATCH_TRAILER_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RESERVED_1: { start: 9, end: 17 },
  DETAIL_COUNT: { start: 18, end: 23 }, // Total records in batch
  TOTAL_SIMPLE_SLIPS: { start: 24, end: 29 }, // Total simple slips quantity
  TOTAL_SIMPLE_AMOUNT: { start: 30, end: 47 }, // Total simple slips amount (18 positions, 16+2 decimal)
  TOTAL_ENDORSED_SLIPS: { start: 48, end: 53 }, // Total endorsed slips quantity
  TOTAL_ENDORSED_AMOUNT: { start: 54, end: 71 }, // Total endorsed slips amount (18 positions, 16+2 decimal)
  TOTAL_COLLECTION_SLIPS: { start: 72, end: 77 }, // Total collection slips quantity
  TOTAL_COLLECTION_AMOUNT: { start: 78, end: 95 }, // Total collection slips amount (18 positions, 16+2 decimal)
  WARNING_CODE: { start: 96, end: 103 }, // Reference/warning number
  RESERVED_2: { start: 104, end: 240 },
} as const;

/**
 * File Trailer (Record Type 9) field positions
 * Total: 240 characters
 */
export const FILE_TRAILER_POSITIONS = {
  BANK_CODE: { start: 1, end: 3 },
  BATCH_NUMBER: { start: 4, end: 7 },
  RECORD_TYPE: { start: 8, end: 8 },
  RESERVED_1: { start: 9, end: 17 },
  BATCH_COUNT: { start: 18, end: 23 },
  RECORD_COUNT: { start: 24, end: 29 },
  ACCOUNT_COUNT: { start: 30, end: 35 },
  RESERVED_2: { start: 36, end: 240 },
} as const;

/**
 * Helper function to validate position ranges
 * Ensures positions don't overlap and cover all 240 characters
 */
export function validatePositions(
  positions: Record<string, { start: number; end: number }>,
): boolean {
  const ranges = Object.values(positions).sort((a, b) => a.start - b.start);

  // Check first position starts at 1
  if (ranges[0].start !== 1) return false;

  // Check last position ends at 240
  if (ranges.at(-1)?.end !== 240) return false;

  // Check no gaps or overlaps
  for (let i = 0; i < ranges.length - 1; i++) {
    const current = ranges[i];
    const next = ranges[i + 1];

    // Check for gaps
    if (current.end + 1 !== next.start) {
      // Allow consecutive ranges (end + 1 = next start)
      if (current.end !== next.start - 1) return false;
    }
  }

  return true;
}
