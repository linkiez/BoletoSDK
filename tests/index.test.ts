import { BoletoSDK } from '../src/index';

describe('BoletoSDK', () => {
  describe('constructor', () => {
    it('should create an instance', () => {
      const sdk = new BoletoSDK();
      expect(sdk).toBeInstanceOf(BoletoSDK);
    });
  });

  describe('getVersion', () => {
    it('should return version string', () => {
      const sdk = new BoletoSDK();
      const version = sdk.getVersion();
      expect(typeof version).toBe('string');
      expect(version).toBe('1.0.0');
    });
  });
});
