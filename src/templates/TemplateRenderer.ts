import type { BoletoTemplate, BoletoTemplateData } from './BoletoTemplate';
import {
  buildBoletoHtmlWithPixQrCode,
  type BoletoHtmlPixDependencies,
  type BoletoHtmlTemplateOptions,
} from './HtmlTemplateBuilder';

export class TemplateRenderer {
  public render(template: BoletoTemplate, data: BoletoTemplateData): string {
    return template.render(data);
  }

  public async renderHtmlWithPixQrCode(
    data: BoletoTemplateData,
    options: BoletoHtmlTemplateOptions = {},
    dependencies: BoletoHtmlPixDependencies = {},
  ): Promise<string> {
    return buildBoletoHtmlWithPixQrCode(data, options, dependencies);
  }
}
