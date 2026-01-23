import type { BoletoTemplate, BoletoTemplateData } from './BoletoTemplate';
import { buildBoletoHtml } from './HtmlTemplateBuilder';

export class GenericTemplate implements BoletoTemplate {
  public render(data: BoletoTemplateData): string {
    return buildBoletoHtml(data, {
      title: 'Boleto',
      heading: 'Boleto',
      bankLabel: 'Banco',
      bankCodeLabel: 'Banco',
      showBankName: false,
    });
  }
}
