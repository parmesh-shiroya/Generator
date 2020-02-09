const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;
const { DB_ORGANISATIONS } = require("../../constants").DB_SCHEMAS
/*__GENERATOR__EXTRA_IMPORTS__*/



const orgSchema = new Schema({
    logo: {
        "type": String,
        "required": true
    },
    name: {
        "type": String,
        "required": true
    },
    email: {
        "type": String,
        "required": true
    },
    mobileNo: {
        "type": String,
        "required": true
    },
    website: String,
    billingEmail: String,
    billingMobile: String,
    status: {
        "type": Boolean,
        "default": true
    },
    address: {
        "type": String,
        "required": true
    },
    state: {
        "type": String,
        "required": true
    },
    country: {
        "type": String,
        "required": true
    }
});

orgSchema.plugin(timestamps);
/*__GENERATOR__EXTRA__*/
module.exports = mongoose.model(DB_ORGANISATIONS, orgSchema);