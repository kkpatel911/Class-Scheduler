
const { Client } = require('pg');
//const databaseURL  = require('./config')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  //connectionString: databaseURL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

function saveCalendar(calendarData, calendarName, callback) {
    client.query('INSERT INTO calendar(name) VALUES ($1) RETURNING calendarID;', [calendarName], (err, res) => {
      if (err) throw err;
      console.log("CalendarID: ", res.rows[0]['calendarid'])
      var calendarID = res.rows[0]['calendarid'];
      if (calendarID > 0) {
        for (var className in calendarData) {
          client.query('INSERT INTO calendarRow(calendarid, classname, timeslots) VALUES ($1, $2, $3);', [calendarID, className, calendarData[className]]);
        }
      }
      callback(calendarID);
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

function searchCalendarsByName(name, callback) {
  client.query("SELECT * FROM Calendar WHERE LOWER(name) LIKE LOWER('%' || $1 || '%');", [name], (err, res) => {
    if (err) throw err;
    console.log(JSON.stringify(res.rows));
    callback(res.rows)
  });
}

module.exports = {
  saveCalendar,
  loadCalendar,
  searchCalendarsByName
}