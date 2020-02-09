const _ = require("lodash");
const { queryToMongoAndFilter } = require("../../helpers/index")
const groupDAL = require("./DAL");
/*__GENERATOR__EXTRA_IMPORTS__*/

class Controller {

    async save(req, res) {
        try {
            let params = req.body;
            let schemaObject = _.pick(params, [
                "orgId","name","description"
            ]);

            let data = await groupDAL.insert(schemaObject);
            return res.sendResponse.success({
                msg: "Group details saved successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while saving Group details " }, 500);
        }
    }


    async getOne(req, res) {
        try {
            let _id = req.params.id
            let data = await groupDAL.getOne({ _id });
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "Group not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "Group details fetched successfully",
                data: data
            });
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while finding Group details" }, 500);
        }
    }



    async getAll(req, res) {
        try {
            let data = await groupDAL.getAll({ ...queryToMongoAndFilter(req.query) });
            return res.sendResponse.success({
                msg: "Group details fetched successfully",
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
                "orgId","name","description"
            ]);

            let data = await groupDAL.update({ _id }, schemaObject);
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "Group not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "Group details updated successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while updating Group details " }, 500);
        }
    }

    async delete(req, res) {
        try {
            let _id = req.params.id
            let data = await groupDAL.delete({ _id });
            return res.sendResponse.success({
                msg: "Group deleted successfully",
                data: data
            })
        } catch (e) {
            console.log(e)
            return res.sendResponse.fail({ msg: "Error while deleting Group" }, 500);
        }
    }

    /*__GENERATOR__EXTRA_METHODS__*/

}


module.exports = new Controller();
