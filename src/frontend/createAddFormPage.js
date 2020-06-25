const { TYPE, FIELD_TYPE, FRONTEND_PAGE_TYPE } = require("../../constants")
const FormFields = require("../../template/frontend/FormFields")
const { replace, camelCaseToLabel, objectToAttributes } = require("../helpers/index");
const { identity } = require("lodash");
const fse = require("fs-extra")
const _ = require('lodash')

let outputFolder = "generated/frontend/src/components/"
const createAddFormPage = async (component) => {
    if (!component.frontEnd || !(component.frontEnd.pages.includes(FRONTEND_PAGE_TYPE.ADD_FORM)))
        return;
    let addFormPageConent = fse.readFileSync(process.cwd() + "/template/frontend/stubs/addForm.stub", 'utf8')
    addFormPageConent = replace(addFormPageConent, "__GG__CLASS_NAME__", "Add" + component.frontEnd.pageName)
    addFormPageConent = replace(addFormPageConent, "__GG__PAGE_TITLE__", "Add " + component.frontEnd.pageName)

    let formFieldItmes = []
    Object.keys(component.dbSchema).forEach((key) => {

        if (typeof component.dbSchema[key] == "object") {
            if (Array.isArray(component.dbSchema[key])) {

            } else {
                if (component.dbSchema[key].$GG_visible_add == undefined || component.dbSchema[key].$GG_visible_add == true) {

                    let formItemAttrs = {}
                    let formItemRules = []
                    formItemAttrs["name"] = key
                    formItemAttrs["label"] = component.dbSchema[key].$GG_FIELD_LABEL || camelCaseToLabel(key)

                    if (component.dbSchema[key].$GG_required)
                        formItemRules.push({ required: true, whitespace: true })



                    let formItem = "";
                    switch (component.dbSchema[key].$GG_fieldType) {
                        case FIELD_TYPE.DROPDOWN:
                            formItem = FormFields.InputSelectField()

                            let options = []
                            component.dbSchema[key].$GG_dropdown_options.forEach(option => {
                                if (typeof option == "string")
                                    options.push(`<Select.Option value="${option}">${option}</Select.Option>`)
                                else
                                    options.push(`<Select.Option value="${option.value}">${option.label}</Select.Option>`)

                            })
                            formItem = replace(formItem, "/*__GG_SELECT_OPTIONS__*/", options.join("\n"))

                            break;
                        case FIELD_TYPE.EMAIL:
                            formItem = FormFields.InputTextField()
                            formItemRules.push({ type: "email", message: 'Please enter valid email' })
                            formItem = replace(formItem, "/*__GG_INPUT_ATTR__*/", objectToAttributes({ type: "email", placeholder: "Enter " + camelCaseToLabel(key) }))
                            break;
                        case FIELD_TYPE.IMAGE:
                            break;
                        case FIELD_TYPE.PASSWORD:
                            formItem = FormFields.InputTextPasswordField()

                            formItem = replace(formItem, "/*__GG_INPUT_ATTR__*/", objectToAttributes({ type: "password", placeholder: "Enter " + camelCaseToLabel(key) }))
                            break;
                        case FIELD_TYPE.SWITCH:
                            formItem = FormFields.InputSwitchField()
                            formItem = replace(formItem, "/*__GG_SWITCH_ATTR__*/", objectToAttributes({ defaultChecked: true }))

                            break;
                        default:
                            formItem = FormFields.InputTextField()
                            formItem = replace(formItem, "/*__GG_INPUT_ATTR__*/", objectToAttributes({ placeholder: "Enter " + camelCaseToLabel(key) }))

                            break;
                    }
                    if (!_.isEmpty(formItemRules))
                        formItemAttrs["rules"] = formItemRules

                    formItem = replace(formItem, "/*__GG_FORM_ITEM_ATTR__*/", objectToAttributes(formItemAttrs))

                    formFieldItmes.push(formItem)
                }
            }
        }
    })
    addFormPageConent = replace(addFormPageConent, "/*__GG_FORM_FIELDS__*/", formFieldItmes.join("\n"))
    await fse.outputFile(outputFolder + component.frontEnd.pageName + `/Add${component.frontEnd.pageName}.jsx`, addFormPageConent)
}


module.exports = { createAddFormPage }