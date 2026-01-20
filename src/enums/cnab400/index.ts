/**
 * CNAB400 Enum Definitions
 *
 * Contains enums specific to CNAB400 file format based on FEBRABAN
 * standards and Itaú bank specifications.
 *
 * @module enums/cnab400
 */

/**
 * Record Type Codes
 *
 * Identifies the type of record in a CNAB400 file.
 *
 * @see CNAB400-ITAU.md section 3.1
 */
export enum RecordType {
  /** File header record */
  HEADER = '0',

  /** Detail/transaction record */
  DETAIL = '1',

  /** Guarantor (sacador avalista) detail record */
  GUARANTOR = '5',

  /** Front message record (required for Itaú) */
  MESSAGE_FRONT = '7',

  /** Back message record (optional) */
  MESSAGE_BACK = '8',

  /** File trailer record */
  TRAILER = '9',
}

/**
 * Operation Type Codes
 *
 * Identifies whether the file is a remittance (from company to bank)
 * or return (from bank to company).
 */
export enum OperationType {
  /** Remittance file - Company sends to bank */
  REMITTANCE = '1',

  /** Return file - Bank sends to company */
  RETURN = '2',
}

/**
 * Registration Type Codes
 *
 * Identifies the type of tax registration number (CPF or CNPJ).
 */
export enum RegistrationType {
  /** Individual taxpayer (CPF - 11 digits) */
  CPF = '01',

  /** Company taxpayer (CNPJ - 14 digits) */
  CNPJ = '02',

  /** Other registration type */
  OTHER = '03',
}

/**
 * Instruction Codes (Itaú CNAB400)
 *
 * Commands that can be sent to the bank regarding boleto processing.
 *
 * @see CNAB400-ITAU.md - Tabela de Instruções
 */
export enum InstructionCode {
  /** No instruction */
  NONE = '00',

  /** Protest automatically after N days */
  AUTO_PROTEST = '01',

  /** Do not protest */
  NO_PROTEST = '02',

  /** Lower to profit after N days */
  LOWER_TO_PROFIT = '03',

  /** Waive protest */
  WAIVE_PROTEST = '04',

  /** Protest on due date */
  PROTEST_ON_DUE_DATE = '05',

  /** Automatic cancellation after N days overdue */
  AUTO_CANCEL = '06',

  /** Negative for non-payment */
  NEGATIVE = '07',

  /** Do not collect bank fee */
  NO_BANK_FEE = '08',

  /** Cancellation for specific title */
  CANCEL_SPECIFIC_TITLE = '09',

  /** Do not charge interest */
  NO_INTEREST = '10',

  /** Cancel conditional discount */
  CANCEL_CONDITIONAL_DISCOUNT = '11',

  /** Exempt fine */
  EXEMPT_FINE = '12',

  /** Limit discount to settlement date */
  LIMIT_DISCOUNT_SETTLEMENT_DATE = '13',

  /** Exempt IOF */
  EXEMPT_IOF = '14',

  /** Cancel protest and automatic negative */
  CANCEL_PROTEST_NEGATIVE = '15',
}

/**
 * Occurrence Codes (Itaú CNAB400 Return)
 *
 * Codes returned by the bank indicating the status or action taken
 * on a boleto.
 *
 * @see CNAB400-ITAU.md - Tabela de Ocorrências
 */
export enum OccurrenceCode {
  /** Entry confirmed */
  ENTRY_CONFIRMED = '02',

  /** Entry rejected */
  ENTRY_REJECTED = '03',

  /** Transfer to discounted */
  TRANSFER_DISCOUNTED = '04',

  /** Transfer to pledge */
  TRANSFER_PLEDGE = '05',

  /** Payment liquidation */
  PAYMENT = '06',

  /** Payment confirmation via bank */
  PAYMENT_CONFIRMATION = '07',

  /** Payment by clearing */
  PAYMENT_CLEARING = '08',

  /** Partial payment */
  PARTIAL_PAYMENT = '09',

  /** Low via file */
  LOW_VIA_FILE = '10',

  /** Title in being */
  TITLE_IN_BEING = '11',

  /** Abatement granted */
  ABATEMENT_GRANTED = '12',

  /** Abatement canceled */
  ABATEMENT_CANCELED = '13',

  /** Due date change */
  DUE_DATE_CHANGE = '14',

  /** Payment liquidation after low */
  PAYMENT_AFTER_LOW = '15',

  /** Instruction change confirmation */
  INSTRUCTION_CHANGE = '16',

  /** Allegation payer */
  ALLEGATION_PAYER = '17',

  /** Instruction rejected */
  INSTRUCTION_REJECTED = '18',

  /** Instruction confirmation */
  INSTRUCTION_CONFIRMATION = '19',

  /** Debited */
  DEBITED = '20',

  /** Title change */
  TITLE_CHANGE = '21',

