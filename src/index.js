#!/usr/bin/env node

const chalk = require('chalk'); // to color the output
const argv = require('yargs');
const util = require('./util.js');
const version = require('./version.js');

// handle when there is an option

function handleArg(args) {
  util.setDefaultConfig();
  if (args.c) {
    util.manageConfiguration(args.c);
  }
  if (args.f) {
    util.readFile(args.f);
  } else if (args.d) {
    util.readDir(args.d);
  } else if (args.u) {
    args.u.forEach((singleUrl) => {
      util.checkUrlAndReport(singleUrl);
    });
  } else if (args.a) {
    args.a.forEach((singleUrl) => {
      util.archivedURL(singleUrl);
    });
  } else if (args.v) {
    console.log(chalk.red.bold('Current Version Number: {$v}'));
  } else if (args.t) {
    util.handleTelescope();
  }
}
// set the argument

/* eslint-disable no-unused-expressions */
argv
  .scriptName('fbl')
  .usage('Usage: $0 [options] <argument> where argument can be a file name or a url')
  .example('$ fbl -f ./test.html ./test.txt', 'process the files to find any broken link.')
  .example(
    '$ fbl -d ./test/ ./test2/',
    'process the files in the directories to find any broken link.'
  )
  .example(
    '$ fbl -u https://www.google.ca/ https://www.facebook.com/',
    'check all the url if it is broken link or not.'
  )
  .example(
    '$fbl -a https://www.google.com/ https://www.facebook.com/',
    'Check all the url if it has archived version or not'
  )
  .example(
    'fbl -c src/fbl-config.json -f ./test.txt/ ',
    "Print the URL from the file based on Config file's result type and report format(JSON)"
  )
  .option('f', {
    alias: 'fileName',
    describe: 'Show the broken link for any number of file',
    type: 'array',
  })
  .option('d', {
    alias: 'dir',
    describe: 'Show the broken link for any number of directory',
    type: 'array',
  })
  .option('u', {
    alias: 'url',
    describe: 'Show the broken link for any number of URL',
    type: 'array',
  })
  .option('a', {
    alias: 'archived',
    describe: 'Show the archived version of any number of URL',
    type: 'array',
  })
  .option('c', {
    alias: 'config',
    describe: 'Provide a config file',
    type: 'string',
  })
  .option('t', {
    alias: 'telescope',
    describe: 'Check the links in the last 10 posts indexed by your local Telescope',
    type: 'boolean',
  })
  .alias('v', 'version')
  .version(chalk.yellow(`${version.getVersion()}`))
  .alias('h', 'help')
  .epilog('copyright 2020')

  .check((args) => {
    // check if the options is provided or argument with option is provided or not
    if (
      (args.f && args.f.length !== 0) ||
      (args.a && args.a.length !== 0) ||
      (args.u && args.u.length !== 0) ||
      (args.d && args.d.length !== 0) ||
      args.t
    ) {
      handleArg(args);
      return true;
    }
    throw new Error(chalk.red.bold('At least one option/argument is required!'));
  }).argv;
