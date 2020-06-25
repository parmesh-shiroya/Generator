const { configs, helpers, components, WEB_ROLES, DB_SCHEMAS } = require("./generateJson")
const createComponents = require("./src/backend/createComponents")
const createConfig = require("./src/backend/createConfig")
const createHelpers = require("./src/backend/createHelpers")
const createConstants = require("./src/backend/createConstants")

const createOthers = require("./src/backend/createOthers")
// createComponents(components, DB_SCHEMAS)


// createConfig(configs)
// createHelpers(helpers)
// createConstants(components, WEB_ROLES)

// createOthers(components)



const { createAddFormPage } = require("./src/frontend/createAddFormPage")
const { createAllTablePage } = require("./src/frontend/createAllTablePage")

components.forEach(c => {
    createAddFormPage(c)
    createAllTablePage(c)
})