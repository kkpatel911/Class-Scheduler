const fs = require("fs");
const days = 5;
const time_slots = 24;

function buildCalendar(classList, classDataDict) {
    var calendarData = {}
    classList.forEach(className => {
        calendarData[className] = []
        var inClass = classDataDict.filter(function(value, index, array) {
          return value.subject + value.courseNum == className;
        });
        // Add time slots to class's array
        inClass.forEach(classData => {
            calendarData[className] = calendarData[className].concat(getTimeSlots(classData.meetingTimes))
        });
    });

    return calendarData
}

/**
 * Gets array of time slots given a meeting time
 * 
 * @param {array} meetingTimeArr two-index array of [DAYS, TIME RANGE] (ex: ["MWF", "1:00 PM - 3:00 PM"])
 * @returns {array} List of all time indices represented by the meeting time (ex: [1,2,3, 16,17,18, 33,34,35])
 */
function getTimeSlots(meetingTimeArr) {
    // Read all entries
    if(meetingTimeArr[1] != " - ") {
        // Times
        var times = meetingTimeArr[1].split(/ - /);
        var timeEnds = []
        for(var k = 0; k < 2; k++) {
            var index = (Number(times[k].substring(0, 2)) - 8)*2;
            if (times[k].substring(7, 9) === "PM" && index < 8) index += time_slots;
            if (Number(times[k].substring(3, 5)) >= 30) index ++;
            timeEnds[k] = index;
        }
        // Return array of all numbers between beginning and end
        var timeIndices = Array.from(new Array(timeEnds[1] - timeEnds[0]), (x,i) => i + timeEnds[0]);

        // Days
        var timeDays = []
        for (var day = 0; day < meetingTimeArr[0].length; day++) {
            switch(meetingTimeArr[0][day]) {
                case 'M':
                    timeDays.push(0)
                    break;
                // TODO: Improve to know FOR SURE which day is used in cases like Operating Systems
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

        var timeSlots = []
        for (var k = 0; k < timeIndices.length; k++) {
            for(var j = 0; j< timeDays.length; j++ ) {
                timeSlots.push(timeIndices[k]*days + timeDays[j])
            }
        }
    }
}

module.exports = buildCalendar;