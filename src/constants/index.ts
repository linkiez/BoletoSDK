// Exports all constants from all subfolders
export * from './bancos';

// Export CNAB240 and CNAB400 constants under their own namespaces to avoid conflicts
export * as CNAB240 from './cnab240';
export * as CNAB400 from './cnab400';
