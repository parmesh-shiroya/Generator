const fse = require("fs-extra")
const _ = require('lodash')
let outputFolder = "generated/src/components/"

const textWithRemoveQ = (text) => {
    return "__GENERATOR_REMOVE_START_QUOTATION__" + text + "__GENERATOR_REMOVE_END_QUOTATION__"
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
    schemaContent = schemaContent.replace(new RegExp("\"__GENERATOR_REMOVE_START_QUOTATION__", "g"), "")
    schemaContent = schemaContent.replace(new RegExp("__GENERATOR_REMOVE_END_QUOTATION__\"", "g"), "")
    modelContent = modelContent.replace(new RegExp("\/\\*__GENERATOR__SCHEMA__\\*\/", "g"), schemaContent)
    modelContent = modelContent.replace(new RegExp("__GENERATOR__SCHEMA__NAME__", "g"), component.name + "Schema")
    modelContent = modelContent.replace(new RegExp("\/\\*__GENERATOR__DB_NAMES__\\*\/", "g"), "DB_" + component.dbName.toUpperCase())
    modelContent = modelContent.replace(new RegExp("__GENERATOR__SCHEMA_KEY__", "g"), "DB_" + component.dbName.toUpperCase())
    await fse.outputFile(outputFolder + component.name + "/model.js", modelContent)

}

const createDal = async (component) => {
    let dalContent = fse.readFileSync("template/src/components/demo/DAL.js", 'utf8')
    dalContent = dalContent.replace(new RegExp("__GENERATOR__SCHEMA__NAME__", "g"), component.name + "Schema")
    await fse.outputFile(outputFolder + component.name + "/DAL.js", dalContent)
}

const createController = async (component) => {
    let dbKeys = Object.keys(component.dbSchema);
    dbKeys = JSON.stringify(dbKeys).replace("[", "").replace("]", "")
    let controllerContent = fse.readFileSync("template/src/components/demo/controller.js", 'utf8')
    controllerContent = controllerContent.replace(new RegExp("__GENERATOR__DAL_NAME__", "g"), component.name + "DAL")
    controllerContent = controllerContent.replace(new RegExp("__GENERATOR__COMPONENT_NAME__", "g"), _.startCase(_.toLower(component.name)))
    controllerContent = controllerContent.replace(new RegExp("\/\\*__GENERATOR__SCHEMA__KEYS__\\*\/", "g"), dbKeys)
    controllerContent = controllerContent.replace(new RegExp("\/\\*__GENERATOR__UPDATABLE_SCHEMA__KEYS__\\*\/", "g"), dbKeys)
    await fse.outputFile(outputFolder + component.name + "/controller.js", controllerContent)
}

const createRouter = async (component) => {

}


module.exports = async (components) => {
    components.forEach(com => {
        createModel(com)
        createDal(com)
        createController(com)
        createRouter(com)
    });
}
