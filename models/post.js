var mongoose = require("mongoose"),
Schema = mongoose.Schema;

var postSchema = new Schema({
    title: String,
    body: String,
    author: {
    	id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    	username: String
    },
    date: {type: String, default: new Date().toDateString()},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
});

module.exports = mongoose.model("Post", postSchema);