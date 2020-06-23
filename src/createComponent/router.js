const fse = require("fs-extra")
const _ = require('lodash')
const { replace, textWithRemoveQ, replaceQText } = require("../helpers/index")
let outputFolder = "generated/backend/src/components/"




const createBodyMiddleware = (key, type = "string", isArray = false) => {
    let ext = "";
    if (isArray) {
        ext = `.isArray().withMessage("${key} should be array")`
    }
    if (type == "EMAIL") {
        return ` body("${key}","${key} is required").notEmpty().isEmail().withMessage("${key} is not valid")${ext}, \n `
    } else if (type == "IMAGE") {
        return ""
    }
    return ` body("${key}","${key} is required").notEmpty()${ext}, \n `
}

const createRouter = async (component) => {
    let routerContent = fse.readFileSync(process.cwd() + "/template/backend/src/components/demo/router.stub", 'utf8')

    if (component.login) {


        if (_.has(component, "login.methods.form.fields") && component.login.methods.form.fields.length) {
            let loginRouters = fse.readFileSync(process.cwd() + "/template/backend/extra/loginComponent/router.js")

            routerContent = replace(routerContent, "/*__GENERATOR__COMPONENT_ROUTERS__*/", loginRouters + "\n\n/*__GENERATOR__COMPONENT_ROUTERS__*/")


        } else {
            throw new Error(JSON.stringify(fieldsKeys) + component.name + " is not exist in schame")

        }
    }


    routerContent = replace(routerContent, "/*__GENERATOR_COMPONENT_NAME__*/", component.name)
    routerContent = replace(routerContent, "/*__GENERATOR__CONTROLLER_NAME__*/", component.name + "Controller")

    let routerMiddlewares = "  ";
    Object.keys(component.dbSchema).forEach(key => {
        if (Array.isArray(component.dbSchema[key])) {
            if (typeof (component.dbSchema[key][0]) === "object") {
                if (component.dbSchema[key][0].required) {
                    routerMiddlewares += createBodyMiddleware(key, (component.dbSchema[key][0].valueType || "string"), true)
                }
            }
        } else if (typeof (component.dbSchema[key]) === "object" && component.dbSchema[key].required) {
            routerMiddlewares += createBodyMiddleware(key, (component.dbSchema[key].valueType || "string"))
        }
    })
    if (routerMiddlewares.trim() != "") {
        routerMiddlewares = `[\n${routerMiddlewares.trim().slice(0, -1)}\n],\nvalidator,\n`
    }

    routerContent = replace(routerContent, "/*__GENERATOR_EXTRA_POST_MIDDLEWARES__*/", routerMiddlewares)

    await fse.outputFile(outputFolder + component.name + "/router.js", routerContent)
}
module.exports = createRouter