var express = require("express");
const puppeteer = require("puppeteer");
var app = express();
var port = 8080;
const fs = require("fs");
const $ = require("jquery");
const { json } = require("express");

// TODO: Also put class start and end dates in data

async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createData(major, term) {
  const browser = await puppeteer.launch({headless: false});

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(
    "https://sis-reg.utc.edu/StudentRegistrationSsb/ssb/classSearch/classSearch",
    { waitUntil: "networkidle0" }
  );
  // await page.screenshot({ path: `first-${i}.png`, fullPage: true });

  page.click("#classSearchLink");
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  page.evaluate((term) => {
    return document
      .getElementById("txt_term")
      .setAttribute("listofsearchterms", term);
  }, term);
  page.click("#term-go");
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await page.evaluate((major) => {
    // let elements = document.getElementById("txt_term")
    console.log(major)
    return document.getElementById("txt_subject").setAttribute("value", major); // CPSC,SUBJ,ANTH,etc to get multiple subjects
  }, major);
  page.focus("#txt_keywordlike");
  page.keyboard.type(``);
  await timeout(500);
  page.keyboard.down("Enter");
  await timeout(5000);

  // Shows 50 classes at a time
  await page.select(".page-size-select", "50");
  await timeout(6000);

  // Clear file
  fs.writeFile("data/" + term + "." + major + '.json', '[]', function (err) {
    if (err) throw err;
    console.log('New file created!');
  }); 

  // await page.screenshot({ path: `third.jpg`, fullPage: true });
  var res = true
  while(res) {
    var datas = await page.evaluate(() => {
      var classes = $('#table1 tbody tr')
      var titleLinkArray = [];
      var m = 0;
      for (var classNum = 0; classNum < classes.length; classNum++) {
        var meetingTimes = [];

        $(classes.eq(classNum).children().eq(8)).find(".meeting").each(function() {
          var meetInfo = {}
          meetInfo['days'] =
            $(this)
              .find("li")
              .filter(function(index) {
                return this.getAttribute("aria-checked") == "true";
              })
              .text()
          
          meetInfo['hours'] =
            $(this)
              .children("span").eq(0)
              .text()
          meetingTimes.push(meetInfo)
        });

        console.log(classNum, " of ", classes.length)
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
        console.log(m.toString() + ":  " + JSON.stringify(titleLinkArray[m]))
        m++;
      }
      return titleLinkArray;
    });
    
    fs.readFile("data/" + term + "." + major + ".json", "utf8", function(err, data) {
      if (err) {
        console.log(err);
      }
      var json = JSON.parse(data);
      for (let x = 0; x < datas.length; x++) {
        json.push(datas[x]);
      }

      fs.writeFile("data/" + term + "." + major + ".json", JSON.stringify(json, null, "\t"), err => {
        if (err) reject(err);
      });
    });

    // Button with title "next" continues. If hasAttribute "disabled" then stop
    res = await page.evaluate(() => {
      if($('button[title="Next"]').attr("disabled") != undefined) {
        return false
      }
      return true;
    });
    await page.click('button[title="Next"]');

    await timeout(5000);
  }
  await page.close();
  await browser.close();
  console.log("Browser Closed");
};

(async () => {
  var classes = "\
ACC,ART,ANTH,ASTR,ATTR,BIOL,BUS,ENCH,CHEM,ENCE,CLAS,COOP,COMM,ENCM,\
CPEN,CPSC,COUN,CRMJ,ECHD,ECON,EDAS,EDUC,EDS,EDSP,EPSY,ENEE,ENGR,ENGM,ETME,ENGL,\
ESL,ETCM,ETEM,ETR,ESC,EXCH,FIN,FREN,GNSC,GEOG,GEOL,GRK,HHP,HIST,\
HUM,INTS,IARC,LAT,LEAD,MGT,MKT,MATH,ENME,MILS,MLNG,MOSA,MUS,MUSP,NURS,NUTR,\
OCTH,PHIL,PHYT,PHYS,PSPS,PMBA,PSY,PUBH,REL,STEM,SOCW,SOC,SPAN,THSP,UHON,USTU,WGSS"
  
  var classList = classes.split(',')
  for(var i = 0; i < classList.length; i++) {
    await createData(classList[i], "202040");
  }
})();

app.use("/", (req, res) => {
  res.send("Worked...");
});
app.listen(port, () =>
  console.log(`App listening on port ${"\n"}http://localhost:${port}`)
);
