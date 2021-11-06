var mongoose = require("mongoose");

var NewsSchema = new mongoose.Schema({
    newsId: String,
    fakePercentage: Number,
    votes: [String]
});

module.exports = mongoose.model("News", NewsSchema);

