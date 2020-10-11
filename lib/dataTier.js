
const { Client } = require('pg');
const databaseURL  = require('./config')

const client = new Client({
  connectionString: databaseURL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

function saveCalendar(calendarData, calendarName) {
    client.query('INSERT INTO calendar(name) VALUES ($1) RETURNING calendarID;', [calendarName], (err, res) => {
      if (err) throw err;
      console.log("CalendarID: ", res.rows[0]['calendarid'])
      var calendarID = res.rows[0]['calendarid'];
      if (calendarID > 0) {
        for (var className in calendarData) {
          client.query('INSERT INTO calendarRow(calendarid, classname, timeslots) VALUES ($1, $2, $3);', [calendarID, className, calendarData[className]]);
        }
      }
    });
}

function loadCalendar(calendarID, callback) {
  client.query('SELECT * FROM CalendarRow WHERE calendarID=$1;', [calendarID], (err, res) => {
    if (err) throw err;
    var calendarData = {}
    for (let row of res.rows) {
      console.log(JSON.stringify(row))
      calendarData[row.classname] = row.timeslots
    }
    console.log(JSON.stringify(calendarData));
    callback(calendarData)
  });
}

module.exports = {
  saveCalendar,
  loadCalendar
}