const Query = require("../../GoogleBooksAPI/QueryBuilder.js");
const Google_Books = require("../../GoogleBooksAPI/SearchInfoBooks.js");

class Book {
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
}

class BookShelves {
	constructor() {
		this.book = [];
	}

	BookParser(rowBooksArray) {
		var array = [];
		for(let rowBook of rowBooksArray)
			array.push(new Book(rowBook));

		return array;
	}

	async create(settings) { //settings: string -•- settings: [isbn, author, title]
		var query;

		if(settings.constructor === Object) query = Query.queryBuilder(new Query.Options(settings)); // advanced search
		else query = Query.queryBuilder(settings); // generic search

		console.log(query)
		var response = await Google_Books.getInfo(query);

		if(response.err)
			throw new response.err;
		else this.book = this.BookParser(response.data)
	}

	async foundByISBN(isbn) {
		var query = Query.queryBuilder(new Query.Options({"isbn": isbn, "inauthor":null, "intitle":null}));
		var response = await Google_Books.getInfo(query);
		response.data = this.BookParser(response.data);
		return response;
	}
}