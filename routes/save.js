var express = require('express');
var router = express.Router();
const dataTier = require("../lib/dataTier");

// POST calendar to database
router.post('/', function(req,res) {
  // TODO: Get data from request
  var calendarInput = JSON.parse(req.body.calendarData);
  var calendarName = req.body.calendarName;

  // Save data in database
  dataTier.saveCalendar(calendarInput, calendarName);

  res.render('configSearch');
  res.render('chart',
    { name: calendarName,
      barArray: JSON.stringify(calendarInput),
      chartX: 5,
      chartY: 27
    });
});

module.exports = router;
