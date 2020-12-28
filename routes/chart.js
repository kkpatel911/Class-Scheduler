var express = require('express');
var router = express.Router();

const buildCalendar = require("../lib/buildCalendar");
const readClassInfo = require("../lib/readClass");
const dataTier = require("../lib/dataTier");

// GET calendar
router.get('/:id', function(req, res, next) {
  // If an extension is noted, call it by id
  console.log(req.params.id)
    dataTier.loadCalendar(req.params.id, function(calendarData) {
      res.render('chart',
        { name: "Class Layout by Week",
          barArray: JSON.stringify(calendarData),
          chartX: 5,
          chartY: 27,
          isAlreadySaved: true
        });
    })
});

// POST search params
router.post('/', function(req, res, next) {
  // TODO: Translate data from configSearch front-end
  var mockInput = req.body.classes
  // Go through req to find REAL input, find out WHICH files need to be opened
  classProcessingArray = mockInput.map(name => readClassInfo(name.replace(/[0-9]/g, ''), 2020, "Fall"))
  Promise.all(classProcessingArray)
    .then((values) => {
      // Flatten class datas so we have a single array of class info
      let pertinentClassData = [].concat.apply([], values)
      
      // Numbers 1-27 represent 8:00am-9:30pm on Monday by half-hour. 28-54 represent 8:00am-9:30pm on Tuesday.
      var createdCalendar = buildCalendar(mockInput, pertinentClassData); // Created calendar format: { CPSC1100: [0, 1, 2, 8, 9, 12, 13, 41, 42], CPSC1110: [22, 76], ... }
      
      res.render('chart',
        { name: "Class Layout by Week",
          barArray: JSON.stringify(createdCalendar),
          chartX: 5,
          chartY: 27,
          isAlreadySaved: false
        });
    });
});

module.exports = router;
