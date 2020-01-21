var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const puppeteer = require("puppeteer");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// // view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "jade");

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });
var test = document.getElementById('txt_keywordlike').value


  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // var heights = await page.evaluate(() => {
    //   return window.innerHeight;
    // });

    // var widths = await page.evaluate(() => {
    //   return window.innerWidth;
    // });

    console.log("The Process has started....");

    // await page.setViewport({
    //   width: 1500,
    //   height: heights,
    //   deviceScaleFactor: 1
    // });

    await page.goto(
      "https://sis-reg.utc.edu/StudentRegistrationSsb/ssb/classSearch/classSearch"
    );
    const s = await page.evaluate(
      () => document.getElementById("txt_keywordlike").value = "20054"
    );

    // fs.writeFileSync("tes1.txt", name);
    app.get("/home", (req, res) => {
      res.write("Name: ");
      res.end();
      // console.log(document.getElementById('txt_keywordlike').value)
    }).listen(8080);

    console.log("Server has started on port 8080");

    await browser.close();
  })();