# BoletoSDK v1.0.0 - Publication Instructions

## Status: Ready for npm Publication ✅

All release artifacts have been prepared and committed. The GitHub release has been created successfully.

### Completed Steps:
- ✅ v1.0.0 tag created and pushed to GitHub
- ✅ GitHub Release published: https://github.com/linkiez/BoletoSDK/releases/tag/v1.0.0
- ✅ Release branch merged to main and pushed
- ✅ Build compiled to `dist/` directory
- ✅ Package metadata configured (package.json with version 1.0.0)

### Remaining Step: npm Publication

To publish to npm registry, complete the following:

#### Option 1: Using npm token (Recommended for CI/CD)

1. Generate an npm access token at https://www.npmjs.com/settings/~/tokens
2. Create/update `~/.npmrc` with:
   ```
   //registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE
   ```
3. Run:
   ```bash
   npm publish --ignore-scripts
   ```

#### Option 2: Interactive npm login

1. Run:
   ```bash
   npm login
   ```
2. Enter your npm username, password, and OTP (if enabled)
3. Publish:
   ```bash
   npm publish --ignore-scripts
   ```

### Verification After Publishing

Verify the package is available:
```bash
npm view @linkiez/boleto-sdk@1.0.0
```

Install from npm to verify:
```bash
npm install @linkiez/boleto-sdk@1.0.0
```

## Release Summary

**Version:** 1.0.0
**Release Date:** 2026-05-09
**GitHub Release:** https://github.com/linkiez/BoletoSDK/releases/tag/v1.0.0

### Key Features:
- Complete CNAB400 and CNAB240 support
- Boleto generation (HTML/PDF) with barcode and PIX QR codes
- In-memory PDF streaming
- Email utilities for boleto delivery
- Comprehensive test coverage (905 tests passing)
- TypeScript definitions included

### Package Details:
- **Entry Point:** `./dist/index.js` (CommonJS)
- **Types:** `./dist/index.d.ts`
- **Exports:** Configured for dual CommonJS/ESM usage
- **Scope:** `@linkiez/boleto-sdk` on npm registry
