#!/usr/bin/env node

const chalk = require("chalk"); //to color the output
const lineReader = require('line-reader'); // to read line one by one
const fetch = require("node-fetch"); // to send request and get response
const axios = require('axios');
const fs = require('fs');
const v = require("../package.json").version; //getting version number
// to match url with http and https
const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g);
const versionDetails = chalk.yellow(`fbl version: ${v}`); //setting version number
var jsonObj = {
    "url": String,
    "status": Number
}
var jsonResponse = [];
//set the arguement
const argv = require("yargs")
    .scriptName("fbl")
    .usage("Usage: $0 [options] <argument> where argument can be a file name or a url")
    .example(
        "$ fbl -f test.html test.txt",
        "process the files to find any broken link."
    ).example(
        "$ fbl -d test test2",
        "process the files in the directories to find any broken link."
    )
    .example(
        "$ fbl -u https://www.google.ca/ https://www.facebook.com/",
        "check all the url if it is broken link or not."
    )
    .example(
        "$fbl -a https://www.google.com/ https://www.facebook.com/",
         "Check all the url if it has archived version or not"  
    )
    .option("f", {
        alias: "fileName",
        describe: "Show the broken link for any number of file",
        type: "array",

    })
    .option("d", {
        alias: "dir",
        describe: "Show the broken link for any number of directory",
        type: "array",

    })
    .option("u", {
        alias: "url",
        describe: "Show the broken link for any number of URL",
        type: "array",

    })
    .option("a", {
        alias: "archived",
        describe: "Show the archived version of any number of URL",
        type: "array",
    })
    .option("j", {
        alias: "json",
        describe: "output the result into JSON format",
        type: "boolean",
    })  
   .check((argv) => {
       //check if the options is provided or argument with option is provided or not
        if ((argv.f && argv.f.length != 0) || (argv.a && argv.a.length != 0) || 
        (argv.u && argv.u.length != 0) || (argv.d && argv.d.length != 0) || argv.j) {
            handleArg(argv)
            return true
        }
        throw new Error(chalk.red.bold('At least one option/argument is required!'))        
    })
    .alias('v', 'version')
    .version(`${versionDetails}`)
    .alias('h', 'help')
    .epilog("copyright 2020")
    .argv;

//handle when there is an option
function handleArg(argv) {
    if (argv.f) {
        readFile(argv.f)       
    }else if(argv.d){
        //handle multiple directories
        argv.d.forEach(dir=>{
        fs.readdir(dir, (err, files)=>{
            if(err){
                console.log(err)
            }else{
                readFile(files)
                }
            })
        }) 
    }else if (argv.u) {
        argv.u.forEach(singleUrl=>{
            checkUrlAndReport(singleUrl)
        })    
    }else if (argv.a) {
        argv.a.forEach(singleUrl=>{
            archivedURL(singleUrl)
        })  
    }else if(argv.v){
        console.log(chalk.red.bold(`Current Version Number: {$v}`))
    }
    
}

//send http request and check the status
function checkUrlAndReport(url) {
    fetch(url, { method: "head", timeout: 13000, redirect : "manual"})
        .then(function (response) {
            if(argv.j){
                jsonObj.url = response.url
                jsonObj.status = response.status
                jsonResponse.push(jsonObj)
                console.log(JSON.stringify(jsonResponse))

            }else{
                if (response.status == 400 || response.status == 404) {
                    console.log(chalk.red.bold("Bad ===> " + response.status + " ===> " + response.url))
                } else if (response.status == 200) {
                    console.log(chalk.green.bold("Good ===> " + response.status + " ===> " + response.url))
                } else if(response.status == 301 || response.status == 307 || response.status == 308){
                    console.log(chalk.yellow.bold("Redirect ===> " + response.status + " ===> " + response.url))
                }else {
                    console.log(chalk.grey.bold("Unknown ===> " + response.status + " ===> " + response.url))
                }
            }
                            
        }).catch(function (err) {
            if(!argv.j){
                console.log(chalk.blue.bold("Not exist ===> 000 ===> " + url))
            }
            
        })
    }
        

// read each line of a file and call checkUrlandReport function
function readFile(fileNames) {
    fileNames.forEach(file => {
        lineReader.eachLine(file, (line) => {
            //find if any line conatins url with http and https
            let match_array = line.match(regex)
            if (match_array != null) {
                match_array.forEach((i) => {
                    checkUrlAndReport(i)
                })
            }
        })
    })
}


//archived version from wayback machine url
function archivedURL(url) {
    let bashed_url = encodeURIComponent(url, 26, true)
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