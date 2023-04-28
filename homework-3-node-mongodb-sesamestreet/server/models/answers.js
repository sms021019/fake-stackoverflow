// Answer Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AnswerSchema = new Schema(
    {
        text: {type: String, required: true},
        ans_by: {type: String, required: true, default: 'Anonymous'},
        ans_date_time: {type: Date, required: true, default: Date.now}
    }
);

AnswerSchema
.virtual('url')
.get(() => {
    return '/catalog/answer/' + this._id;
});

module.exports = mongoose.model('Answer', AnswerSchema);