const router = require("express").Router();
const { body, oneOf } = require("express-validator");
const { userHasRole, userLogined, validator, upload } = require("../../middlewares/index")
const __GENERATOR__CONTROLLER_NAME__ = require("./controller");
/*__GENERATOR__EXTRA_IMPORTS__*/





router.post("/__GENERATOR_COMPONENT_NAME__", /*__GENERATOR_EXTRA_POST_MIDDLEWARES__*/ __GENERATOR__CONTROLLER_NAME__.save);


router.get('/__GENERATOR_COMPONENT_NAME__/:id', __GENERATOR__CONTROLLER_NAME__.getOne);

router.get('/__GENERATOR_COMPONENT_NAME__', __GENERATOR__CONTROLLER_NAME__.getAll);

router.patch('/__GENERATOR_COMPONENT_NAME__/:id', __GENERATOR__CONTROLLER_NAME__.update);

router.delete('/__GENERATOR_COMPONENT_NAME__/:id', __GENERATOR__CONTROLLER_NAME__.delete);





/*__GENERATOR__COMPONENT_ROUTERS__*/

module.exports = router;