const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/QuizWeb");

//check db connected or not
connect.then(() => {
    console.log("Exam list database connected successfully");
})
.catch(() => {
    console.log("Exam list database cannot be connected");
})

//Schema for examList
const ExamSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    status: {
        type: String,

    },
    timeStart: {
        type: Date,
        required: false
    },
    timeEnd: {
        type: Date,
        required: false
    }
});

const exam = new mongoose.model("exams", ExamSchema);

module.exports = exam;
