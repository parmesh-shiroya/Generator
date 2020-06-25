
const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;


const replace = (txt, searchTxt, replaceTxt) => {
    if (searchTxt) {
        searchTxt = searchTxt.replace(matchOperatorsRegex, '\\$&');
        return txt.replace(new RegExp(searchTxt, "g"), replaceTxt)
    }
    return txt
}
const textWithRemoveQ = (text) => {
    return "__GENERATOR_REMOVE_START_QUOTATION__" + text + "__GENERATOR_REMOVE_END_QUOTATION__"
}

const replaceQText = (text) => {
    text = replace(text, `"__GENERATOR_REMOVE_START_QUOTATION__`, "")
    text = replace(text, `__GENERATOR_REMOVE_END_QUOTATION__"`, "")
    text = replace(text, `__GENERATOR_REMOVE_START_QUOTATION__`, "")
    return replace(text, `__GENERATOR_REMOVE_END_QUOTATION__`, "")

}

const camelCaseToLabel = (text) => {
    return text.replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function (str) { return str.toUpperCase(); })
}

const objectToAttributes = (object) => {
    return "{..." + JSON.stringify(object) + "}"
}
module.exports = { objectToAttributes, replace, camelCaseToLabel, textWithRemoveQ, replaceQText }