var express = require('express');
var router = express.Router();
const dataTier = require("../lib/dataTier");

// POST calendar to database
router.post('/', function(req,res) {
  // Get data from request
  var calendarInput = JSON.parse(req.body.calendarData);
  var calendarName = req.body.calendarName;

  // Save data in database
  dataTier.saveCalendar(calendarInput, calendarName, function(calendarID) {
    if (calendarID > 0)
      res.redirect('/chart/' + calendarID);
    else
      res.redirect('/');
  });
  
});

module.exports = router;
