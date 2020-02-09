const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;
const { DB_EMPLOYEES } = require("../../constants").DB_SCHEMAS
/*__GENERATOR__EXTRA_IMPORTS__*/



const employeeSchema = new Schema({
    orgId: {
        "type": "ObjectId",
        "ref": "organisations"
    },
    firstName: {
        "type": String,
        "required": true
    },
    lastName: {
        "type": String,
        "required": true
    },
    email: {
        "type": String,
        "required": true
    },
    password: {
        "type": String,
        "required": true,
        "default": "123456789"
    },
    mobileNo: {
        "required": true,
        "type": String
    },
    role: String,
    groupId: [
        {
            "type": "ObjectId",
            "ref": "groups"
        }
    ],
    gender: String,
    dob: String,
    empNo: String,
    lastLogin: Date,
    joinDate: String,
    webRole: {
        "type": String,
        "default": "Member"
    },
    images: [
        {
            "type": String
        }
    ],
    status: {
        "type": Boolean,
        "default": true
    },
    addedBy: {
        "type": "ObjectId",
        "ref": "employees"
    },
    groupAdmin: [
        {
            "type": "ObjectId",
            "ref": "groups"
        }
    ]
});

employeeSchema.plugin(timestamps);
/*__GENERATOR__EXTRA__*/
module.exports = mongoose.model(DB_EMPLOYEES, employeeSchema);