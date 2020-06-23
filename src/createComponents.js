const fse = require("fs-extra")
const _ = require('lodash')
let outputFolder = "generated/backend/src/components/"
const createModel = require("./createComponent/model")
const createDal = require("./createComponent/dal")
const createController = require("./createComponent/controller")
const createRouter = require("./createComponent/router")




const createComponentIndexFile = async (components) => {
    let fileContent = `const express = require("express");
const router = express.Router();\n\n`
    components.forEach(c => {
        fileContent += `router.use(require("./${c.name}/router")); \n`
    })

    fileContent += "module.exports = router;"
    await fse.outputFile(outputFolder + "index.js", fileContent)

}
module.exports = async (components, DB_SCHEMAS) => {
    components.forEach(com => {
        createModel(com, DB_SCHEMAS)
        createDal(com)
        createController(com)
        createRouter(com)
    });
    createComponentIndexFile(components)
}
