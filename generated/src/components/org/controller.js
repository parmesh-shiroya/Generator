const _ = require("lodash");
const { queryToMongoAndFilter } = require("../../helpers/index")
const orgDAL = require("./DAL");
/*__GENERATOR__EXTRA_IMPORTS__*/

class Controller {

    async save(req, res) {
        try {
            let params = req.body;
            let schemaObject = _.pick(params, [
                "logo","name","email","mobileNo","website","billingEmail","billingMobile","status","address","state","country"
            ]);

            let data = await orgDAL.insert(schemaObject);
            return res.sendResponse.success({
                msg: "Org details saved successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while saving Org details " }, 500);
        }
    }


    async getOne(req, res) {
        try {
            let _id = req.params.id
            let data = await orgDAL.getOne({ _id });
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "Org not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "Org details fetched successfully",
                data: data
            });
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while finding Org details" }, 500);
        }
    }



    async getAll(req, res) {
        try {
            let data = await orgDAL.getAll({ ...queryToMongoAndFilter(req.query) });
            return res.sendResponse.success({
                msg: "Org details fetched successfully",
                data: data
            });
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while finding group details" }, 500);
        }
    }


    async update(req, res) {
        try {
            let _id = req.params.id
            let params = req.body;
            let schemaObject = _.pick(params, [
                "logo","name","email","mobileNo","website","billingEmail","billingMobile","status","address","state","country"
            ]);

            let data = await orgDAL.update({ _id }, schemaObject);
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "Org not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "Org details updated successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while updating Org details " }, 500);
        }
    }

    async delete(req, res) {
        try {
            let _id = req.params.id
            let data = await orgDAL.delete({ _id });
            return res.sendResponse.success({
                msg: "Org deleted successfully",
                data: data
            })
        } catch (e) {
            console.log(e)
            return res.sendResponse.fail({ msg: "Error while deleting Org" }, 500);
        }
    }

    /*__GENERATOR__EXTRA_METHODS__*/

}


module.exports = new Controller();
