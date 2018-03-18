var mongoose = require("mongoose"),
Schema = mongoose.Schema;

var commentSchema = new Schema({
    body: String,
    author: {
    	id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    	username: String,
    },
    date: {type: String, default: new Date().toString()}
});

module.exports = mongoose.model("Comment", commentSchema);