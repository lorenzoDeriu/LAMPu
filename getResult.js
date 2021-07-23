"use strict";

const fs = require('fs');

module.exports = {
	getObjectFrom: function(fileJSON) {
		var obj = new Object();
		fs.open(fileJSON, "r", (err, fd) => {
			if(err) {
				console.log("ERROR: getObjectFrom() > fs.open()")
				throw err;
			}
			obj = JSON.parse(fs.readFileSync(fileJSON).toString())
			fs.close(fd);
		})
	  
	  try {
		  fs.unlinkSync(fileJSON);
		} catch(error) {
			console.log("ERROR: getObjectFrom() > fs.unlinkSync()")
		  console.log(error);
		}
		console.log("test")
		return obj;
	}
}

//var result = getObjectFrom(fileName);
/*
try {
  fs.unlinkSync(fileName);
} catch(error) {
  console.log(error);
}*/
//console.log(result["items"][0]["volumeInfo"]["description"])