const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Schema = mongoose.Schema;
const { DB_GROUPS } = require("../../constants").DB_SCHEMAS
/*__GENERATOR__EXTRA_IMPORTS__*/



const groupSchema = new Schema({
    orgId: {
        "type": "ObjectId",
        "ref": "organisations"
    },
    name: String,
    description: String
});

groupSchema.plugin(timestamps);
/*__GENERATOR__EXTRA__*/
module.exports = mongoose.model(DB_GROUPS, groupSchema);