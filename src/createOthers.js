const fse = require("fs-extra")
const _ = require('lodash')


const createMiddlewareFolder = () => {
    fse.copy(process.cwd() + "/template/backend/src/middlewares", "generated/backend/src/middlewares")
}

const copyUtilsFolder = () => {
    fse.copy(process.cwd() + "/template/backend/src/utils", "generated/backend/src/utils")
}

const copyPackageAndIndex = () => {
    fse.copy(process.cwd() + "/template/backend/package.json", "generated/backend/package.json")
    fse.copy(process.cwd() + "/template/backend/index.js", "generated/backend/index.js")
}


module.exports = async (components) => {
    createMiddlewareFolder()
    copyUtilsFolder()
    copyPackageAndIndex()
}
