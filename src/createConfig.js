const fse = require("fs-extra")
const configFiles = [
    "generated/config/dev.js",
    "generated/config/prod.js"
]
module.exports = async (config) => {
    let content = "module.exports = "
    content += JSON.stringify(config, null, 4)
    for (let f of configFiles) {
        await fse.outputFile(f, content)
    }
    await fse.copyFileSync("template/config/index.js", 'generated/config/index.js')
}
