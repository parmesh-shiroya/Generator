const devConfig = require("./dev")
const prodConfig = require("./prod")

const config = {
    development: devConfig,
    production: prodConfig
}

module.exports = config[process.env.NODE_ENV || "development"]