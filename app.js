var express = require("express");
const puppeteer = require("puppeteer");
var app = express();
var port = 8080;
const fs = require("fs");

async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
var arr = [40243, 42877, 41189, 41190, 40244];
for (let i = 0; i < 20; i++) {
  // const element = array[i];

  (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(
      "https://sis-reg.utc.edu/StudentRegistrationSsb/ssb/classSearch/classSearch",
      { waitUntil: "networkidle0" }
    );
    // await page.screenshot({ path: `first-${i}.png`, fullPage: true });

    page.click("#classSearchLink");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    // await page.screenshot({ path: `second-${i}.png`, fullPage: true });

    page.evaluate(() => {
      return document
        .getElementById("txt_term")
        .setAttribute("listofsearchterms", "202040");
    });
    page.click("#term-go");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    page.focus("#txt_keywordlike");
    page.keyboard.type(`  ${arr[i]}`);
    page.waitForNavigation({ waitUntil: "networkidle0" });
    await timeout(5000);
    page.keyboard.down("Enter");
    await timeout(5000);
    // await page.screenshot({ path: `third-${i}.png`, fullPage: true });
    let bodyHTML = await page.evaluate(() => {
      var d = document.getElementsByClassName(
        "ui-pillbox-summary screen-reader"
      );
      return d;
    });

    fs.appendFile("helloworld.json", JSON.stringify(bodyHTML), function(err) {
      if (err) return console.log(err);
      console.log("Hello World > helloworld.txt");
    });
  })();
}
app.use("/", (req, res) => {
  res.send("Worked...");
});

app.listen(port, () =>
  console.log(`App listening on port ${"\n"}http://localhost:${port}`)
);
