const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Quiz-login");

//check db connected or not
connect.then(() => {
    console.log("Database connected successfully");
})
.catch(() => {
    console.log("Database cannot be connected");
})

//Create a schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//collection Part
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;