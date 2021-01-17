
function getTerm() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var term = "202020"
    if (month <= 3 || (month == 4 && day <= 5))
        term = year.toString() + "20"
    else if (month <= 6 || (month == 7 && day <= 5))
        term = year.toString() + "30"
    else
        term = year.toString() + "40"
    
    return term
}

module.exports = {
    getTerm
  }