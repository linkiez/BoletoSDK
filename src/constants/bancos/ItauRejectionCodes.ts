/**
 * Known Itaú rejection code descriptions extracted from return message area conventions.
 */
export const ITAU_REJECTION_CODE_DESCRIPTION_MAP: Record<string, string> = {
  '00000001': 'Rejected due to invalid wallet code',
  '00000002': 'Rejected due to invalid payer document',
  '00000003': 'Rejected due to invalid due date',
  '00000004': 'Rejected due to invalid issue date',
  '00000005': 'Rejected due to invalid due date factor',
  '00000006': 'Rejected due to invalid title amount',
  '00000010': 'Rejected due to invalid beneficiary document',
};
