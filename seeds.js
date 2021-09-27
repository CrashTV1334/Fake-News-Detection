var mongoose = require("mongoose");
var User = require("./models/user");



var data = [{
        name: "Sam",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtIkmYyz_zlIDdo4krOu48MVSOSTZue5_RYQ&usqp=CAU",
        description: "Must visit place on your bucket list"
    },
    {
        name: "Snake's Valey",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVCTAtCh_UvcXwe_5kHSDDZbzU3rs4_CFmZQ&usqp=CAU",
        description: "Beautiful location with a wonderful river"
    },
    {
        name: "Cabin Woods",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpr67RMWSztxMtldAW2Bky28oiTJIhcedqzA&usqp=CAU",
        description: "Don't know how to make a tent, Don't worry we got you covered"
    }
];


function seedDB() {
    Campground.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campgrounds) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added campground");
                        Comment.create({
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campgrounds.comments.push(comment);
                                campgrounds.save();
                                console.log("Added a new comment!");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;