const fse = require("fs-extra")
const _ = require('lodash')
const { replace, textWithRemoveQ, replaceQText } = require("../../helpers/index")
let outputFolder = "generated/backend/src/components/"

const createSchemaJson = (schema, dependantSchemas) => {
    let newSchema = {}

    Object.keys(schema).forEach(key => {

        if (key.startsWith("$GG"))
            return;

        let values;
        if (typeof schema[key] == "object") {
            if (Array.isArray(schema[key])) {
                let arrayValue = []
                schema[key].forEach(k2 => {
                    arrayValue.push(createSchemaJson(k2))
                })
                values = arrayValue
            } else {
                values = createSchemaJson({ ...schema[key] })
            }

        } else if (typeof (schema[key]) === 'function') {
            values = textWithRemoveQ(schema[key].name)
        }
        if (!values) {

            if (schema[key] == "ObjectId")
                values = textWithRemoveQ("mongoose.Schema.Types.ObjectId")
            else if (schema[key] == "any")
                values = textWithRemoveQ("mongoose.Schema.Types.Mixed")
            else
                values = schema[key]
        }

        newSchema[textWithRemoveQ(key)] = values
    })

    return newSchema;
}

const createModel = async (component, DB_SCHEMAS) => {
    let modelContent = fse.readFileSync(process.cwd() + "/template/backend/src/components/demo/model.stub", 'utf8')

    let schemaContent = JSON.stringify(createSchemaJson(component.dbSchema), null, 4)
    let dependantSchemas = []
    Object.values(DB_SCHEMAS).forEach(dbName => {
        if (schemaContent.includes(`"${dbName}"`)) {
            console.log(`"${dbName}"`, "DB_" + dbName.toUpperCase())
            schemaContent = replace(schemaContent, `"${dbName}"`, "DB_" + dbName.toUpperCase())
            dependantSchemas.push(textWithRemoveQ("DB_" + dbName.toUpperCase()))
        }
        if (dbName == component.dbName) {
            dependantSchemas.push(textWithRemoveQ("DB_" + dbName.toUpperCase()))
        }
    })

    schemaContent = replaceQText(schemaContent)
    console.log(schemaContent)
    modelContent = replace(modelContent, `/*__GENERATOR__SCHEMA_JSON__*/`, schemaContent.substring(1, schemaContent.length - 1))

    modelContent = replace(modelContent, `/*__GENERATOR__IMPORT_COLLECTIONS_NAMES__*/`, replaceQText(dependantSchemas.join(", ")))

    modelContent = replace(modelContent, `/*__GENERATOR__SCHEMA_KEY__*/`, "DB_" + component.dbName.toUpperCase())






    let extraFunctions = []
    if (component.login) {

        let loginModel = require(process.cwd() + "/template/backend/extra/loginComponent/model")
        if (_.has(component, "login.methods.form.fields") && component.login.methods.form.fields.length) {

            let fieldsKeys = component.login.methods.form.fields.map(field => {
                return field.dbKey;
            })



            if (_.every(fieldsKeys, _.partial(_.has, component.dbSchema))) {




                modelContent = replace(modelContent, `/*__GENERATOR__EXTRA_IMPORTS__*/`, loginModel.extraImports() + "\n/*__GENERATOR__EXTRA_IMPORTS__*/")

                extraFunctions.push(`/*__GENERATOR__SCHEMA_VAR_NAME__*/.methods.compare = ${loginModel.compare.toString()} `)

                extraFunctions.push(`/*__GENERATOR__SCHEMA_VAR_NAME__*/.methods.generateJWT = ${loginModel.generateJWT.toString()} `)





                let encryptedKeys = []
                component.login.methods.form.fields.forEach(field => {
                    if (field.bcryptCompare) {
                        encryptedKeys.push(field.dbKey)
                    }
                })


                if (encryptedKeys.length) {
                    let conditions = []
                    encryptedKeys.forEach(ek => {
                        conditions.push(
                            `
if (this.${ek} && this.${ek}.length < 50) {
    this.${ek} = await bcrypt.hash(this.${ek}, saltRounds)
}
`)
                    })

                    let preSaveFunc = loginModel.preSave.toString()
                    preSaveFunc = replace(preSaveFunc, "/*__GENERATOR__ENCRYPT_VALUES__*/", conditions.join("\n"))
                    extraFunctions.push(`/*__GENERATOR__SCHEMA_VAR_NAME__*/.pre("save", ${preSaveFunc});`)
                }

            } else {
                throw new Error(JSON.stringify(fieldsKeys) + component.name + " is not exist in schame")

            }
        }

    }

    if (extraFunctions.length) {

        modelContent = replace(modelContent, `/*__GENERATOR__EXTRA__*/`, extraFunctions.join("\n")) + "\n\n/*__GENERATOR__EXTRA__*/"

    }





    modelContent = replace(modelContent, `/*__GENERATOR__SCHEMA_VAR_NAME__*/`, component.name + "Schema")

    await fse.outputFile(outputFolder + component.name + "/model.js", modelContent)

}

module.exports = createModel