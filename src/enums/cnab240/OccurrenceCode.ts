/**
 * CNAB240 Occurrence Codes (Remessa - Remittance)
 *
 * Instructions sent to the bank about what to do with the slip.
 * These codes are used in the Detail records (Segment P).
 *
 * @see FEBRABAN CNAB240 Specification
 */
export enum OccurrenceCodeRemessa {
  /**
   * 01 - Entrada de Título (Slip Registration)
   * Register new slip in the bank
   */
  REGISTER_SLIP = '01',

  /**
   * 02 - Pedido de Baixa (Request Cancelation)
   * Request to cancel/write-off the slip
   */
  REQUEST_CANCELATION = '02',

  /**
   * 03 - Concessão de Abatimento (Grant Rebate)
   * Grant a rebate/discount on the slip
   */
  GRANT_REBATE = '03',

  /**
   * 04 - Cancelamento de Abatimento (Cancel Rebate)
   * Cancel a previously granted rebate
   */
  CANCEL_REBATE = '04',

  /**
   * 05 - Concessão de Desconto (Grant Discount)
   * Grant a discount on the slip
   */
  GRANT_DISCOUNT = '05',

  /**
   * 06 - Cancelamento de Desconto (Cancel Discount)
   * Cancel a previously granted discount
   */
  CANCEL_DISCOUNT = '06',

  /**
   * 07 - Alteração de Vencimento (Change Due Date)
   * Modify the slip due date
   */
  CHANGE_DUE_DATE = '07',

  /**
   * 08 - Alteração do Valor do Título (Change Slip Amount)
   * Modify the slip amount
   */
  CHANGE_AMOUNT = '08',

  /**
   * 09 - Protestar (Protest)
   * Send slip for protest
   */
  PROTEST = '09',

  /**
   * 10 - Sustar Protesto e Baixar Título (Cancel Protest and Write-off)
   * Cancel protest and write-off the slip
   */
  CANCEL_PROTEST_AND_WRITEOFF = '10',

  /**
   * 11 - Sustar Protesto e Manter em Carteira (Cancel Protest and Keep)
   * Cancel protest but keep slip active
   */
  CANCEL_PROTEST_AND_KEEP = '11',

  /**
   * 12 - Alteração de Juros de Mora (Change Interest)
   * Modify late payment interest
   */
  CHANGE_INTEREST = '12',

  /**
   * 13 - Dispensar Cobrança de Juros de Mora (Waive Interest)
   * Waive late payment interest
   */
  WAIVE_INTEREST = '13',

  /**
   * 14 - Alteração de Valor/Percentual de Multa (Change Fine)
   * Modify fine value or percentage
   */
  CHANGE_FINE = '14',

  /**
   * 15 - Dispensar Cobrança de Multa (Waive Fine)
   * Waive fine
   */
  WAIVE_FINE = '15',

  /**
   * 16 - Alteração do Valor de Desconto (Change Discount Amount)
   * Modify discount amount
   */
  CHANGE_DISCOUNT_AMOUNT = '16',

  /**
   * 17 - Não Conceder Desconto (Do Not Grant Discount)
   * Cancel automatic discount
   */
  DO_NOT_GRANT_DISCOUNT = '17',

  /**
   * 18 - Alteração do Valor de Abatimento (Change Rebate Amount)
   * Modify rebate amount
   */
  CHANGE_REBATE_AMOUNT = '18',

  /**
   * 19 - Não Conceder Abatimento (Do Not Grant Rebate)
   * Cancel automatic rebate
   */
  DO_NOT_GRANT_REBATE = '19',

  /**
   * 20 - Alteração de Dados do Sacado (Change Payer Data)
   * Modify payer information
   */
  CHANGE_PAYER_DATA = '20',

  /**
   * 21 - Alteração de Outros Dados (Change Other Data)
   * Modify other slip information
   */
  CHANGE_OTHER_DATA = '21',

  /**
   * 22 - Alteração de Dados do Rateio de Crédito (Change Credit Split Data)
   * Modify credit split information
   */
  CHANGE_CREDIT_SPLIT = '22',

  /**
   * 23 - Cancelar Rateio de Crédito (Cancel Credit Split)
   * Cancel credit split
   */
  CANCEL_CREDIT_SPLIT = '23',

  /**
   * 31 - Alteração de Carteira (Change Portfolio)
   * Change slip portfolio type
   */
  CHANGE_PORTFOLIO = '31',

  /**
   * 34 - Baixa por Ter Sido Pago Diretamente ao Beneficiário (Write-off - Paid Directly)
   * Write-off because it was paid directly to beneficiary
   */
  WRITEOFF_PAID_DIRECTLY = '34',

  /**
   * 35 - Cancelar Instrução (Cancel Instruction)
   * Cancel a previous instruction
   */
  CANCEL_INSTRUCTION = '35',

