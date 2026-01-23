import type { BoletoTemplate, BoletoTemplateData } from './BoletoTemplate';
import { buildBoletoHtml } from './HtmlTemplateBuilder';

export class BradescoTemplate implements BoletoTemplate {
  public render(data: BoletoTemplateData): string {
    return buildBoletoHtml(data, {
      title: 'Boleto - Bradesco',
      heading: 'Boleto Bradesco',
      bankCodeLabel: 'Código do banco',
    });
  }
}
