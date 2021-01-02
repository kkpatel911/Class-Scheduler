
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

async function getClassData(name, level) {
  let result = await client.query(
    "SELECT m.days, m.hours FROM class c JOIN meetingTime m ON c.classID = m.classID WHERE c.Subject = $1 AND Level = $2;",
    [name, level]);
  var meetingDicts = []
  for(let meeting of result.rows) {
    meetingDicts.push({"days": meeting['days'], "hours": meeting['hours']})
  }
  return { "Subject": name, "Level": level, "Meeting": meetingDicts}
}

function clearClassData() {
  client.query("DELETE FROM meetingTime;", (err, res) => {
    if (err) throw err;
  });
  client.query("DELETE FROM class;", (err, res) => {
    if (err) throw err;
  });
}

/*
titleLinkArray[m] = {
  Title: classes.eq(classNum).children().eq(0).find('a').text(),
  Subject: classes.eq(classNum).children().eq(1).text(),
  Level: classes.eq(classNum).children().eq(2).text(),
  Hours: classes.eq(classNum).children().eq(4).text(),
  CRN: classes.eq(classNum).children().eq(5).text(),
  Meeting: meetingTimes,
  // Meeting place & Meeting room is good information but not needed
  Campus: classes.eq(classNum).children().eq(9).text()
};
*/
function insertClassRow(classTitle) {
  client.query("INSERT INTO class(title, subject, level, hours, crn, campus) VALUES ($1, $2, $3, $4, $5, $6) RETURNING classID;",
    [classTitle.Title, classTitle.Subject, classTitle.Level, classTitle.Hours, classTitle.CRN, classTitle.Campus], (err, res) => {
    if (err) {
      console.log(JSON.stringify(classTitle));
      throw err;
    }
    // Add meeting time rows
    for (let meetingTime of classTitle.Meeting) {
      client.query("INSERT INTO meetingTime(days, hours, classID) VALUES ($1, $2, $3);",
        [meetingTime.days, meetingTime.hours, res.rows[0]['classid']], (err2, res2) => {
        if (err2) throw err2;
      });
    }
  });
}

module.exports = {
  saveCalendar,
  loadCalendar,
  searchCalendarsByName,
  clearClassData,
  insertClassRow,
  getClassData
}