  /** Late payment */
  LATE_PAYMENT = '23',

  /** Entry rejected - duplicate */
  ENTRY_REJECTED_DUPLICATE = '24',

  /** Protest entry rejected */
  PROTEST_ENTRY_REJECTED = '25',

  /** Instruction rejected - title already protested */
  INSTRUCTION_REJECTED_PROTESTED = '26',

  /** Protest withdrawal rejected */
  PROTEST_WITHDRAWAL_REJECTED = '27',

  /** Debit of fees/commissions */
  DEBIT_FEES = '28',

  /** Protest maintained */
  PROTEST_MAINTAINED = '29',

  /** Command recused */
  COMMAND_RECUSED = '30',

  /** Manual change of payer */
  PAYER_CHANGE = '31',

  /** Returned by Correios */
  RETURNED_MAIL = '32',

  /** Delayed payment */
  DELAYED_PAYMENT = '33',
}

/**
 * Document Species Codes (Itaú)
 *
 * Types of documents that can be issued as boletos.
 *
 * @see CNAB400-ITAU.md - Espécie de Título
 */
export enum SpeciesCodeCnab400 {
  /** Mercantile duplicate */
  DUPLICATA_MERCANTIL = '01',

  /** Note/insurance */
  NOTA_SEGURO = '02',

  /** Receipt */
  RECIBO = '03',

  /** Contract */
  CONTRATO = '04',

  /** Service duplicate */
  DUPLICATA_SERVICO = '05',

  /** Rural credit */
  CREDITO_RURAL = '06',

  /** Rental */
  ALUGUEL = '07',

  /** Warrant */
  WARRANT = '08',

  /** Promissory note */
  NOTA_PROMISSORIA = '09',

  /** Direct debit */
  DEBITO_DIRETO = '10',

  /** Other */
  OUTROS = '99',
}

/**
 * Portfolio Codes (Itaú)
 *
 * Identifies the type of collection portfolio.
 *
 * @see CNAB400-ITAU.md - Carteiras
 */
export enum PortfolioCode {
  /** Simple collection */
  SIMPLES = '109',

  /** Registered collection */
  REGISTRADA = '112',

  /** Collection without registration - print by bank */
  SEM_REGISTRO_IMPRESSAO_BANCO = '103',

  /** Collection without registration - alternative print */
  SEM_REGISTRO_ALTERNATIVA = '104',

  /** Electronic collection */
  ELETRONICA = '180',

  /** Direct collection */
  DIRETA = '121',
}

/**
 * Acceptance Type Codes
 *
 * Indicates if the boleto was accepted by the payer.
 */
export enum AcceptanceTypeCnab400 {
  /** Accepted */
  ACCEPTED = 'A',

  /** Not accepted */
  NOT_ACCEPTED = 'N',
}

/**
 * Rejection Reason Codes (Itaú Return)
 *
 * Codes explaining why an entry or instruction was rejected.
 *
 * @see CNAB400-ITAU.md - Motivos de Rejeição
 */
export enum RejectionReasonCode {
  /** No rejection */
  NONE = '00',

  /** Invalid bank code */
  INVALID_BANK_CODE = '01',

  /** Invalid agency code */
  INVALID_AGENCY = '02',

  /** Invalid account number */
  INVALID_ACCOUNT = '03',

  /** Invalid account digit */
  INVALID_ACCOUNT_DIGIT = '04',

  /** Invalid portfolio code */
  INVALID_PORTFOLIO = '05',

  /** Invalid document species */
  INVALID_SPECIES = '06',

  /** Invalid instruction code */
  INVALID_INSTRUCTION = '07',

  /** Invalid our number */
  INVALID_OUR_NUMBER = '08',

  /** Duplicate our number */
  DUPLICATE_OUR_NUMBER = '09',

  /** Invalid payer CPF/CNPJ */
  INVALID_PAYER_TAX_ID = '10',

  /** Invalid due date */
  INVALID_DUE_DATE = '11',

  /** Invalid amount */
  INVALID_AMOUNT = '12',

  /** Invalid discount */
  INVALID_DISCOUNT = '13',

  /** Invalid fine */
  INVALID_FINE = '14',

  /** Invalid interest */
  INVALID_INTEREST = '15',

  /** Title already registered */
  ALREADY_REGISTERED = '16',

  /** Title not found */
  TITLE_NOT_FOUND = '17',

  /** Title already paid */
  ALREADY_PAID = '18',

  /** Title already protested */
  ALREADY_PROTESTED = '19',

  /** Title already canceled */
  ALREADY_CANCELED = '20',

  /** Insufficient balance */
  INSUFFICIENT_BALANCE = '21',

  /** Invalid message */
  INVALID_MESSAGE = '22',

  /** Processing deadline expired */
  DEADLINE_EXPIRED = '23',

  /** System error */
  SYSTEM_ERROR = '99',
}

