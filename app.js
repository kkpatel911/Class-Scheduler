var express = require("express");
const puppeteer = require("puppeteer");
var app = express();
//const exportGraph = require("./lib/chart");
const processPage = require("./lib/process");

async function run() {
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log(msg.text()));
  
  console.log("The Process has started....");
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(
    "https://sis-reg.utc.edu/StudentRegistrationSsb/ssb/classSearch/classSearch", {
    waitUntil: 'networkidle2'
  }
  );

  //await page.screenshot({ path: './public/images/1.jpg', type: 'jpeg', fullPage: true });

  await Promise.all([
    // page.waitForNavigation(waitOptions),
    page.click("#classSearchLink"),
  ]);

  //await page.screenshot({ path: './public/images/2.jpg', type: 'jpeg', fullPage: true });

  await page.evaluate(() => {
    // let elements = document.getElementById("txt_term")
    return document.getElementById("txt_term").setAttribute("listofsearchterms", "201920"); // yyyy20,30,40 depending on Spring, Summer of Fall
  });

  await Promise.all([
    // page.waitForNavigation(waitOptions),
    page.click("#term-go"),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  //await page.screenshot({ path: './public/images/3.jpg', type: 'jpeg', fullPage: true });

  await page.evaluate(() => {
    return document.getElementById("txt_subject").setAttribute("value", "CPSC"); // CPSC,SUBJ,ANTH,etc to get multiple subjects
  });

  await Promise.all([
    page.click("#search-go"),
    page.waitForSelector(".meeting")
  ]);

  const days = 5;
  const hours = 12;
  var calendarData = new Array(days*hours);
  for (var i = 0; i < days*hours; i++) {
    calendarData[i] = new Array(3);
    calendarData[i][0] = i%5;
    calendarData[i][1] = Math.floor(i/5);
    calendarData[i][2] = 0;
  }

  var res = true
  while(res) {
    calendarData = await processPage(page, calendarData, days, hours);

    // Button with title "next" continues. If hasAttribute "disabled" then stop
    res = await page.evaluate(() => {
      // Class "meeting" holds all the info in the first "span" tag
      var x = document.getElementsByClassName("next");
      if(x[0].hasAttribute("disabled")) {
        return false
      }
      return true;
    });

    await Promise.all([
      page.click(".next"),
      page.waitFor(1000)
    ]);
  }

  await page.close();
  await browser.close();

  return calendarData
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.static(__dirname + '/public'))

app.get('/chart', function(req,res) {
  run().then(chartData => {
    console.log(chartData)
    res.render('chart',
      { name: "Class Layout by Week",
        barArray: chartData,
      });
  });
});

console.log("Server has started on port 8080");
app.listen(8080)