// Exports all enums from all subfolders

// CNAB240 enums
export {
    OperationType as Cnab240OperationType,
    RecordType as Cnab240RecordType, OccurrenceCodeRemessa,
    OccurrenceCodeRetorno, SegmentCode,
    ServiceType
} from './cnab240';

// CNAB400 enums
export {
    AcceptanceTypeCnab400, InstructionCode as Cnab400InstructionCode, OperationType as Cnab400OperationType, RecordType as Cnab400RecordType, OccurrenceCode, PortfolioCode, RegistrationType, RejectionReasonCode, SpeciesCodeCnab400
} from './cnab400';

// Common enums
export {
    BankCode, InstructionCode as CommonInstructionCode, DocumentType
} from './common';
