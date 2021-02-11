var express = require('express');
var router = express.Router();

const dataTier = require("../lib/dataTier");

/* GET home page. */
router.get('/', function(req, res, next) {
  dataTier.getClassNames(function(classesArray) {
    res.render('configSearch', { classes: classesArray });
  })
});

module.exports = router;
