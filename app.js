// Load packages
var express = require("express");
const bodyParser = require('body-parser');
var app = express();
const fs = require("fs");
const buildCalendar = require("./lib/buildCalendar");
const readClassInfo = require("./lib/readClass");
const dataTier = require("./lib/dataTier");

// Set up express
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }));

// Website Root
app.get('/', function(req,res) {
    res.render('configSearch');
});

// Show/Load calendar
app.get('/chart', function(req,res) {
  // TODO: Translate data from configSearch front-end
  /*console.log(req.body.major1)
  console.log(req.body.classNumber1)
  console.log(req.body.geneds)*/
  // TODO: If an extension is noted, call it by id

  // Make front-end somehow allow users to submit all classes as a single array:
  var mockInput = ["CPSC1100", "CPSC1110", "CPSC2100", "MATH1950", "MATH1960"]

    // Go through req to find REAL input, find out WHICH files need to be opened
    classProcessingArray = mockInput.map(name => readClassInfo(name.replace(/[0-9]/g, ''), 2020, "Fall"))
    Promise.all(classProcessingArray)
      .then((values) => {
        // Flatten class datas so we have a single array of class info
        let pertinentClassData = [].concat.apply([], values)
        
        // Numbers 1-27 represent 8:00am-9:30pm on Monday by half-hour. 28-54 represent 8:00am-9:30pm on Tuesday.
        var createdCalendar = buildCalendar(mockInput, pertinentClassData); // Created calendar format: { CPSC1100: [0, 1, 2, 8, 9, 12, 13, 41, 42], CPSC1110: [22, 76], ... }
        console.log(createdCalendar)
        
        res.render('chart',
          { name: "Class Layout by Week",
            barArray: JSON.stringify(createdCalendar),
            chartX: 5,
            chartY: 27
          });
      });
});

// Save calendar
app.post('/saveChart', function(req,res) {
  // TODO: Get data from request
  var mockInput = {
    CPSC1100: [
       62, 63, 64,  65,  66,  67, 68,   2,   3,  56, 57, 110,
      111, 44, 45,  46,  47,  67, 68,  69,  70,  41, 42,  43,
       95, 96, 97,   4,   5,  58, 59, 112, 113,  13, 14,  15,
       16, 22, 23,  24,  25,  26, 76,  77,  78,  79, 80,   6,
        7, 60, 61, 114, 115,  44, 45,  46,  47,  62, 63,  64,
       65, 66, 67,  68,   2,   3, 56,  57, 110, 111, 44,  45,
       46, 47, 67,  68,  69,  70, 41,  42,  43,  95, 96,  97,
        4,  5, 58,  59, 112, 113, 13,  14,  15,  16, 22,  23,
       24, 25, 26,  76
    ],
    CPSC1110: [
       6,  7, 60, 61, 114, 115, 42, 43, 44, 45,  31,  32,
      33, 34, 15, 16,  17,  69, 70, 71, 31, 32,  33,  34,
       6,  7, 60, 61, 114, 115,  6,  7, 60, 61, 114, 115,
      42, 43, 44, 45,  31,  32, 33, 34, 15, 16,  17,  69,
      70, 71, 31, 32,  33,  34,  6,  7, 60, 61, 114, 115,
       6,  7, 60, 61, 114, 115, 42, 43, 44, 45,  31,  32,
      33, 34, 15, 16,  17,  69, 70, 71, 31, 32,  33,  34,
       6,  7, 60, 61, 114, 115
    ],
    MATH1950: [
      0, 1, 2, 54, 55, 56, 108, 109, 110,
      6, 7, 8, 60, 61, 62, 114, 115, 116,
      0, 1, 2, 54, 55, 56, 108, 109, 110,
      6, 7, 8, 60, 61, 62, 114, 115, 116
    ]
  }
  var mockName = "NewCalendar"

  // Save data in database
  dataTier.saveCalendar(mockInput, mockName)

  res.render('configSearch');
});

// TODO: Create a search page to find calendars by their name


console.log("Server has started on port 8080");
app.listen(8080)