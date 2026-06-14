---
name: Industrial Integrity
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#46464b'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#77767b'
  outline-variant: '#c7c6cb'
  surface-tint: '#5f5e61'
  primary: '#121315'
  on-primary: '#ffffff'
  primary-container: '#27272a'
  on-primary-container: '#8f8e91'
  inverse-primary: '#c8c6c9'
  secondary: '#bb0112'
  on-secondary: '#ffffff'
  secondary-container: '#e02928'
  on-secondary-container: '#fffbff'
  tertiary: '#121218'
  on-tertiary: '#ffffff'
  tertiary-container: '#27272d'
  on-tertiary-container: '#8f8d96'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e1e5'
  primary-fixed-dim: '#c8c6c9'
  on-primary-fixed: '#1b1b1e'
  on-primary-fixed-variant: '#47464a'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000b'
  tertiary-fixed: '#e3e1ea'
  tertiary-fixed-dim: '#c7c5ce'
  on-tertiary-fixed: '#1b1b21'
  on-tertiary-fixed-variant: '#46464d'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  slate-steel: '#27272A'
  industrial-red: '#DC2626'
  iron-gray: '#3F3F46'
  surface-alt: '#F4F4F5'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  field-height: 48px
  margin-xs: 4px
  margin-sm: 8px
  margin-md: 16px
  margin-lg: 32px
---

## Brand & Style

This design system is engineered for the industrial and metallurgical sector, specifically tailored for the professional presentation of financial documents like the "Boleto Bancário." The brand personality is authoritative, precise, and dependable. It reflects the strength of metal through a structured, high-utility aesthetic.

The chosen style is **Corporate / Modern** with a lean toward **Minimalism**. By prioritizing extreme legibility and a logical information hierarchy, the UI ensures that critical financial data is processed without friction. The design avoids unnecessary flourish, favoring clean lines, generous white space, and a sense of architectural stability that builds trust between the provider and the client.

## Colors

The color palette is derived from the textures of raw materials and industrial environments. 

- **Primary (Slate Steel):** Used for primary text, headers, and structural elements. It provides a more sophisticated, softer alternative to pure black while maintaining high contrast for accessibility.
- **Secondary (Industrial Red):** Reserved strictly for "Action" or "Alert" items—specifically the total amount, due date, and critical barcodes. This draws the eye immediately to the most vital information.
- **Tertiary (Iron Gray):** Utilized for secondary information, borders, and supporting labels.
- **Neutral (Surface):** The background is kept near-white (#F9FAFB) to ensure a "clean-sheet" feel, with subtle gray fills used to group related data fields.

## Typography

The typography system uses a tri-font approach to balance character with technical precision.

- **Hanken Grotesk** is used for main headings and titles, providing a sharp, contemporary "engineered" look.
- **Inter** handles all body copy and descriptions, ensuring maximum readability across digital and printed formats.
- **JetBrains Mono** is utilized for labels (e.g., "Data de Vencimento") and the numeric strings of the barcode (Linha Digitável). Its monospaced nature ensures that numbers align perfectly, reducing errors during manual entry.

All labels should be rendered in uppercase using the `label-caps` style to distinguish them from the user's variable data.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for documents, based on an 8px spacing scale. 

The layout for the boleto is divided into a structured header (Logo and Bank Code), a data grid, and a footer (Barcode). The data grid follows a "Cell" model where each piece of information is contained within a defined boundary. 

On desktop, the content is centered with a max-width of 800px to mimic a standard A4 sheet. On mobile, the grid collapses into a single column, but the "Linha Digitável" (the code used for payment) remains fixed at the top or bottom of the viewport for easy copying.

## Elevation & Depth

To maintain a professional and "printable" look, this design system avoids heavy shadows. Instead, it uses **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** #F9FAFB.
- **Level 1 (Field Fill):** Surfaces that require data entry or highlighting use a subtle #F4F4F5 fill.
- **Outlines:** Use 1px solid borders in #E4E4E7 (Iron Gray at low opacity).

This "flat-but-layered" approach ensures that the document looks as good on a screen as it does when printed on a thermal or laser printer. Depth is conveyed through subtle changes in background saturation rather than optical shadows.

## Shapes

The shape language is **Soft (0.25rem)**. While the brand is industrial, pure sharp corners can feel aggressive and dated. A subtle radius on input fields and containers provides a modern touch without sacrificing the professional, "engineered" aesthetic.

- **Standard Buttons/Inputs:** 4px radius.
- **Data Containers:** 4px radius.
- **Badges/Chips:** 2px radius (near-sharp).

## Components

### Buttons
Primary buttons use the Slate Steel (#27272A) background with white text. For the "Copy Code" action, use a secondary style with a Slate Steel outline.

### Input Fields / Data Cells
Each field in the boleto consists of a `label-caps` at the top-left and the data value in `body-md` or `body-lg` centered or left-aligned. Use a 1px border (#E4E4E7) to define the grid.

### The "Linha Digitável" Component
The numeric sequence must be presented in a high-contrast box with a "Copy" icon. Use the Industrial Red (#DC2626) for the text color of the "Due Date" and "Total Amount" to ensure they are the most prominent elements on the page.

### Barcode
The barcode should be rendered with a minimum height of 50px and a clear "quiet zone" (white space) around it to ensure scanners can read it accurately.

### Status Chips
If the boleto is "Paid" or "Overdue," use small rectangular chips. "Paid" uses a muted emerald tint, while "Overdue" uses the Industrial Red.