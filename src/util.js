const axios = require('axios');
const chalk = require("chalk"); //to color the output
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

module.exports.archivedURL = archivedURL
