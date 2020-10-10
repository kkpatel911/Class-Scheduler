
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

function saveCalendar(calendarData, calendarName) {
    client.query('INSERT INTO calendar(name) VALUES ($1) RETURNING calendarID;', [mockName], (err, res) => {
      if (err) throw err;
      console.log("CalendarID: ", res.rows[0]['calendarid'])
      var calendarID = res.rows[0]['calendarid'];
      if (calendarID > 0) {
        for (var className in mockInput) {
          client.query('INSERT INTO calendarRow(calendarid, classname, timeslots) VALUES ($1, $2, $3);', [calendarID, className, mockInput[className]]);
        }
      }
    });
}

function loadCalendar(calendarID) {
  /*client.query('SELECT * FROM Calendar;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  });*/
  return {calendarName: "RandomName", calendarData: []};
}

module.exports = {
  saveCalendar,
  loadCalendar
}