const puppeteer = require("puppeteer");

async function processPage(page, calendarData, days, hours) {
    // Class "meeting" holds all the info in the first "span" tag
    cal = await page.evaluate(({calendarData, days, hours}) => {
        var x = document.getElementsByClassName("meeting");
        for (var i = 0; i < x.length; i++) {
            // Days
            var y = x[i].children[0].getElementsByTagName("li");
            for (var j = 0; j < y.length; j++) {
                if(y[j].getAttribute("aria-checked") == "true") {
                    // Time
                    if(x[i].children[1].innerText != " - ") {
                        var time = x[i].children[1].innerText
                        var times = time.split(/ - /);
                        var timeEnds = []
                        for(var k = 0; k < 2; k++) {
                            var index = Number(times[k].substring(0, 2)) - 8;
                            if (times[k].substring(6, 8) === "PM" && index < 0) index += 12;
                            if (Number(times[k].substring(3, 5)) >= 30) index ++;
                            timeEnds[k] = index;
                        }
                        // Return array of all numbers between beginning and end
                        var timeIndices = Array.from(new Array(timeEnds[1] - timeEnds[0]), (x,i) => i + timeEnds[0]);

                        for (var k = 0; k < timeIndices.length; k++) {
                            calendarData[timeIndices[k]*days + (j-1)][2]++;
                        }
                    }
                }
            }
        }

        return calendarData
    }, {calendarData, days, hours});
    return cal
}

module.exports = processPage;