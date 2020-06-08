var fs = require("fs");

fs.readFile("data.json", "utf8", function(err, data) {
  if (err) {
    console.log(err);
  }
  var json = JSON.parse(data);
  console.log(json);
  json.push({ searchresult: "example" });
  json.push({ name: "example" });

  fs.writeFile("data.json", JSON.stringify(json), err => {
    if (err) reject(err);
  });
});

// const fs = require("fs");
// const json = require("./data.json");

// function saveNewAddress(address) {
//   return new Promise((resolve, reject) => {
//     json.push({ address });
//     fs.writeFile("data.json", JSON.stringify(json), err => {
//       if (err) reject(err);
//       resolve("File saved.");
//     });
//   });
// }

// saveNewAddress("some_new_adress").then(result => {
//   console.log(result);
// });
