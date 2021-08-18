const Book = require("book.models.js");
 
module.exports = {
	BookDB: class {
		constructor(book) {
			this.title = book.title;
			this.authors = book.authors;
			this.isbn = book.isbn;
			this.thumbnail = book.thumbnail;
		}
	}
}