  /**
   * 37 - Alterar Vencimento e Sustar Protesto (Change Due Date and Cancel Protest)
   * Modify due date and cancel protest
   */
  CHANGE_DUE_DATE_AND_CANCEL_PROTEST = '37',

  /**
   * 38 - Beneficiário Não Concorda com Alegação do Sacado (Beneficiary Disagrees with Payer)
   * Beneficiary does not agree with payer's claim
   */
  BENEFICIARY_DISAGREES = '38',

  /**
   * 47 - Alterar Controle do Participante (Change Participant Control)
   * Modify participant control number
   */
  CHANGE_PARTICIPANT_CONTROL = '47',

  /**
   * 68 - Acerto nos Dados do Rateio de Crédito (Adjust Credit Split Data)
   * Adjust credit split data
   */
  ADJUST_CREDIT_SPLIT = '68',

  /**
   * 69 - Cancelamento de Dados do Rateio (Cancel Credit Split Data)
   * Cancel credit split data
   */
  CANCEL_CREDIT_SPLIT_DATA = '69',
}

/**
 * CNAB240 Occurrence Codes (Retorno - Return)
 *
 * Return codes sent by the bank about slip status.
 * These codes are used in the Detail records (Segment T/U).
 *
 * @see FEBRABAN CNAB240 Specification
 */
export enum OccurrenceCodeRetorno {
  /**
   * 02 - Entrada Confirmada (Registration Confirmed)
   * Slip successfully registered
   */
  REGISTRATION_CONFIRMED = '02',

  /**
   * 03 - Entrada Rejeitada (Registration Rejected)
   * Slip registration rejected
   */
  REGISTRATION_REJECTED = '03',

  /**
   * 04 - Alteração de Dados Confirmada (Data Change Confirmed)
   * Data change successfully processed
   */
  DATA_CHANGE_CONFIRMED = '04',

  /**
   * 05 - Alteração de Dados Rejeitada (Data Change Rejected)
   * Data change rejected
   */
  DATA_CHANGE_REJECTED = '05',

  /**
   * 06 - Liquidação Normal (Normal Payment)
   * Slip paid normally
   */
  PAID_NORMALLY = '06',

  /**
   * 07 - Liquidação Parcial (Partial Payment)
   * Slip partially paid
   */
  PAID_PARTIALLY = '07',

  /**
   * 08 - Liquidação por Conta (Payment by Third Party)
   * Slip paid by a third party
   */
  PAID_BY_THIRD_PARTY = '08',

  /**
   * 09 - Baixa Confirmada (Write-off Confirmed)
   * Write-off successfully processed
   */
  WRITEOFF_CONFIRMED = '09',

  /**
   * 10 - Baixa Rejeitada (Write-off Rejected)
   * Write-off rejected
   */
  WRITEOFF_REJECTED = '10',

  /**
   * 11 - Títulos em Carteira (Slip in Portfolio)
   * Slip status in portfolio
   */
  IN_PORTFOLIO = '11',

  /**
   * 12 - Abatimento Concedido (Rebate Granted)
   * Rebate successfully granted
   */
  REBATE_GRANTED = '12',

  /**
   * 13 - Abatimento Cancelado (Rebate Canceled)
   * Rebate successfully canceled
   */
  REBATE_CANCELED = '13',

  /**
   * 14 - Vencimento Alterado (Due Date Changed)
   * Due date successfully changed
   */
  DUE_DATE_CHANGED = '14',

  /**
   * 15 - Liquidação em Cartório (Payment in Notary)
   * Slip paid at notary office
   */
  PAID_IN_NOTARY = '15',

  /**
   * 17 - Liquidação Após Baixa (Payment After Write-off)
   * Slip paid after being written off
   */
  PAID_AFTER_WRITEOFF = '17',

  /**
   * 19 - Confirmação de Instrução de Protesto (Protest Instruction Confirmed)
   * Protest instruction confirmed
   */
  PROTEST_INSTRUCTION_CONFIRMED = '19',

  /**
   * 20 - Confirmação de Sustação de Protesto (Protest Cancelation Confirmed)
   * Protest cancelation confirmed
   */
  PROTEST_CANCELATION_CONFIRMED = '20',

  /**
   * 23 - Entrada de Título em Cartório (Slip Sent to Notary)
   * Slip sent to notary for protest
   */
  SENT_TO_NOTARY = '23',

  /**
   * 25 - Baixa por Protesto (Write-off by Protest)
   * Slip written off due to protest
   */
  WRITEOFF_BY_PROTEST = '25',

  /**
   * 28 - Débito de Tarifas/Custos (Fees/Costs Debit)
   * Bank fees/costs debited
   */
  FEES_DEBITED = '28',

  /**
   * 73 - Confirmação de Entrada - Cobrança Simples (Simple Collection Entry Confirmed)
   * Simple collection entry confirmed
   */
  SIMPLE_COLLECTION_ENTRY_CONFIRMED = '73',
}
