var express = require("express");
const puppeteer = require("puppeteer");
var app = express();
var port = 8080;
const fs = require("fs");
const $ = require("jquery");

async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
  page.keyboard.type(``);
  page.waitForNavigation({ waitUntil: "networkidle0" });
  await timeout(5000);
  page.keyboard.down("Enter");
  await timeout(5000);
  //   await page.screenshot({ path: `third.jpg`, fullPage: true });

  for (let c = 0; c < 5; c++) {
    var datas = await page.evaluate(() => {
      var content = document.getElementsByClassName("readonly");
      var titleLinkArray = [];
      var m = 0;
      var titleNum = 0;
      for (var i = 1; i < content.length; i = i + 12) {
        var title = document.getElementsByClassName("section-details-link");
        titleLinkArray[m] = {
          Title: title[titleNum].innerText,
          Subject: content[i - 1].innerText,
          Hours: content[i + 2].innerText,
          CRN: content[i + 3].innerText,
          Meeting_Times: $(content[i + 5]).text(),
          Campus: content[i + 6].innerText
        };
        titleNum++;
        m++;
      }
      return titleLinkArray;
    });
    // console.log(data);

    // await browser.close();

    // fs.readFile("data.json", function(err, data) {
    //   var json = JSON.stringify;
    // });
    fs.readFile("data.json", "utf8", function(err, data) {
      if (err) {
        console.log(err);
      }
      var json = JSON.parse(data);
      // console.log(json);
      for (let x = 0; x < datas.length; x++) {
        json.push(datas[x]);
      }
      // json.push({ name: "Kishan" });

      fs.writeFile("data.json", JSON.stringify(json), err => {
        if (err) reject(err);
      });
    });

    // fs.appendFile("data.json", JSON.stringify(data), function(err) {
    //   if (err) throw err;
    //   console.log("Saved!");
    // });

    await page.click('button[title="Next"]');

    await timeout(5000);
  }
  await page.close();
  await browser.close();
  // await page.screenshot({ path: `third.jpg`, fullPage: true });
  // console.log(success("Browser Closed"));
})();
app.use("/", (req, res) => {
  res.send("Worked...");
});

app.listen(port, () =>
  console.log(`App listening on port ${"\n"}http://localhost:${port}`)
);
