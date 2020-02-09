const _ = require("lodash");
const { queryToMongoAndFilter } = require("../../helpers/index")
const userDAL = require("./DAL");
/*__GENERATOR__EXTRA_IMPORTS__*/

class Controller {

    async save(req, res) {
        try {
            let params = req.body;
            let schemaObject = _.pick(params, [
                "empId","status"
            ]);

            let data = await userDAL.insert(schemaObject);
            return res.sendResponse.success({
                msg: "User details saved successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while saving User details " }, 500);
        }
    }


    async getOne(req, res) {
        try {
            let _id = req.params.id
            let data = await userDAL.getOne({ _id });
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "User not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "User details fetched successfully",
                data: data
            });
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while finding User details" }, 500);
        }
    }



    async getAll(req, res) {
        try {
            let data = await userDAL.getAll({ ...queryToMongoAndFilter(req.query) });
            return res.sendResponse.success({
                msg: "User details fetched successfully",
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
                "empId","status"
            ]);

            let data = await userDAL.update({ _id }, schemaObject);
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "User not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "User details updated successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while updating User details " }, 500);
        }
    }

    async delete(req, res) {
        try {
            let _id = req.params.id
            let data = await userDAL.delete({ _id });
            return res.sendResponse.success({
                msg: "User deleted successfully",
                data: data
            })
        } catch (e) {
            console.log(e)
            return res.sendResponse.fail({ msg: "Error while deleting User" }, 500);
        }
    }

    /*__GENERATOR__EXTRA_METHODS__*/

}


module.exports = new Controller();
