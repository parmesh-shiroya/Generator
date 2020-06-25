const fse = require("fs-extra")
const configFiles = [
    "generated/backend/config/dev.js",
    "generated/backend/config/prod.js"
]
module.exports = async (config) => {
    let content = "module.exports = "
    content += JSON.stringify(config, null, 4)
    for (let f of configFiles) {
        await fse.outputFile(f, content)
    }
    await fse.copyFileSync(process.cwd() + "/template/backend/config/index.js", 'generated/backend/config/index.js')
}
