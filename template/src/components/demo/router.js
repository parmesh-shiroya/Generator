const router = require("express").Router();
const { body, oneOf } = require("express-validator");
const { userHasRole, userLogined, validator, upload } = require("../../middlewares/index")
const __GENERATOR__CONTROLLER_NAME__ = require("./controller");
/*__GENERATOR__EXTRA_IMPORTS__*/



/*__GENERATOR__COMPONENT_ROUTERS__*/

module.exports = router;