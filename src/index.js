#!/usr/bin/env node

const chalk = require("chalk"); //to color the output
const util = require('./util.js')
const fs = require('fs');
const version = require('./version.js')

//set the arguement
const argv = require("yargs")
    .scriptName("fbl")
    .usage("Usage: $0 [options] <argument> where argument can be a file name or a url")
    .example(
        "$ fbl -f ./test.html ./test.txt",
        "process the files to find any broken link."
    ).example(
        "$ fbl -d ./test/ ./test2/",
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
    .example(
        "fbl -c src/fbl-config.json -f ./test.txt/ ",
        "Print the URL from the file based on Config file's result type and report format(JSON)"
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
    .option("c", {
        alias: "config",
        describe: "Provide a config file",
        type: "string",
    })
    .option("t", {
        alias: "telescope",
        describe: "Check the links in the last 10 posts indexed by your local Telescope",
        type: "boolean"
    })   
   .check((argv) => {
       //check if the options is provided or argument with option is provided or not
        if ((argv.f && argv.f.length != 0) || (argv.a && argv.a.length != 0) || 
        (argv.u && argv.u.length != 0) || (argv.d && argv.d.length != 0) || argv.t) {
            handleArg(argv)
            return true
        }
        throw new Error(chalk.red.bold('At least one option/argument is required!'))        
    })
    .alias('v', 'version')
    .version(chalk.yellow(`${version.getVersion()}`))
    .alias('h', 'help')
    .epilog("copyright 2020")
    .argv;

//handle when there is an option

function handleArg(argv) {
    util.setDefaultConfig()
    if(argv.c){
        util.manageConfiguration(argv.c)        
    }
    if (argv.f) {
        util.readFile(argv.f)       
    }else if(argv.d){
        util.readDir(argv.d) 
    }else if (argv.u) {
        argv.u.forEach(singleUrl=>{
            util.checkUrlAndReport(singleUrl)
        })    
    }else if (argv.a) {
        argv.a.forEach(singleUrl=>{
            util.archivedURL(singleUrl)
        })  
    }else if(argv.v){
        console.log(chalk.red.bold(`Current Version Number: {$v}`))
    }else if(argv.t){
         util.handleTelsescope()
    }
    
    
}
