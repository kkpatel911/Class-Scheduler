var express = require('express');
var router = express.Router();
const dataTier = require("../lib/dataTier");
const scraper = require("../lib/scrapper");

// POST calendar to database
router.get('/', function(req,res) {
  res.send("Working on it");

  // Clear class tables
  dataTier.clearClassData()
  scraper.scrapeData()
});

module.exports = router;
