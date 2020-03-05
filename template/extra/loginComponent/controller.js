class Controller {

    async loginByForm(req, res) {

        let filter = _.pick(req.body, [/*__GENERATOR_FIND_FOR_LOGIN_KEYS__*/])
        let data = await __GENERATOR__DAL_NAME__.getOne({ filter });
        if (_.isEmpty(data)) {
            return res.sendResponse.fail({ msg: "__GENERATOR__COMPONENT_NAME__ not found" }, 421);
        }

        /*__GENERATOR_OTHER_CONDITION__*/

        return res.sendResponse.success({ msg: "Logined Successfully", data: { token: data.generateJWT(), user: data.toObject() } })
    }

    async forgotPassword(req, res) {
        try {
            let filter = _.pick(req.body, [/*__GENERATOR_FIND_FOR_LOGIN_KEYS__*/])
            let data = await __GENERATOR__DAL_NAME__.getOne(filter)
            if (_.isEmpty(data)) {
                return res.sendResponse.success({ msg: "Reset link sent to your email. Please check your mailbox." })
            }
            let token = crypto.createHash("sha256").update(emp._id + _.random(1000)).digest("hex").toLowerCase()
            data.resetToken = token;
            await data.save()
            let url = DASHBOARD_URL + "#/user/resetPassword?token=" + token

            let mailOptions = {
                from: MAIL_FROM, // sender address
                to: "__GENERATOR_TO_EMAIL_VAR__", // list of receivers
                subject: "__GENERATOR__APP_NAME__ - Reset password", // Subject line
                // text: req.body.body, // plain text body
                html: `Click here to reset your password <br/> <a href="${url}">${url}</a>` // html body
            };
            mailTransporter.sendMail(mailOptions);
            return res.sendResponse.success({ msg: "Reset link sent to your email. Please check your mailbox." })

        } catch (e) {
            console.log(e)
            return res.sendResponse.fail({ msg: "Error while request " }, 500);
        }
    }

    async resetPassword(req, res) {
        try {
            let data = await __GENERATOR__DAL_NAME__.getOne({ resetToken: req.body.token })

            if (_.isEmpty(data))
                return res.sendResponse.fail("Token is not valid");

            /*__GENERATOR__PASSWORD_CHANGES__*/
            emp.password = req.body.password
            emp.resetToken = undefined
            await emp.save()
            return res.sendResponse.success({
                msg: "Password changed successfully"
            });
        } catch (e) {
            return res.sendResponse.fail({ msg: "Error while reseting password " }, 500);
        }
    }

    // async changePassword(req, res) {
    // 	let { oldPassword, newPassword } = req.body;
    // 	// Get the empId from token
    // 	let empId = req.user._id;
    // 	try {
    // 		// If the empId exist in url take that as empId
    // 		if (req.params.empId) {
    // 			empId = req.params.empId
    // 		}
    // 		// Get the employee by id
    // 		let emp = await EmpDAL.getOne({ _id: empId, ...employeePermission(req.user) })
    // 		// If employee not exist send the error
    // 		if (_.isEmpty(emp))
    // 			return res.sendResponse.fail({ msg: "Employee not found" })

    // 		// Compare the old password with current password if fail send fail response
    // 		if (!(oldPassword === emp.password))
    // 			return res.sendResponse.fail({ msg: "Old password is not correct" })
    // 		// If password match set new password save the emplyee and send success msg
    // 		emp.password = newPassword;
    // 		emp.save()
    // 		return res.sendResponse.success({ msg: "Password updated successfully" })
    // 	} catch (e) {
    // 		req.logger.error("Employee.account.updatePassword", e)
    // 		return res.sendResponse.fail({ msg: "Error while updating password" })
    // 	}
    // }


}

module.exports = new Controller()