import type { BoletoTemplate, BoletoTemplateData } from './BoletoTemplate';
import { IndustrialIntegrityTemplate } from './IndustrialIntegrityTemplate';

export class GenericTemplate implements BoletoTemplate {
  public render(data: BoletoTemplateData): string {
    return new IndustrialIntegrityTemplate().render(data);
  }
}
