const axios = require('axios');
const chalk = require('chalk'); // to color the output
const lineReader = require('line-reader'); // to read line one by one
const fetch = require('node-fetch');
const fs = require('fs');
const tmp = require('tmp');
const path = require('path');

// to match url with http and https
const regex = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
);
let config; // config file

function setDefaultConfig() {
  config = {
    resultType: 'all',
    isJsonFormat: false,
  };
}

function storeJsonData(url, status) {
  const urlDetails = {
    url: String,
    status: Number,
  };
  urlDetails.url = url;
  urlDetails.status = status;
  return urlDetails;
}

async function checkUrlAndReport(url) {
  await fetch(url, { method: 'head', timeout: 13000, redirect: 'manual' })
    .then((response) => {
      if (config.isJsonFormat === false) {
        if (
          (config.resultType === 'all' || config.resultType === 'bad') &&
          (response.status === 400 || response.status === 404)
        ) {
          console.log(chalk.red.bold(`Bad ===> ${response.status} ===> ${response.url}`));
        } else if (
          (config.resultType === 'all' || config.resultType === 'good') &&
          response.status === 200
        ) {
          console.log(chalk.green.bold(`Good ===> ${response.status} ===> ${response.url}`));
        } else if (
          config.resultType === 'all' &&
          (response.status === 301 || response.status === 307 || response.status === 308)
        ) {
          console.log(chalk.yellow.bold(`Redirect ===> ${response.status} ===> ${response.url}`));
        } else if (config.resultType === 'all') {
          console.log(chalk.grey.bold(`Unknown ===> ${response.status} ===> ${response.url}`));
        }
      } else {
        // output in JSON
        console.log(storeJsonData(response.url, response.status));
      }
    })
    .catch(() => {
      if (config.isJsonFormat === false) {
        if (config.resultType === 'all') {
          console.log(chalk.blue.bold(`Not exist ===> 000 ===> ${url}`));
        }
      } else {
        // output in JSON
        console.log(storeJsonData(url, '000'));
      }
    });
}

// read each line of a file and call checkUrl and Report function
function readFile(fileNames) {
  fileNames.forEach((file) => {
    lineReader.eachLine(file, (line) => {
      // find if any line contains url with http and https
      const matchArray = line.match(regex);
      if (matchArray != null) {
        // remove duplicates
        matchArray.forEach((i) => {
          if (matchArray[i] === matchArray[i + 1]) {
            matchArray.splice(i, 1);
          }
          checkUrlAndReport(i);
        });
      }
    });
  });
}
function readDir(dirs) {
  dirs.forEach((dir) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        readFile(files);
      }
    });
  });
}
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
function manageConfiguration(configFile) {
  try {
    // check if the config file exists or not
    if (fs.existsSync(configFile)) {
      // check if the user provide absolute path or not
      if (path.isAbsolute(configFile)) {
        config = require(configFile);
      } else {
        // get the absolute path of that config file
        const filePath = path.resolve(configFile);
        config = require(filePath);
      }
    } else {
      console.log(
        chalk.bgMagentaBright.bold(' Config file does not exist; Using default config. ')
      );
      setDefaultConfig();
    }
  } catch (err) {
    console.error(err);
  }
}

// archived version from way back machine url
function archivedURL(url) {
  const bashedUrl = encodeURIComponent(url, 26, true);
  axios
    .get(`http://archive.org/wayback/available?url=${bashedUrl}`)
    .then((response) => {
      if (response.data.archived_snapshots.length === 0) {
        console.log(`There is no archived version available for ${url}`);
      } else {
        console.log(
          `Check out the archived version at ${chalk.green.bold(
            `${response.data.archived_snapshots.closest.url}`
          )}`
        );
      }
    })
    .catch((err) => console.log(err));
}
// Check the links in the last 10 posts indexed by your local Telescope
async function handleTelescope() {
  const finalArray = [];

  const posts = await fetch('http://localhost:3000/posts').then((response) => response.json());
  posts.forEach((post) => {
    finalArray.push(
      fetch(`http://localhost:3000${post.url}`)
        .then((response) => response.json())
        .then((data) => data.html)
        .then((postContent) => {
          const tmpObj = tmp.fileSync();
          fs.appendFile(tmpObj.name, postContent, (err) => {
            if (err) throw err;
          });
          return tmpObj.name;
        })
    );
  });
  const files = await Promise.all(finalArray);
  readFile(files);
}

module.exports.archivedURL = archivedURL;
module.exports.readFile = readFile;
module.exports.readDir = readDir;
module.exports.setDefaultConfig = setDefaultConfig;
module.exports.storeJsonData = storeJsonData;
module.exports.checkUrlAndReport = checkUrlAndReport;
module.exports.manageConfiguration = manageConfiguration;
module.exports.handleTelescope = handleTelescope;
