const mongoose = require('mongoose')

const ExamListSchema = mongoose.Schema({
    Exam_id: {
        type: String,
        maxlength: 10,
        unique : 1
    },
    Exam_code: {
        type: Number,
        maxlength: 7,
        unique : 1
    },
    Questions: {
        type: Array,
        items:{
            type: String
        }
    }
})

const ExamList = mongoose.model('ExamList',ExamListSchema)
module.exports = {ExamList}