const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;
const { DB_USERS } = require("../../constants").DB_SCHEMAS
/*__GENERATOR__EXTRA_IMPORTS__*/



const userSchema = new Schema({
    empId: [
        {
            "type": "ObjectId",
            "ref": "employees"
        }
    ],
    status: {
        "type": Boolean,
        "default": true
    }
});

userSchema.plugin(timestamps);
/*__GENERATOR__EXTRA__*/
module.exports = mongoose.model(DB_USERS, userSchema);