const { TYPE, FIELD_TYPE, FRONTEND_PAGE_TYPE, FILTER_TYPE } = require("../../constants")
const FormFields = require("../../template/frontend/FormFields")
const { replace, camelCaseToLabel, textWithRemoveQ, objectToAttributes, replaceQText } = require("../helpers/index");
const { identity } = require("lodash");
const fse = require("fs-extra")
const _ = require('lodash')
let outputFolder = "generated/frontend/src/components/"

const createAllTablePage = async (component) => {
    if (!component.frontEnd || !(component.frontEnd.pages.includes(FRONTEND_PAGE_TYPE.ALL_TABLE)))
        return;
    if (component.frontEnd.allTable == undefined)
        throw new Error("coulden't found allTable key in component.frontEnd")
    let allTablePageConent = fse.readFileSync(process.cwd() + "/template/frontend/stubs/allTable.stub", 'utf8')
    allTablePageConent = replace(allTablePageConent, "__GG__CLASS_NAME__", "All" + component.frontEnd.pageName)
    allTablePageConent = replace(allTablePageConent, "__GG__PAGE_TITLE__", component.frontEnd.pageName)


    let tableColumns = []
    component.frontEnd.allTable.tableColumns.forEach(obj => {
        let newObj = {}

        if (obj.$GG_filter) {
            if (obj.$GG_filter.filterType == FILTER_TYPE.DROPDOWN) {

                let filterArray = []
                obj.$GG_filter.options.forEach(option => {
                    if (typeof option == "string") {
                        filterArray.push({ text: option, value: option })
                    } else
                        filterArray.push({ text: option.label, value: option.value })
                })
                obj[textWithRemoveQ("filters")] = filterArray
                obj[textWithRemoveQ("onFilter")] = (value, record) => record.__GG__dataIndex__ == value
            }

        }


        Object.keys(obj).forEach(k => {
            if (k.startsWith("$GG"))
                return
            if (typeof obj[k] == "function") {
                let functionString = textWithRemoveQ(obj[k].toString());

                functionString = replace(functionString, "__GG__dataIndex__", obj.dataIndex)
                console.log(functionString)
                newObj[textWithRemoveQ(k)] = functionString
            } else
                newObj[textWithRemoveQ(k)] = obj[k]
        })


        if (!_.isEmpty(Object.keys(newObj)))
            tableColumns.push(newObj)
    })



    allTablePageConent = replace(allTablePageConent, "/*__GG__COLUMNS__*/", JSON.stringify(tableColumns, null, 4))


    allTablePageConent = replaceQText(allTablePageConent)

    await fse.outputFile(outputFolder + component.frontEnd.pageName + `/All${component.frontEnd.pageName}.jsx`, allTablePageConent)
}


module.exports = { createAllTablePage }