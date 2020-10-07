#!/usr/bin/env node

const chalk = require("chalk"); //to color the output
const lineReader = require('line-reader'); // to read line one by one
const fetch = require("node-fetch"); // to send request and get response
const axios = require('axios');
// to match url with http and https
const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g);
//set the arguement
const argv = require("yargs")
    .scriptName("fbl")
    .usage("Usage: $0 [options] <argument> where argument can be a file name or a url")
    .example(
        "$ fbl -f test.html or test.txt",
        "process the file to find any broken link inside the file."
    )
    .example(
        "$ fbl -u https://www.google.ca/",
        "check the url if it is broken link or not."
    )
    .option("f", {
        alias: "fileName",
        describe: "Any file you want to check for broken link",
        type: "array",

    })
    .option("u", {
        alias: "url",
        describe: "Any url you want to check for broken link",
        type: "string",

    })
    .option("a", {
        alias: "archived",
        describe: "Show the archived version of an URL",
        type: "string",
    })
    .check((argv) => {
        if (argv.f || argv.u || argv.a) {
            handleArg(argv)
            return true
        }
        console.log(chalk.red.bold('At least one arguement is required!'));
        return false
    })
    .version('v', 'Show version number', '1.0.0')
    .alias('v', 'version')
    .help('h', "Show help.")
    .alias('h', 'help')
    .epilog("copyright 2020")
    .argv;

//handle when there is a arguement
function handleArg(argv) {
    //when argument is a filename
    if (argv.f) {
        readFile(argv.f)
        //when arguemnt is a url
    } else if (argv.u) {
        checkUrlAndReport(argv.u)
    }
    else if (argv.a) {
        console.log(argv.a);
        archivedURL(argv.a)
    }
}

//send http request and check the status
function checkUrlAndReport(url) {
    fetch(url, { method: "head", timeout: 13000 })
        .then(function (response) {
            if (response.status == 400 || response.status == 404) {
                console.log(chalk.red.bold("Bad ===> " + response.status + " ===> " + response.url));
            } else if (response.status == 200) {
                console.log(chalk.green.bold("Good ===> " + response.status + " ===> " + response.url));
            } else {
                console.log(chalk.grey.bold("Unknown ===> " + response.status + " ===> " + response.url));
            }
        }).catch(function (err) {
            console.log(chalk.blue.bold("Not exist ===> 000 ===> " + url));
        })
}

// read each line of a file and call checkUrlandReport function
function readFile(fileName) {
    fileName.forEach(i => {
        lineReader.eachLine(i, (line) => {
            //find if any line conatins url with http and https
            let match_array = line.match(regex);
            if (match_array != null) {
                match_array.forEach((i) => {
                    checkUrlAndReport(i);
                });
            }
        })
    });
}


//archived version from wayback machine url
function archivedURL(url) {
    let bashed_url = encodeURIComponent(url, 26, true);
    axios.get(`http://archive.org/wayback/available?url=${bashed_url}`)
        .then(response => {
            if (response.data.archived_snapshots.length == 0) {
                console.log(`There is no archived version available for ${url}`)
            }
            else {
                console.log((`Check out the archived version at `) + chalk.green.bold(`${response.data.archived_snapshots.closest.url}`))
            }
        })
        .catch(err => console.log(err))
}