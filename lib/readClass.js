const fs = require("fs");

/**
 * Builds class data array from a data file created by scrapper.js.
 * Reads all data for a single class in a given term.
 * 
 * @param {string} className Name of the course type to read in catalog format (ex: CPSC)
 * @param {int} year Year of the course to read
 * @param {string} termName School term to read (ex: Spring)
 */
async function readClassInfo(className, year = 2020, termName = "Fall") {
  var term;
  if(termName == "Spring")
    term = 20
  else if(termName == "Summer")
    term = 30
  else if(termName == "Fall")
    term = 40

  let classData = fs.readFileSync("data/" + year.toString() + term.toString() + "." + className + ".json", "utf8");
  let classDict = JSON.parse(classData);
  console.log(classDict)
  return classDict;
}

module.exports = readClassInfo;