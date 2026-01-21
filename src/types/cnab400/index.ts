/**
 * CNAB400 Type Definitions
 *
 * This module exports TypeScript types for CNAB400 file format
 * based on FEBRABAN standard with Itaú bank layout.
 *
 * CNAB400 Format Structure:
 * - Header Record (Type 0): 1 record per file
 * - Detail Records (Type 1): Multiple transaction records
 * - Detail Records (Type 5): Optional guarantor records
 * - Detail Records (Type 7): Required front message records
 * - Detail Records (Type 8): Optional back message records
 * - Trailer Record (Type 9): 1 record per file
 *
 * @module types/cnab400
 */

/**
 * File Header Record (Type 0)
 *
 * Represents the header information of a CNAB400 file.
 * Contains company identification, bank code, and file metadata.
 *
 * @see CNAB400-ITAU.md section 3.1 - Arquivo Remessa
 *
 * @example
 * ```typescript
 * const header: FileHeader = {
 *   recordType: '0',
 *   operationType: '1',
 *   operationLiteral: 'REMESSA',
 *   serviceCode: '01',
 *   serviceLiteral: 'COBRANCA',
 *   agency: '0001',
 *   zeros: '00',
 *   account: '12345',
 *   accountDigit: '6',
 *   companyName: 'ACME CORPORATION LTDA',
 *   bankCode: '341',
 *   bankName: 'BANCO ITAU SA',
 *   generationDate: new Date('2026-01-20'),
 *   sequenceNumber: 1,
 *   layoutVersion: '400'
 * };
 * ```
 */
export interface FileHeader {
  /** Record type identifier - Always '0' for header (Position 001-001) */
  recordType: '0';

  /** Operation type - '1' for REMESSA (remittance), '2' for RETORNO (return) (Position 002-002) */
  operationType: '1' | '2';

  /** Operation literal - 'REMESSA' or 'RETORNO' (Position 003-009) */
  operationLiteral: string;

  /** Service code - '01' for collection service (Position 010-011) */
  serviceCode: string;

  /** Service literal - 'COBRANCA' (Position 012-026) */
  serviceLiteral: string;

  /** Agency code - 4 digits (Position 027-030) */
  agency: string;

  /** Zeros - Complement '00' (Position 031-032) */
  zeros: string;

  /** Account number - 5 digits (Position 033-037) */
  account: string;

  /** Account check digit - 1 digit (Position 038-038) */
  accountDigit: string;

  /** Company name - Up to 30 characters (Position 047-076) */
  companyName: string;

  /** Bank code - '341' for Itaú (Position 077-079) */
  bankCode: string;

  /** Bank name - 'BANCO ITAU SA' (Position 080-094) */
  bankName: string;

  /** File generation date - DDMMYY format (Position 095-100) */
  generationDate: Date;

  /** Density code - Spaces (Position 101-107) */
  densityCode?: string;

  /** Density unit - Spaces (Position 108-110) */
  densityUnit?: string;

  /** Sequential file number - Incremental (Position 111-115) */
  sequenceNumber: number;

  /** File creation date - DDMMYYYY format (Position 116-123) */
  creationDate?: Date;

  /** Layout version - '400' (Position 124-126) */
  layoutVersion?: string;

  /** Blanks - Complement (Position 127-394) */
  blanks?: string;

  /** Sequential - Record sequence '000001' (Position 395-400) */
  sequential?: string;
}

/**
 * Detail Record (Type 1)
 *
 * Represents a bank slip (boleto) transaction detail in a CNAB400 file.
 * Contains payer information, amounts, dates, and payment instructions.
 *
 * @see CNAB400-ITAU.md section 3.1 - Registro Detalhe
 *
 * @example
 * ```typescript
 * const detail: DetailRecord = {
 *   recordType: '1',
 *   companyRegistrationType: '02',
 *   companyRegistrationNumber: '12345678000195',
 *   agency: '0001',
 *   account: '12345',
 *   accountDigit: '6',
 *   documentNumber: 'DOC123456',
 *   ourNumber: '12345678',
 *   amount: 150.00,
 *   bankCode: '341',
 *   dueDate: new Date('2026-03-01'),
 *   instructionCode1: '01',
 *   payerName: 'JOHN DOE',
 *   payerAddress: 'RUA EXEMPLO 100',
 *   payerCity: 'SAO PAULO',
 *   payerState: 'SP',
 *   payerZipCode: '01310100',
 *   sequentialNumber: 2
 * };
 * ```
 */
export interface DetailRecord {
  /** Record type identifier - Always '1' for detail (Position 001-001) */
  recordType: '1';

