const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/QuizWeb");

//check db connected or not
connect.then(() => {
    console.log("Exam list database connected successfully");
})
.catch(() => {
    console.log("Exam list database cannot be connected");
})

// Schema for AnswerOption subdocument
const AnswerOptionSchema = new mongoose.Schema({
    optionNumber: Number,
    answerBody: {
       type: String,
       required: true,
       minlength: 1,
       maxlength: 200
    },
    isCorrectAnswer: {
       type: Boolean,
       default: false
    }
   }, {
    _id: false // Prevents Mongoose from creating an _id field for subdocuments
});
   
// Schema for Question
const QuestionSchema = new mongoose.Schema({
    questionText: {
       type: String,
       required: true
    },
    answerOptions: {
       type: [AnswerOptionSchema],
       required: true
    }
});

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
    },
    questions: [QuestionSchema] // Add questions array
});

const exam = new mongoose.model("exams", ExamSchema);

module.exports = exam;
