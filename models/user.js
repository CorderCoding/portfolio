var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose"),
Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false},
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);