  /** Company registration type - '01'=CPF, '02'=CNPJ (Position 002-003) */
  companyRegistrationType: '01' | '02' | '03';

  /** Company registration number - CPF/CNPJ (Position 004-017) */
  companyRegistrationNumber: string;

  /** Agency code - 4 digits (Position 018-021) */
  agency: string;

  /** Zeros - Complement '00' (Position 022-023) */
  zeros?: string;

  /** Account number - 5 digits (Position 024-028) */
  account: string;

  /** Account check digit - 1 digit (Position 029-029) */
  accountDigit: string;

  /** Company internal control - Optional (Position 030-054) */
  companyControl?: string;

  /** Our number - Bank's identification (Position 055-062) */
  ourNumber: string;

  /** Discount amount to be granted - 13 digits (Position 063-070) */
  discountAmount?: number;

  /** IOF percentage - Percentage (Position 071-072) */
  iofPercentage?: number;

  /** Portfolio code - Collection type (Position 083-085) */
  portfolioCode?: string;

  /** Registration instruction - '00' for normal (Position 086-087) */
  registrationInstruction?: string;

  /** Document number - Client's document number (Position 088-097) */
  documentNumber?: string;

  /** Due date - DDMMYY format (Position 101-106) */
  dueDate: Date;

  /** Transaction amount - 13 digits with 2 decimals (Position 107-119) */
  amount: number;

  /** Bank code - '341' for Itaú (Position 120-122) */
  bankCode?: string;

  /** Collecting agency - 4 digits (Position 123-126) */
  collectingAgency?: string;

  /** Agency digit - 1 digit (Position 127-127) */
  collectingAgencyDigit?: string;

  /** Document species - Check slip species (Position 128-129) */
  speciesCode?: string;

  /** Acceptance - 'A' for accepted (Position 130-130) */
  acceptance?: 'A' | 'N';

  /** Issue date - DDMMYY format (Position 131-136) */
  issueDate?: Date;

  /** Instruction code 1 - First instruction (Position 137-138) */
  instructionCode1?: string;

  /** Instruction code 2 - Second instruction (Position 139-140) */
  instructionCode2?: string;

  /** Daily interest amount - 13 digits (Position 141-153) */
  dailyInterestAmount?: number;

  /** Discount limit date - DDMMYY format (Position 154-159) */
  discountLimitDate?: Date;

  /** Discount amount - 13 digits (Position 160-172) */
  discountValue?: number;

  /** IOF amount - 13 digits (Position 173-185) */
  iofAmount?: number;

  /** Rebate amount - 13 digits (Position 186-198) */
  rebateAmount?: number;

  /** Payer registration type - '01'=CPF, '02'=CNPJ (Position 199-200) */
  payerRegistrationType?: '01' | '02';

  /** Payer registration number - CPF/CNPJ (Position 201-214) */
  payerRegistrationNumber?: string;

  /** Payer name - Up to 30 characters (Position 215-244) */
  payerName: string;

  /** Payer address - Up to 40 characters (Position 245-284) */
  payerAddress?: string;

  /** First message line - Optional (Position 285-314) */
  firstMessage?: string;

  /** Payer postal code - 8 digits (Position 315-322) */
  payerZipCode?: string;

  /** Guarantor/Third party - Optional (Position 323-337) */
  guarantor?: string;

  /** Guarantor city - Optional (Position 338-352) */
  guarantorCity?: string;

  /** Guarantor state - 2 letters (Position 353-354) */
  guarantorState?: string;

  /** Payer city - City name (Position 355-374) */
  payerCity?: string;

  /** Payer state - 2 letters (Position 375-376) */
  payerState?: string;

  /** Fine percentage - Percentage (Position 377-380) */
  finePercentage?: number;

  /** Fine days - Days until fine (Position 381-382) */
  fineDays?: number;

  /** Currency code - '09' for Real (Position 383-384) */
  currencyCode?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}

/**
 * Penalty Record (Type 2) - Optional
 *
 * Optional record containing penalty/fine (multa) information.
 * Used to register or update fine values/percentages for the bank slip.
 * Valid only for registered portfolios.
 *
 * @see CNAB400-ITAU.md section 3.1 - Registro Detalhe Multa (Opcional)
 *
 * @example
 * ```typescript
 * const penaltyRecord: PenaltyRecord = {
 *   recordType: '2',
 *   penaltyCode: '2',
 *   penaltyDate: new Date('2026-03-10'),
 *   penaltyValue: 5.00,
 *   sequentialNumber: 3
 * };
 * ```
 */
export interface PenaltyRecord {
  /** Record type identifier - Always '2' for penalty (Position 001-001) */
  recordType: '2';

