function buildCalendar(data, options) {
    const days = 5;
    const hours = 13;
    var calendarData = new Array(days*hours);
    for (var i = 0; i < days*hours; i++) {
      calendarData[i] = new Array(3);
      calendarData[i][0] = i%5;
      calendarData[i][1] = Math.floor(i/5);
      calendarData[i][2] = 0;
    }

    for (var i = 0; i < data.length; i++) {
        // Don't include data that don't match our filter
        if(options.subject != "" && data[i].Subject != options.subject) {
            continue;
        }
        // Read all entries
        if(data[i].Meeting[1] != " - ") {
            // Times
            var time = data[i].Meeting[1]
            var times = time.split(/ - /);
            var timeEnds = []
            for(var k = 0; k < 2; k++) {
                var index = Number(times[k].substring(0, 2)) - 8;
                if (times[k].substring(7, 9) === "PM" && index < 4) index += 12;
                if (Number(times[k].substring(3, 5)) >= 30) index ++;
                timeEnds[k] = index;
            }
            // Return array of all numbers between beginning and end
            var timeIndices = Array.from(new Array(timeEnds[1] - timeEnds[0]), (x,i) => i + timeEnds[0]);

            // Days
            var timeDays = []
            for (var day = 0; day < data[i].Meeting[0].length; day++) {
                switch(data[i].Meeting[0][day]) {
                    case 'M':
                        timeDays.push(0)
                        break;
                    case 'T':
                        if(!timeDays.includes(1))
                            timeDays.push(1)
                        else if(!timeDays.includes(3))
                            timeDays.push(3)
                        break;
                    case 'W':
                        timeDays.push(2)
                        break;
                    case 'F':
                        if(!timeDays.includes(4))
                            timeDays.push(4)
                        break;
                    default:
                }                
            }

            for (var k = 0; k < timeIndices.length; k++) {
                for(var j = 0; j< timeDays.length; j++ ) {
                    calendarData[timeIndices[k]*days + timeDays[j]][2]++;
                }
            }
        }
    }
    return calendarData
}

module.exports = buildCalendar;