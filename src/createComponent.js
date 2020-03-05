const fse = require("fs-extra")
const _ = require('lodash')
const { replace } = require("./helpers/index")
let outputFolder = "generated/src/components/"

const textWithRemoveQ = (text) => {
    return "__GENERATOR_REMOVE_START_QUOTATION__" + text + "__GENERATOR_REMOVE_END_QUOTATION__"
}

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

const createModel = async (component) => {
    let modelContent = fse.readFileSync("template/src/components/demo/model.js", 'utf8')
    let schema = {}
    Object.keys(component.dbSchema).forEach(key => {
        let values = {}
        console.log(component.dbSchema[key], typeof component.dbSchema[key])
        if (typeof component.dbSchema[key] == "object") {
            if (Array.isArray(component.dbSchema[key])) {
                values = component.dbSchema[key][0]
            } else {
                values = { ...component.dbSchema[key] }
            }
            delete values.updatableBy
            delete values.bcrypt
            delete values.labelKey
            delete values.oneOf
            delete values.valueType
            if (typeof (values.type) === 'function') {
                values.type = textWithRemoveQ(values.type.name)
            }
        } else if (typeof (component.dbSchema[key]) === 'function') {
            values = textWithRemoveQ(component.dbSchema[key].name)
        }
        if (Array.isArray(component.dbSchema[key])) {
            schema[textWithRemoveQ(key)] = [values]
        } else
            schema[textWithRemoveQ(key)] = values
    })
    let schemaContent = JSON.stringify(schema, null, 4)
    schemaContent = replace(schemaContent, `"__GENERATOR_REMOVE_START_QUOTATION__`, "")
    schemaContent = replace(schemaContent, `__GENERATOR_REMOVE_END_QUOTATION__"`, "")
    modelContent = replace(modelContent, `/*__GENERATOR__SCHEMA__*/`, schemaContent.substring(1, schemaContent.length - 1))
    modelContent = replace(modelContent, `__GENERATOR__SCHEMA__NAME__`, component.name + "Schema")
    modelContent = replace(modelContent, `/*__GENERATOR__DB_NAMES__*/`, "DB_" + component.dbName.toUpperCase())
    modelContent = replace(modelContent, `__GENERATOR__SCHEMA_KEY__`, "DB_" + component.dbName.toUpperCase())

    await fse.outputFile(outputFolder + component.name + "/model.js", modelContent)

}

const createDal = async (component) => {
    let dalContent = fse.readFileSync("template/src/components/demo/DAL.js", 'utf8')
    dalContent = replace(dalContent, "__GENERATOR__SCHEMA_NAME__", component.name + "Schema")

    await fse.outputFile(outputFolder + component.name + "/DAL.js", dalContent)
}

const createController = async (component) => {
    let dbKeys = Object.keys(component.dbSchema);
    dbKeys = JSON.stringify(dbKeys).replace("[", "").replace("]", "")
    let controllerContent = fse.readFileSync("template/src/components/demo/controller.js", 'utf8')

    controllerContent = replace(controllerContent, "__GENERATOR__DAL_NAME__", component.name + "DAL")
    controllerContent = replace(controllerContent, "__GENERATOR__COMPONENT_NAME__", _.startCase(_.toLower(component.name)))
    // controllerContent = replace(controllerContent, "/*__GENERATOR__SCHEMA__KEYS__*/", dbKeys)
    controllerContent = replace(controllerContent, "/*__GENERATOR__UPDATABLE_SCHEMA__KEYS__*/", dbKeys)



    let extraFunctions = []
    if (component.login) {

        let loginController = require("../template/extra/loginComponent/controller")
        if (_.has(component, "login.methods.form.fields") && component.login.methods.form.fields.length) {



            let fieldsKeys = component.login.methods.form.fields.map(field => {
                return field.dbKey;
            })

            console.log(component.dbSchema)

            if (_.every(fieldsKeys, _.partial(_.has, component.dbSchema))) {




                let loginByFormFunction = loginController.loginByForm.toString()

                let fieldKeys = []
                let encryptedKeys = []
                component.login.methods.form.fields.forEach(field => {
                    if (field.bcryptCompare) {
                        encryptedKeys.push(field.dbKey)
                    } else
                        fieldKeys.push(field.dbKey)
                })

                loginByFormFunction = replace(loginByFormFunction, "/*__GENERATOR_FIND_FOR_LOGIN_KEYS__*/", fieldsKeys.map(date => `'${date}'`).join(", "))


                if (encryptedKeys.length) {
                    let condition = []
                    encryptedKeys.forEach(ek => {
                        condition.push(`!(await data.compare(data.${ek},req.body.${ek}))`)
                    })
                    let conditionFull = `
                if (${condition.join(" && ")}) {
                    return res.sendResponse.fail("${component.name} not found", 421)
                }
                `
                    loginByFormFunction = replace(loginByFormFunction, "/*__GENERATOR_OTHER_CONDITION__*/", conditionFull)

                }
                extraFunctions.push(loginByFormFunction)





            } else {
                throw new Error(JSON.stringify(fieldsKeys) + component.name + " is not exist in schame")

            }
        }

        if (_.has(component, "login.forgotPassword.methods.emailVerification")) {

            let forgotPasswordFun = loginController.forgotPassword.toString()

            let field = component.login.forgotPassword.methods.emailVerification.fields.map(f => f.dbKey)
            forgotPasswordFun = replace(forgotPasswordFun, "/*__GENERATOR_FIND_FOR_LOGIN_KEYS__*/", field.map(date => `'${date}'`).join(", "))

            forgotPasswordFun = replace(forgotPasswordFun, "__GENERATOR_TO_EMAIL_VAR__", component.login.forgotPassword.methods.emailVerification.emailField)

            extraFunctions.push(forgotPasswordFun)

            let resetPasswordFun = loginController.resetPassword.toString()

            resetPasswordFun = replace(resetPasswordFun, "/*__GENERATOR__PASSWORD_CHANGES__*/", ` data.${component.login.forgotPassword.methods.emailVerification.passwordField.dbKey} = req.body.${component.login.forgotPassword.methods.emailVerification.passwordField.dbKey}`)
            extraFunctions.push(resetPasswordFun)

        }



    }
    if (extraFunctions.length) {
        let extraFunctionsString = extraFunctions.join(" \n\n") + "\n\n"
        extraFunctionsString = replace(extraFunctionsString, "__GENERATOR__COMPONENT_NAME__", component.name)
        extraFunctionsString = replace(extraFunctionsString, "__GENERATOR__DAL_NAME__", component.name + "DAL")

        controllerContent = replace(controllerContent, "/*__GENERATOR__EXTRA_METHODS__*/", extraFunctionsString)
    }

    await fse.outputFile(outputFolder + component.name + "/controller.js", controllerContent)
}

const createRouter = async (component) => {
    let routerContent = fse.readFileSync("template/src/components/demo/router.js", 'utf8')
    routerContent = replace(routerContent, "__GENERATOR_COMPONENT_NAME__", component.name)
    routerContent = replace(routerContent, "__GENERATOR__CONTROLLER_NAME__", component.name + "Controller")

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

const createComponentIndexFile = async (components) => {
    let fileContent = `const express = require("express");
const router = express.Router();\n\n`
    components.forEach(c => {
        fileContent += `router.use(require("./${c.name}/router")); \n`
    })

    fileContent += "module.exports = router;"
    await fse.outputFile(outputFolder + "index.js", fileContent)

}

module.exports = async (components) => {
    components.forEach(com => {
        createModel(com)
        createDal(com)
        createController(com)
        createRouter(com)
    });
    createComponentIndexFile(components)
}
