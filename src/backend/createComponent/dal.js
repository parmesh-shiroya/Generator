const fse = require("fs-extra")
const _ = require('lodash')
const { replace, textWithRemoveQ, replaceQText } = require("../../helpers/index")
let outputFolder = "generated/backend/src/components/"


const createDal = async (component) => {
    let dalContent = fse.readFileSync(process.cwd() + "/template/backend/src/components/demo/DAL.stub", 'utf8')
    dalContent = replace(dalContent, "/*__GENERATOR__SCHEMA_VAR_NAME__*/", component.name + "Schema")

    await fse.outputFile(outputFolder + component.name + "/DAL.js", dalContent)
}
module.exports = createDal;