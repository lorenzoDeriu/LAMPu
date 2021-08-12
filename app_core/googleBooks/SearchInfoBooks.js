"use strict";
const fetch = require("node-fetch");
const BookModel = require('../models/book.models.js')

module.exports = { 
	getInfo: async function(query) {
		let response = await fetch(query)
		if(!response.ok) 
			return {
				err: { status: response.status },
				data: null
			};

		let book = await response.json();
		return {err: null, data: book.items};
	}
}
