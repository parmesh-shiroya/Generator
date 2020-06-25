const fse = require("fs-extra")
const _ = require('lodash')
const { replace, textWithRemoveQ, replaceQText } = require("../../helpers/index")
let outputFolder = "generated/backend/src/components/"

const createController = async (component) => {
    let dbKeys = Object.keys(component.dbSchema);
    dbKeys = JSON.stringify(dbKeys).replace("[", "").replace("]", "")
    let controllerContent = fse.readFileSync(process.cwd() + "/template/backend/src/components/demo/controller.stub", 'utf8')

    controllerContent = replace(controllerContent, "/*__GENERATOR__DAL_NAME__*/", component.name + "DAL")

    controllerContent = replace(controllerContent, "/*__GENERATOR__COMPONENT_NAME__*/", _.startCase(_.toLower(component.name)))
    // controllerContent = replace(controllerContent, "/*__GENERATOR__SCHEMA__KEYS__*/", dbKeys)
    controllerContent = replace(controllerContent, "/*__GENERATOR__UPDATABLE_SCHEMA__KEYS__*/", dbKeys)



    let extraFunctions = []
    if (component.login) {

        let loginController = require(process.cwd() + "/template/backend/extra/loginComponent/controller")
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

            forgotPasswordFun = replace(forgotPasswordFun, `"/*__GENERATOR_TO_EMAIL_VAR__*/"`, `data.${component.login.forgotPassword.methods.emailVerification.emailField}`)

            extraFunctions.push(forgotPasswordFun)

            let resetPasswordFun = loginController.resetPassword.toString()

            resetPasswordFun = replace(resetPasswordFun, "/*__GENERATOR__PASSWORD_CHANGES__*/", ` data.${component.login.forgotPassword.methods.emailVerification.passwordField.dbKey} = req.body.${component.login.forgotPassword.methods.emailVerification.passwordField.dbKey}`)
            extraFunctions.push(resetPasswordFun)

        }



    }
    if (extraFunctions.length) {
        let extraFunctionsString = extraFunctions.join(" \n\n") + "\n\n"
        extraFunctionsString = replace(extraFunctionsString, "/*__GENERATOR__COMPONENT_NAME__*/", component.name)
        extraFunctionsString = replace(extraFunctionsString, "__GENERATOR__DAL_NAME__", component.name + "DAL")

        controllerContent = replace(controllerContent, "/*__GENERATOR__EXTRA_METHODS__*/", extraFunctionsString)
    }

    await fse.outputFile(outputFolder + component.name + "/controller.js", controllerContent)
}

module.exports = createController;