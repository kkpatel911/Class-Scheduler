var express = require("express");
const bodyParser = require('body-parser');
var app = express();
const fs = require("fs");
const buildCalendar = require("./lib/buildCalendar");
const readClassInfo = require("./lib/readClass");

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

    // TODO: Go through req to find REAL input, find out WHICH files need to be opened


    // Open data/202040.CPSC.json and data/202040.MATH.json and put both into a single dictionary
    // WARNING: Run readClassInfo asynchronously with all other required classes
    Promise.all([
      readClassInfo("CPSC", 2020, "Fall"),
      readClassInfo("MATH", 2020, "Fall")])
      .then((values) => {
        // Flatten class datas so we have a single array of class info
        let pertinentClassData = [].concat.apply([], values)
        
        // Numbers 1-27 represent 8:00am-9:30pm on Monday by half-hour. 25-54 represent 8:00am-9:30pm on Tuesday.
        var createdCalendar = buildCalendar(mockInput, pertinentClassData); // Created calendar format: { CPSC1100: [0, 1, 2, 8, 9, 12, 13, 41, 42], CPSC1110: [22, 76], ... }
    
        res.render('chart',
          { name: "Class Layout by Week",
            barArray: JSON.stringify(createdCalendar),
          });
      });
});

console.log("Server has started on port 8080");
app.listen(8080)