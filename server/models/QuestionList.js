const mongoose = require('mongoose')

const QuestionListSchema = mongoose.Schema({
    Question_id: {
        type: Number,
        maxlength: 5,
        unique : 1
    },
    title: {
        type: String,
        trim: true,
        unique: 1
    },
    choice: {
        type: Array,
        items:{
            type: String
        }
    },
    correct_idx: { 
        type: Number
    }
})

const QuestionList = mongoose.model('QuestionList',QuestionListSchema)

module.exports = {QuestionList}