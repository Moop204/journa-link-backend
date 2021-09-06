var express = require("express");
var app = express();
// Uses Heroku defined port number or else 3000
var port = process.env.PORT || 3000;
app.get("/api", function (req, res) {
    res.status(200).json({ api: "version 1" });
});
app.get("/", function (req, res) {
    res.status(200).json({ base: "other" });
});
app.listen(3000, function () { return console.log("server started"); });
