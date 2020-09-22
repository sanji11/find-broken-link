#!/usr/bin/env node

//to color the output
const chalk = require("chalk"); 
// to read line one by one
const lineReader = require('line-reader'); 
// to send request and get response
const fetch = require("node-fetch"); 
// to match url with http and https
const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g);
//set the arguement
var argv  = require("yargs") 
    .scriptName("Find broken link(fbl)")
    .usage("Usage: $0 [options] <argument> where argument can be file name or a url")
    
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
        type: "string",

    })
    .option("u", {
        alias: "url",
        describe: "Any url you want to check for broken link",
        type: "string",

    })
    .check((argv) => {
       
        if(argv.f || argv.u){
            handleArg(argv)
            return true
       
        }
        console.log(chalk.red.bold('At least one arguement is required!'));
        return false
        
    })
    .version('v', 'Show version number', '1.0.0')
    .alias('v', 'version')
    .epilog("copyright 2020")
    .argv;

//handle when there is a arguement
function handleArg(argv){
    //when arguement is a filename
    if(argv.f){
        readFile(argv.f)
    //when arguemnt is a url
    }else if(argv.u){
    
        checkUrlAndReport(argv.u)

    }
}
function checkUrlAndReport(url){

    //send http request and check the status
      
    fetch(url)
        .then(function (response){
                
            if(response.status == 400 || response.status == 404){
                console.log(chalk.red.bold("Bad ===> " + response.url));
            }else if(response.status == 200){
                console.log(chalk.green.bold("Good ===> " + response.url));
            
            }else{
                console.log(chalk.grey.bold("Unknown ===> " + response.url));
            }
        }).catch(function (err){
        
            console.log(chalk.blue.bold("Not exist ===> " + url));
        })    
                
        
}


function readFile(fileName){
    lineReader.eachLine(fileName, function(line){
    
        //find if any line conatins url with http and https
        var match_array = line.match(regex);
    
        if(match_array != null){
    
            for(i = 0; i < match_array.length; i++){
                
                checkUrlAndReport(match_array[i]);
                
                
            }
            
        }
        
    })
    
}