  /** Penalty code - '1'=None, '2'=Percentage, '3'=Fixed value (Position 002-002) */
  penaltyCode: '1' | '2' | '3';

  /** Penalty date - Date when penalty starts (Position 003-010, DDMMYYYY) */
  penaltyDate?: Date;

  /** Penalty value - Amount or percentage (Position 011-023) */
  penaltyValue?: number;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}

/**
 * Guarantor Detail Record (Type 5) - Optional
 *
 * Additional record containing guarantor (sacador avalista) information.
 * Only included when there is a guarantor for the transaction.
 *
 * @see CNAB400-ITAU.md section 3.1 - Registro Detalhe Sacador Avalista
 *
 * @example
 * ```typescript
 * const guarantorRecord: GuarantorRecord = {
 *   recordType: '5',
 *   companyRegistrationType: '02',
 *   companyRegistrationNumber: '12345678000195',
 *   documentNumber: 'DOC123456',
 *   guarantorName: 'GUARANTOR COMPANY LTDA',
 *   guarantorAddress: 'AV EXAMPLE 500',
 *   guarantorCity: 'RIO DE JANEIRO',
 *   guarantorState: 'RJ',
 *   guarantorZipCode: '20000000',
 *   sequentialNumber: 3
 * };
 * ```
 */
export interface GuarantorRecord {
  /** Record type identifier - Always '5' for guarantor (Position 001-001) */
  recordType: '5';

  /** Company registration type - '01'=CPF, '02'=CNPJ (Position 002-003) */
  companyRegistrationType: '01' | '02';

  /** Company registration number - CPF/CNPJ (Position 004-017) */
  companyRegistrationNumber: string;

  /** Agency code - 4 digits (Position 018-021) */
  agency?: string;

  /** Account number - 5 digits (Position 024-028) */
  account?: string;

  /** Account check digit - 1 digit (Position 029-029) */
  accountDigit?: string;

  /** Document number - Must match detail record (Position 088-097) */
  documentNumber: string;

  /** Guarantor registration type - '01'=CPF, '02'=CNPJ (Position 199-200) */
  guarantorRegistrationType?: '01' | '02';

  /** Guarantor registration number - CPF/CNPJ (Position 201-214) */
  guarantorRegistrationNumber?: string;

  /** Guarantor name - Up to 30 characters (Position 215-244) */
  guarantorName: string;

  /** Guarantor address - Up to 45 characters (Position 245-289) */
  guarantorAddress?: string;

  /** Guarantor postal code - 8 digits (Position 290-297) */
  guarantorZipCode?: string;

  /** Guarantor city - City name (Position 298-312) */
  guarantorCity?: string;

  /** Guarantor state - 2 letters (Position 313-314) */
  guarantorState?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}

/**
 * Message Front Record (Type 7) - Required for Itaú
 *
 * Contains message lines to be printed on the front of the bank slip.
 * At least one Type 7 record is required for Itaú CNAB400 files.
 *
 * @see CNAB400-ITAU.md section 3.1.1 - Registro mensagem FRENTE
 *
 * @example
 * ```typescript
 * const frontMessage: MessageFrontRecord = {
 *   recordType: '7',
 *   message1: 'PAYMENT FOR SERVICES PROVIDED IN JANUARY 2026',
 *   message2: 'INVOICE NUMBER: 12345',
 *   message3: 'THANK YOU FOR YOUR BUSINESS',
 *   sequentialNumber: 4
 * };
 * ```
 */
export interface MessageFrontRecord {
  /** Record type identifier - Always '7' for front message (Position 001-001) */
  recordType: '7';

  /** First message line - Up to 80 characters (Position 002-081) */
  message1?: string;

  /** Second message line - Up to 80 characters (Position 082-161) */
  message2?: string;

  /** Third message line - Up to 80 characters (Position 162-241) */
  message3?: string;

  /** Fourth message line - Up to 80 characters (Position 242-321) */
  message4?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}

/**
 * Message Back Record (Type 8) - Optional
 *
 * Contains message lines to be printed on the back of the bank slip.
 * This record is optional and used for additional information.
 *
 * @see CNAB400-ITAU.md section 3.1.2 - Registro mensagem VERSO
 *
 * @example
 * ```typescript
 * const backMessage: MessageBackRecord = {
 *   recordType: '8',
 *   message1: 'ADDITIONAL INFORMATION',
 *   message2: 'PAYMENT CAN BE MADE AT ANY BANK BRANCH',
 *   sequentialNumber: 5
 * };
 * ```
 */
