const { getVersion } = require('../src/version');

describe('version test', () => {
  test('get version should return a string', () => {
    expect(typeof getVersion()).toBe('string');
  });
  test('get version should return the exact version details', () => {
    expect(getVersion()).toBe('fbl version: 1.0.0');
  });
});
