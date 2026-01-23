# BBTemplate

## Overview

HTML template for rendering Banco do Brasil bank slips.

## Responsibilities

- Render a boleto layout with Banco do Brasil branding
- Display core boleto information (bank, parties, amount, due date)
- Delegate layout structure to the shared HTML builder

## Inputs and outputs

- Input: `BoletoTemplateData`
- Output: HTML string

## API / Signature

```ts
export class BBTemplate implements BoletoTemplate {
  render(data: BoletoTemplateData): string;
}
```

## Main flow

```mermaid
flowchart TD
  A[BoletoTemplateData] --> B[BBTemplate.render]
  B --> C[HTML string]
```

## Error handling and edge cases

- Renders bank logo only when `bank.logo` is provided

## Examples

```ts
const html = new BBTemplate().render(data);
```

## Dependencies and integrations

- `buildBoletoHtml` from `src/templates/HtmlTemplateBuilder`
- `BoletoTemplate` interface
