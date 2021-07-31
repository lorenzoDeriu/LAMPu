"use strict";
const fetch = require("node-fetch");
const BookModel = require('../app_core/models/book.models.js')

//var query = 'https://www.googleapis.com/books/v1/volumes?q=inauthor:giovanni+pizzigoni+intitle:carne+sprecata+';

module.exports = { 
	getInfo: async function(query) {
		let response = await fetch(query)
		if(!response.ok) 
			return {"err": new Error("HTTP error status " + response.status), "data": null};

		let book = await response.json();
		return {"err": null, "data": book.items};
	}
}

/*
try {
	getInfo(query).then((res) => {
		if(res.err){
			//console.log(res.err.message)
			throw res.err;
		}

		var book = new BookModel.Book(res.data.items[0]);
		console.log(book);
	});
} catch(e) {
	console.log(e);
}*/


/*
const got = require("got");

async function getInfo(query) {
	await got(query,{ json: true }).then(response => {
		response.body.items[0]
	}).catch(error => {
		console.log(error.response);
	}).resolve((res) => { return res});
}
*/
