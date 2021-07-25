"use strict";
const got = require("got");

var query = 'https://www.googleapis.com/books/v1/volumes?q=isbn:1910701874';

module.exports = {
	getInfo: async function(query) {
		await got(query,{ json: true }).then(response => {
			console.log(response.body.items[0].volumeInfo.title);
		}).catch(error => {
		  console.log(error.response);
		});
	}
} 