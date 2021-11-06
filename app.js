var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


window = {};

var User = require("./models/user");
var News = require("./models/news");

var seedDB = require("./seeds");
const { exists } = require("./models/user");


var flag = 0;
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

var pg1 = 0;

app.get("/", function(req, res){
    res.render("index.ejs", {currPg: pg1});
});

app.get("/downvote/:newsid/:pg2", function(req, res){
    // console.log(req.params.newsid);
    curr_news_id = req.params.newsid;
    curr_username = res.locals.currentUser.username;
    curr_user_news = res.locals.currentUser.news;
    var pg = req.params.pg2;

    News.find({newsId: curr_news_id}, function(err, nws){
        if(err){
            console.log(err);
        }
        else{
            if(nws.length==0)
            {
                var newNews = {
                    newsId: curr_news_id,
                    fakePercentage: 0,
                    votes: ['']
                };
                News.create(newNews, function(err, newlyCreated){
                    if(err){
                        console.log(err);
                    }else{
                        News.find({newsId: curr_news_id}, function(err, nws1){
                            if(err){
                                console.log(err);
                            }
                            else{
                                if(curr_user_news.includes(curr_news_id)===true)
                                {
            
                                }
                                else{
                                console.log("DOWNVOTE");
                                console.log(nws1);
                                res.locals.currentUser.news.push(curr_news_id);
                                nws1[0].votes.push(curr_username);
                                nws1[0].save();
                                res.locals.currentUser.save();
                                }
                                flag = 1;
                                pg1 = pg;
                                res.redirect("/");
                            }
                        });
                    }
                });
            }
            else
            {
                News.find({newsId: curr_news_id}, function(err, nws1){
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(curr_user_news.includes(curr_news_id)===true)
                        {
    
                        }
                        else{
                        console.log("DOWNVOTE");
                        console.log(nws1);
                        res.locals.currentUser.news.push(curr_news_id);
                        nws1[0].votes.push(curr_username);
                        nws1[0].save();
                        res.locals.currentUser.save();
                        }
                        flag = 1;
                        pg1 = pg;
                        res.redirect("/");
                    }
                });
            }
            
        }
    });

    // flag = 0;
    // res.redirect("/");
});

app.get("/upvote/:newsid/:pg2", function(req, res){
    // console.log(req.params.newsid);
    curr_news_id = req.params.newsid;
    curr_username = res.locals.currentUser.username;
    curr_user_news = res.locals.currentUser.news;
    var pg = req.params.pg2;

    News.find({newsId: curr_news_id}, function(err, nws){
        if(err){
            console.log(err);
        }
        else{
            News.find({newsId: curr_news_id}, function(err, nws1){
                if(err){
                    console.log(err);
                }
                else{
                    if(curr_user_news.includes(curr_news_id)===true)
                    {
                        console.log("UPVOTE");
                        console.log(nws1);
                        res.locals.currentUser.news.remove(curr_news_id);
                        nws1[0].votes.remove(curr_username);
                        nws1[0].save();
                        res.locals.currentUser.save();
                    }
                    flag = 0;
                    pg1 = pg;
                    res.redirect("/");
                }
            });
        }
    });

    // flag = 1;
    // res.redirect("/");
});

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
                flag = 0;
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