const fse = require("fs-extra")
const helperFiles = "generated/backend/src/helpers/index.js"
const { replace, textWithRemoveQ, replaceQText } = require("../helpers/index")

const createHelperFile = async (helpers, config) => {

    let helperContent = fse.readFileSync("template/backend/src/helpers/index.stub", 'utf8')

    let extraHelpers = ""
    Object.keys(helpers).forEach(key => {
        extraHelpers += key + ":" + helpers[key].toString() + ",\n"
    })
    console.log(extraHelpers)
    helperContent = replace(helperContent, "/*__GENERATOR__EXTRA_HELPERS__*/", extraHelpers)


    await fse.outputFile(helperFiles, helperContent)

}
const createOtherHelper = () => {
    fse.copy("template/backend/src/helpers/responseHandler.js", "generated/backend/src/helpers/responseHandler.js")
}

module.exports = async (helpers, config = {}) => {
    createHelperFile(helpers, config)
    createOtherHelper()
}
