// Tag Document Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TagSchema = new Schema(
    {
        name: {type: String, require: true}
    }
);

TagSchema
.virtual('url')
.get(() => {
    return '/catalog/tag/' + this._id;
});

module.exports = mongoose.model('Tag', TagSchema);

