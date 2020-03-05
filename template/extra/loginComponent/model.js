let preSave = async function (next, done) {

    /*__GENERATOR__ENCRYPT_VALUES__*/

    next();
}

let compare = async function (dbValue, value) {

    return await bcrypt.compare(value, dbValue)

}

let generateJWT = function (extra = {}) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    return jwt.sign(
        {
            _id: this._id,
            ...extra,
            exp: parseInt(expirationDate.getTime() / 1000, 10)
        },
        jwtSecret
    );
};

let extraImports = () => {
    return `
    const jwt = require("jsonwebtoken");
    const bcrypt = require("bcrypt")
    const jwtSecret = "__GENERATOR__JWTSECRET__"
    `
}


module.exports = { preSave, compare, generateJWT, extraImports }