export interface MessageBackRecord {
  /** Record type identifier - Always '8' for back message (Position 001-001) */
  recordType: '8';

  /** First message line - Up to 80 characters (Position 002-081) */
  message1?: string;

  /** Second message line - Up to 80 characters (Position 082-161) */
  message2?: string;

  /** Third message line - Up to 80 characters (Position 162-241) */
  message3?: string;

  /** Fourth message line - Up to 80 characters (Position 242-321) */
  message4?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}

/**
 * File Trailer Record (Type 9)
 *
 * Represents the trailer (summary) of a CNAB400 file.
 * Contains record counts and totals.
 *
 * @see CNAB400-ITAU.md section 3.1 - Registro Trailer
 *
 * @example
 * ```typescript
 * const trailer: FileTrailer = {
 *   recordType: '9',
 *   totalRecords: 10,
 *   totalAmount: 1500.00,
 *   sequentialNumber: 11
 * };
 * ```
 */
export interface FileTrailer {
  /** Record type identifier - Always '9' for trailer (Position 001-001) */
  recordType: '9';

  /** Total number of records in file - Including header and trailer (Position 002-007) */
  totalRecords: number;

  /** Total transaction amount - Sum of all details (Position 008-020) */
  totalAmount?: number;

  /** Total number of detail records - Type 1 records only (Position 021-028) */
  totalDetailRecords?: number;

  /** Zeros - Complement (Position 029-394) */
  zeros?: string;

  /** Sequential number - Record sequence in file (Position 395-400) */
  sequentialNumber: number;
}

/**
 * Complete CNAB400 File Structure
 *
 * Represents a complete CNAB400 remittance or return file.
 * Follows the structure: Header + Details + Trailer
 *
 * @example
 * ```typescript
 * const cnabFile: Cnab400File = {
 *   header: {
 *     recordType: '0',
 *     operationType: '1',
 *     companyName: 'ACME CORP',
 *     bankCode: '341',
 *     generationDate: new Date(),
 *     sequenceNumber: 1
 *   },
 *   details: [
 *     {
 *       recordType: '1',
 *       ourNumber: '12345678',
 *       amount: 150.00,
 *       dueDate: new Date('2026-03-01'),
 *       payerName: 'JOHN DOE',
 *       sequentialNumber: 2
 *     }
 *   ],
 *   guarantorRecords: [],
 *   messageFrontRecords: [
 *     {
 *       recordType: '7',
 *       message1: 'PAYMENT INSTRUCTIONS',
 *       sequentialNumber: 3
 *     }
 *   ],
 *   messageBackRecords: [],
 *   trailer: {
 *     recordType: '9',
 *     totalRecords: 4,
 *     totalAmount: 150.00,
 *     sequentialNumber: 4
 *   }
 * };
 * ```
 */
export interface Cnab400File {
  /** File header record (Type 0) - Required, exactly 1 per file */
  header: FileHeader;

  /** Detail records (Type 1) - One or more transaction records */
  details: DetailRecord[];

  /** Penalty records (Type 2) - Optional, one per detail with penalty */
  penaltyRecords?: PenaltyRecord[];

  /** Guarantor records (Type 5) - Optional, one per detail with guarantor */
  guarantorRecords?: GuarantorRecord[];

  /** Message front records (Type 7) - Required for Itaú, at least 1 */
  messageFrontRecords?: MessageFrontRecord[];

  /** Message back records (Type 8) - Optional */
  messageBackRecords?: MessageBackRecord[];

  /** File trailer record (Type 9) - Required, exactly 1 per file */
  trailer: FileTrailer;
}

/**
 * CNAB400 Return File Additional Fields
 *
 * When processing return files from the bank, additional fields
 * are present in the detail records with occurrence information.
 */
export interface ReturnDetailRecord extends DetailRecord {
  /** Occurrence code - Bank's processing result (Position 109-110) */
  occurrenceCode: string;

  /** Occurrence date - DDMMYY when event occurred (Position 111-116) */
  occurrenceDate?: Date;

  /** Bank's document number - Bank's internal reference (Position 117-126) */
  bankDocumentNumber?: string;

  /** Credit date - DDMMYY when credited (Position 176-181) */
  creditDate?: Date;

  /** Payment amount - Actual amount paid (Position 254-266) */
  paymentAmount?: number;

  /** Expenses amount - Bank fees (Position 267-279) */
  expensesAmount?: number;

  /** Rejection reasons - Up to 8 rejection codes (Position 319-326) */
  rejectionReasons?: string[];
}

export type Cnab400ReturnFile = Omit<Cnab400File, 'details'> & {
  details: ReturnDetailRecord[];
};
