class ResponseHandler {
  constructor(res) {
    this.response = res;
  }

  fail(response, statusCode = 422) {
    if (typeof response.msg === "string") {
      response = [{ msg: response.msg }];
    } else if (typeof response === "string") {
      response = [{ msg: response }];
    }
    console.log("fail", response);
    this.response.status(statusCode).json({
      code: statusCode,
      type: "handled",
      status: false,
      error: response
    });
  }
  exception(msg) {
    this.response.json({
      code: 500,
      type: "Unhandled",
      status: false,
      error: [{ msg: msg }]
    });
  }
  success(msg, result = true) {
    this.response.json({
      code: 200,
      type: "",
      status: result,
      response: msg
    });
  }
}
module.exports = res => new ResponseHandler(res);
