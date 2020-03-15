var express = require("express");
const puppeteer = require("puppeteer");
var app = express();
var port = 8080;


// async function run() {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   console.log("The Process has started....");
//   await page.setViewport({ width: 1920, height: 1080 });

//   await page.goto(
//     "https://sis-reg.utc.edu/StudentRegistrationSsb/ssb/classSearch/classSearch", {
//     waitUntil: 'networkidle2'
//   }
//   );

//   await page.screenshot({ path: './public/images/1.jpg', type: 'jpeg', fullPage: true });

//   //   await Promise.all([
//   //     page.waitForNavigation(),
//   //     console.log("All shit has been done now")
//   // ]);

//   await Promise.all([
//     // page.waitForNavigation(waitOptions),
//     page.click("#classSearchLink"),
//   ]);

//   await page.screenshot({ path: './public/images/2.jpg', type: 'jpeg', fullPage: true });

//   await page.evaluate(() => {
//     // let elements = document.getElementById("txt_term")
//     return document.getElementById("txt_term").setAttribute("listofsearchterms", "201920");
//   });

//   await Promise.all([
//     // page.waitForNavigation(waitOptions),
//     page.click("#term-go"),
//     page.waitForNavigation({ waitUntil: 'networkidle2' }),
//   ]);

//   await Promise.all([
//     page.screenshot({ path: './public/images/3.jpg', type: 'jpeg', fullPage: true }),
//     page.waitForNavigation({ waitUntil: 'networkidle2' }),
//   ]);

//   await page.evaluate(() => {
//     // let elements = document.getElementById("txt_term")
//     return document.getElementById("txt_term").setAttribute("listofsearchterms", "201920");
//   });


//   console.log("Server has started on port 8080");

//   await page.close();
//   await browser.close();
// }
async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://sis-reg.utc.edu/StudentRegistrationSsb/ssb/classSearch/classSearch', { "waitUntil": "networkidle0" });
  await page.screenshot({ path: 'newsearch.png', fullPage: true });

  // page.focus(".gLFyf");
  // page.keyboard.type("Kishan PAtel");
  page.click("#classSearchLink");
  await page.waitForNavigation({ "waitUntil": "networkidle0" });
  await page.screenshot({ path: 'newsearch1.png', fullPage: true });



  page.evaluate(() => {
    return document.getElementById("txt_term").setAttribute("listofsearchterms", "202040");
  });
  page.click("#term-go");
  await page.waitForNavigation({ "waitUntil": "networkidle0" });
  page.focus("#txt_keywordlike");
  page.keyboard.type("  40243");
  page.waitForNavigation({ "waitUntil": "networkidle0" });
  await timeout(5000);
  page.keyboard.down('Enter');
  await timeout(5000);
  await page.screenshot({ path: 'newsearch3.png', fullPage: true });

  // page.click('input[type="submit"]');
  // page.keyboard.down('Enter');
  // await page.waitForNavigation({ waitUntil: "load" });
  // await page.screenshot({ path: 'newsearch2.png', fullPage: true });

  // Enter the CRN Number
  // txt_keywordlike
  // 40243
  // await page.focus("#txt_keywordlike");
  // await page.keyboard.type("40243");
  // await page.keyboard.down('Enter');
  // await page.waitForNavigation({ "waitUntil": "load" });
  // await page.screenshot({ path: 'newsearch4.png', fullPage: true });

  // page.close();
  // browser.close();
})();



// app. get is called when the HTTP method is set to GET , whereas app. use is called regardless of the HTTP method
// For MoreINFO(https://stackoverflow.com/questions/15601703/difference-between-app-use-and-app-get-in-express-js#:~:text=)
app.use("/", (req, res) => {
  res.send("Worked...")
})


app.listen(port, () => console.log(`App listening on port ${"\n"}http://localhost:${port}`))