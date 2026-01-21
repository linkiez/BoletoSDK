import {
  OccurrenceCodeRemessa,
  OccurrenceCodeRetorno,
  OperationType,
  RecordType,
  SegmentCode,
  ServiceType,
} from '../../../src/enums/cnab240';

describe('CNAB240 Enums', () => {
  describe('RecordType', () => {
    it('should have correct record type codes', () => {
      expect(RecordType.FILE_HEADER).toBe('0');
      expect(RecordType.BATCH_HEADER).toBe('1');
      expect(RecordType.DETAIL).toBe('3');
      expect(RecordType.BATCH_TRAILER).toBe('5');
      expect(RecordType.FILE_TRAILER).toBe('9');
    });

    it('should have exactly 5 record types', () => {
      const recordTypes = Object.values(RecordType);
      expect(recordTypes).toHaveLength(5);
    });
  });

  describe('SegmentCode', () => {
    it('should have correct segment codes', () => {
      expect(SegmentCode.P).toBe('P');
      expect(SegmentCode.Q).toBe('Q');
      expect(SegmentCode.R).toBe('R');
      expect(SegmentCode.S).toBe('S');
      expect(SegmentCode.T).toBe('T');
      expect(SegmentCode.U).toBe('U');
      expect(SegmentCode.Y).toBe('Y');
    });

    it('should have exactly 7 segment codes', () => {
      const segmentCodes = Object.values(SegmentCode);
      expect(segmentCodes).toHaveLength(7);
    });
  });

  describe('ServiceType', () => {
    it('should have correct service type codes', () => {
      expect(ServiceType.SIMPLE_COLLECTION).toBe('01');
      expect(ServiceType.LINKED_COLLECTION).toBe('02');
      expect(ServiceType.GUARANTEED_COLLECTION).toBe('03');
      expect(ServiceType.DISCOUNTED_COLLECTION).toBe('04');
      expect(ServiceType.OTHER_SERVICES).toBe('98');
    });

    it('should have exactly 5 service types', () => {
      const serviceTypes = Object.values(ServiceType);
      expect(serviceTypes).toHaveLength(5);
    });
  });

  describe('OperationType', () => {
    it('should have correct operation type codes', () => {
      expect(OperationType.CREDIT).toBe('C');
      expect(OperationType.DEBIT).toBe('D');
      expect(OperationType.STATEMENT).toBe('E');
      expect(OperationType.INFORMATION).toBe('I');
    });

    it('should have exactly 4 operation types', () => {
      const operationTypes = Object.values(OperationType);
      expect(operationTypes).toHaveLength(4);
    });
  });

  describe('OccurrenceCodeRemessa', () => {
    it('should have correct remittance occurrence codes', () => {
      expect(OccurrenceCodeRemessa.REGISTER_SLIP).toBe('01');
      expect(OccurrenceCodeRemessa.REQUEST_CANCELATION).toBe('02');
      expect(OccurrenceCodeRemessa.GRANT_REBATE).toBe('03');
      expect(OccurrenceCodeRemessa.CANCEL_REBATE).toBe('04');
      expect(OccurrenceCodeRemessa.GRANT_DISCOUNT).toBe('05');
      expect(OccurrenceCodeRemessa.CANCEL_DISCOUNT).toBe('06');
      expect(OccurrenceCodeRemessa.CHANGE_DUE_DATE).toBe('07');
      expect(OccurrenceCodeRemessa.CHANGE_AMOUNT).toBe('08');
      expect(OccurrenceCodeRemessa.PROTEST).toBe('09');
      expect(OccurrenceCodeRemessa.CANCEL_PROTEST_AND_WRITEOFF).toBe('10');
      expect(OccurrenceCodeRemessa.CANCEL_PROTEST_AND_KEEP).toBe('11');
    });

    it('should have remittance codes for data changes', () => {
      expect(OccurrenceCodeRemessa.CHANGE_INTEREST).toBe('12');
      expect(OccurrenceCodeRemessa.WAIVE_INTEREST).toBe('13');
      expect(OccurrenceCodeRemessa.CHANGE_FINE).toBe('14');
      expect(OccurrenceCodeRemessa.WAIVE_FINE).toBe('15');
      expect(OccurrenceCodeRemessa.CHANGE_DISCOUNT_AMOUNT).toBe('16');
      expect(OccurrenceCodeRemessa.DO_NOT_GRANT_DISCOUNT).toBe('17');
      expect(OccurrenceCodeRemessa.CHANGE_REBATE_AMOUNT).toBe('18');
      expect(OccurrenceCodeRemessa.DO_NOT_GRANT_REBATE).toBe('19');
      expect(OccurrenceCodeRemessa.CHANGE_PAYER_DATA).toBe('20');
      expect(OccurrenceCodeRemessa.CHANGE_OTHER_DATA).toBe('21');
    });

    it('should have at least 20 remittance occurrence codes', () => {
      const codes = Object.values(OccurrenceCodeRemessa);
      expect(codes.length).toBeGreaterThanOrEqual(20);
    });
  });

  describe('OccurrenceCodeRetorno', () => {
    it('should have correct return occurrence codes', () => {
      expect(OccurrenceCodeRetorno.REGISTRATION_CONFIRMED).toBe('02');
      expect(OccurrenceCodeRetorno.REGISTRATION_REJECTED).toBe('03');
      expect(OccurrenceCodeRetorno.DATA_CHANGE_CONFIRMED).toBe('04');
      expect(OccurrenceCodeRetorno.DATA_CHANGE_REJECTED).toBe('05');
      expect(OccurrenceCodeRetorno.PAID_NORMALLY).toBe('06');
      expect(OccurrenceCodeRetorno.PAID_PARTIALLY).toBe('07');
      expect(OccurrenceCodeRetorno.PAID_BY_THIRD_PARTY).toBe('08');
      expect(OccurrenceCodeRetorno.WRITEOFF_CONFIRMED).toBe('09');
      expect(OccurrenceCodeRetorno.WRITEOFF_REJECTED).toBe('10');
    });

    it('should have return codes for slip status', () => {
      expect(OccurrenceCodeRetorno.IN_PORTFOLIO).toBe('11');
      expect(OccurrenceCodeRetorno.REBATE_GRANTED).toBe('12');
      expect(OccurrenceCodeRetorno.REBATE_CANCELED).toBe('13');
      expect(OccurrenceCodeRetorno.DUE_DATE_CHANGED).toBe('14');
      expect(OccurrenceCodeRetorno.PAID_IN_NOTARY).toBe('15');
      expect(OccurrenceCodeRetorno.PAID_AFTER_WRITEOFF).toBe('17');
    });

    it('should have return codes for protest', () => {
      expect(OccurrenceCodeRetorno.PROTEST_INSTRUCTION_CONFIRMED).toBe('19');
      expect(OccurrenceCodeRetorno.PROTEST_CANCELATION_CONFIRMED).toBe('20');
      expect(OccurrenceCodeRetorno.SENT_TO_NOTARY).toBe('23');
      expect(OccurrenceCodeRetorno.WRITEOFF_BY_PROTEST).toBe('25');
    });

    it('should have at least 15 return occurrence codes', () => {
      const codes = Object.values(OccurrenceCodeRetorno);
      expect(codes.length).toBeGreaterThanOrEqual(15);
    });
  });
});
