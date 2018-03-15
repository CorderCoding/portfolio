var mongoose = require("mongoose"),
Schema = mongoose.Schema;

var postSchema = new Schema({
    title: String,
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model("Post", postSchema);