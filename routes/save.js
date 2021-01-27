var express = require('express');
var router = express.Router();
const dataTier = require("../lib/dataTier");
var CryptoJS = require("crypto-js");

// POST calendar to database
router.post('/', function(req,res) {
  // Get data from request
  var calendarInput = JSON.parse(req.body.calendarData);
  var calendarName = req.body.calendarName;

  // Save data in database
  dataTier.saveCalendar(calendarInput, calendarName, function(calendarID) {
    if (calendarID > 0) {
      var chartKey = CryptoJS.AES.encrypt(calendarID.toString(), process.env.CHART_ENCODER_KEY)
      res.redirect('/chart/' + encodeURIComponent(chartKey.toString()));
    }
    else
      res.redirect('/');
  });
  
});

module.exports = router;
