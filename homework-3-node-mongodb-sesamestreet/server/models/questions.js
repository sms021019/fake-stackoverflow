// Question Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
    {
        title: {type: String, required: true, maxLength: 100},
        text: {type: String, required: true},
        tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
        answers: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
        asked_by: {type: String, required: true, default: 'Anonymous'},
        ask_date_time: {type: Date, required: true, default: Date.now},
        views: {type: Number, required: true, default: 0}
    }
);

QuestionSchema
.virtual('url')
.get(() => {
    return '/catalog/question/' + this._id;
});

module.exports = mongoose.model('Question', QuestionSchema);