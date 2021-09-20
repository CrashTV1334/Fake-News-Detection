var express = require("express");
var app = express();

const PORT = 3000;

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render("index.ejs");
});

app.get("/check-news", function(req,res){
    res.send("You are on /check-news");
})

app.listen(PORT, function(){
    console.log("Running on PORT 3000");
});