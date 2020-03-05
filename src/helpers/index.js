
const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;


const replace = (txt, searchTxt, replaceTxt) => {
    if (searchTxt) {
        searchTxt = searchTxt.replace(matchOperatorsRegex, '\\$&');
        return txt.replace(new RegExp(searchTxt, "g"), replaceTxt)
    }
    return txt
}

module.exports = { replace }