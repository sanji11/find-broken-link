# Contributing to FBL (find-broken-link)

## Installation

### Pre-requisite

To use this CLI, you will need node and npm installed. [Download and install Node](https://nodejs.org/en/download/) before proceeding with the installation of this CLI.

### Install `fbl` CLI

To install it globally on your computer, open your terminal and run ` npm install -g https://github.com/sanji11/find-broken-link`.

## Development Guide

A guideline of how to use the tool for development:

- Clone the repo: `git clone https://github.com/sanji11/find-broken-link.git`
- Install it locally on your computer: `npm install -g .`

## Formatting Your Codes

To make your code prettier, run the following command:

```sh
$ npm run prettier
```

To make sure the above command is ran and your code is prettier at the moment, run the following command:

```sh
$ npm run prettier-check
```

## Make Your Code Bug Free

To spot "silly" mistakes that all programmers make, or avoid certain code patterns that often lead to bugs, run the following command:

```sh
$ npm run eslint
```

or

```sh
$ npm run lint
```

This command will report any bug or mistake you made in your code.

To fix the fixable bug by eslint, run following command:

```sh
$ npm run eslint-fix
```

## Editor/IDE Integration

Recommended Editor: **Visual studio code**
This project use `prettier` and `eslint` extension. Install the extensions before starting:

### Prettier Extension Installation:

Prettier-vscode can be installed using the extension sidebar – it’s called “Prettier - Code formatter.”
For more information, check [prettier documentation on editor configuration.](https://prettier.io/docs/en/editors.html)

### Eslint Extension Installion:

To install the extension, [go to the following link](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and press "Install"

## Run Test Framework

To run test, run the following command:

```sh
$ npm run test
```

## Run Coverage Tool

To generate code coverage for current tests, run the following command:

```sh
$ npm run coverage
```

You can check the coverage report in browser by running following command:

```sh
$ open coverage/lcov-report/index.html
```

## Rules for Writing Test

There are many more tests needed for this CLI. Your contribution in writing tests will be greatly appreciated. Some simple rule to follow:

- write tests inside test folder
- tests are divided by .js file. If you are writing test for a function in util.js, you should write the test in corresponding test files which is util.test.js
- each function's test should be in their own describe scope
