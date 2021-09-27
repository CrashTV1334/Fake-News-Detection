var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    location: String,
    interests: [String]
});

// var User = mongoose.model("User", userSchema);

// var g = new User({
//     name: "Sam",
//     location: "Vadodara",
//     interests: ["cricket", "football", "painting"]
// });

// var UserSchema = new mongoose.Schema({
//     username: String,
//     password: String
// });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);