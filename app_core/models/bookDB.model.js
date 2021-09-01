const mongoose = require('mongoose'); 

const isbn_schema = new mongoose.Schema({
	type: {
		type: String,
		required: true
	},
	identifier: {
		type: String,
		required: true
	}
}, { _id: false });

const bookDB_schema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	authors: {
		type: [String],
		required: true
	},
	isbn: {
		type: [isbn_schema],
		required: true
	},
	thumbnail: {
		type: Object,
		required: false
	},
	publishedDate: {
		type: String,
		required: false
	}
}, { _id: false });

const Book = mongoose.model('Book', bookDB_schema);
module.exports = Book;