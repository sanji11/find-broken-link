# fbl(find-broken-link)

This is a command line tool designed to report broken link and their status, such as good, bad, redirect, unknown and not exist.

## Feature

![fbl](./fbl_cmd.PNG)

- Identify different types of URL with status code in colour coded:
  - Good link - status code `200`
  - Redirect link - status code `301`, `307`, `308`
  - Bad link - status code `400`, `404`
  - Unknown link - status code except above ones
  - Not exist link - status code with timeout and DNS issues
- Find broken links for one or more file
- Find broken links for one or more file in one or more directory
- Find broken links directly from one or more URL
- Find archvied version of link directly from one or more URL
- Accepts configuration file for customizing result (good, bad, all links) and report format (JSON)
- Check the links in the last 10 posts indexed by your local Telescope

## Usage

`fbl [options] <argument>`

To check broken links in one or more files:

```sh
$ fbl -f [path to file1] [path to file2]...
```

To check broken link for one or more file in one or more directories:

```sh
$ fbl -d [path to directory1] [path to other directory2]...
```

To check broken link directy for one or more URL:

```sh
 $ fbl -u [url1] [url2]...
```

To find an archived version of one or more URL:

```sh
$ fbl -a [url1] [url2]...
```

To print specific type of URL(good/bad/all):

```sh
$ fbl -c [path to Config file] <another option>
```

The Config file must be a valid json with following structure:

```
{
    "resultType" : "[type]",
    "isJsonFormat" : boolean
}
```

where type can be `good` or `bad` or `all` and isJsonFormat is boolean : `true` or `false`. You can change the resultType and isJsonFormat while testing.

### Options

- `-f`, `--fileName`: path to one or more files you want to check for broken link
- `-d`, `--dir` : path to one or more directories you want to check for broken link
- `-u`, `--url`: one or more URL you want to check for broken link
- `-a`, `--archived`: one or more URL you want to check for archived version
- `-c`, `--config`: uses the configuartion from specified file
- `-t`, `--telescope` : Check the links in the last 10 posts indexed by your local Telescope
- `-v`, `--version`: prints current version number of the CLI with tool name
- `-h`, `--help`: prints the options available for the CLI with the example of how to use it

## Testing

For testing purposes, two test files(test.txt, test2.html), one test directory, and a Config file have been provided.

## Improvement

I am actively working on this project and hoping to add more improved features in future. Any suggestion will be appriciated. Please do a pull request or open an issue with any suggestions you want to share.

For contribution information, please check [the contributiors documentation](CONTRIBUTING.md).

## License

https://www.apache.org/licenses/LICENSE-2.0
