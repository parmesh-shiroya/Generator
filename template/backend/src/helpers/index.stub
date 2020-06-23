const _ = require("lodash")
const ObjectId = require('mongoose').Types.ObjectId;
/*__GENERATOR__EXTRA_IMPORTS__*/

const helpers = {
    /*__GENERATOR__EXTRA_HELPERS__*/


    queryToMongoAndFilter: (queryArray = []) => {

        if (_.isEmpty(queryArray))
            return {}

        let filterArray = []
        for (x in queryArray) {
            if (ObjectId.isValid(queryArray[x])) {
                filterArray.push({ [x]: queryArray[x] || "##" })
            } else
                filterArray.push({ [x]: { $regex: queryArray[x] || "##", $options: "i" } })
        }
        return { $and: filterArray }
    }

}




module.exports = helpers