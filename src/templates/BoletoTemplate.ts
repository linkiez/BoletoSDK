export interface BoletoTemplateData {
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

export interface BoletoTemplate {
  render(data: BoletoTemplateData): string;
}
