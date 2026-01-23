# ItauTemplate

## Overview

HTML template for rendering Itau bank slips.

## Responsibilities

- Render a boleto layout with Itau branding
- Display core boleto information (bank, parties, amount, due date)
- Delegate layout structure to the shared HTML builder

## Inputs and outputs

- Input: `BoletoTemplateData`
- Output: HTML string

## API / Signature

```ts
export class ItauTemplate implements BoletoTemplate {
  render(data: BoletoTemplateData): string;
}
```

## Main flow

```mermaid
flowchart TD
  A[BoletoTemplateData] --> B[ItauTemplate.render]
  B --> C[HTML string]
```

## Error handling and edge cases

- Renders bank logo only when `bank.logo` is provided

## Examples

```ts
const html = new ItauTemplate().render(data);
```

## Dependencies and integrations

- `buildBoletoHtml` from `src/templates/HtmlTemplateBuilder`
- `BoletoTemplate` interface
