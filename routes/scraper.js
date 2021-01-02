var express = require('express');
var router = express.Router();
const dataTier = require("../lib/dataTier");
const scraper = require("../lib/scrapper");

async function scrapeData() {
  var classes = "\
    ACC,ART,ANTH,ASTR,ATTR,BIOL,BUS,ENCH,CHEM,ENCE,CLAS,COOP,COMM,ENCM,\
    CPEN,CPSC,COUN,CRMJ,ECHD,ECON,EDAS,EDUC,EDS,EDSP,EPSY,ENEE,ENGR,ENGM,ETME,ENGL,\
    ESL,ETCM,ETEM,ETR,ESC,EXCH,FIN,FREN,GNSC,GEOG,GEOL,GRK,HHP,HIST,\
    HUM,INTS,IARC,LAT,LEAD,MGT,MKT,MATH,ENME,MILS,MLNG,MOSA,MUS,MUSP,NURS,NUTR,\
    OCTH,PHIL,PHYT,PHYS,PSPS,PMBA,PSY,PUBH,REL,STEM,SOCW,SOC,SPAN,THSP,UHON,USTU,WGSS";
  
  var classList = classes.split(',');
  for(var i = 0; i < classList.length; i++) {
    await scraper.createData(classList[i], "202040"); // TODO: Sense which semester we're in
  }
}

// POST calendar to database
router.get('/', function(req,res) {
  res.send("Working on it");

  // Clear class tables
  dataTier.clearClassData()
  scrapeData()
});

module.exports = router;
