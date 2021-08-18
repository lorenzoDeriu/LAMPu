const BookModel = require("book.models.js");
const mongoose = require('mongoose'); 

class BookDB_model {
	constructor(book) {
		this.title = book.title;
		this.authors = book.authors;
		this.isbn = book.isbn;
		this.thumbnail = book.thumbnail;
	}
}

module.exports = BookDB;

bookDB_schema: mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	authors: {
		type: [String],
		required: true
	},
	isbn: {
		type: [String],
		required: true
	},
	thumbnail: {
		type: [String],
		required: false
	},
	publishDate: {
		type: String,
		required: false
	}
});

const Book = new mongoose.model('Book', bookDB_schema);
module.exports = Book;