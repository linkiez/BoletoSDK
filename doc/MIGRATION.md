# Migration Guide

This guide describes how to migrate between major versions of BoletoSDK.

## From 0.x to 1.x

When the first stable release is published, this section will describe breaking changes and required code updates.

### Expected Areas of Change

- Public API names and exports
- TypeScript types
- Validation behavior and error handling
- Default values for generator fields

### Migration Checklist

- Update package version in your project
- Rebuild TypeScript typings
- Run tests against existing CNAB fixtures
- Review error messages and validation behavior
- Verify file generation outputs (line lengths and record counts)

## Compatibility Notes

- CNAB240 and CNAB400 formats remain supported
- Existing parsing and generation flows will be preserved where possible

## Need Help?

Open an issue at:

- https://github.com/linkiez/BoletoSDK/issues
