# AttachmentHelper

## Overview

Wraps generated boleto content as email attachments.

## Responsibilities

- Create PDF attachments from `Buffer` content.
- Create HTML attachments from string content.

## Inputs and outputs

- Inputs:
  - Filename and content for PDF or HTML attachments.
- Outputs:
  - Structured `EmailAttachment` objects.

## API / Signature

```ts
export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export function createPdfAttachment(filename: string, content: Buffer): EmailAttachment;
export function createHtmlAttachment(filename: string, htmlContent: string): EmailAttachment;
```

## Dependencies and integrations

- Used by `EmailTemplateGenerator` to build attachment lists.
