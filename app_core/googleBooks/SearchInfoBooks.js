"use strict";
const fetch = require("node-fetch");
const BookModel = require('../models/book.models.js')

module.exports = { 
	getInfo: async function(query) {
		let response = await fetch(query);
		if(!response.ok)
			return {
				err: { status: response.status },
				data: null
			};

		let book = await response.json();
		if (book.totalItems === 0) {
			return {
				err: { status: 404, kind: "not_found", message: "book not found"},
				data: null
			}
		}
		return {err: null, data: book.items};
	},

	getSelfLink: async function(selfLink) {
		let response = await fetch(selfLink);
		if(!response.ok)
			return {
				err: { status: response.status },
				data: null
			};

		let book = await response.json();
		return {err: null, data: book};
	}
}
