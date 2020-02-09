const _ = require("lodash")
const ObjectId = require('mongoose').Types.ObjectId;
/*__GENERATOR__EXTRA_IMPORTS__*/

const helpers = {
    formatDate:(date) => {
        // date = new Date(1579174808117)
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }
        date = dd + '-' + mm + '-' + yyyy;
        return date
    },



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