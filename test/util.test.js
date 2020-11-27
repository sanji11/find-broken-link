const chalk = require('chalk');
const nock = require('nock');
const {
  storeJsonData,
  checkUrlAndReport,
  setDefaultConfig,
  manageConfiguration,
} = require('../src/util');

const originalConsoleLogFn = global.console.log;
const originalConsoleErrorFn = global.console.error;

describe('storeJsonData test', () => {
  test('it should return a JSON object', () => {
    const expectedOutput = { url: 'abc', status: 200 };
    expect(storeJsonData('abc', 200)).toEqual(expectedOutput);
  });
});

describe('checkUrlAndReport test', () => {
  let logOutput = null;
  let errorOutput = null;

  function testLogFn(...args) {
    logOutput = logOutput || [];
    args.forEach((arg) => logOutput.push(arg));
  }

  function testErrorFn(...args) {
    errorOutput = errorOutput || [];
    args.forEach((arg) => errorOutput.push(arg));
  }

  function finalize(output) {
    if (output && Array.isArray(output)) {
      return output.join('');
    }
    return output;
  }

  beforeEach(() => {
    // setDefaultConfig();
    global.console.log = testLogFn;
    global.console.error = testErrorFn;

    logOutput = null;
    errorOutput = null;
  });

  afterEach(() => {
    global.console.log = originalConsoleLogFn;
    global.console.error = originalConsoleErrorFn;

    logOutput = null;
    errorOutput = null;
  });
  // test for config type
  test('config result type good should only displays good URL', async () => {
    setDefaultConfig('good');
    await checkUrlAndReport('https://medium.com/');
    const expected = chalk.green.bold(`Good ===> 200 ===> https://medium.com/`);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('config result type bad should only displays bad URL', async () => {
    setDefaultConfig('bad');
    await checkUrlAndReport('http://gogle.ca');
    const expected = chalk.red.bold(`Bad ===> 404 ===> http://gogle.ca/`);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  // test for output color
  test('url with status 200 prints in green', async () => {
    setDefaultConfig(); // when no parameter passed, default is: resultType: 'all', isJsonFormat: false
    await checkUrlAndReport('https://medium.com/');
    const expected = chalk.green.bold(`Good ===> 200 ===> https://medium.com/`);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url with status 400 or 404 prints in red', async () => {
    setDefaultConfig();
    await checkUrlAndReport('http://gogle.ca');
    const expected = chalk.red.bold(`Bad ===> 404 ===> http://gogle.ca/`);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url with status 301 or 307 or 308 prints in yellow', async () => {
    setDefaultConfig();
    await checkUrlAndReport('http://abc.com');
    const expected = chalk.yellow.bold(`Redirect ===> 301 ===> http://abc.com/`);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url with status 000 prints in blue', async () => {
    setDefaultConfig();
    await checkUrlAndReport('http://go0gle.ca');
    const expected = chalk.blue.bold(`Not exist ===> 000 ===> http://go0gle.ca`);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url other than above status prints in grey', async () => {
    setDefaultConfig();
    await checkUrlAndReport('http://stronglytyped.ca/category/spo600/feed/');
    const expected = chalk.grey.bold(
      `Unknown ===> 500 ===> http://stronglytyped.ca/category/spo600/feed/`
    );
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  // test for status code
  test('url should return 200 status code and should be considered as good', async () => {
    setDefaultConfig();
    nock('https://medium.com').head('/').reply(200);
    await checkUrlAndReport('https://medium.com/');
    const expected = chalk.green.bold(`Good ===> 200 ===> https://medium.com/`);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url should return 400 or 404 status code and should be considered as bad', async () => {
    setDefaultConfig();
    nock('http://gogle.ca').head('/').reply(404);
    await checkUrlAndReport('http://gogle.ca');
    const expected = chalk.red.bold(`Bad ===> 404 ===> http://gogle.ca/`);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url should return 301 or 307 or 308 status code and should be considered as redirect', async () => {
    setDefaultConfig();
    nock('http://abc.com').head('/').reply(301);
    await checkUrlAndReport('http://abc.com');
    const expected = chalk.yellow.bold(`Redirect ===> 301 ===> http://abc.com/`);
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url should return other status code and should be considered as Unknown', async () => {
    setDefaultConfig();
    nock('http://stronglytyped.ca/category/spo600/feed/').head('/').reply(500);
    await checkUrlAndReport('http://stronglytyped.ca/category/spo600/feed/');
    const expected = chalk.grey.bold(
      `Unknown ===> 500 ===> http://stronglytyped.ca/category/spo600/feed/`
    );
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
});

describe('manageConfiguration test', () => {
  let logOutput = null;
  let errorOutput = null;

  function testLogFn(...args) {
    logOutput = logOutput || [];
    args.forEach((arg) => logOutput.push(arg));
  }

  function testErrorFn(...args) {
    errorOutput = errorOutput || [];
    args.forEach((arg) => errorOutput.push(arg));
  }

  function finalize(output) {
    if (output && Array.isArray(output)) {
      return output.join('');
    }
    return output;
  }

  beforeEach(() => {
    // setDefaultConfig();
    global.console.log = testLogFn;
    global.console.error = testErrorFn;

    logOutput = null;
    errorOutput = null;
  });

  afterEach(() => {
    global.console.log = originalConsoleLogFn;
    global.console.error = originalConsoleErrorFn;

    logOutput = null;
    errorOutput = null;
  });

  test('configure file is empty', () => {
    const configFile = '';
    manageConfiguration(configFile);
    const expected = chalk.bgMagentaBright.bold(
      ' Config file does not exist; Using default config. '
    );
    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
});
