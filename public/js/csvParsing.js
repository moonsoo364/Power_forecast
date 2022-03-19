const parse  = require("csv-parse/lib");
const fs = require("fs");

fs.readFile('data.csv', 'utf8', function (err, data) {
    var dataArray = data.split(/\r?\n/);
    console.log(dataArray);
  });