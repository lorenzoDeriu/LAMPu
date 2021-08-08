const Query = require("../../GoogleBooksAPI/QueryBuilder.js");
const Google_Books = require("../../GoogleBooksAPI/SearchInfoBooks.js");

module.exports = {
	Book: class {
		constructor(obj) { //obj: response.body.items[i];
			this.title = obj.volumeInfo.title;
			this.authors = obj.volumeInfo.authors;
			this.publisher = obj.volumeInfo.publisher;
			this.publishedDate = obj.volumeInfo.publishedDate;
			this.categories = obj.volumeInfo.categories;
			this.isbn = obj.volumeInfo.industryIdentifiers
			this.thumbnail = obj.volumeInfo.imageLinks;
			this.language = obj.volumeInfo.language;
			this.description = obj.volumeInfo.description;
		}	
	},

	create: async function(settings) { //settings: string -•- settings: {"isbn": isbn, "inauthor": author, "intitle": title}
		var query;

		if(settings.constructor === Object) query = Query.queryBuilder(new Query.Options(settings)); // advanced search
		else query = Query.queryBuilder(settings); // generic search

		response = await Google_Books.getInfo(query);

		if(response.err)
			return response;
		else response.data = this.bookParser(response.data);

		return response;
	},

	foundByISBN: async function(isbn) {
		var query = Query.queryBuilder(new Query.Options({"isbn": isbn, "inauthor": null, "intitle": null}));
		var response = await Google_Books.getInfo(query);
		response.data = this.bookParser(response.data);
		return response;
	},

	bookParser: function(rowBooksArray) {
		var array = [];
		for(let rowBook of rowBooksArray)
			array.push(new this.Book(rowBook));
		return array;
	}

}



