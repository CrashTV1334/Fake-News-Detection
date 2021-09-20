var express = require("express");
var app = express();

const PORT = 3000;

app.get("/", function(req, res){
    res.send("Hello");
});

app.listen(PORT, function(){
    console.log("Running on PORT 3000");
});