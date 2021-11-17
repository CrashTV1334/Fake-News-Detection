var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var XMLHttpRequest = require("xhr2");
const request = require("request-promise");
var xmlhttp = new XMLHttpRequest();

var news_arr = [];
var session_key = "";
var user_name = "";
var vote_id = "";

var url = "https://fake-news-detector-grouproject.herokuapp.com/";

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + "/public"));

var port = process.env.PORT || 3000;
var newsId;
var indx = 0;

xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    news_arr = JSON.parse(this.responseText);
    proceedFunction();
  }
};
xmlhttp.open(
  "GET",
  "https://fake-news-detector-grouproject.herokuapp.com/get/news/20",
  true
);
xmlhttp.send();

function proceedFunction() {
  app.get("/", function (req, res) {
    newsId = news_arr[indx]._id;
    res.redirect("/" + newsId);
  });

  app.get("/:newsId", function (req, res) {
    // console.log(news_arr[indx]);

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        temp_news = JSON.parse(this.responseText);

        if (temp_news.error != "No news found in the database")
          news_arr[indx] = temp_news;

        res.render("index.ejs", {
          newsId: newsId,
          newsData: news_arr[indx],
          session_key: session_key,
          user_name: user_name,
        });
      }
    };
    xmlhttp.open(
      "GET",
      "https://fake-news-detector-grouproject.herokuapp.com/one/news/" + newsId,
      true
    );
    xmlhttp.send();
  });

  app.get("/:newId/next", function (req, res) {
    indx += 1;
    if (indx >= news_arr.length) indx = 0;
    res.redirect("/");
  });

  app.get("/:newId/previous", function (req, res) {
    indx -= 1;
    if (indx < 0) indx = news_arr.length - 1;
    res.redirect("/");
  });

  app.get("/:newsId/downvote", function (req, res) {
    const options = {
      method: "POST",
      uri: "https://fake-news-detector-grouproject.herokuapp.com/one/news/downvote",
      body: {
        vote_id: vote_id,
        news_id: newsId,
      },
      json: true,
    };
    request(options)
      .then(function (response) {
        // res.send(response);
        res.redirect("/" + newsId);
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  app.get("/:newsId/upvote", function (req, res) {
    const options = {
      method: "POST",
      uri: "https://fake-news-detector-grouproject.herokuapp.com/one/news/upvote",
      body: {
        vote_id: vote_id,
        news_id: newsId,
      },
      json: true,
    };
    request(options)
      .then(function (response) {
        // res.send(response);
        res.redirect("/" + newsId);
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  app.get("/:newsId/register", function (req, res) {
    res.render("./authenticate/register.ejs", {
      session_key: session_key,
    });
  });

  app.post("/:newsId/register", function (req, res) {
    // console.log(req.body);
    const options = {
      method: "POST",
      uri: "https://fake-news-detector-grouproject.herokuapp.com/register",
      body: req.body,
      json: true,
    };
    request(options)
      .then(function (response) {
        // res.send(response);
        res.redirect("/:newsId/login");
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  app.get("/:newsId/login", function (req, res) {
    res.render("./authenticate/login.ejs", {
      session_key: session_key,
    });
  });

  app.post("/:newsId/login", function (req, res) {
    // console.log(req.body);
    const options = {
      method: "POST",
      uri: "https://fake-news-detector-grouproject.herokuapp.com/login",
      body: req.body,
      json: true,
    };
    request(options)
      .then(function (response) {
        session_key = response.key;
        user_name = response.data.name;
        vote_id = response.data.voteId;
        // res.send(response);
        res.redirect("/");
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  app.get("/:newsId/logout", function (req, res) {
    session_key = "";
    user_name = "";
    vote_id = "";
    res.redirect("/");
  });

  app.listen(port, function () {
    console.log("Running on PORT " + port);
  });
}
