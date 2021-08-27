const Query = require("../googleBooks/QueryBuilder");
const Google_Books = require("../googleBooks/SearchInfoBooks");

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
			this.pageCount = obj.volumeInfo.pageCount;
		}	
	},

	create: async function(settings) { //settings: string -•- settings: {"isbn": isbn, "inauthor": author, "intitle": title}
		var query;

		if(settings.constructor === Object) query = Query.queryBuilder(new Query.Options(settings)); // advanced search
		else query = Query.queryBuilder(settings); // generic search

		response = await Google_Books.getInfo(query);

		if(response.err)
			return response;
		else response.data = await this.bookParser(response.data);

		return response;
	},

	foundByISBN: async function(isbn) {
		var query = Query.queryBuilder(new Query.Options({"isbn": isbn, "inauthor": null, "intitle": null}));
		var response = await Google_Books.getInfo(query);
		response.data = this.bookParser(response.data);
		return response;
	},

	bookParser: async function(rowBooksArray) {
		if(!rowBooksArray) return null;
		var array = [];

		for(let rowBook of rowBooksArray) {
			var selfLink = "";
			for(let identifiers of rowBook.volumeInfo.industryIdentifiers)
				if(identifiers.type != "ISBN_10" && identifiers.type != "ISBN_13") selfLink = rowBook.selfLink;

			if(selfLink != "") {
				var res = await Google_Books.getSelfLink(selfLink);
				rowBook.volumeInfo.industryIdentifiers = res.data.volumeInfo.industryIdentifiers;
			}

			if(rowBook.volumeInfo.title != undefined)
				array.push(new this.Book(rowBook));
		}

		return array;
	}

}