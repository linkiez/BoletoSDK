import type { BoletoTemplate, BoletoTemplateData } from './BoletoTemplate';
import { buildBoletoHtml } from './HtmlTemplateBuilder';

export class BBTemplate implements BoletoTemplate {
  public render(data: BoletoTemplateData): string {
    return buildBoletoHtml(data, {
      title: 'Boleto - Banco do Brasil',
      heading: 'Boleto Banco do Brasil',
      bankCodeLabel: 'Código do banco',
    });
  }
}
