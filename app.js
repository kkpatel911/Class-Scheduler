var express = require("express");
const bodyParser = require('body-parser');
var app = express();
const fs = require("fs");
const buildCalendar = require("./lib/buildCalendar");

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req,res) {
    res.render('query');
});

app.post('/chart', function(req,res) {
    var calendarData = []
    fs.readFile("data.json", "utf8", function(err, data) {
      if (err) {
        console.log(err);
      }
      var json = JSON.parse(data);
      calendarData = buildCalendar(json, req.body);
      res.render('chart',
        { name: "Class Layout by Week",
          barArray: JSON.stringify(calendarData),
        });
    });
});

console.log("Server has started on port 8080");
app.listen(8080)