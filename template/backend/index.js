const express = require("express");
const bodyParser = require("body-parser");
const ResponseHandler = require("./src/helpers/responseHandler");
const jwt = require("express-jwt");
const cors = require("cors");
const { UPLOAD_DIR, PORT, KEYS } = require("./config/index")

// Connect To Database
require("./src/utils/mongoose/index");

//   Init Express Server
const app = express();

app.use(cors())

// parse requests of content-type - application/x-www-form-urlencoded
// parse requests of content-type - application/json
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

// allow access control origin and headers
app.use(function (req, res, next) {
    console.log(req.body)
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    next();
});

app.use(express.static(UPLOAD_DIR))

app.use(jwt({ secret: KEYS.JWT_SECRET, credentialsRequired: false }));

app.use((req, res, next) => {
    res.sendResponse = ResponseHandler(res);
    next();
});

// Set API Routes
app.use("/v1", require("./src/components/index"));



app.use(function (err, req, res, next) {
    console.log("Errros", err);
    if (err.message) {
        err = err.message;
    }
    console.log("Filtered Err", err);
    ResponseHandler(res).exception(err);
});
//app.use(multer({ dest: "../attendex_api/src/images"}));

// listen for requests
const port = process.env.PORT || PORT;

app.listen(port, "0.0.0.0", () => {
    console.log("Server is listening on port " + port);
});
