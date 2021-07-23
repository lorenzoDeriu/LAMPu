"use strict";

const https = require('https');
const fs = require('fs');
var request = require('request');

//var result = new Object();
var query = 'https://www.googleapis.com/books/v1/volumes?q=isbn:1910701874';
var tempFile = "/result.json";

module.exports = { 
  getInfo: async function(query, tempFile) {
    await request(query, function(error, response, body) {
      console.log("call request")
      var fileDescriptor = fs.openSync(tempFile, "as+");
      fs.writeFileSync(tempFile, body.toString());
      fs.closeSync(fileDescriptor);
    })
    /*https.get(query, (res) => {
      res.on('data', (data) => {
        var fd = fs.openSync(tempFile, "as+");
        fs.writeFileSync(fd, data.toString());
        setTimeout(function () {
          console.log('closing file now')
          fs.closeSync(fd)
        }, 1)
        //old
        
        fs.openSync(tempFile, 'as+', (err, fd) => {
          if(err) throw error;
          fs.appendFileSync(tempFile, data.toString())
          fs.closeSync(fd, (err) => { if(err) throw err;});
        });
      });


    }).on('error', (e) => { console.error(e) });*/
  }
}