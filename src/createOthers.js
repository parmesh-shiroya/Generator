const fse = require("fs-extra")
const _ = require('lodash')


const createMiddlewareFolder = () => {
    fse.copy("template/src/middlewares", "generated/src/middlewares")
}

const copyUtilsFolder = () => {
    fse.copy("template/src/utils", "generated/src/utils")
}

const copyPackahgeAndIndex = () => {
    fse.copy("template/package.json", "generated/package.json")
    fse.copy("template/index.js", "generated/index.js")
}


module.exports = async (components) => {
    createMiddlewareFolder()
    copyUtilsFolder()
    copyPackahgeAndIndex()
}
