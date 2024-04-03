const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/QuizWeb");

//check db connected or not
connect.then(() => {
    console.log("User database connected successfully");
})
.catch(() => {
    console.log("User database cannot be connected");
})

//Schema for login
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
const user = new mongoose.model("users", LoginSchema);

module.exports = user;

