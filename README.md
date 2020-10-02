# fbl(find-broken-link)

This is a command line tool designed to report broken link along with good, unknown and other links. 
It can be tested with a file or a url.

## Installation

### Pre-requisite

To use this CLI, you will need node and npm install. [Download and install Node](https://nodejs.org/en/download/) before proceeding with the installation of this CLI.

### Install fbl CLI

To install it, open your terminal and run ` npm install -g https://github.com/sanji11/find-broken-link`. It will install the CLI in your computer  globally.

## Usage

`fbl [options] <argument>`
- To check broken link for a file,
type `fbl -f [path to the file] [path to other file]...`
- To check broken link directy for a url,
type `fbl -u [url]`  

### Options

* `-f`, `--fileName`: path to the file you want to check for broken link
* `-u`, `--url`: url you want to check for broken link
* `-v`, `--version`: prints current version number of the CLI
* `-h`, `--help`: prints the options available for the CLI with the example of how to use it

## Testing

For testing purposes, two test files(test.txt, test2.html) have been provided.

## Improvement

As it is a release 0.1 version of the CLI, the more improved features will be implemented and added in future. Any suggestion will be appriciated. Please do a pull request or open an issue with any suggestions you want to share.

## License

https://www.apache.org/licenses/LICENSE-2.0