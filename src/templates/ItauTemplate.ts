import type { BoletoTemplate, BoletoTemplateData } from './BoletoTemplate';
import { buildBoletoHtml } from './HtmlTemplateBuilder';

export class ItauTemplate implements BoletoTemplate {
  public render(data: BoletoTemplateData): string {
    return buildBoletoHtml(data, {
      title: 'Boleto - Itaú',
      heading: 'Boleto Itaú',
      bankCodeLabel: 'Código do banco',
    });
  }
}
