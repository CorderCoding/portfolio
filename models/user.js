var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose"),
Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    name: {type: String, default: ""},
    email: {type: String, default: ""},
    recvEmails: {type: Boolean, default: false},
    isAuthor: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
