var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

var seedDB = require("./seeds");



const PORT = 3000;

const uri = "mongodb+srv://algoristy4:I68jYIrRxaijCoMv@profile-news.2cijj.mongodb.net/userProfileDatabase?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'));

app.use(require("express-session")({
    secret: "This the 5th sem Algoristy mini project",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// seedDB();
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});



app.get("/", function(req, res){
    res.render("index.ejs");
});

app.get("/check-news", function(req,res){
    res.send("You are on /check-news");
})

app.get("/register", function(req, res){
    res.render("./authenticate/register.ejs");
});

app.post("/register", function(req, res){
    // console.log(req.body);
    User.register(new User({
        username: req.body.username,
        name: req.body.name,
        state: req.body.state,
        city: req.body.city,
        interests: req.body.interests
    }), req.body.password, function (err, user) {
        if (err) {
            console.log("error from /register POST");
            console.log(err);
            return res.render("register.ejs");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/");
            });
        }
    });
});

app.get("/login", function (req, res) {
    res.render("./authenticate/login.ejs");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function (req, res) {

});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.listen(PORT, function(){
    console.log("Running on PORT 3000");
});