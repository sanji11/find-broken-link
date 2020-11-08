const axios = require('axios');
const chalk = require("chalk"); //to color the output
const lineReader = require('line-reader'); // to read line one by one
const fetch = require("node-fetch");
const fs = require('fs');
const tmp = require('tmp');
const path = require('path');

// to match url with http and https
const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g);
var config //config file
var urlDetails = {
    "url": String,
    "status": Number
}
//var files = []
var myCoolNewArray = []

// read each line of a file and call checkUrlandReport function
function readFile(fileNames) {
    fileNames.forEach(file => {
        lineReader.eachLine(file, (line) => {
            //find if any line conatins url with http and https
            let match_array = line.match(regex)    
            if (match_array != null) {
                // remove duplicates
                match_array.forEach((i) => {
                    if(match_array[i] == match_array[i+1]){
                        match_array.splice(i, 1)
                    }
                    checkUrlAndReport(i)
                })
            }
        })
    })    
}
function readDir(dir){
    dir.forEach(dir=>{
        fs.readdir(dir, (err, files)=>{
            if(err){
                console.log(err)
            }else{
                    readFile(files)
                }
            })
    })
}
function setDefaultConfig(){
    config = {
        resultType: "all",
        isJsonFromat: false
    }
    
}

function storeJsonDataAndPrint(url, status){
    urlDetails.url = url
    urlDetails.status = status
    console.log(urlDetails)

 }      

 function checkUrlAndReport(url) {
    fetch(url, { method: "head", timeout: 13000, redirect : "manual"})
      .then(function (response) {
          if(config.isJsonFromat === false){

              if ((config.resultType ==="all" || config.resultType ==="bad") && (response.status == 400 || response.status == 404)) {
                  console.log(chalk.red.bold("Bad ===> " + response.status + " ===> " + response.url))
              } else if ((config.resultType ==="all" || config.resultType ==="good") && response.status == 200) {
                  console.log(chalk.green.bold( "Good ===> " + response.status + " ===> " + response.url))
              } else if( (config.resultType ==="all") && (response.status == 301 || response.status == 307 || response.status == 308)){
                  console.log(chalk.yellow.bold("Redirect ===> " + response.status + " ===> " + response.url))
              }else {
                  if(config.resultType === "all"){
                      console.log(chalk.grey.bold("Unknown ===> " + response.status + " ===> " + response.url))
                  }
              }
          }else{
              //output in JSON
              storeJsonDataAndPrint(response.url, response.status)
          }
              
      }).catch(function (err) {
          if(config.isJsonFromat === false){
              if(config.resultType === "all"){
                  console.log(chalk.blue.bold("Not exist ===> 000 ===> " + url))
              }
          }else{
              //output in JSON
              storeJsonDataAndPrint(url, "000")
          }
      })                    
      
}

function manageConfiguration(configFile){

    try{
        //check if the config file exists or not          
        if(fs.existsSync(configFile)){
            //check if the user provide absolute path or not
            if(path.isAbsolute(configFile)){
                config = require(configFile)
            }else{
                //get the absolute path of that config file
                const filePath = path.resolve(configFile)
                config = require(filePath)
            }                           
        }else{
            console.log(chalk.bgMagentaBright.bold(" Config file does not exist; Using default config. "))    
            util.setDefaultConfig()               
        }      
    }catch(err){
        console.error(err)
    }        

}

//archived version from wayback machine url
function archivedURL(url) {
    console.log(myCoolNewArray)
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
//Check the links in the last 10 posts indexed by your local Telescope
async function handleTelsescope(){

    const finalArray = []
    
    const posts = await fetch('http://localhost:3000/posts')
                        .then(response => response.json())
    posts.forEach(post => {
            finalArray.push(
                fetch(`http://localhost:3000${post.url}`)
                .then(response => response.json())
                .then(data => data.html)
                .then(postContent => {
                    const tmpobj = tmp.fileSync();
                    fs.appendFile(tmpobj.name, postContent, (err) => {
                        if(err)throw(err)                        
                    })
                    return tmpobj.name
                     
                })
            )
    })
    const f_files = await Promise.all(finalArray)
    readFile(f_files)
    
    
}


module.exports.archivedURL = archivedURL
module.exports.readFile = readFile
module.exports.readDir = readDir
module.exports.setDefaultConfig = setDefaultConfig
module.exports.storeJsonDataAndPrint = storeJsonDataAndPrint
module.exports.checkUrlAndReport = checkUrlAndReport
module.exports.manageConfiguration = manageConfiguration
module.exports.handleTelsescope = handleTelsescope
