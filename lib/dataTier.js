
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

async function clearClassDataBySubjectInTerm(dirtySubject, term) {
  await client.query("DELETE FROM meetingTime WHERE classID IN (SELECT classID FROM class WHERE term = $1 AND Subject = $2);", [term, dirtySubject], (err, res) => {
    if (err) throw err;
  });
  await client.query("DELETE FROM class WHERE term = $1 AND Subject = $2;", [term, dirtySubject], (err, res) => {
    if (err) throw err;
  });
}

async function clearClassDataBySubjectAndTerm(dirtySubject, newTerm) {
  await client.query("DELETE FROM meetingTime WHERE classID IN (SELECT classID FROM class WHERE (term < $1 OR term IS NULL) AND Subject = $2);", [newTerm, dirtySubject], (err, res) => {
    if (err) throw err;
  });
  await client.query("DELETE FROM class WHERE (term < $1 OR term IS NULL) AND Subject = $2;", [newTerm, dirtySubject], (err, res) => {
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
  console.log("Inserting " + classTitle.Title)
  client.query("INSERT INTO class(title, subject, level, hours, crn, campus, term) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING classID;",
    [classTitle.Title, classTitle.Subject, classTitle.Level, classTitle.Hours, classTitle.CRN, classTitle.Campus, classTitle.Term], (err, res) => {
    if (err) {
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

async function getSubjectWithPreviousTerm(term) {
  let result = await client.query("SELECT Subject FROM class WHERE term < $1 OR term IS NULL LIMIT 1;", [term]);
  if(result.rows.length > 0) {
    return result.rows[0]['subject'];
  }
  else {
    return null;
  }
}


async function findUnusedSubjects(term) {
  let result = await client.query("SELECT Subject FROM class GROUP BY Subject;");
  var subjects = [
    "ACC","ART","ANTH","ASTR","ATTR","BIOL","BUS","ENCH","CHEM","ENCE","CLAS","COOP","COMM","ENCM",
    "CPEN","CPSC","COUN","CRMJ","ECHD","ECON","EDAS","EDUC","EDS","EDSP","EPSY","ENEE","ENGR","ENGM","ETME","ENGL",
    "ESL","ETCM","ETEM","ETR","ESC","EXCH","FIN","FREN","GNSC","GEOG","GEOL","GRK","HHP","HIST",
    "HUM","INTS","IARC","LAT","LEAD","MGT","MKT","MATH","ENME","MILS","MLNG","MOSA","MUS","MUSP","NURS","NUTR",
    "OCTH","PHIL","PHYT","PHYS","PSPS","PMBA","PSY","PUBH","REL","STEM","SOCW","SOC","SPAN","THSP","UHON","USTU","WGSS"
  ];

  function subjectNotInDatabase(subject) {
    for(i in result.rows) {
      if(result.rows[i]['subject'] == subject)
        return false
    }
    return true
  }
  var unusedSubjects = subjects.filter(subjectNotInDatabase)
  return unusedSubjects;
}

module.exports = {
  saveCalendar,
  loadCalendar,
  searchCalendarsByName,
  clearClassData,
  clearClassDataBySubjectInTerm,
  clearClassDataBySubjectAndTerm,
  insertClassRow,
  getClassData,
  getSubjectWithPreviousTerm,
  findUnusedSubjects
}