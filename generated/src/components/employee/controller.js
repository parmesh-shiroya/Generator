const _ = require("lodash");
const { queryToMongoAndFilter } = require("../../helpers/index")
const employeeDAL = require("./DAL");
/*__GENERATOR__EXTRA_IMPORTS__*/

class Controller {

    async save(req, res) {
        try {
            let params = req.body;
            let schemaObject = _.pick(params, [
                "orgId","firstName","lastName","email","password","mobileNo","role","groupId","gender","dob","empNo","lastLogin","joinDate","webRole","images","status","addedBy","groupAdmin"
            ]);

            let data = await employeeDAL.insert(schemaObject);
            return res.sendResponse.success({
                msg: "Employee details saved successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while saving Employee details " }, 500);
        }
    }


    async getOne(req, res) {
        try {
            let _id = req.params.id
            let data = await employeeDAL.getOne({ _id });
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "Employee not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "Employee details fetched successfully",
                data: data
            });
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while finding Employee details" }, 500);
        }
    }



    async getAll(req, res) {
        try {
            let data = await employeeDAL.getAll({ ...queryToMongoAndFilter(req.query) });
            return res.sendResponse.success({
                msg: "Employee details fetched successfully",
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
                "orgId","firstName","lastName","email","password","mobileNo","role","groupId","gender","dob","empNo","lastLogin","joinDate","webRole","images","status","addedBy","groupAdmin"
            ]);

            let data = await employeeDAL.update({ _id }, schemaObject);
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "Employee not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "Employee details updated successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while updating Employee details " }, 500);
        }
    }

    async delete(req, res) {
        try {
            let _id = req.params.id
            let data = await employeeDAL.delete({ _id });
            return res.sendResponse.success({
                msg: "Employee deleted successfully",
                data: data
            })
        } catch (e) {
            console.log(e)
            return res.sendResponse.fail({ msg: "Error while deleting Employee" }, 500);
        }
    }

    /*__GENERATOR__EXTRA_METHODS__*/

}


module.exports = new Controller();
