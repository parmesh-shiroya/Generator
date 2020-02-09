const _ = require("lodash");
const { queryToMongoAndFilter } = require("../../helpers/index")
const __GENERATOR__DAL_NAME__ = require("./DAL");
/*__GENERATOR__EXTRA_IMPORTS__*/

class Controller {

    async save(req, res) {
        try {
            let params = req.body;
            let schemaObject = _.pick(params, [
                /*__GENERATOR__SCHEMA__KEYS__*/
            ]);

            let data = await __GENERATOR__DAL_NAME__.insert(schemaObject);
            return res.sendResponse.success({
                msg: "__GENERATOR__COMPONENT_NAME__ details saved successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while saving __GENERATOR__COMPONENT_NAME__ details " }, 500);
        }
    }


    async getOne(req, res) {
        try {
            let _id = req.params.id
            let data = await __GENERATOR__DAL_NAME__.getOne({ _id });
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "__GENERATOR__COMPONENT_NAME__ not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "__GENERATOR__COMPONENT_NAME__ details fetched successfully",
                data: data
            });
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while finding __GENERATOR__COMPONENT_NAME__ details" }, 500);
        }
    }



    async getAll(req, res) {
        try {
            let data = await __GENERATOR__DAL_NAME__.getAll({ ...queryToMongoAndFilter(req.query) });
            return res.sendResponse.success({
                msg: "__GENERATOR__COMPONENT_NAME__ details fetched successfully",
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
                /*__GENERATOR__UPDATABLE_SCHEMA__KEYS__*/
            ]);

            let data = await __GENERATOR__DAL_NAME__.update({ _id }, schemaObject);
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "__GENERATOR__COMPONENT_NAME__ not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "__GENERATOR__COMPONENT_NAME__ details updated successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while updating __GENERATOR__COMPONENT_NAME__ details " }, 500);
        }
    }

    async delete(req, res) {
        try {
            let _id = req.params.id
            let data = await __GENERATOR__DAL_NAME__.delete({ _id });
            return res.sendResponse.success({
                msg: "__GENERATOR__COMPONENT_NAME__ deleted successfully",
                data: data
            })
        } catch (e) {
            console.log(e)
            return res.sendResponse.fail({ msg: "Error while deleting __GENERATOR__COMPONENT_NAME__" }, 500);
        }
    }

    /*__GENERATOR__EXTRA_METHODS__*/

}


module.exports = new Controller();
