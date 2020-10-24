const v = require("../package.json").version; //getting version number
const versionDetails = `fbl version: ${v}`; //setting version number

function getVersion() {
    return versionDetails
}

module.exports.getVersion = getVersion