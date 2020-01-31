var express = require("express");
const puppeteer = require("puppeteer");
var app = express();


async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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
    return document.getElementById("txt_term").setAttribute("listofsearchterms", "201920");
  });

  await Promise.all([
    // page.waitForNavigation(waitOptions),
    page.click("#term-go"),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);

  await Promise.all([
    page.screenshot({ path: './public/images/3.jpg', type: 'jpeg', fullPage: true }),
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