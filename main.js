"use strict";

var SearchInfo = require("./SearchInfo.js")
var GetResult = require("./getResult.js")

var query = 'https://www.googleapis.com/books/v1/volumes?q=isbn:1910701874';
var tempFile = "result.json";

SearchInfo.getInfo(query, tempFile);

var result = GetResult.getObjectFrom(tempFile);

//console.log(result)