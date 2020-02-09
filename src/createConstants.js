const fse = require("fs-extra")
const outputFile = "generated/src/components/constants.js"
module.exports = async (components, webRoles = {}) => {
    let dbSchemas = {}
    components.forEach(c => {
        if (c.dbName) {
            let key = "DB_" + c.dbName.toUpperCase()
            dbSchemas[key] = c.dbName
        }
    });
    let output = {
        DB_SCHEMAS: dbSchemas,
        WEB_ROLES: webRoles
    }
    let content = "module.exports = "
    content += JSON.stringify(output, null, 4)
    await fse.outputFile(outputFile, content)
}
