var mongoose = require("mongoose"),
Schema = mongoose.Schema;

var commentSchema = new Schema({
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model("Comment", commentSchema);