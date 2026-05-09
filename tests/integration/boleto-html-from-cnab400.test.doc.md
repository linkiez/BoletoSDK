# boleto-html-from-cnab400.test.ts

## Overview

Integration test that parses a real CNAB400 fixture and generates boleto HTML from the parsed data.

## Responsibilities

- Validate CNAB400 parsing + HTML rendering flow.
- Ensure generated HTML includes core boleto sections and values.

## Inputs and outputs

- Inputs: CNAB400 fixture `itau-remessa-sample1.ret`.
- Outputs: Rendered boleto HTML string validated by assertions.

## Dependencies and integrations

- `parseCnab400` from parser module.
- `buildBoletoHtml` from template module.
- Test helper mapper `mapCnab400ToBoletoTemplateData`.
