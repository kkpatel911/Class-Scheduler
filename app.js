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
    res.render('configSearch');
});

app.post('/chart', function(req,res) {
  // TODO: Make a method to use this data to get all CRNs that match these criteria
  /*console.log(req.body.major1)
  console.log(req.body.classNumber1)
  console.log(req.body.geneds)*/

  // Make front-end somehow allow users to submit all classes as a single array:
  var mockInput = ["CPSC1100", "CPSC1110", "MATH1850", "MATH1960"]

    var classData = []
    // TODO: Go through mockInput, find out which files need to be opened
    // TODO: Open data/202040.CPSC.json and data/202040.MATH.json and put both into a single dictionary

    // WARNING: The below function is asynchronous. Reading all required functions
    //    at the same time is great, but you'll have to block before building calendar
    /*fs.readFile("CPSC.json", "utf8", function(err, data) {
      if (err) {
        console.log(err);
      }
      // Gets dictionary like: var x = [ {subject: "CPSC", courseNum: "1100", meetingTimes: ["W", "05:30  PM - 08:00  PM"]}, {subject: "CPSC", courseNum: "1100", meetingTimes: ["MWF", "10:00  AM - 10:50  AM"]}, {subject: "CPSC", courseNum: "1110", meetingTimes: ["TT", "09:25  AM - 10:40  AM"]} ]
      // Append this to classData... somehow...
    });*/

    // Numbers 1-24 represent 8:00am-8:00pm on Monday by half-hour. 25-48 represent 8:00am-8:00pm on Tuesday.
    var createdCalendar = buildCalendar(mockInput, classData); // Created calendar format: { CPSC1100: [0, 1, 2, 8, 9, 12, 13, 41, 42], CPSC1110: [22, 76], ... }

    res.render('chart',
      { name: "Class Layout by Week",
        barArray: JSON.stringify(calendarData),
      });
});

console.log("Server has started on port 8080");
app.listen(8080)