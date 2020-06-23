const { configs, helpers, components, WEB_ROLES, DB_SCHEMAS } = require("./generateJson")
const createComponents = require("./src/createComponents")
createComponents(components, DB_SCHEMAS)