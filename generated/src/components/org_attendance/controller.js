const _ = require("lodash");
const { queryToMongoAndFilter } = require("../../helpers/index")
const org_attendanceDAL = require("./DAL");
/*__GENERATOR__EXTRA_IMPORTS__*/

class Controller {

    async save(req, res) {
        try {
            let params = req.body;
            let schemaObject = _.pick(params, [
                "orgId","userId","checkInTime","checkOutTime","checkInGate","checkOutGate","date","hours","purpose"
            ]);

            let data = await org_attendanceDAL.insert(schemaObject);
            return res.sendResponse.success({
                msg: "Org Attendance details saved successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while saving Org Attendance details " }, 500);
        }
    }


    async getOne(req, res) {
        try {
            let _id = req.params.id
            let data = await org_attendanceDAL.getOne({ _id });
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "Org Attendance not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "Org Attendance details fetched successfully",
                data: data
            });
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while finding Org Attendance details" }, 500);
        }
    }



    async getAll(req, res) {
        try {
            let data = await org_attendanceDAL.getAll({ ...queryToMongoAndFilter(req.query) });
            return res.sendResponse.success({
                msg: "Org Attendance details fetched successfully",
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
                "orgId","userId","checkInTime","checkOutTime","checkInGate","checkOutGate","date","hours","purpose"
            ]);

            let data = await org_attendanceDAL.update({ _id }, schemaObject);
            if (_.isEmpty(data)) {
                return res.sendResponse.fail({ msg: "Org Attendance not found" }, 421);
            }
            return res.sendResponse.success({
                msg: "Org Attendance details updated successfully",
                data: data
            })
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while updating Org Attendance details " }, 500);
        }
    }

    async delete(req, res) {
        try {
            let _id = req.params.id
            let data = await org_attendanceDAL.delete({ _id });
            return res.sendResponse.success({
                msg: "Org Attendance deleted successfully",
                data: data
            })
        } catch (e) {
            console.log(e)
            return res.sendResponse.fail({ msg: "Error while deleting Org Attendance" }, 500);
        }
    }

    /*__GENERATOR__EXTRA_METHODS__*/

}


module.exports = new Controller();
