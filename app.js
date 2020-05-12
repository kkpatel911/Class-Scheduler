var express = require("express");
const puppeteer = require("puppeteer");
var app = express();


async function run() {
  //const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log("The Process has started....");
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto(
    "https://sis-reg.utc.edu/StudentRegistrationSsb/ssb/classSearch/classSearch", {
    waitUntil: 'networkidle2'
  }
  );

  await page.screenshot({ path: './public/images/1.jpg', type: 'jpeg', fullPage: true });

  //   await Promise.all([
  //     page.waitForNavigation(),
  //     console.log("All shit has been done now")
  // ]);

  await Promise.all([
    // page.waitForNavigation(waitOptions),
    page.click("#classSearchLink"),
  ]);

  await page.screenshot({ path: './public/images/2.jpg', type: 'jpeg', fullPage: true });

  await page.evaluate(() => {
    // let elements = document.getElementById("txt_term")
    return document.getElementById("txt_term").setAttribute("listofsearchterms", "201920"); // yyyy20,30,40 depending on Spring, Summer of Fall
  });

  await Promise.all([
    // page.waitForNavigation(waitOptions),
    page.click("#term-go"),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  await page.screenshot({ path: './public/images/3.jpg', type: 'jpeg', fullPage: true });

  await page.evaluate(() => {
    // let elements = document.getElementById("txt_term")
    return document.getElementById("txt_subject").setAttribute("value", "CPSC"); // CPSC,SUBJ,ANTH,etc to get multiple subjects
  });

  await Promise.all([
    // page.waitForNavigation(waitOptions),
    page.click("#search-go"),
    //page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.waitForSelector(".meeting")
  ]);

  while(true) {
    await page.evaluate(() => {
      // Class "meeting" holds all the info in the first "span" tag
      var x = document.getElementsByClassName("meeting");
      for (var i = 0; i < x.length; i++) {
        console.log(x[i].children[1].innerText);
      }
      return;
    });


    // Button with title "next" continues. If hasAttribute "disabled" then stop
    var res = await page.evaluate(() => {
      // Class "meeting" holds all the info in the first "span" tag
      var x = document.getElementsByClassName("next");
      if(x[0].hasAttribute("disabled")) {
        return false
      }
      return true;
    });
    if(res == false) {
      break;
    }

    await Promise.all([
      // page.waitForNavigation(waitOptions),
      page.click(".next"),
      //page.waitForNavigation({ waitUntil: 'networkidle2' }),
      await page.waitFor(1000)
    ]);
  }

  await Promise.all([
    page.screenshot({ path: './public/images/4.jpg', type: 'jpeg', fullPage: true }),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  console.log("Server has started on port 8080");

  await page.close();
  await browser.close();
}

app.use("/home", (req, res) => {
  res.send("Worked")
  run();
})


app.listen(8080)