const dbConfig = require("../../../config/index").DATABASE;
const mongoose = require("mongoose");
mongoose.Promise = global.Promise; // Connecting to the database //

mongoose
    .connect(dbConfig.URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch(err => {
        console.log(err);
        console.log("Could not connect to the database. Exiting now...");
        process.exit();
    });
