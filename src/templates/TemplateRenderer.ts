import type { BoletoTemplate, BoletoTemplateData } from './BoletoTemplate';

export class TemplateRenderer {
  public render(template: BoletoTemplate, data: BoletoTemplateData): string {
    return template.render(data);
  }
}
