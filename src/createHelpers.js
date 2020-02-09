const fse = require("fs-extra")
const helperFiles = "generated/src/helpers/index.js"


module.exports = async (helpers, config = {}) => {

    let helperContent = fse.readFileSync("template/src/helpers/index.js", 'utf8')

    let extraHelpers = ""
    Object.keys(helpers).forEach(key => {
        extraHelpers += key + ":" + helpers[key].toString() + ",\n"
    })
    console.log(extraHelpers)
    helperContent = helperContent.replace(new RegExp("\/\\*__GENERATOR__EXTRA_HELPERS__\\*\/", "g"), extraHelpers)

    await fse.outputFile(helperFiles, helperContent)

}
