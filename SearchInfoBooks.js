"use strict";
const got = require("got");

var query = 'https://www.googleapis.com/books/v1/volumes?q=isbn:1910701874';

async function getInfo(query) {
	await got(query,{ json: true }).then(response => {
		console.log(response.body)
		//document.getElementById("title-paragraph").innerHTML = "title: " + response.body.items[0].volumeInfo.title;
		//document.getElementById("author-paragraph").innerHTML = "authors: " + response.body.items[0].volumeInfo.authors[0];
		//document.getElementById("ISBN-paragraph").innerHTML = "isbn: " + response.body.items[0].volumeInfo.industryIdentifiers[0].identifier:
	}).catch(error => {
	  console.log(error.response);
	});
}

getInfo(query);