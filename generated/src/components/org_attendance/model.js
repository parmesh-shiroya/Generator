const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;
const { DB_ORG_ATTENDANCES } = require("../../constants").DB_SCHEMAS
/*__GENERATOR__EXTRA_IMPORTS__*/



const org_attendanceSchema = new Schema({
    orgId: {
        "type": "ObjectId",
        "ref": "organisations"
    },
    userId: {
        "type": "ObjectId",
        "ref": "users"
    },
    checkInTime: Number,
    checkOutTime: Number,
    checkInGate: String,
    checkOutGate: String,
    date: {
        "type": String
    },
    hours: Number,
    purpose: String
});

org_attendanceSchema.plugin(timestamps);
/*__GENERATOR__EXTRA__*/
module.exports = mongoose.model(DB_ORG_ATTENDANCES, org_attendanceSchema);