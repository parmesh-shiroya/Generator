const _ = require("lodash");
const { validationResult } = require("express-validator");
var multer = require('multer');
const path = require('path');
const { UPLOAD_DIR } = require("../../config/index")

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const userLogined = async (req, res, next) => {
    const user = req.user;
    if (user && user.webRole) return next();
    return res.sendResponse.fail({ msg: "You are not authorized user" }, 401);
};



// Roles:superAdmin,admin,employee
const userHasRole = roles => {
    return [
        userLogined,
        (req, res, next) => {
            // return next()
            const user = req.user;

            if (_.includes(roles, user.webRole)) return next();

            return res.sendResponse.fail(
                { msg: "You don't have permission to perform this action" },
                401
            );
        }
    ];
};

const errorFormat = ({ location, msg, param, value, nestedErrors }) => {
    let message = param != "_error" ? param + " " : "";
    message += msg;
    if (!_.isEmpty(nestedErrors)) {
        let newError = nestedErrors[0];
        return {
            msg: newError.msg,
            param: newError.param,
            location: newError.location,
            value: newError.value,
            nestedErrors: newError.nestedErrors
        };
    }
    return {
        msg: msg,
        param: param,
        location: location,
        value: value,
        nestedErrors: nestedErrors
    };
};

const validator = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormat);
    if (!errors.isEmpty())
        return res.sendResponse.fail(_.values(errors.mapped()), 422);
    next();
};

module.exports = {
    userLogined,
    userHasRole,
    validator,
    upload
};
